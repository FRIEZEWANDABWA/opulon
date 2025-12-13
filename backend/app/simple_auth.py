from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from .core.database import get_db
from .models.user import User, UserRole
from pydantic import BaseModel
import hashlib
from datetime import datetime, timedelta
import json
import base64

router = APIRouter(prefix="/simple-auth", tags=["Simple Auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    username: str
    full_name: str
    password: str

@router.post("/register")
def simple_register(data: RegisterRequest, db: Session = Depends(get_db)):
    # Check if user exists
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create user with simple hash
    password_hash = hashlib.sha256(data.password.encode()).hexdigest()
    
    user = User(
        email=data.email,
        username=data.username,
        full_name=data.full_name,
        hashed_password=password_hash,
        role=UserRole.CUSTOMER
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create simple token
    token_data = {"user_id": user.id, "email": user.email}
    token = base64.b64encode(json.dumps(token_data).encode()).decode()
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "role": user.role.value
        }
    }

@router.post("/login")
def simple_login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Check password with simple hash
    password_hash = hashlib.sha256(data.password.encode()).hexdigest()
    if password_hash != user.hashed_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create simple token
    token_data = {"user_id": user.id, "email": user.email}
    token = base64.b64encode(json.dumps(token_data).encode()).decode()
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "role": user.role.value
        }
    }