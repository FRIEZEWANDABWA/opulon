from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import datetime

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal
    sku: str
    stock_quantity: int = 0
    image_url: Optional[str] = None
    category_id: int
    is_prescription_required: bool = False
    manufacturer: Optional[str] = None
    dosage: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]
    category: Optional[CategoryResponse] = None
    
    class Config:
        from_attributes = True