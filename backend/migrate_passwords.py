#!/usr/bin/env python3
"""
Password Migration Script
Migrates existing SHA256 passwords to bcrypt hashing
"""
import hashlib
from sqlalchemy.orm import Session
from app.core.database import engine, get_db
from app.core.security import get_password_hash
from app.models.user import User

def is_sha256_hash(password_hash: str) -> bool:
    """Check if a password hash is SHA256 (64 hex characters)"""
    return len(password_hash) == 64 and all(c in '0123456789abcdef' for c in password_hash.lower())

def migrate_passwords():
    """Migrate SHA256 passwords to bcrypt"""
    db = Session(bind=engine)
    
    try:
        # Find users with SHA256 passwords
        users = db.query(User).all()
        sha256_users = []
        
        for user in users:
            if is_sha256_hash(user.hashed_password):
                sha256_users.append(user)
        
        if not sha256_users:
            print("No SHA256 passwords found. All passwords are already using bcrypt.")
            return
        
        print(f"Found {len(sha256_users)} users with SHA256 passwords.")
        print("WARNING: SHA256 passwords cannot be migrated to bcrypt without knowing the original password.")
        print("These users will need to reset their passwords.")
        
        # For demo purposes, set a default password that users must change
        default_password = "ChangeMe123!"
        default_bcrypt_hash = get_password_hash(default_password)
        
        for user in sha256_users:
            print(f"Migrating user: {user.email}")
            user.hashed_password = default_bcrypt_hash
            # Mark user as needing password reset
            user.is_verified = False
        
        db.commit()
        print(f"Migration completed. {len(sha256_users)} users now have bcrypt passwords.")
        print(f"Default password for migrated users: {default_password}")
        print("Users should be notified to change their passwords immediately.")
        
    except Exception as e:
        db.rollback()
        print(f"Migration failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    migrate_passwords()