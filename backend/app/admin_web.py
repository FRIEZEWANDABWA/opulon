from fastapi import APIRouter, Request, Depends, Form, HTTPException, status
from fastapi.responses import HTMLResponse
# from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from .core.database import get_db
from .models.product import Product, Category
from .models.user import User
from .models.order import Order
from .core.deps import get_admin_user
import os

router = APIRouter(prefix="/admin-panel", tags=["Admin Panel"])
# templates = Jinja2Templates(directory="templates")

@router.get("/", response_class=HTMLResponse)
async def admin_dashboard(request: Request, db: Session = Depends(get_db)):
    """Admin Dashboard"""
    total_products = db.query(Product).count()
    total_categories = db.query(Category).count()
    total_users = db.query(User).count()
    total_orders = db.query(Order).count()
    
    return HTMLResponse(content=f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Opulon Admin Dashboard</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-light">
        <nav class="navbar navbar-dark bg-primary">
            <div class="container-fluid">
                <span class="navbar-brand mb-0 h1">
                    <i class="fas fa-hospital"></i> Opulon Admin Dashboard
                </span>
            </div>
        </nav>
        
        <div class="container-fluid mt-4">
            <div class="row">
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body text-center">
                            <i class="fas fa-pills fa-3x text-primary mb-3"></i>
                            <h3>{total_products}</h3>
                            <p class="text-muted">Total Products</p>
                            <a href="/admin-panel/products" class="btn btn-primary btn-sm">Manage Products</a>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body text-center">
                            <i class="fas fa-tags fa-3x text-success mb-3"></i>
                            <h3>{total_categories}</h3>
                            <p class="text-muted">Categories</p>
                            <a href="/admin-panel/categories" class="btn btn-success btn-sm">Manage Categories</a>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body text-center">
                            <i class="fas fa-users fa-3x text-info mb-3"></i>
                            <h3>{total_users}</h3>
                            <p class="text-muted">Total Users</p>
                            <a href="/admin-panel/users" class="btn btn-info btn-sm">Manage Users</a>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body text-center">
                            <i class="fas fa-shopping-cart fa-3x text-warning mb-3"></i>
                            <h3>{total_orders}</h3>
                            <p class="text-muted">Total Orders</p>
                            <a href="/admin-panel/orders" class="btn btn-warning btn-sm">View Orders</a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mt-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5><i class="fas fa-tachometer-alt"></i> Quick Actions</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4">
                                    <a href="/admin-panel/products/add" class="btn btn-success btn-lg w-100 mb-2">
                                        <i class="fas fa-plus"></i> Add New Product
                                    </a>
                                </div>
                                <div class="col-md-4">
                                    <a href="/admin-panel/bulk-upload" class="btn btn-primary btn-lg w-100 mb-2">
                                        <i class="fas fa-upload"></i> Bulk Upload Products
                                    </a>
                                </div>
                                <div class="col-md-4">
                                    <a href="/docs" class="btn btn-secondary btn-lg w-100 mb-2" target="_blank">
                                        <i class="fas fa-code"></i> API Documentation
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
    """)

@router.get("/products", response_class=HTMLResponse)
async def products_page(request: Request, db: Session = Depends(get_db)):
    """Products Management Page"""
    products = db.query(Product).all()
    
    products_html = ""
    for product in products:
        products_html += f"""
        <tr>
            <td>{product.id}</td>
            <td>{product.name}</td>
            <td>{product.sku}</td>
            <td>${product.price:.2f}</td>
            <td>{product.stock_quantity}</td>
            <td>
                <span class="badge bg-{'success' if product.stock_quantity > 10 else 'warning' if product.stock_quantity > 0 else 'danger'}">
                    {'In Stock' if product.stock_quantity > 10 else 'Low Stock' if product.stock_quantity > 0 else 'Out of Stock'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editProduct({product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct({product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
        """
    
    return HTMLResponse(content=f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Products - Opulon Admin</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-light">
        <nav class="navbar navbar-dark bg-primary">
            <div class="container-fluid">
                <a class="navbar-brand" href="/admin-panel/">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </a>
                <span class="navbar-text">Products Management</span>
            </div>
        </nav>
        
        <div class="container-fluid mt-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h2><i class="fas fa-pills"></i> Products</h2>
                <a href="/admin-panel/products/add" class="btn btn-success">
                    <i class="fas fa-plus"></i> Add Product
                </a>
            </div>
            
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>SKU</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products_html}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
        <script>
            function editProduct(id) {{
                window.location.href = `/admin-panel/products/edit/${{id}}`;
            }}
            
            function deleteProduct(id) {{
                if (confirm('Are you sure you want to delete this product?')) {{
                    fetch(`/api/v1/products/${{id}}`, {{
                        method: 'DELETE'
                    }}).then(() => location.reload());
                }}
            }}
        </script>
    </body>
    </html>
    """)

@router.get("/bulk-upload", response_class=HTMLResponse)
async def bulk_upload_page(request: Request):
    """Bulk Upload Page"""
    return HTMLResponse(content="""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Bulk Upload - Opulon Admin</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-light">
        <nav class="navbar navbar-dark bg-primary">
            <div class="container-fluid">
                <a class="navbar-brand" href="/admin-panel/">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </a>
                <span class="navbar-text">Bulk Upload Products</span>
            </div>
        </nav>
        
        <div class="container mt-4">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-header">
                            <h5><i class="fas fa-upload"></i> Bulk Upload Products</h5>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-info">
                                <h6><i class="fas fa-info-circle"></i> Instructions:</h6>
                                <ul class="mb-0">
                                    <li>Upload a CSV file with product data</li>
                                    <li>Required columns: name, price, sku, category_name</li>
                                    <li>Optional columns: description, stock_quantity, manufacturer, dosage</li>
                                </ul>
                            </div>
                            
                            <form id="uploadForm" enctype="multipart/form-data">
                                <div class="mb-3">
                                    <label for="csvFile" class="form-label">Select CSV File</label>
                                    <input type="file" class="form-control" id="csvFile" accept=".csv" required>
                                </div>
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-upload"></i> Upload Products
                                </button>
                                <a href="/api/v1/admin/products/export-template" class="btn btn-secondary">
                                    <i class="fas fa-download"></i> Download Template
                                </a>
                            </form>
                            
                            <div id="result" class="mt-3"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
        <script>
            document.getElementById('uploadForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const fileInput = document.getElementById('csvFile');
                const file = fileInput.files[0];
                
                if (!file) {
                    alert('Please select a file');
                    return;
                }
                
                const formData = new FormData();
                formData.append('file', file);
                
                try {
                    const response = await fetch('/api/v1/admin/products/bulk-upload', {
                        method: 'POST',
                        body: formData
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        document.getElementById('result').innerHTML = `
                            <div class="alert alert-success">
                                <h6>Success!</h6>
                                <p>${result.message}</p>
                                ${result.created_products.length > 0 ? `<p>Created: ${result.created_products.join(', ')}</p>` : ''}
                                ${result.errors.length > 0 ? `<p>Errors: ${result.errors.join(', ')}</p>` : ''}
                            </div>
                        `;
                    } else {
                        document.getElementById('result').innerHTML = `
                            <div class="alert alert-danger">
                                <h6>Error!</h6>
                                <p>${result.detail}</p>
                            </div>
                        `;
                    }
                } catch (error) {
                    document.getElementById('result').innerHTML = `
                        <div class="alert alert-danger">
                            <h6>Error!</h6>
                            <p>Failed to upload file: ${error.message}</p>
                        </div>
                    `;
                }
            });
        </script>
    </body>
    </html>
    """)