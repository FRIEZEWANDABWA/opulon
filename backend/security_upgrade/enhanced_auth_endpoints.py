"""
Enhanced Authentication Endpoints
Cookie-based JWT with 2FA, Rate Limiting, and Audit Logging
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
import pyotp
import qrcode
import io
import base64

from ..core.database import get_db
from .enhanced_security import (
    password_manager, token_manager, rate_limiter, session_manager,
    CSRFProtection, TwoFactorAuth, SecurityConfig
)
from .auth_middleware import get_current_user, require_auth, rate_limit
from .models import User, AuditLog
from .schemas import (
    UserRegister, UserLogin, UserResponse, 
    PasswordChange, TwoFASetup, TwoFAVerify
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
async def register(
    user_data: UserRegister,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
    _: bool = Depends(rate_limit("register", 3, 3600))  # 3 per hour
):
    """Register new user with enhanced security"""
    
    # Check if user exists
    if db.query(User).filter(User.email == user_data.email.lower()).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create user with secure password hash
    hashed_password = password_manager.hash_password(user_data.password)
    
    user = User(
        email=user_data.email.lower(),
        username=user_data.username,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        is_active=True,
        is_verified=False,  # Require email verification
        password_changed_at=datetime.utcnow()
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Assign default customer role
    from .models import Role, UserRole
    customer_role = db.query(Role).filter(Role.name == "customer").first()
    if customer_role:
        user_role = UserRole(user_id=user.id, role_id=customer_role.id)
        db.add(user_role)
        db.commit()
    
    # Create session and tokens
    session_id = session_manager.create_session(user.id, request)
    permissions = ["products.read"]  # Basic permissions for customers
    
    access_token = token_manager.create_access_token(user.id, permissions)
    refresh_token = token_manager.create_refresh_token(user.id, session_id)
    csrf_token = CSRFProtection.generate_csrf_token(session_id)
    
    # Set secure cookies
    auth_middleware = AuthMiddleware(db)
    auth_middleware.set_auth_cookies(response, access_token, refresh_token)
    
    # Set CSRF token cookie
    response.set_cookie(
        key="csrf_token",
        value=csrf_token,
        max_age=SecurityConfig.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        httponly=False,  # Accessible to JavaScript for AJAX requests
        secure=SecurityConfig.COOKIE_SECURE,
        samesite=SecurityConfig.COOKIE_SAMESITE,
        domain=SecurityConfig.COOKIE_DOMAIN
    )
    
    # Log registration
    audit_log = AuditLog(
        user_id=user.id,
        action="user_register",
        resource_type="user",
        resource_id=str(user.id),
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent", "")
    )
    db.add(audit_log)
    db.commit()
    
    return {
        "message": "Registration successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "is_verified": user.is_verified
        },
        "csrf_token": csrf_token
    }

@router.post("/login")
async def login(
    credentials: UserLogin,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
    _: bool = Depends(rate_limit("login", 5, 900))  # 5 per 15 minutes
):
    """Login with enhanced security and 2FA support"""
    
    client_ip = request.client.host
    
    # Find user
    user = db.query(User).filter(User.email == credentials.email.lower()).first()
    
    if not user:
        # Prevent user enumeration - same response time
        password_manager.verify_password("dummy", "$argon2id$v=19$m=65536,t=3,p=1$dummy")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Check if account is locked
    if user.locked_until and user.locked_until > datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail="Account temporarily locked due to failed login attempts"
        )
    
    # Verify password
    if not password_manager.verify_password(credentials.password, user.hashed_password):
        # Increment failed attempts
        user.failed_login_attempts = (user.failed_login_attempts or 0) + 1
        
        # Lock account if too many failures
        if user.failed_login_attempts >= SecurityConfig.MAX_FAILED_ATTEMPTS:
            user.locked_until = datetime.utcnow() + timedelta(
                minutes=SecurityConfig.LOCKOUT_DURATION_MINUTES
            )
        
        db.commit()
        
        # Log failed attempt
        audit_log = AuditLog(
            user_id=user.id,
            action="login_failed",
            resource_type="user",
            resource_id=str(user.id),
            ip_address=client_ip,
            user_agent=request.headers.get("user-agent", "")
        )
        db.add(audit_log)
        db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Check if account is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is inactive"
        )
    
    # Check 2FA for admin users
    if user.two_fa_enabled and credentials.totp_code:
        if not TwoFactorAuth.verify_totp(user.two_fa_secret, credentials.totp_code):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid 2FA code"
            )
    elif user.two_fa_enabled and not credentials.totp_code:
        return {
            "requires_2fa": True,
            "message": "2FA code required"
        }
    
    # Reset failed attempts on successful login
    user.failed_login_attempts = 0
    user.locked_until = None
    db.commit()
    
    # Get user permissions
    auth_middleware = AuthMiddleware(db)
    permissions = auth_middleware.get_user_permissions(user.id)
    
    # Create session and tokens
    session_id = session_manager.create_session(user.id, request)
    access_token = token_manager.create_access_token(user.id, permissions)
    refresh_token = token_manager.create_refresh_token(user.id, session_id)
    csrf_token = CSRFProtection.generate_csrf_token(session_id)
    
    # Set secure cookies
    auth_middleware.set_auth_cookies(response, access_token, refresh_token)
    
    # Set CSRF token cookie
    response.set_cookie(
        key="csrf_token",
        value=csrf_token,
        max_age=SecurityConfig.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        httponly=False,
        secure=SecurityConfig.COOKIE_SECURE,
        samesite=SecurityConfig.COOKIE_SAMESITE,
        domain=SecurityConfig.COOKIE_DOMAIN
    )
    
    # Log successful login
    audit_log = AuditLog(
        user_id=user.id,
        action="login_success",
        resource_type="user",
        resource_id=str(user.id),
        ip_address=client_ip,
        user_agent=request.headers.get("user-agent", "")
    )
    db.add(audit_log)
    db.commit()
    
    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "roles": auth_middleware.get_user_roles(user.id),
            "two_fa_enabled": user.two_fa_enabled
        },
        "csrf_token": csrf_token
    }

@router.post("/refresh")
async def refresh_token(
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    """Refresh access token using refresh token"""
    
    auth_middleware = AuthMiddleware(db)
    new_access_token = auth_middleware.refresh_access_token(request, response)
    
    if not new_access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    # Generate new CSRF token
    refresh_token = request.cookies.get("refresh_token")
    payload = token_manager.verify_token(refresh_token, "refresh")
    session_id = payload.get("session_id")
    csrf_token = CSRFProtection.generate_csrf_token(session_id)
    
    response.set_cookie(
        key="csrf_token",
        value=csrf_token,
        max_age=SecurityConfig.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        httponly=False,
        secure=SecurityConfig.COOKIE_SECURE,
        samesite=SecurityConfig.COOKIE_SAMESITE,
        domain=SecurityConfig.COOKIE_DOMAIN
    )
    
    return {
        "message": "Token refreshed",
        "csrf_token": csrf_token
    }

@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Logout and invalidate tokens"""
    
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Get tokens from cookies
    access_token = request.cookies.get("access_token")
    refresh_token = request.cookies.get("refresh_token")
    
    # Blacklist tokens
    if access_token:
        token_manager.blacklist_token(access_token)
    if refresh_token:
        token_manager.blacklist_token(refresh_token)
        
        # Get session ID and revoke session
        payload = token_manager.verify_token(refresh_token, "refresh")
        if payload:
            session_id = payload.get("session_id")
            session_manager.revoke_session(session_id)
    
    # Clear cookies
    auth_middleware = AuthMiddleware(db)
    auth_middleware.clear_auth_cookies(response)
    
    # Log logout
    audit_log = AuditLog(
        user_id=current_user["id"],
        action="logout",
        resource_type="user",
        resource_id=str(current_user["id"]),
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent", "")
    )
    db.add(audit_log)
    db.commit()
    
    return {"message": "Logged out successfully"}

