from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
import shutil
from pathlib import Path
try:
    from PIL import Image
except ImportError:
    Image = None
from ...core.database import get_db
from ...core.deps import get_admin_user
from ...models.user import User
from ...models.product import Product
from ...models.product_image import ProductImage

router = APIRouter(prefix="/upload", tags=["Upload"])

# Allowed image formats
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
UPLOAD_DIR = Path("uploads/products")

# Ensure upload directory exists
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

def validate_image(file: UploadFile) -> bool:
    """Validate uploaded image file"""
    # Check file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        return False
    
    # Check file size
    if file.size and file.size > MAX_FILE_SIZE:
        return False
    
    return True

def resize_image(image_path: Path, max_size: tuple = (800, 800)) -> None:
    """Resize image while maintaining aspect ratio"""
    if not Image:
        return  # Skip resizing if PIL not available
    try:
        with Image.open(image_path) as img:
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            
            # Resize maintaining aspect ratio
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Save optimized image
            img.save(image_path, 'JPEG', quality=85, optimize=True)
    except Exception as e:
        print(f"Error resizing image: {e}")

@router.post("/product-images/{product_id}")
async def upload_product_images(
    product_id: int,
    files: List[UploadFile] = File(...),
    alt_texts: Optional[List[str]] = Form(None),
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Upload multiple images for a product (max 3)"""
    
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
    
    # Check current image count
    current_images = db.query(ProductImage).filter(ProductImage.product_id == product_id).count()
    if current_images + len(files) > 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Product already has {current_images} images. Maximum 3 total allowed."
        )
    
    uploaded_images = []
    
    for i, file in enumerate(files):
        # Validate file
        if not validate_image(file):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file: {file.filename}. Must be image file under 5MB."
            )
        
        # Generate unique filename
        file_ext = Path(file.filename).suffix.lower()
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / unique_filename
        
        try:
            # Save file
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # Resize and optimize image
            resize_image(file_path)
            
            # Create database record
            alt_text = alt_texts[i] if alt_texts and i < len(alt_texts) else f"{product.name} - Image {i+1}"
            is_primary = current_images == 0 and i == 0  # First image is primary
            
            product_image = ProductImage(
                product_id=product_id,
                image_url=f"/uploads/products/{unique_filename}",
                alt_text=alt_text,
                is_primary=is_primary,
                display_order=current_images + i
            )
            
            db.add(product_image)
            db.commit()
            db.refresh(product_image)
            
            uploaded_images.append({
                "id": product_image.id,
                "image_url": product_image.image_url,
                "alt_text": product_image.alt_text,
                "is_primary": product_image.is_primary,
                "display_order": product_image.display_order
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

@router.delete("/product-images/{image_id}")
async def delete_product_image(
    image_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a product image"""
    
    image = db.query(ProductImage).filter(ProductImage.id == image_id).first()
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )
    
    # Delete file from filesystem
    file_path = Path("uploads") / "products" / Path(image.image_url).name
    if file_path.exists():
        file_path.unlink()
    
    # Delete from database
    db.delete(image)
    db.commit()
    
    return {"message": "Image deleted successfully"}

@router.get("/product-images/{product_id}")
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