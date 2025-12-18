#!/usr/bin/env python3
"""
Initialize admin user for Opulon platform
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.core.database import Base

def create_admin_user():
    """Create admin user if it doesn't exist"""
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        # Check if admin user exists
        admin_user = db.query(User).filter(User.email == "admin@opulon.com").first()
        
        if admin_user:
            print("Admin user already exists!")
            print(f"Email: {admin_user.email}")
            print(f"Role: {admin_user.role}")
            return
        
        # Create admin user
        password = "admin123"[:72]  # Truncate to 72 bytes for bcrypt
        hashed_password = get_password_hash(password)
        admin_user = User(
            email="admin@opulon.com",
            username="admin",
            hashed_password=hashed_password,
            full_name="Admin User",
            role=UserRole.ADMIN,
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("✅ Admin user created successfully!")
        print(f"Email: admin@opulon.com")
        print(f"Password: admin123")
        print(f"Role: {admin_user.role}")
        
        # Create a test regular user
        test_user = db.query(User).filter(User.email == "user@opulon.com").first()
        if not test_user:
            test_password = "user123"[:72]  # Truncate to 72 bytes for bcrypt
            test_hashed_password = get_password_hash(test_password)
            test_user = User(
                email="user@opulon.com",
                username="testuser",
                hashed_password=test_hashed_password,
                full_name="Test User",
                role=UserRole.USER,
                is_active=True
            )
            db.add(test_user)
            db.commit()
            print("✅ Test user created successfully!")
            print(f"Email: user@opulon.com")
            print(f"Password: user123")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()