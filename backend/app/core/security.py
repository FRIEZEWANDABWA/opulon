from datetime import datetime, timedelta
from typing import Optional
import hashlib
import secrets
from jose import JWTError, jwt
from .config import settings

# Session timeout: 1 hour
SESSION_TIMEOUT_MINUTES = 60

# Use PBKDF2 with SHA256 for secure password hashing (Docker compatible)
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash (supports both bcrypt and PBKDF2)"""
    try:
        # Check if it's bcrypt hash (existing format)
        if hashed_password.startswith('$2b$') or hashed_password.startswith('$2a$'):
            import bcrypt
            return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
        
        # Check if it's PBKDF2 hash (new format)
        parts = hashed_password.split('$')
        if len(parts) == 3 and parts[0] == 'pbkdf2_sha256':
            iterations = int(parts[1])
            salt_and_hash = parts[2]
            salt = bytes.fromhex(salt_and_hash[:64])  # First 32 bytes (64 hex chars)
            stored_hash = salt_and_hash[64:]  # Remaining hash
            
            # Hash the provided password with the same salt
            new_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, iterations)
            return new_hash.hex() == stored_hash
        
        return False
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    """Hash a password using PBKDF2-SHA256"""
    # Generate a random salt
    salt = secrets.token_bytes(32)
    iterations = 100000  # OWASP recommended minimum
    
    # Hash the password
    password_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, iterations)
    
    # Return in format: algorithm$iterations$salt_hex+hash_hex
    return f"pbkdf2_sha256${iterations}${salt.hex()}{password_hash.hex()}"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=SESSION_TIMEOUT_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None