#!/usr/bin/env python3
"""
Fix admin password with proper bcrypt hash
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User

def fix_admin_password():
    """Update admin password with proper hash"""
    db: Session = SessionLocal()
    try:
        # Find admin user
        admin_user = db.query(User).filter(User.email == "admin@opulon.com").first()
        
        if not admin_user:
            print("❌ Admin user not found!")
            return
        
        # Generate proper password hash
        new_password_hash = get_password_hash("admin123")
        admin_user.hashed_password = new_password_hash
        
        db.commit()
        print("✅ Admin password updated successfully!")
        print(f"Email: admin@opulon.com")
        print(f"Password: admin123")
        
        # Also fix test user
        test_user = db.query(User).filter(User.email == "user@opulon.com").first()
        if test_user:
            test_password_hash = get_password_hash("user123")
            test_user.hashed_password = test_password_hash
            db.commit()
            print("✅ Test user password updated successfully!")
        
    except Exception as e:
        print(f"❌ Error updating password: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_admin_password()