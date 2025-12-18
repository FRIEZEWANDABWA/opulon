from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ...core.database import get_db
from ...core.deps import get_admin_user
from ...models.product import Product, Category
from ...models.user import User
from ...models.product_image import ProductImage
from ...schemas.product import ProductCreate, ProductResponse, CategoryCreate, CategoryResponse

router = APIRouter(prefix="/products", tags=["Products"])

# Public routes
@router.get("/")
def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product)
    
    if category_id:
        query = query.filter(Product.category_id == category_id)
    
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    
    products = query.offset(skip).limit(limit).all()
    
    # Enhanced response format with stock status and images
    result = []
    for p in products:
        # Get product images
        from ...models.product_image import ProductImage
        images = db.query(ProductImage).filter(
            ProductImage.product_id == p.id
        ).order_by(ProductImage.display_order).all()
        
        product_data = {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": float(p.price),
            "sku": p.sku,
            "stock_quantity": p.stock_quantity,
            "stock_status": "out_of_stock" if p.stock_quantity <= 0 else "low_stock" if p.stock_quantity <= 10 else "in_stock",
            "is_available": p.stock_quantity > 0,
            "category_id": p.category_id,
            "manufacturer": p.manufacturer,
            "dosage": p.dosage,
            "is_prescription_required": p.is_prescription_required,
            "image_url": p.image_url,  # Legacy single image
            "images": [{
                "id": img.id,
                "image_url": img.image_url,
                "alt_text": img.alt_text,
                "is_primary": img.is_primary
            } for img in images]
        }
        result.append(product_data)
    
    return result

@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.is_active == True
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Get product images
    images = db.query(ProductImage).filter(
        ProductImage.product_id == product.id
    ).order_by(ProductImage.display_order).all()
    
    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": float(product.price),
        "sku": product.sku,
        "stock_quantity": product.stock_quantity,
        "category_id": product.category_id,
        "manufacturer": product.manufacturer,
        "dosage": product.dosage,
        "is_prescription_required": product.is_prescription_required,
        "is_active": product.is_active,
        "created_at": product.created_at,
        "updated_at": product.updated_at,
        "images": [{
            "id": img.id,
            "image_url": img.image_url,
            "alt_text": img.alt_text,
            "is_primary": img.is_primary
        } for img in images]
    }

@router.get("/categories/")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return [{
        "id": c.id,
        "name": c.name,
        "description": c.description
    } for c in categories]

# Admin routes
@router.post("/", response_model=ProductResponse)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    # Check if SKU exists
    if db.query(Product).filter(Product.sku == product_data.sku).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="SKU already exists"
        )
    
    product = Product(**product_data.dict())
    db.add(product)
    db.commit()
    db.refresh(product)
    
    return product

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    for field, value in product_data.dict().items():
        setattr(product, field, value)
    
    db.commit()
    db.refresh(product)
    
    return product

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    db.delete(product)
    db.commit()
    
    return {"message": "Product deleted successfully"}

@router.post("/categories/", response_model=CategoryResponse)
def create_category(
    category_data: CategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    category = Category(**category_data.dict())
    db.add(category)
    db.commit()
    db.refresh(category)
    
    return category