from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .product import ProductResponse

class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItemResponse(CartItemBase):
    id: int
    created_at: datetime
    product: ProductResponse
    
    class Config:
        from_attributes = True

class CartResponse(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[CartItemResponse]
    
    class Config:
        from_attributes = True