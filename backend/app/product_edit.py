from fastapi import APIRouter, Request, Depends, Form, HTTPException, status, UploadFile, File
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy.orm import Session
from .core.database import get_db
from .models.product import Product, Category
from .secure_admin import verify_admin_session
import os
import uuid
import shutil

router = APIRouter(prefix="/admin", tags=["Product Edit"])

@router.get("/products/edit/{product_id}", response_class=HTMLResponse)
async def edit_product_page(product_id: int, request: Request, db: Session = Depends(get_db), _: bool = Depends(verify_admin_session)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    categories = db.query(Category).all()
    categories_options = ""
    for category in categories:
        selected = "selected" if category.id == product.category_id else ""
        categories_options += f'<option value="{category.id}" {selected}>{category.name}</option>'
    
    return HTMLResponse(content=f"""
    <!DOCTYPE html>
    <html data-theme="light">
    <head>
        <title>Edit Product - Opulon Admin</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/daisyui@4.4.24/dist/full.min.css" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-base-200">
        <div class="navbar bg-primary text-primary-content">
            <div class="flex-1">
                <a href="/admin/products" class="btn btn-ghost text-xl">
                    <i class="fas fa-arrow-left mr-2"></i>Edit Product
                </a>
            </div>
        </div>
        
        <div class="container mx-auto p-6">
            <div class="card bg-base-100 shadow-xl max-w-4xl mx-auto">
                <div class="card-body">
                    <h2 class="card-title text-2xl mb-6">Edit Product: {product.name}</h2>
                    
                    <form id="editProductForm" enctype="multipart/form-data" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">Product Name</span>
                                </label>
                                <input type="text" name="name" value="{product.name}" class="input input-bordered" required>
                            </div>
                            
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">SKU</span>
                                </label>
                                <input type="text" name="sku" value="{product.sku}" class="input input-bordered" required>
                            </div>
                            
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">Price ($)</span>
                                </label>
                                <input type="number" step="0.01" name="price" value="{product.price}" class="input input-bordered" required>
                            </div>
                            
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">Stock Quantity</span>
                                </label>
                                <input type="number" name="stock_quantity" value="{product.stock_quantity}" class="input input-bordered" required>
                            </div>
                            
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">Category</span>
                                </label>
                                <select name="category_id" class="select select-bordered" required>
                                    {categories_options}
                                </select>
                            </div>
                            
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">Manufacturer</span>
                                </label>
                                <input type="text" name="manufacturer" value="{product.manufacturer or ''}" class="input input-bordered">
                            </div>
                            
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">Dosage</span>
                                </label>
                                <input type="text" name="dosage" value="{product.dosage or ''}" class="input input-bordered">
                            </div>
                        </div>
                        
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Description</span>
                            </label>
                            <textarea name="description" class="textarea textarea-bordered h-24">{product.description or ''}</textarea>
                        </div>
                        
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Current Image</span>
                            </label>
                            <div class="flex items-center gap-4">
                                <div class="avatar">
                                    <div class="w-24 rounded">
                                        <img src="{product.image_url or '/static/placeholder.jpg'}" alt="Current image" />
                                    </div>
                                </div>
                                <div>
                                    <input type="file" name="image" accept="image/*" class="file-input file-input-bordered">
                                    <div class="label">
                                        <span class="label-text-alt">Leave empty to keep current image</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-control">
                            <label class="cursor-pointer label">
                                <span class="label-text">Prescription Required</span>
                                <input type="checkbox" name="is_prescription_required" class="checkbox" {'checked' if product.is_prescription_required else ''}>
                            </label>
                        </div>
                        
                        <div class="flex gap-4 justify-end">
                            <button type="button" class="btn btn-outline" onclick="window.history.back()">Cancel</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save mr-2"></i>Update Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
        <script>
            document.getElementById('editProductForm').addEventListener('submit', async function(e) {{
                e.preventDefault();
                
                const formData = new FormData(this);
                
                try {{
                    const response = await fetch('/api/v1/products/{product_id}', {{
                        method: 'PUT',
                        body: formData
                    }});
                    
                    if (response.ok) {{
                        alert('Product updated successfully!');
                        window.location.href = '/admin/products';
                    }} else {{
                        const error = await response.json();
                        alert('Error: ' + error.detail);
                    }}
                }} catch (error) {{
                    alert('Error: ' + error.message);
                }}
            }});
        </script>
    </body>
    </html>
    """)

@router.get("/bulk-upload", response_class=HTMLResponse)
async def bulk_upload_page(request: Request, _: bool = Depends(verify_admin_session)):
    return HTMLResponse(content="""
    <!DOCTYPE html>
    <html data-theme="light">
    <head>
        <title>Bulk Upload - Opulon Admin</title>
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
                    <i class="fas fa-arrow-left mr-2"></i>Bulk Upload
                </a>
            </div>
        </div>
        
        <div class="container mx-auto p-6">
            <div class="card bg-base-100 shadow-xl max-w-2xl mx-auto">
                <div class="card-body">
                    <h2 class="card-title text-2xl mb-6">
                        <i class="fas fa-upload mr-2"></i>Bulk Upload Products
                    </h2>
                    
                    <div class="alert alert-info mb-6">
                        <i class="fas fa-info-circle"></i>
                        <div>
                            <h3 class="font-bold">Instructions:</h3>
                            <ul class="list-disc list-inside mt-2">
                                <li>Upload a CSV file with product data</li>
                                <li>Required columns: name, price, sku, category_name</li>
                                <li>Optional: description, stock_quantity, manufacturer, dosage</li>
                            </ul>
                        </div>
                    </div>
                    
                    <form id="uploadForm" enctype="multipart/form-data" class="space-y-6">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Select CSV File</span>
                            </label>
                            <input type="file" id="csvFile" accept=".csv" class="file-input file-input-bordered" required>
                        </div>
                        
                        <div class="flex gap-4">
                            <button type="submit" class="btn btn-primary flex-1">
                                <i class="fas fa-upload mr-2"></i>Upload Products
                            </button>
                            <a href="/api/v1/admin/products/export-template" class="btn btn-outline">
                                <i class="fas fa-download mr-2"></i>Download Template
                            </a>
                        </div>
                    </form>
                    
                    <div id="result" class="mt-6"></div>
                </div>
            </div>
        </div>
        
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
                                <i class="fas fa-check-circle"></i>
                                <div>
                                    <h3 class="font-bold">Success!</h3>
                                    <p>${result.message}</p>
                                    ${result.created_products.length > 0 ? `<p><strong>Created:</strong> ${result.created_products.join(', ')}</p>` : ''}
                                    ${result.errors.length > 0 ? `<p><strong>Errors:</strong> ${result.errors.join(', ')}</p>` : ''}
                                </div>
                            </div>
                        `;
                    } else {
                        document.getElementById('result').innerHTML = `
                            <div class="alert alert-error">
                                <i class="fas fa-exclamation-circle"></i>
                                <div>
                                    <h3 class="font-bold">Error!</h3>
                                    <p>${result.detail}</p>
                                </div>
                            </div>
                        `;
                    }
                } catch (error) {
                    document.getElementById('result').innerHTML = `
                        <div class="alert alert-error">
                            <i class="fas fa-exclamation-circle"></i>
                            <div>
                                <h3 class="font-bold">Error!</h3>
                                <p>Failed to upload file: ${error.message}</p>
                            </div>
                        </div>
                    `;
                }
            });
        </script>
    </body>
    </html>
    """)