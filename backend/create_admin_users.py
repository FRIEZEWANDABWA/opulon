#!/usr/bin/env python3
"""
Create admin users for production deployment
"""
import asyncio
from sqlalchemy.orm import Session
from app.core.database import engine
from app.core.security import get_password_hash
from app.models.user import User, UserRole

def create_admin_users():
    """Create the two admin users for production"""
    db = Session(bind=engine)
    
    try:
        # Super Admin - Frieze Wandabwa
        super_admin = db.query(User).filter(User.email == "friezekw@gmail.com").first()
        if not super_admin:
            super_admin = User(
                email="friezekw@gmail.com",
                username="frieze",
                full_name="Frieze Wandabwa",
                hashed_password=get_password_hash("Hakunapassword@123"),
                role=UserRole.SUPERADMIN,
                is_active=True,
                is_verified=True
            )
            db.add(super_admin)
            print("✅ Created Super Admin: Frieze Wandabwa")
        else:
            print("ℹ️ Super Admin already exists")

        # Admin - Aubwa
        admin = db.query(User).filter(User.email == "afubwa@opulonhq.com").first()
        if not admin:
            admin = User(
                email="afubwa@opulonhq.com",
                username="aubwa",
                full_name="Aubwa",
                hashed_password=get_password_hash("Afubwa@123"),
                role=UserRole.ADMIN,
                is_active=True,
                is_verified=True
            )
            db.add(admin)
            print("✅ Created Admin: Aubwa")
        else:
            print("ℹ️ Admin already exists")

        db.commit()
        print("🎉 Admin users setup complete!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating admin users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_users()