"""
Enhanced Security Module - Production Ready
Cookie-based JWT with Refresh Tokens, CSRF Protection, Rate Limiting
"""
import secrets
import hashlib
import hmac
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from uuid import uuid4
# argon2 will be imported in the class
import pyotp
from jose import JWTError, jwt
from fastapi import HTTPException, status, Request, Response
from sqlalchemy.orm import Session
import redis
import json

class SecurityConfig:
    # Strong secret keys (generate with: secrets.token_urlsafe(32))
    JWT_SECRET_KEY = "CHANGE_ME_IN_PRODUCTION_32_CHARS_MIN"
    CSRF_SECRET_KEY = "CHANGE_ME_IN_PRODUCTION_32_CHARS_MIN"
    
    # Token lifespans
    ACCESS_TOKEN_EXPIRE_MINUTES = 15
    REFRESH_TOKEN_EXPIRE_DAYS = 30
    
    # Cookie settings
    COOKIE_DOMAIN = ".opulonhq.com"
    COOKIE_SECURE = True  # HTTPS only
    COOKIE_HTTPONLY = True
    COOKIE_SAMESITE = "lax"
    
    # Rate limiting
    LOGIN_RATE_LIMIT = 5  # attempts per window
    LOGIN_RATE_WINDOW = 900  # 15 minutes in seconds
    
    # Account lockout
    MAX_FAILED_ATTEMPTS = 5
    LOCKOUT_DURATION_MINUTES = 30

class PasswordManager:
    """Argon2 password hashing (OWASP recommended)"""
    
    def __init__(self):
        from argon2 import PasswordHasher
        self.hasher = PasswordHasher(
            time_cost=3,      # iterations
            memory_cost=65536, # 64 MB
            parallelism=1,    # threads
            hash_len=32,      # output length
            salt_len=16       # salt length
        )
    
    def hash_password(self, password: str) -> str:
        return self.hasher.hash(password)
    
    def verify_password(self, password: str, hashed: str) -> bool:
        try:
            self.hasher.verify(hashed, password)
            return True
        except Exception:
            return False
        except Exception:
            return False

class TokenManager:
    """JWT Token Management with Refresh Token Rotation"""
    
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        self.password_manager = PasswordManager()
    
    def create_access_token(self, user_id: int, permissions: list = None) -> str:
        """Create short-lived access token"""
        payload = {
            "sub": str(user_id),
            "type": "access",
            "permissions": permissions or [],
            "exp": datetime.utcnow() + timedelta(minutes=SecurityConfig.ACCESS_TOKEN_EXPIRE_MINUTES),
            "iat": datetime.utcnow(),
            "jti": str(uuid4())  # JWT ID for revocation
        }
        return jwt.encode(payload, SecurityConfig.JWT_SECRET_KEY, algorithm="HS256")
    
    def create_refresh_token(self, user_id: int, session_id: str) -> str:
        """Create long-lived refresh token"""
        payload = {
            "sub": str(user_id),
            "type": "refresh",
            "session_id": session_id,
            "exp": datetime.utcnow() + timedelta(days=SecurityConfig.REFRESH_TOKEN_EXPIRE_DAYS),
            "iat": datetime.utcnow(),
            "jti": str(uuid4())
        }
        return jwt.encode(payload, SecurityConfig.JWT_SECRET_KEY, algorithm="HS256")
    
    def verify_token(self, token: str, token_type: str = "access") -> Optional[Dict[str, Any]]:
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(token, SecurityConfig.JWT_SECRET_KEY, algorithms=["HS256"])
            
            if payload.get("type") != token_type:
                return None
            
            # Check if token is blacklisted
            jti = payload.get("jti")
            if jti and self.redis.get(f"blacklist:{jti}"):
                return None
            
            return payload
        except JWTError:
            return None
    
    def blacklist_token(self, token: str):
        """Add token to blacklist"""
        try:
            payload = jwt.decode(token, SecurityConfig.JWT_SECRET_KEY, algorithms=["HS256"])
            jti = payload.get("jti")
            exp = payload.get("exp")
            
            if jti and exp:
                # Set expiry to match token expiry
                ttl = exp - datetime.utcnow().timestamp()
                if ttl > 0:
                    self.redis.setex(f"blacklist:{jti}", int(ttl), "1")
        except JWTError:
            pass

