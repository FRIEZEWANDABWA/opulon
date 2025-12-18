from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import csv
import io
import json
from datetime import datetime
from ...core.database import get_db
from ...core.deps import get_admin_user
from ...models.user import User, UserRole
from ...models.product import Product, Category
from ...schemas.product import ProductCreate, ProductResponse
from ...schemas.user import UserCreate, UserUpdate
from ...core.security import get_password_hash

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/dashboard")
async def get_admin_dashboard(current_user: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    """Get admin dashboard statistics"""
    total_products = db.query(Product).count()
    total_categories = db.query(Category).count()
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    admin_users = db.query(User).filter(User.role == UserRole.ADMIN).count()
    low_stock_products = db.query(Product).filter(Product.stock_quantity < 10).count()
    
    return {
        "total_products": total_products,
        "total_categories": total_categories,
        "total_users": total_users,
        "active_users": active_users,
        "admin_users": admin_users,
        "low_stock_products": low_stock_products,
        "message": f"Welcome back, {current_user.full_name}!"
    }

@router.post("/products/bulk-upload")
async def bulk_upload_products(
    file: UploadFile = File(...),
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Bulk upload products via CSV file"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV files are supported"
        )
    
    try:
        # Read CSV content
        content = await file.read()
        csv_content = content.decode('utf-8')
        csv_reader = csv.DictReader(io.StringIO(csv_content))
        
        created_products = []
        errors = []
        
        for row_num, row in enumerate(csv_reader, start=2):  # Start at 2 for header
            try:
                # Validate required fields
                required_fields = ['name', 'price', 'sku', 'category_name']
                for field in required_fields:
                    if not row.get(field):
                        errors.append(f"Row {row_num}: Missing required field '{field}'")
                        continue
                
                # Find or create category
                category_name = row['category_name'].strip()
                category = db.query(Category).filter(Category.name == category_name).first()
                if not category:
                    category = Category(name=category_name, description=f"Auto-created category: {category_name}")
                    db.add(category)
                    db.commit()
                    db.refresh(category)
                
                # Check if product with SKU already exists
                existing_product = db.query(Product).filter(Product.sku == row['sku']).first()
                if existing_product:
                    errors.append(f"Row {row_num}: Product with SKU '{row['sku']}' already exists")
                    continue
                
                # Create product
                product = Product(
                    name=row['name'].strip(),
                    description=row.get('description', '').strip(),
                    price=float(row['price']),
                    sku=row['sku'].strip(),
                    stock_quantity=int(row.get('stock_quantity', 0)),
                    category_id=category.id,
                    manufacturer=row.get('manufacturer', '').strip() or None,
                    dosage=row.get('dosage', '').strip() or None,
                    is_prescription_required=row.get('is_prescription_required', '').lower() in ['true', '1', 'yes']
                )
                
                db.add(product)
                db.commit()
                db.refresh(product)
                created_products.append(product.name)
                
            except Exception as e:
                errors.append(f"Row {row_num}: {str(e)}")
                db.rollback()
        
        return {
            "message": f"Bulk upload completed. Created {len(created_products)} products.",
            "created_products": created_products,
            "errors": errors
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing file: {str(e)}"
        )

@router.get("/products/export-template")
async def export_product_template(current_user: User = Depends(get_admin_user)):
    """Download CSV template for bulk product upload"""
    template_content = """name,description,price,sku,stock_quantity,category_name,manufacturer,dosage,is_prescription_required
Aspirin 325mg,Pain reliever and anti-inflammatory,5.99,ASP-325MG,100,Pain Management,Generic Pharma,325mg,false
Lisinopril 10mg,ACE inhibitor for blood pressure,12.50,LIS-10MG-NEW,50,Heart Health,CardioMed,10mg,true"""
    
    return {
        "template": template_content,
        "instructions": [
            "Required fields: name, price, sku, category_name",
            "Optional fields: description, stock_quantity, manufacturer, dosage, is_prescription_required",
            "Categories will be auto-created if they don't exist",
            "SKU must be unique across all products",
            "Price should be a decimal number (e.g., 12.50)",
            "Stock quantity should be an integer",
            "is_prescription_required should be true/false"
        ]
    }

@router.get("/users")
async def get_all_users(current_user: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    """Get all users for admin management"""
    users = db.query(User).all()
    return [{
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "full_name": user.full_name,
        "role": user.role.value,
        "is_active": user.is_active,
        "is_verified": user.is_verified,
        "created_at": user.created_at.isoformat()
    } for user in users]

@router.post("/users")
async def create_user(
    user_data: UserCreate,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exists"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        role=UserRole(user_data.role) if user_data.role else UserRole.USER,
        is_active=user_data.is_active if user_data.is_active is not None else True,
        is_verified=user_data.is_verified if user_data.is_verified is not None else False
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Log audit
    log_audit(
        action="CREATE",
        entity_type="USER",
        entity_id=new_user.id,
        user_id=current_user.id,
        user_name=current_user.full_name,
        changes={"email": new_user.email, "role": new_user.role.value},
        db=db
    )
    
    return {
        "id": new_user.id,
        "email": new_user.email,
        "username": new_user.username,
        "full_name": new_user.full_name,
        "role": new_user.role.value,
        "is_active": new_user.is_active,
        "is_verified": new_user.is_verified,
        "created_at": new_user.created_at.isoformat()
    }

@router.put("/users/{user_id}")
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update fields if provided
    if user_data.email:
        # Check if email is already taken by another user
        existing_user = db.query(User).filter(
            User.email == user_data.email,
            User.id != user_id
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already taken"
            )
        user.email = user_data.email
    
    if user_data.username:
        # Check if username is already taken by another user
        existing_user = db.query(User).filter(
            User.username == user_data.username,
            User.id != user_id
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        user.username = user_data.username
    
    if user_data.full_name:
        user.full_name = user_data.full_name
    
    if user_data.role:
        user.role = UserRole(user_data.role)
    
    if user_data.is_active is not None:
        user.is_active = user_data.is_active
    
    if user_data.is_verified is not None:
        user.is_verified = user_data.is_verified
    
    changes = {}
    if user_data.role and user.role.value != user_data.role:
        changes["role"] = {"from": user.role.value, "to": user_data.role}
    
    if user_data.password:
        user.hashed_password = get_password_hash(user_data.password)
        changes["password"] = "updated"
    
    db.commit()
    db.refresh(user)
    
    # Log audit if there were changes
    if changes:
        log_audit(
            action="UPDATE",
            entity_type="USER",
            entity_id=user.id,
            user_id=current_user.id,
            user_name=current_user.full_name,
            changes=changes,
            db=db
        )
    
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "full_name": user.full_name,
        "role": user.role.value,
        "is_active": user.is_active,
        "is_verified": user.is_verified,
        "created_at": user.created_at.isoformat()
    }

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent deleting yourself
    if user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    # Log audit before deletion
    log_audit(
        action="DELETE",
        entity_type="USER",
        entity_id=user.id,
        user_id=current_user.id,
        user_name=current_user.full_name,
        changes={"deleted_user": user.email},
        db=db
    )
    
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"}

def log_audit(action: str, entity_type: str, entity_id: int, user_id: int, user_name: str, changes: dict, ip_address: str = None, db: Session = None):
    """Log audit event to database"""
    from ...models.audit_log import AuditLog
    
    if not db:
        from ...core.database import SessionLocal
        db = SessionLocal()
        should_close = True
    else:
        should_close = False
    
    try:
        audit_log = AuditLog(
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            user_id=user_id,
            user_name=user_name,
            changes=changes,
            ip_address=ip_address
        )
        
        db.add(audit_log)
        db.commit()
    except Exception as e:
        print(f"Error logging audit: {e}")
        db.rollback()
    finally:
        if should_close:
            db.close()

@router.get("/audits")
async def get_audit_logs(current_user: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    """Get audit logs from database"""
    from ...models.audit_log import AuditLog
    
    audit_logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(100).all()
    
    return [{
        "id": log.id,
        "action": log.action,
        "entity_type": log.entity_type,
        "entity_id": log.entity_id,
        "user_id": log.user_id,
        "user_name": log.user_name,
        "changes": log.changes,
        "timestamp": log.timestamp.isoformat(),
        "ip_address": log.ip_address
    } for log in audit_logs]