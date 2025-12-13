from fastapi import APIRouter, Request, Depends, Form, HTTPException, status, UploadFile, File, Cookie
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy.orm import Session
from .core.database import get_db
from .models.product import Product, Category
from .models.user import User, UserRole
from .models.order import Order, OrderStatus
from .secure_admin import verify_admin_session
import json
from datetime import datetime, timedelta
from sqlalchemy import func

router = APIRouter(prefix="/admin", tags=["Admin Features"])

@router.get("/categories", response_class=HTMLResponse)
async def categories_page(request: Request, db: Session = Depends(get_db), _: bool = Depends(verify_admin_session)):
    categories = db.query(Category).all()
    
    categories_html = ""
    for category in categories:
        product_count = db.query(Product).filter(Product.category_id == category.id).count()
        categories_html += f"""
        <tr>
            <td>{category.id}</td>
            <td>{category.name}</td>
            <td>{category.description or 'No description'}</td>
            <td><div class="badge badge-primary">{product_count}</div></td>
            <td>
                <div class="flex gap-2">
                    <button class="btn btn-ghost btn-xs" onclick="editCategory({category.id}, '{category.name}', '{category.description or ''}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-ghost btn-xs text-error" onclick="deleteCategory({category.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
        """
    
    return HTMLResponse(content=f"""
    <!DOCTYPE html>
    <html data-theme="light">
    <head>
        <title>Categories - Opulon Admin</title>
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
                    <i class="fas fa-arrow-left mr-2"></i>Categories
                </a>
            </div>
        </div>
        
        <div class="container mx-auto p-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold">Categories Management</h1>
                <button class="btn btn-primary" onclick="document.getElementById('add_category_modal').showModal()">
                    <i class="fas fa-plus mr-2"></i>Add Category
                </button>
            </div>
            
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <table class="table table-zebra">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Products</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories_html}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <!-- Add Category Modal -->
        <dialog id="add_category_modal" class="modal">
            <div class="modal-box">
                <h3 class="font-bold text-lg mb-4">Add New Category</h3>
                <form id="addCategoryForm" class="space-y-4">
                    <div class="form-control">
                        <label class="label"><span class="label-text">Name</span></label>
                        <input type="text" name="name" class="input input-bordered" required>
                    </div>
                    <div class="form-control">
                        <label class="label"><span class="label-text">Description</span></label>
                        <textarea name="description" class="textarea textarea-bordered"></textarea>
                    </div>
                    <div class="modal-action">
                        <button type="submit" class="btn btn-primary">Save</button>
                        <button type="button" class="btn" onclick="document.getElementById('add_category_modal').close()">Cancel</button>
                    </div>
                </form>
            </div>
        </dialog>
        
        <script>
            document.getElementById('addCategoryForm').addEventListener('submit', async function(e) {{
                e.preventDefault();
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                
                try {{
                    const response = await fetch('/api/v1/products/categories/', {{
                        method: 'POST',
                        headers: {{'Content-Type': 'application/json'}},
                        body: JSON.stringify(data)
                    }});
                    
                    if (response.ok) {{
                        location.reload();
                    }}
                }} catch (error) {{
                    alert('Error: ' + error.message);
                }}
            }});
            
            async function deleteCategory(id) {{
                if (confirm('Delete this category?')) {{
                    // Implement delete API call
                    alert('Delete functionality will be implemented');
                }}
            }}
        </script>
    </body>
    </html>
    """)

