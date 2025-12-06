from pydantic import BaseModel
from typing import List
from decimal import Decimal
from datetime import datetime
from ..models.order import OrderStatus

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: Decimal

class OrderItemResponse(OrderItemBase):
    id: int
    
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    shipping_address: str
    payment_method: str

class OrderCreate(OrderBase):
    items: List[OrderItemBase]

class OrderResponse(OrderBase):
    id: int
    user_id: int
    total_amount: Decimal
    status: OrderStatus
    payment_status: str
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse]
    
    class Config:
        from_attributes = True