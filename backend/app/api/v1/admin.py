from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import csv
import io
from ...core.database import get_db
from ...core.deps import get_admin_user
from ...models.user import User
from ...models.product import Product, Category
from ...schemas.product import ProductCreate, ProductResponse

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/dashboard")
async def get_admin_dashboard(current_user: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    """Get admin dashboard statistics"""
    total_products = db.query(Product).count()
    total_categories = db.query(Category).count()
    low_stock_products = db.query(Product).filter(Product.stock_quantity < 10).count()
    
    return {
        "total_products": total_products,
        "total_categories": total_categories,
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