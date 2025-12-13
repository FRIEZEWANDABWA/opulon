from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from .core.database import get_db
from .models.user import User, UserRole
from pydantic import BaseModel
import hashlib
import json
import base64

router = APIRouter(prefix="/auth", tags=["Working Auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    username: str
    full_name: str
    password: str
    phone: str = None
    address: str = None

@router.post("/register")
def register_user(data: RegisterRequest, db: Session = Depends(get_db)):
    # Check if user exists
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create user
    password_hash = hashlib.sha256(data.password.encode()).hexdigest()
    
    user = User(
        email=data.email,
        username=data.username,
        full_name=data.full_name,
        phone=data.phone,
        address=data.address,
        hashed_password=password_hash,
        role=UserRole.CUSTOMER,
        is_active=True,
        is_verified=True
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create token
    token_data = {"user_id": user.id, "email": user.email, "role": user.role.value}
    token = base64.b64encode(json.dumps(token_data).encode()).decode()
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "phone": user.phone,
            "address": user.address,
            "role": user.role.value,
            "is_active": user.is_active
        }
    }

@router.post("/login")
def login_user(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user.is_active:
        raise HTTPException(status_code=401, detail="Account is deactivated")
    
    # Check password
    password_hash = hashlib.sha256(data.password.encode()).hexdigest()
    if password_hash != user.hashed_password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create token
    token_data = {"user_id": user.id, "email": user.email, "role": user.role.value}
    token = base64.b64encode(json.dumps(token_data).encode()).decode()
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "phone": user.phone,
            "address": user.address,
            "role": user.role.value,
            "is_active": user.is_active
        }
    }