from fastapi import APIRouter, Depends, HTTPException, status, Request, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import secrets
from ...core.database import get_db
from ...core.security import verify_password, get_password_hash, create_access_token
from ...models.user import User
from ...schemas.user import UserCreate, UserLogin, UserResponse, Token
from ...schemas.auth import ResendVerificationRequest, ForgotPasswordRequest, ResetPasswordRequest
from ...core.email import send_verification_email, send_password_reset_email

# Simple rate limiting storage (use Redis in production)
login_attempts = {}

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
def register(
    user_data: UserCreate,
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db)
):
    # Check if user exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    
    # Generate verification token
    token = secrets.token_urlsafe(32)
    token_expires = datetime.now(timezone.utc) + timedelta(hours=24)

    user = User(
        email=user_data.email,
        username=user_data.username,
        full_name=user_data.full_name,
        phone=user_data.phone,
        address=user_data.address,
        hashed_password=hashed_password,
        is_verified=False,
        email_verification_token=token,
        email_verification_expires=token_expires
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Send verification email
    background_tasks.add_task(send_verification_email, user.email, token)    
    
    return {
        "message": "Registration successful. Please check your email to verify your account."
    }


@router.get("/verify-email")
def verify_email(
    token: str, 
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email_verification_token == token).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token."
        )

    if user.email_verification_expires < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token has expired."
        )

    user.is_verified = True
    user.email_verification_token = None
    user.email_verification_expires = None
    db.commit()

    return {"message": "Email verified successfully."}


@router.post("/resend-verification")
def resend_verification(
    request: ResendVerificationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user or user.is_verified:
        return {"message": "If the email exists, a verification link has been sent."}

    
    # Generate new verification token
    token = secrets.token_urlsafe(32)
    token_expires = datetime.now(timezone.utc) + timedelta(hours=24)
    
    user.email_verification_token = token
    user.email_verification_expires = token_expires
    db.commit()
    
    # Send verification email
    background_tasks.add_task(send_verification_email, user.email, token)
    
    return {"message": "Verification email resent successfully."}


@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == request.email).first()
    if user:
        token = secrets.token_urlsafe(32)
        token_expires = datetime.now(timezone.utc) + timedelta(hours=1)
        user.password_reset_token = token
        user.password_reset_expires = token_expires
        db.commit()
        background_tasks.add_task(send_password_reset_email, user.email, token)
    return {"message": "If an account with that email exists, a password reset link has been sent."}


@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.password_reset_token == request.token).first()

    if not user or user.password_reset_expires < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token."
        )

    user.hashed_password = get_password_hash(request.password)
    user.password_reset_token = None
    user.password_reset_expires = None
    db.commit()

    return {"message": "Password has been reset successfully."}


@router.post("/login")
def login(request: Request, credentials: UserLogin, db: Session = Depends(get_db)):
    client_ip = request.client.host
    
    # Rate limiting check
    now = datetime.now(timezone.utc)
    if client_ip in login_attempts:
        attempts = login_attempts[client_ip]
        # Remove attempts older than 15 minutes
        attempts = [attempt for attempt in attempts if now - attempt < timedelta(minutes=15)]
        login_attempts[client_ip] = attempts
        
        if len(attempts) >= 5:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many login attempts. Please try again later."
            )
    
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        # Record failed attempt
        if client_ip not in login_attempts:
            login_attempts[client_ip] = []
        login_attempts[client_ip].append(now)
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is inactive"
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email not verified. Please check your email."
        )
    
    # Clear failed attempts on successful login
    if client_ip in login_attempts:
        del login_attempts[client_ip]
    
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "phone": user.phone,
            "address": user.address,
            "role": user.role.value,
            "is_active": user.is_active,
            "is_verified": user.is_verified,
            "created_at": user.created_at.isoformat()
        }
    }