@router.get("/users", response_class=HTMLResponse)
async def users_page(request: Request, db: Session = Depends(get_db), _: bool = Depends(verify_admin_session)):
    users = db.query(User).all()
    
    users_html = ""
    for user in users:
        role_badge = "primary" if user.role == UserRole.SUPERADMIN else "secondary" if user.role == UserRole.STAFF else "accent"
        users_html += f"""
        <tr>
            <td>{user.id}</td>
            <td>{user.full_name}</td>
            <td>{user.email}</td>
            <td><div class="badge badge-{role_badge}">{user.role.value}</div></td>
            <td>{user.created_at.strftime('%Y-%m-%d')}</td>
            <td>
                <select class="select select-xs" onchange="updateUserRole({user.id}, this.value)">
                    <option value="customer" {'selected' if user.role == UserRole.CUSTOMER else ''}>Customer</option>
                    <option value="staff" {'selected' if user.role == UserRole.STAFF else ''}>Staff</option>
                    <option value="superadmin" {'selected' if user.role == UserRole.SUPERADMIN else ''}>Admin</option>
                </select>
            </td>
        </tr>
        """
    
    return HTMLResponse(content=f"""
    <!DOCTYPE html>
    <html data-theme="light">
    <head>
        <title>Users - Opulon Admin</title>
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
                    <i class="fas fa-arrow-left mr-2"></i>Users Management
                </a>
            </div>
        </div>
        
        <div class="container mx-auto p-6">
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <table class="table table-zebra">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Change Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users_html}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <script>
            async function updateUserRole(userId, newRole) {{
                try {{
                    const response = await fetch(`/admin/users/${{userId}}/role`, {{
                        method: 'PUT',
                        headers: {{'Content-Type': 'application/json'}},
                        body: JSON.stringify({{role: newRole}})
                    }});
                    
                    if (response.ok) {{
                        location.reload();
                    }}
                }} catch (error) {{
                    alert('Error updating role');
                }}
            }}
        </script>
    </body>
    </html>
    """)

@router.get("/orders", response_class=HTMLResponse)
async def orders_page(request: Request, db: Session = Depends(get_db), _: bool = Depends(verify_admin_session)):
    orders = db.query(Order).all()
    
    orders_html = ""
    for order in orders:
        status_colors = {
            "pending": "warning",
            "paid": "info", 
            "processing": "primary",
            "shipped": "secondary",
            "delivered": "success",
            "cancelled": "error"
        }
        status_color = status_colors.get(order.status.value, "neutral")
        
        orders_html += f"""
        <tr>
            <td>#{order.id}</td>
            <td>{order.user.full_name if order.user else 'N/A'}</td>
            <td>${order.total_amount:.2f}</td>
            <td>
                <select class="select select-xs select-{status_color}" onchange="updateOrderStatus({order.id}, this.value)">
                    <option value="pending" {'selected' if order.status == OrderStatus.PENDING else ''}>Pending</option>
                    <option value="paid" {'selected' if order.status == OrderStatus.PAID else ''}>Paid</option>
                    <option value="processing" {'selected' if order.status == OrderStatus.PROCESSING else ''}>Processing</option>
                    <option value="shipped" {'selected' if order.status == OrderStatus.SHIPPED else ''}>Shipped</option>
                    <option value="delivered" {'selected' if order.status == OrderStatus.DELIVERED else ''}>Delivered</option>
                    <option value="cancelled" {'selected' if order.status == OrderStatus.CANCELLED else ''}>Cancelled</option>
                </select>
            </td>
            <td>{order.created_at.strftime('%Y-%m-%d %H:%M')}</td>
            <td>
                <button class="btn btn-ghost btn-xs" onclick="viewOrder({order.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
        """
    
    return HTMLResponse(content=f"""
    <!DOCTYPE html>
    <html data-theme="light">
    <head>
        <title>Orders - Opulon Admin</title>
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
                    <i class="fas fa-arrow-left mr-2"></i>Orders Management
                </a>
            </div>
        </div>
        
        <div class="container mx-auto p-6">
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <table class="table table-zebra">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders_html}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <script>
            async function updateOrderStatus(orderId, newStatus) {{
                try {{
                    const response = await fetch(`/api/v1/orders/${{orderId}}/status?status=${{newStatus}}`, {{
                        method: 'PUT'
                    }});
                    
                    if (response.ok) {{
                        location.reload();
                    }}
                }} catch (error) {{
                    alert('Error updating status');
                }}
            }}
            
            function viewOrder(orderId) {{
                window.open(`/admin/orders/${{orderId}}`, '_blank');
            }}
        </script>
    </body>
    </html>
    """)

