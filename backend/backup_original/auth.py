from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from ...core.database import get_db
from ...core.security import verify_password, get_password_hash, create_access_token
from ...models.user import User
from ...schemas.user import UserCreate, UserLogin, UserResponse, Token

# Simple rate limiting storage (use Redis in production)
login_attempts = {}

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
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
    user = User(
        email=user_data.email,
        username=user_data.username,
        full_name=user_data.full_name,
        phone=user_data.phone,
        address=user_data.address,
        hashed_password=hashed_password
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create token
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

@router.post("/login")
def login(credentials: UserLogin, request: Request, db: Session = Depends(get_db)):
    client_ip = request.client.host
    
    # Rate limiting check
    now = datetime.utcnow()
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