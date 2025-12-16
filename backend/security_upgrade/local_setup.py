"""
Local Setup Script - Integrate Enhanced Security
Run this to upgrade your existing local backend
"""
import os
import shutil
import sys

def backup_existing_files():
    """Backup existing files before upgrade"""
    backup_dir = "backup_original"
    os.makedirs(backup_dir, exist_ok=True)
    
    files_to_backup = [
        "app/core/security.py",
        "app/core/deps.py", 
        "app/api/v1/auth.py",
        "app/main.py"
    ]
    
    for file_path in files_to_backup:
        if os.path.exists(file_path):
            shutil.copy2(file_path, f"{backup_dir}/{os.path.basename(file_path)}")
            print(f"Backed up {file_path}")

def create_enhanced_models():
    """Create enhanced models for RBAC"""
    models_content = '''"""
Enhanced Models for RBAC System
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB, INET
import uuid
from ..core.database import Base

class Role(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    permissions = relationship("RolePermission", back_populates="role")
    users = relationship("UserRole", back_populates="role")

class Permission(Base):
    __tablename__ = "permissions"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    resource = Column(String(50), nullable=False)
    action = Column(String(50), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    roles = relationship("RolePermission", back_populates="permission")

class RolePermission(Base):
    __tablename__ = "role_permissions"
    
    role_id = Column(Integer, ForeignKey("roles.id"), primary_key=True)
    permission_id = Column(Integer, ForeignKey("permissions.id"), primary_key=True)
    
    # Relationships
    role = relationship("Role", back_populates="permissions")
    permission = relationship("Permission", back_populates="roles")

class UserRole(Base):
    __tablename__ = "user_roles"
    
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    role_id = Column(Integer, ForeignKey("roles.id"), primary_key=True)
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())
    assigned_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relationships
    role = relationship("Role", back_populates="users")

class UserSession(Base):
    __tablename__ = "user_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    refresh_token_hash = Column(String(255), nullable=False)
    device_info = Column(JSONB)
    ip_address = Column(INET)
    user_agent = Column(Text)
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_used_at = Column(DateTime(timezone=True), server_default=func.now())

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(50), nullable=False)
    resource_id = Column(String(50))
    old_values = Column(JSONB)
    new_values = Column(JSONB)
    ip_address = Column(INET)
    user_agent = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class UserPreference(Base):
    __tablename__ = "user_preferences"
    
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    theme = Column(String(20), default='light')
    language = Column(String(10), default='en')
    notifications = Column(JSONB, default={"email": True, "sms": False})
    privacy_settings = Column(JSONB, default={"profile_public": False})
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

class Wishlist(Base):
    __tablename__ = "wishlists"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    added_at = Column(DateTime(timezone=True), server_default=func.now())
'''
    
    with open("app/models/enhanced.py", "w") as f:
        f.write(models_content)
    print("Created enhanced models")

def create_enhanced_schemas():
    """Create enhanced schemas"""
    schemas_content = '''"""
Enhanced Schemas for Authentication
"""
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime
import re

class UserRegister(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\\d', v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    totp_code: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str
    
    @validator('new_password')
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class TwoFASetup(BaseModel):
    pass

class TwoFAVerify(BaseModel):
    totp_code: str
'''
    
    with open("app/schemas/enhanced.py", "w") as f:
        f.write(schemas_content)
    print("Created enhanced schemas")

def update_user_model():
    """Update existing user model with new fields"""
    user_model_additions = '''
# Add these fields to your existing User model in app/models/user.py

# Enhanced security fields
password_changed_at = Column(DateTime(timezone=True), server_default=func.now())
failed_login_attempts = Column(Integer, default=0)
locked_until = Column(DateTime(timezone=True), nullable=True)
two_fa_secret = Column(String(32), nullable=True)
two_fa_enabled = Column(Boolean, default=False)
email_verified_at = Column(DateTime(timezone=True), nullable=True)
'''
    
    with open("user_model_additions.txt", "w") as f:
        f.write(user_model_additions)
    print("Created user model additions guide")

def create_local_env():
    """Create local environment file for testing"""
    env_content = '''# Local Testing Environment
DATABASE_URL=postgresql://postgres:password@localhost/opulon
REDIS_URL=redis://localhost:6379/0

# Security Keys (for testing only - generate new ones for production)
JWT_SECRET_KEY=test_jwt_secret_key_32_chars_minimum_length
CSRF_SECRET_KEY=test_csrf_secret_key_32_chars_minimum_length

# App Settings
DEBUG=True
APP_NAME=Opulon API Enhanced
VERSION=2.0.0
ALLOWED_HOSTS=["http://localhost:3000", "localhost", "127.0.0.1"]

# Rate Limiting
LOGIN_RATE_LIMIT=5
LOGIN_RATE_WINDOW=900
'''
    
    with open(".env.local", "w") as f:
        f.write(env_content)
    print("Created local environment file")

def main():
    """Main setup function"""
    print("Setting up Enhanced Security for Local Testing\n")
    
    # Check if we're in the right directory
    if not os.path.exists("app"):
        print("Please run this script from the backend directory")
        sys.exit(1)
    
    # Backup existing files
    print("Backing up existing files...")
    backup_existing_files()
    print()
    
    # Create enhanced models and schemas
    print("Creating enhanced models and schemas...")
    create_enhanced_models()
    create_enhanced_schemas()
    update_user_model()
    create_local_env()
    print()
    
    print("Setup complete! Next steps:")
    print("1. Install enhanced dependencies: pip install -r security_upgrade/requirements_enhanced.txt")
    print("2. Update your User model with the fields from user_model_additions.txt")
    print("3. Run database migrations: python security_upgrade/schema.sql")
    print("4. Start Redis: redis-server")
    print("5. Start your backend: uvicorn app.main:app --reload")
    print("6. Run tests: python security_upgrade/test_local.py")

if __name__ == "__main__":
    main()