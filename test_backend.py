"""
Simple test version of Opulon backend for demonstration
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(
    title="Opulon API - Test Version",
    version="1.0.0",
    description="Healthcare E-commerce Platform API (Test Mode)"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data
mock_products = [
    {
        "id": 1,
        "name": "Aspirin 325mg",
        "description": "Pain reliever and fever reducer",
        "price": 12.99,
        "sku": "ASP-325-100",
        "stock_quantity": 150,
        "image_url": None,
        "is_active": True,
        "is_prescription_required": False,
        "manufacturer": "PharmaCorp"
    },
    {
        "id": 2,
        "name": "Digital Thermometer",
        "description": "Fast and accurate digital thermometer",
        "price": 24.99,
        "sku": "THERM-DIG-001",
        "stock_quantity": 75,
        "image_url": None,
        "is_active": True,
        "is_prescription_required": False,
        "manufacturer": "MedTech"
    },
    {
        "id": 3,
        "name": "Vitamin D3 1000IU",
        "description": "Essential vitamin D supplement",
        "price": 18.99,
        "sku": "VIT-D3-1000",
        "stock_quantity": 200,
        "image_url": None,
        "is_active": True,
        "is_prescription_required": False,
        "manufacturer": "HealthPlus"
    }
]

mock_categories = [
    {"id": 1, "name": "Pharmaceuticals", "description": "Prescription and OTC medications"},
    {"id": 2, "name": "Medical Supplies", "description": "Essential medical supplies"},
    {"id": 3, "name": "Vitamins & Supplements", "description": "Health supplements"}
]

# Pydantic models
class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str
    username: str
    full_name: str
    password: str
    phone: Optional[str] = None
    address: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# Routes
@app.get("/")
def root():
    return {
        "message": "Welcome to Opulon API - Test Version",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "mode": "test"}

@app.get("/api/v1/products")
def get_products():
    return mock_products

@app.get("/api/v1/products/{product_id}")
def get_product(product_id: int):
    product = next((p for p in mock_products if p["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.get("/api/v1/products/categories")
def get_categories():
    return mock_categories

@app.post("/api/v1/auth/login")
def login(credentials: UserLogin):
    # Mock authentication
    if credentials.email == "admin@opulon.com" and credentials.password == "admin123":
        return Token(
            access_token="mock-admin-token",
            token_type="bearer",
            user={
                "id": 1,
                "email": "admin@opulon.com",
                "username": "admin",
                "full_name": "Admin User",
                "role": "superadmin",
                "is_active": True
            }
        )
    elif credentials.email == "user@test.com" and credentials.password == "test123":
        return Token(
            access_token="mock-user-token",
            token_type="bearer",
            user={
                "id": 2,
                "email": "user@test.com",
                "username": "testuser",
                "full_name": "Test User",
                "role": "user",
                "is_active": True
            }
        )
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/v1/auth/register")
def register(user_data: UserCreate):
    # Mock registration
    return Token(
        access_token="mock-new-user-token",
        token_type="bearer",
        user={
            "id": 3,
            "email": user_data.email,
            "username": user_data.username,
            "full_name": user_data.full_name,
            "role": "user",
            "is_active": True
        }
    )

@app.get("/api/v1/cart")
def get_cart():
    return {"id": 1, "user_id": 1, "items": [], "created_at": "2024-01-01T00:00:00"}

@app.post("/api/v1/cart/items")
def add_to_cart(item: dict):
    return {"message": "Item added to cart", "item": item}

if __name__ == "__main__":
    print("🚀 Starting Opulon Test Backend...")
    print("📍 API will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔑 Test Accounts:")
    print("   Admin: admin@opulon.com / admin123")
    print("   User:  user@test.com / test123")
    print("\n✨ Ready for testing!")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)