@router.get("/analytics", response_class=HTMLResponse)
async def analytics_page(request: Request, db: Session = Depends(get_db), _: bool = Depends(verify_admin_session)):
    # Calculate analytics
    total_revenue = db.query(func.sum(Order.total_amount)).filter(Order.status == OrderStatus.DELIVERED).scalar() or 0
    total_orders = db.query(Order).count()
    total_customers = db.query(User).filter(User.role == UserRole.CUSTOMER).count()
    
    # Recent orders (last 7 days)
    week_ago = datetime.now() - timedelta(days=7)
    recent_orders = db.query(Order).filter(Order.created_at >= week_ago).count()
    
    # Top products
    top_products = db.query(Product.name, func.count(Product.id).label('sales')).join(Order).group_by(Product.id).order_by(func.count(Product.id).desc()).limit(5).all()
    
    top_products_html = ""
    for product, sales in top_products:
        top_products_html += f"""
        <tr>
            <td>{product}</td>
            <td><div class="badge badge-primary">{sales}</div></td>
        </tr>
        """
    
    return HTMLResponse(content=f"""
    <!DOCTYPE html>
    <html data-theme="light">
    <head>
        <title>Analytics - Opulon Admin</title>
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
                    <i class="fas fa-arrow-left mr-2"></i>Analytics Dashboard
                </a>
            </div>
        </div>
        
        <div class="container mx-auto p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="stat bg-base-100 rounded-lg shadow">
                    <div class="stat-figure text-success">
                        <i class="fas fa-dollar-sign text-3xl"></i>
                    </div>
                    <div class="stat-title">Total Revenue</div>
                    <div class="stat-value text-success">${total_revenue:.2f}</div>
                </div>
                
                <div class="stat bg-base-100 rounded-lg shadow">
                    <div class="stat-figure text-primary">
                        <i class="fas fa-shopping-cart text-3xl"></i>
                    </div>
                    <div class="stat-title">Total Orders</div>
                    <div class="stat-value text-primary">{total_orders}</div>
                </div>
                
                <div class="stat bg-base-100 rounded-lg shadow">
                    <div class="stat-figure text-info">
                        <i class="fas fa-users text-3xl"></i>
                    </div>
                    <div class="stat-title">Customers</div>
                    <div class="stat-value text-info">{total_customers}</div>
                </div>
                
                <div class="stat bg-base-100 rounded-lg shadow">
                    <div class="stat-figure text-warning">
                        <i class="fas fa-chart-line text-3xl"></i>
                    </div>
                    <div class="stat-title">This Week</div>
                    <div class="stat-value text-warning">{recent_orders}</div>
                    <div class="stat-desc">New orders</div>
                </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title">Top Selling Products</h2>
                        <table class="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Sales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {top_products_html}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title">Quick Reports</h2>
                        <div class="space-y-4">
                            <button class="btn btn-outline w-full">
                                <i class="fas fa-file-pdf mr-2"></i>Generate Sales Report
                            </button>
                            <button class="btn btn-outline w-full">
                                <i class="fas fa-file-excel mr-2"></i>Export Customer Data
                            </button>
                            <button class="btn btn-outline w-full">
                                <i class="fas fa-chart-bar mr-2"></i>Inventory Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    """)

@router.put("/users/{user_id}/role")
async def update_user_role(user_id: int, request: Request, db: Session = Depends(get_db), _: bool = Depends(verify_admin_session)):
    data = await request.json()
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    role_mapping = {
        "customer": UserRole.CUSTOMER,
        "staff": UserRole.STAFF,
        "superadmin": UserRole.SUPERADMIN
    }
    
    user.role = role_mapping[data["role"]]
    db.commit()
    return {"message": "Role updated successfully"}