@router.get("/me")
async def get_current_user_info(
    current_user: dict = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Get current user information"""
    
    user = db.query(User).filter(User.id == current_user["id"]).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "full_name": user.full_name,
        "roles": current_user.get("roles", []),
        "permissions": current_user.get("permissions", []),
        "two_fa_enabled": user.two_fa_enabled,
        "is_verified": user.is_verified,
        "created_at": user.created_at
    }

@router.post("/setup-2fa")
async def setup_2fa(
    request: Request,
    current_user: dict = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Setup 2FA for user account"""
    
    user = db.query(User).filter(User.id == current_user["id"]).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.two_fa_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="2FA already enabled"
        )
    
    # Generate new secret
    secret = TwoFactorAuth.generate_secret()
    qr_url = TwoFactorAuth.generate_qr_url(secret, user.email)
    
    # Store secret temporarily (not enabled until verified)
    user.two_fa_secret = secret
    db.commit()
    
    # Generate QR code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(qr_url)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    qr_code_base64 = base64.b64encode(buffer.getvalue()).decode()
    
    return {
        "secret": secret,
        "qr_code": f"data:image/png;base64,{qr_code_base64}",
        "manual_entry_key": secret
    }

@router.post("/verify-2fa")
async def verify_2fa(
    verify_data: TwoFAVerify,
    request: Request,
    current_user: dict = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Verify and enable 2FA"""
    
    user = db.query(User).filter(User.id == current_user["id"]).first()
    if not user or not user.two_fa_secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="2FA setup not initiated"
        )
    
    # Verify TOTP code
    if not TwoFactorAuth.verify_totp(user.two_fa_secret, verify_data.totp_code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid 2FA code"
        )
    
    # Enable 2FA
    user.two_fa_enabled = True
    db.commit()
    
    # Log 2FA enablement
    audit_log = AuditLog(
        user_id=user.id,
        action="2fa_enabled",
        resource_type="user",
        resource_id=str(user.id),
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent", "")
    )
    db.add(audit_log)
    db.commit()
    
    return {"message": "2FA enabled successfully"}

@router.post("/disable-2fa")
async def disable_2fa(
    verify_data: TwoFAVerify,
    request: Request,
    current_user: dict = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Disable 2FA for user account"""
    
    user = db.query(User).filter(User.id == current_user["id"]).first()
    if not user or not user.two_fa_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="2FA not enabled"
        )
    
    # Verify current TOTP code
    if not TwoFactorAuth.verify_totp(user.two_fa_secret, verify_data.totp_code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid 2FA code"
        )
    
    # Disable 2FA
    user.two_fa_enabled = False
    user.two_fa_secret = None
    db.commit()
    
    # Log 2FA disablement
    audit_log = AuditLog(
        user_id=user.id,
        action="2fa_disabled",
        resource_type="user",
        resource_id=str(user.id),
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent", "")
    )
    db.add(audit_log)
    db.commit()
    
    return {"message": "2FA disabled successfully"}

