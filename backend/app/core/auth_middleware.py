"""
Authentication & Authorization Middleware
Cookie-based JWT with RBAC and CSRF Protection
"""
from fastapi import Request, Response, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from datetime import datetime

from .enhanced_security import (
    token_manager, rate_limiter, session_manager, 
    CSRFProtection, SecurityConfig
)
from .deps import get_db

class AuthMiddleware:
    """Authentication middleware for cookie-based JWT"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_current_user(self, request: Request) -> Optional[Dict[str, Any]]:
        """Extract and validate user from cookies"""
        access_token = request.cookies.get("access_token")
        if not access_token:
            return None
        
        # Verify access token
        payload = token_manager.verify_token(access_token, "access")
        if not payload:
            return None
        
        user_id = int(payload.get("sub"))
        
        # Get user from database
        from ..models.user import User
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            return None
        
        # Check if account is locked
        if user.locked_until and user.locked_until > datetime.utcnow():
            return None
        
        return {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "roles": self.get_user_roles(user_id),
            "permissions": payload.get("permissions", []),
            "two_fa_enabled": getattr(user, 'two_fa_enabled', False)
        }
    
    def get_user_roles(self, user_id: int) -> List[str]:
        """Get user roles from database"""
        from ..models.user import User
        user = self.db.query(User).filter(User.id == user_id).first()
        if user and user.role:
            return [user.role]
        return ["user"]
    
    def set_auth_cookies(self, response: Response, access_token: str, refresh_token: str):
        """Set secure authentication cookies"""
        # Access token cookie (short-lived)
        response.set_cookie(
            key="access_token",
            value=access_token,
            max_age=SecurityConfig.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            httponly=SecurityConfig.COOKIE_HTTPONLY,
            secure=SecurityConfig.COOKIE_SECURE,
            samesite=SecurityConfig.COOKIE_SAMESITE
        )
        
        # Refresh token cookie (long-lived)
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            max_age=SecurityConfig.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
            httponly=SecurityConfig.COOKIE_HTTPONLY,
            secure=SecurityConfig.COOKIE_SECURE,
            samesite=SecurityConfig.COOKIE_SAMESITE
        )
    
    def clear_auth_cookies(self, response: Response):
        """Clear authentication cookies"""
        response.delete_cookie(key="access_token")
        response.delete_cookie(key="refresh_token")
        response.delete_cookie(key="csrf_token")

# Dependency functions for FastAPI
def get_current_user(request: Request, db: Session = Depends(get_db)) -> Optional[Dict[str, Any]]:
    """FastAPI dependency to get current authenticated user"""
    auth_middleware = AuthMiddleware(db)
    return auth_middleware.get_current_user(request)

def require_auth(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Require authentication"""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    return current_user

def require_admin(current_user: Dict[str, Any] = Depends(require_auth)) -> Dict[str, Any]:
    """Require admin role"""
    user_roles = current_user.get("roles", [])
    if not any(role in ["admin", "super_admin"] for role in user_roles):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

def rate_limit(key_prefix: str, limit: int, window: int):
    """Rate limiting decorator"""
    def rate_limit_checker(request: Request):
        client_ip = request.client.host
        key = f"{key_prefix}:{client_ip}"
        
        if rate_limiter.is_rate_limited(key, limit, window):
            remaining = rate_limiter.get_remaining_attempts(key, limit)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Try again later.",
                headers={"Retry-After": str(window)}
            )
        return True
    return rate_limit_checker