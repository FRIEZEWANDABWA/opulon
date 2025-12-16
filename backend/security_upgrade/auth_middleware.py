"""
Authentication & Authorization Middleware
Cookie-based JWT with RBAC and CSRF Protection
"""
from fastapi import Request, Response, HTTPException, status, Depends
from fastapi.security.utils import get_authorization_scheme_param
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
import json
from datetime import datetime

from .enhanced_security import (
    token_manager, rate_limiter, session_manager, 
    CSRFProtection, SecurityConfig
)

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
            "two_fa_enabled": user.two_fa_enabled
        }
    
    def get_user_roles(self, user_id: int) -> List[str]:
        """Get user roles from database"""
        from ..models.user import User
        from .models import Role, UserRole
        
        roles = self.db.query(Role.name).join(
            UserRole, Role.id == UserRole.role_id
        ).filter(UserRole.user_id == user_id).all()
        
        return [role.name for role in roles]
    
    def refresh_access_token(self, request: Request, response: Response) -> Optional[str]:
        """Refresh access token using refresh token"""
        refresh_token = request.cookies.get("refresh_token")
        if not refresh_token:
            return None
        
        # Verify refresh token
        payload = token_manager.verify_token(refresh_token, "refresh")
        if not payload:
            return None
        
        user_id = int(payload.get("sub"))
        session_id = payload.get("session_id")
        
        # Verify session exists
        session_data = session_manager.get_session(session_id)
        if not session_data or session_data.get("user_id") != user_id:
            return None
        
        # Get user permissions
        permissions = self.get_user_permissions(user_id)
        
        # Create new access token
        new_access_token = token_manager.create_access_token(user_id, permissions)
        
        # Rotate refresh token
        new_refresh_token = token_manager.create_refresh_token(user_id, session_id)
        
        # Blacklist old refresh token
        token_manager.blacklist_token(refresh_token)
        
        # Set new cookies
        self.set_auth_cookies(response, new_access_token, new_refresh_token)
        
        # Update session activity
        session_manager.update_session_activity(session_id)
        
        return new_access_token
    
    def get_user_permissions(self, user_id: int) -> List[str]:
        """Get user permissions from RBAC system"""
        from .models import Permission, RolePermission, UserRole
        
        permissions = self.db.query(Permission.name).join(
            RolePermission, Permission.id == RolePermission.permission_id
        ).join(
            UserRole, RolePermission.role_id == UserRole.role_id
        ).filter(UserRole.user_id == user_id).all()
        
        return [perm.name for perm in permissions]
    
    def set_auth_cookies(self, response: Response, access_token: str, refresh_token: str):
        """Set secure authentication cookies"""
        # Access token cookie (short-lived)
        response.set_cookie(
            key="access_token",
            value=access_token,
            max_age=SecurityConfig.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            httponly=SecurityConfig.COOKIE_HTTPONLY,
            secure=SecurityConfig.COOKIE_SECURE,
            samesite=SecurityConfig.COOKIE_SAMESITE,
            domain=SecurityConfig.COOKIE_DOMAIN
        )
        
        # Refresh token cookie (long-lived)
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            max_age=SecurityConfig.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
            httponly=SecurityConfig.COOKIE_HTTPONLY,
            secure=SecurityConfig.COOKIE_SECURE,
            samesite=SecurityConfig.COOKIE_SAMESITE,
            domain=SecurityConfig.COOKIE_DOMAIN
        )
    
    def clear_auth_cookies(self, response: Response):
        """Clear authentication cookies"""
        response.delete_cookie(
            key="access_token",
            domain=SecurityConfig.COOKIE_DOMAIN
        )
        response.delete_cookie(
            key="refresh_token", 
            domain=SecurityConfig.COOKIE_DOMAIN
        )
        response.delete_cookie(
            key="csrf_token",
            domain=SecurityConfig.COOKIE_DOMAIN
        )

class RBACMiddleware:
    """Role-Based Access Control middleware"""
    
    def __init__(self, required_permissions: List[str] = None, required_roles: List[str] = None):
        self.required_permissions = required_permissions or []
        self.required_roles = required_roles or []
    
    def __call__(self, current_user: Dict[str, Any] = Depends(get_current_user)):
        """Check user permissions and roles"""
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required"
            )
        
        # Check roles
        user_roles = current_user.get("roles", [])
        if self.required_roles:
            if not any(role in user_roles for role in self.required_roles):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Insufficient role permissions"
                )
        
        # Check permissions
        user_permissions = current_user.get("permissions", [])
        if self.required_permissions:
            if not all(perm in user_permissions for perm in self.required_permissions):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Insufficient permissions"
                )
        
        return current_user

class CSRFMiddleware:
    """CSRF protection middleware"""
    
    def __init__(self, exempt_methods: List[str] = None):
        self.exempt_methods = exempt_methods or ["GET", "HEAD", "OPTIONS"]
    
    def __call__(self, request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
        """Validate CSRF token for state-changing requests"""
        if request.method in self.exempt_methods:
            return True
        
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required"
            )
        
        # Get CSRF token from header or form
        csrf_token = request.headers.get("X-CSRF-Token")
        if not csrf_token:
            # Try to get from form data
            if hasattr(request, "form"):
                form_data = request.form()
                csrf_token = form_data.get("csrf_token")
        
        if not csrf_token:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="CSRF token missing"
            )
        
        # Get session ID from refresh token
        refresh_token = request.cookies.get("refresh_token")
        if not refresh_token:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid session"
            )
        
        payload = token_manager.verify_token(refresh_token, "refresh")
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid session"
            )
        
        session_id = payload.get("session_id")
        if not CSRFProtection.verify_csrf_token(csrf_token, session_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid CSRF token"
            )
        
        return True

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
    if not any(role in ["super_admin", "ops_admin"] for role in user_roles):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

def require_permissions(permissions: List[str]):
    """Require specific permissions"""
    def permission_checker(current_user: Dict[str, Any] = Depends(require_auth)) -> Dict[str, Any]:
        user_permissions = current_user.get("permissions", [])
        if not all(perm in user_permissions for perm in permissions):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Required permissions: {', '.join(permissions)}"
            )
        return current_user
    return permission_checker

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