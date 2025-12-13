from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.staticfiles import StaticFiles
from .core.config import settings
from .core.database import engine, Base
from .api.v1 import auth, products, cart, orders, admin
from .secure_admin import router as secure_admin_router
from .product_admin import router as product_admin_router
from .product_edit import router as product_edit_router
from .admin_features import router as admin_features_router
from .simple_auth import router as simple_auth_router
from .working_auth import router as working_auth_router
from .user_management import router as user_management_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Modern Healthcare E-commerce Platform API",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(products.router, prefix="/api/v1")
app.include_router(cart.router, prefix="/api/v1")
app.include_router(orders.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(secure_admin_router)
app.include_router(product_admin_router)
app.include_router(product_edit_router)
app.include_router(admin_features_router)
app.include_router(simple_auth_router)
app.include_router(working_auth_router)
app.include_router(user_management_router)

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def root():
    return {
        "message": "Welcome to Opulon API",
        "version": settings.VERSION,
        "docs": "/docs",
        "admin_panel": "/admin/login"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)