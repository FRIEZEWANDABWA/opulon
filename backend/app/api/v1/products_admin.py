from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
import shutil
from pathlib import Path
from ...core.database import get_db
from ...core.deps import get_admin_user
from ...models.user import User
from ...models.product import Product, Category, ProductCreate
from ...models.product_image import ProductImage

router = APIRouter(prefix="/admin/products", tags=["Admin Products"])

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Create a new product"""
    
    # Check if SKU is unique
    existing_sku = db.query(Product).filter(Product.sku == product_in.sku).first()
    if existing_sku:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="SKU already exists"
        )

    # Check if category exists
    category = db.query(Category).filter(Category.id == product_in.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {product_in.category_id} not found"
        )

    new_product = Product(**product_in.dict())
    
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    
    return {
        "id": new_product.id,
        "name": new_product.name,
        "description": new_product.description,
        "price": float(new_product.price),
        "sku": new_product.sku,
        "stock_quantity": new_product.stock_quantity,
        "category_id": new_product.category_id,
        "manufacturer": new_product.manufacturer,
        "dosage": new_product.dosage,
        "is_prescription_required": new_product.is_prescription_required
    }

@router.put("/{product_id}")
async def update_product(
    product_id: int,
    name: str = Form(...),
    description: str = Form(""),
    price: float = Form(...),
    sku: str = Form(...),
    stock_quantity: int = Form(0),
    category_id: int = Form(...),
    manufacturer: str = Form(""),
    dosage: str = Form(""),
    is_prescription_required: bool = Form(False),
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update product details"""
    
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Check if SKU is unique (excluding current product)
    existing_sku = db.query(Product).filter(
        Product.sku == sku,
        Product.id != product_id
    ).first()
    if existing_sku:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="SKU already exists"
        )
    
    # Update product fields
    product.name = name
    product.description = description
    product.price = price
    product.sku = sku
    product.stock_quantity = stock_quantity
    product.category_id = category_id
    product.manufacturer = manufacturer
    product.dosage = dosage
    product.is_prescription_required = is_prescription_required
    
    db.commit()
    db.refresh(product)
    
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
        "is_prescription_required": product.is_prescription_required
    }

@router.post("/{product_id}/images")
async def upload_product_images(
    product_id: int,
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Upload images for a product"""
    
    # Check if product exists
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Limit to 3 images
    if len(files) > 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 3 images allowed per product"
        )
    
    # Create uploads directory
    upload_dir = Path("/app/uploads/products")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    uploaded_images = []
    
    for i, file in enumerate(files):
        # Validate file type by extension
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.avif'}
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File {file.filename} format not supported. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Generate unique filename
        file_ext = Path(file.filename).suffix.lower()
        if not file_ext:
            file_ext = '.jpg'
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = upload_dir / unique_filename
        
        try:
            # Save file
            with open(file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            
            # Create database record
            is_primary = i == 0  # First image is primary
            
            product_image = ProductImage(
                product_id=product_id,
                image_url=f"/uploads/products/{unique_filename}",
                alt_text=f"{product.name} - Image {i+1}",
                is_primary=is_primary,
                display_order=i
            )
            
            db.add(product_image)
            db.commit()
            db.refresh(product_image)
            
            uploaded_images.append({
                "id": product_image.id,
                "image_url": product_image.image_url,
                "alt_text": product_image.alt_text,
                "is_primary": product_image.is_primary
            })
            
        except Exception as e:
            # Clean up file if database operation fails
            if file_path.exists():
                file_path.unlink()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error uploading file {file.filename}: {str(e)}"
            )
    
    return {
        "message": f"Successfully uploaded {len(uploaded_images)} images",
        "images": uploaded_images
    }

@router.delete("/{product_id}/images/{image_id}")
async def delete_product_image(
    product_id: int,
    image_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a product image"""
    
    image = db.query(ProductImage).filter(
        ProductImage.id == image_id,
        ProductImage.product_id == product_id
    ).first()
    
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )
    
    # Delete file from filesystem
    file_path = Path("/app") / "uploads" / "products" / Path(image.image_url).name
    if file_path.exists():
        file_path.unlink()
    
    # Delete from database
    db.delete(image)
    db.commit()
    
    return {"message": "Image deleted successfully"}

@router.get("/{product_id}/images")
async def get_product_images(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Get all images for a product"""
    
    images = db.query(ProductImage).filter(
        ProductImage.product_id == product_id
    ).order_by(ProductImage.display_order).all()
    
    return [{
        "id": img.id,
        "image_url": img.image_url,
        "alt_text": img.alt_text,
        "is_primary": img.is_primary,
        "display_order": img.display_order
    } for img in images]