@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    request: Request,
    current_user: dict = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Change user password"""
    
    user = db.query(User).filter(User.id == current_user["id"]).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Verify current password
    if not password_manager.verify_password(password_data.current_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Hash new password
    new_hashed_password = password_manager.hash_password(password_data.new_password)
    
    # Update password
    user.hashed_password = new_hashed_password
    user.password_changed_at = datetime.utcnow()
    db.commit()
    
    # Revoke all existing sessions (force re-login)
    session_manager.revoke_all_user_sessions(user.id)
    
    # Log password change
    audit_log = AuditLog(
        user_id=user.id,
        action="password_changed",
        resource_type="user",
        resource_id=str(user.id),
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent", "")
    )
    db.add(audit_log)
    db.commit()
    
    return {"message": "Password changed successfully. Please log in again."}

@router.post("/logout-all")
async def logout_all_sessions(
    request: Request,
    current_user: dict = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Logout from all devices/sessions"""
    
    # Revoke all user sessions
    session_manager.revoke_all_user_sessions(current_user["id"])
    
    # Log action
    audit_log = AuditLog(
        user_id=current_user["id"],
        action="logout_all_sessions",
        resource_type="user",
        resource_id=str(current_user["id"]),
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent", "")
    )
    db.add(audit_log)
    db.commit()
    
    return {"message": "Logged out from all devices successfully"}