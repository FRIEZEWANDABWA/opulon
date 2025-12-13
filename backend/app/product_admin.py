from fastapi import APIRouter, Request, Depends, Form, HTTPException, status, UploadFile, File, Cookie
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy.orm import Session
from .core.database import get_db
from .models.product import Product, Category
from .secure_admin import verify_admin_session
import os
import uuid
from typing import Optional
import shutil

router = APIRouter(prefix="/admin", tags=["Product Admin"])

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads/products"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/products", response_class=HTMLResponse)
async def products_page(request: Request, db: Session = Depends(get_db), _: bool = Depends(verify_admin_session)):
    products = db.query(Product).all()
    categories = db.query(Category).all()
    
    products_html = ""
    for product in products:
        stock_badge = "success" if product.stock_quantity > 10 else "warning" if product.stock_quantity > 0 else "error"
        stock_text = "In Stock" if product.stock_quantity > 10 else "Low Stock" if product.stock_quantity > 0 else "Out of Stock"
        
        products_html += f"""
        <tr>
            <td>
                <div class="flex items-center gap-3">
                    <div class="avatar">
                        <div class="mask mask-squircle w-12 h-12">
                            <img src="{product.image_url or '/static/placeholder.jpg'}" alt="{product.name}" />
                        </div>
                    </div>
                    <div>
                        <div class="font-bold">{product.name}</div>
                        <div class="text-sm opacity-50">{product.sku}</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="badge badge-outline">{product.category.name if product.category else 'No Category'}</div>
            </td>
            <td>${product.price:.2f}</td>
            <td>
                <div class="badge badge-{stock_badge}">{product.stock_quantity}</div>
            </td>
            <td>
                <div class="badge badge-{stock_badge}">{stock_text}</div>
            </td>
            <td>
                <div class="flex gap-2">
                    <button class="btn btn-ghost btn-xs" onclick="editProduct({product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-ghost btn-xs text-error" onclick="deleteProduct({product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
        """
    
    categories_options = ""
    for category in categories:
        categories_options += f'<option value="{category.id}">{category.name}</option>'
    
    return HTMLResponse(content=f"""
    <!DOCTYPE html>
    <html data-theme="light">
    <head>
        <title>Products - Opulon Admin</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/daisyui@4.4.24/dist/full.min.css" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-base-200">
        <div class="navbar bg-primary text-primary-content">
            <div class="flex-1">
                <a href="/admin/dashboard" class="btn btn-ghost text-xl">
                    <i class="fas fa-arrow-left mr-2"></i>Opulon Admin
                </a>
            </div>
            <div class="flex-none">
                <label class="swap swap-rotate">
                    <input type="checkbox" class="theme-controller" value="dark" />
                    <svg class="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
                    </svg>
                    <svg class="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
                    </svg>
                </label>
            </div>
        </div>
        
        <div class="container mx-auto p-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold">
                    <i class="fas fa-pills mr-2"></i>Products Management
                </h1>
                <button class="btn btn-primary" onclick="document.getElementById('add_product_modal').showModal()">
                    <i class="fas fa-plus mr-2"></i>Add Product
                </button>
            </div>
            
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <div class="overflow-x-auto">
                        <table class="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
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
        
        <!-- Add Product Modal -->
        <dialog id="add_product_modal" class="modal">
            <div class="modal-box w-11/12 max-w-2xl">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 class="font-bold text-lg mb-4">Add New Product</h3>
                
                <form id="addProductForm" enctype="multipart/form-data" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Product Name</span>
                            </label>
                            <input type="text" name="name" class="input input-bordered" required>
                        </div>
                        
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">SKU</span>
                            </label>
                            <input type="text" name="sku" class="input input-bordered" required>
                        </div>
                        
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Price ($)</span>
                            </label>
                            <input type="number" step="0.01" name="price" class="input input-bordered" required>
                        </div>
                        
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Stock Quantity</span>
                            </label>
                            <input type="number" name="stock_quantity" class="input input-bordered" required>
                        </div>
                        
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Category</span>
                            </label>
                            <select name="category_id" class="select select-bordered" required>
                                <option value="">Select Category</option>
                                {categories_options}
                            </select>
                        </div>
                        
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Manufacturer</span>
                            </label>
                            <input type="text" name="manufacturer" class="input input-bordered">
                        </div>
                    </div>
                    
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Description</span>
                        </label>
                        <textarea name="description" class="textarea textarea-bordered h-24"></textarea>
                    </div>
                    
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Product Image</span>
                        </label>
                        <input type="file" name="image" accept="image/*" class="file-input file-input-bordered">
                    </div>
                    
                    <div class="form-control">
                        <label class="cursor-pointer label">
                            <span class="label-text">Prescription Required</span>
                            <input type="checkbox" name="is_prescription_required" class="checkbox">
                        </label>
                    </div>
                    
                    <div class="modal-action">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save mr-2"></i>Save Product
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
        
        <script>
            // Theme toggle
            const themeController = document.querySelector('.theme-controller');
            themeController.addEventListener('change', function() {{
                document.documentElement.setAttribute('data-theme', this.checked ? 'dark' : 'light');
            }});
            
            // Add product form
            document.getElementById('addProductForm').addEventListener('submit', async function(e) {{
                e.preventDefault();
                
                const formData = new FormData(this);
                
                try {{
                    const response = await fetch('/api/v1/products/', {{
                        method: 'POST',
                        body: formData,
                        credentials: 'include'
                    }});
                    
                    if (response.ok) {{
                        location.reload();
                    }} else {{
                        const error = await response.json();
                        alert('Error: ' + error.detail);
                    }}
                }} catch (error) {{
                    alert('Error: ' + error.message);
                }}
            }});
            
            function editProduct(id) {{
                window.location.href = `/admin/products/edit/${{id}}`;
            }}
            
            async function deleteProduct(id) {{
                if (confirm('Are you sure you want to delete this product?')) {{
                    try {{
                        const response = await fetch(`/api/v1/products/${{id}}`, {{
                            method: 'DELETE',
                            credentials: 'include'
                        }});
                        
                        if (response.ok) {{
                            location.reload();
                        }} else {{
                            const error = await response.text();
                            alert('Error: ' + error);
                        }}
                    }} catch (error) {{
                        alert('Error: ' + error.message);
                    }}
                }}
            }}
        </script>
    </body>
    </html>
    """)

@router.post("/products/upload-image")
async def upload_product_image(file: UploadFile = File(...), _: bool = Depends(verify_admin_session)):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate unique filename
    file_extension = file.filename.split('.')[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"image_url": f"/uploads/products/{unique_filename}"}