class CSRFProtection:
    """CSRF Token Generation and Validation"""
    
    @staticmethod
    def generate_csrf_token(session_id: str) -> str:
        """Generate CSRF token tied to session"""
        timestamp = str(int(datetime.utcnow().timestamp()))
        message = f"{session_id}:{timestamp}"
        signature = hmac.new(
            SecurityConfig.CSRF_SECRET_KEY.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        return f"{timestamp}.{signature}"
    
    @staticmethod
    def verify_csrf_token(token: str, session_id: str, max_age: int = 3600) -> bool:
        """Verify CSRF token"""
        try:
            timestamp_str, signature = token.split(".", 1)
            timestamp = int(timestamp_str)
            
            # Check age
            if datetime.utcnow().timestamp() - timestamp > max_age:
                return False
            
            # Verify signature
            message = f"{session_id}:{timestamp_str}"
            expected_signature = hmac.new(
                SecurityConfig.CSRF_SECRET_KEY.encode(),
                message.encode(),
                hashlib.sha256
            ).hexdigest()
            
            return hmac.compare_digest(signature, expected_signature)
        except (ValueError, TypeError):
            return False

class RateLimiter:
    """Redis-based rate limiting"""
    
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
    
    def is_rate_limited(self, key: str, limit: int, window: int) -> bool:
        """Check if key is rate limited"""
        current = self.redis.get(key)
        if current is None:
            self.redis.setex(key, window, 1)
            return False
        
        if int(current) >= limit:
            return True
        
        self.redis.incr(key)
        return False
    
    def get_remaining_attempts(self, key: str, limit: int) -> int:
        """Get remaining attempts"""
        current = self.redis.get(key)
        if current is None:
            return limit
        return max(0, limit - int(current))

class TwoFactorAuth:
    """TOTP-based 2FA for admin users"""
    
    @staticmethod
    def generate_secret() -> str:
        """Generate new 2FA secret"""
        return pyotp.random_base32()
    
    @staticmethod
    def generate_qr_url(secret: str, email: str, issuer: str = "Opulon") -> str:
        """Generate QR code URL for 2FA setup"""
        totp = pyotp.TOTP(secret)
        return totp.provisioning_uri(
            name=email,
            issuer_name=issuer
        )
    
    @staticmethod
    def verify_totp(secret: str, token: str) -> bool:
        """Verify TOTP token"""
        try:
            totp = pyotp.TOTP(secret)
            return totp.verify(token, valid_window=1)  # Allow 30s window
        except Exception:
            return False

class SessionManager:
    """Manage user sessions with device tracking"""
    
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
    
    def create_session(self, user_id: int, request: Request) -> str:
        """Create new session"""
        session_id = str(uuid4())
        
        session_data = {
            "user_id": user_id,
            "ip_address": request.client.host,
            "user_agent": request.headers.get("user-agent", ""),
            "created_at": datetime.utcnow().isoformat(),
            "last_used_at": datetime.utcnow().isoformat()
        }
        
        # Store in Redis with expiry
        self.redis.setex(
            f"session:{session_id}",
            SecurityConfig.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
            json.dumps(session_data)
        )
        
        return session_id
    
    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get session data"""
        data = self.redis.get(f"session:{session_id}")
        if data:
            return json.loads(data)
        return None
    
    def update_session_activity(self, session_id: str):
        """Update last activity timestamp"""
        session_data = self.get_session(session_id)
        if session_data:
            session_data["last_used_at"] = datetime.utcnow().isoformat()
            self.redis.setex(
                f"session:{session_id}",
                SecurityConfig.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
                json.dumps(session_data)
            )
    
    def revoke_session(self, session_id: str):
        """Revoke session"""
        self.redis.delete(f"session:{session_id}")
    
    def revoke_all_user_sessions(self, user_id: int):
        """Revoke all sessions for user"""
        pattern = f"session:*"
        for key in self.redis.scan_iter(match=pattern):
            session_data = self.redis.get(key)
            if session_data:
                data = json.loads(session_data)
                if data.get("user_id") == user_id:
                    self.redis.delete(key)

# Initialize global instances
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
token_manager = TokenManager(redis_client)
rate_limiter = RateLimiter(redis_client)
session_manager = SessionManager(redis_client)
password_manager = PasswordManager()