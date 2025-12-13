from fastapi import APIRouter, Request, Depends, Form, HTTPException, status, UploadFile, File, Cookie
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .core.database import get_db
from .models.product import Product, Category
from .models.user import User
from .models.order import Order
from .core.deps import get_admin_user
from .core.security import verify_password, get_password_hash
import os
import uuid
from typing import Optional

router = APIRouter(prefix="/admin", tags=["Secure Admin"])
security = HTTPBearer()

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin@opulon.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")  # Use environment variable

def verify_admin_session(admin_token: Optional[str] = Cookie(None)):
    if not admin_token or admin_token != "opulon_admin_authenticated":
        raise HTTPException(status_code=401, detail="Authentication required")
    return True

@router.get("/login", response_class=HTMLResponse)
async def admin_login_page():
    return HTMLResponse(content="""
    <!DOCTYPE html>
    <html data-theme="light">
    <head>
        <title>Opulon Admin Login</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/daisyui@4.4.24/dist/full.min.css" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div class="min-h-screen flex items-center justify-center">
            <div class="card w-96 bg-base-100 shadow-xl">
                <div class="card-body">
                    <div class="text-center mb-6">
                        <i class="fas fa-hospital text-4xl text-primary mb-2"></i>
                        <h2 class="card-title justify-center text-2xl">Opulon Admin</h2>
                        <p class="text-base-content/60">Secure Admin Access</p>
                    </div>
                    
                    <form id="loginForm" class="space-y-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Username</span>
                            </label>
                            <input type="text" id="username" class="input input-bordered" required>
                        </div>
                        
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Password</span>
                            </label>
                            <input type="password" id="password" class="input input-bordered" required>
                        </div>
                        
                        <div class="form-control mt-6">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-sign-in-alt mr-2"></i>Login
                            </button>
                        </div>
                    </form>
                    
                    <div id="error" class="alert alert-error mt-4 hidden">
                        <span>Invalid credentials</span>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
            document.getElementById('loginForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                
                try {
                    const response = await fetch('/admin/authenticate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password })
                    });
                    
                    if (response.ok) {
                        window.location.href = '/admin/dashboard';
                    } else {
                        document.getElementById('error').classList.remove('hidden');
                    }
                } catch (error) {
                    document.getElementById('error').classList.remove('hidden');
                }
            });
        </script>
    </body>
    </html>
    """)

@router.post("/authenticate")
async def authenticate_admin(request: Request):
    data = await request.json()
    if data.get("username") == ADMIN_USERNAME and data.get("password") == ADMIN_PASSWORD:
        response = RedirectResponse(url="/admin/dashboard", status_code=302)
        response.set_cookie("admin_token", "opulon_admin_authenticated", httponly=True)
        return response
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.get("/dashboard", response_class=HTMLResponse)
async def admin_dashboard(request: Request, db: Session = Depends(get_db), _: bool = Depends(verify_admin_session)):
    total_products = db.query(Product).count()
    total_categories = db.query(Category).count()
    total_users = db.query(User).count()
    total_orders = db.query(Order).count()
    
    return HTMLResponse(content=f"""
    <!DOCTYPE html>
    <html data-theme="light">
    <head>
        <title>Opulon Admin Dashboard</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/daisyui@4.4.24/dist/full.min.css" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-base-200">
        <div class="navbar bg-primary text-primary-content">
            <div class="flex-1">
                <a class="btn btn-ghost text-xl">
                    <i class="fas fa-hospital mr-2"></i>Opulon Admin
                </a>
            </div>
            <div class="flex-none gap-2">
                <label class="swap swap-rotate">
                    <input type="checkbox" class="theme-controller" value="dark" />
                    <svg class="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
                    </svg>
                    <svg class="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
                    </svg>
                </label>
                <div class="dropdown dropdown-end">
                    <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                        <div class="w-10 rounded-full">
                            <i class="fas fa-user-shield text-xl"></i>
                        </div>
                    </div>
                    <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a href="/docs" target="_blank"><i class="fas fa-code mr-2"></i>API Docs</a></li>
                        <li><a href="/admin/logout"><i class="fas fa-sign-out-alt mr-2"></i>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="container mx-auto p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="stat bg-base-100 rounded-lg shadow">
                    <div class="stat-figure text-primary">
                        <i class="fas fa-pills text-3xl"></i>
                    </div>
                    <div class="stat-title">Products</div>
                    <div class="stat-value text-primary">{total_products}</div>
                    <div class="stat-actions">
                        <button class="btn btn-sm btn-primary" onclick="location.href='/admin/products'">Manage</button>
                    </div>
                </div>
                
                <div class="stat bg-base-100 rounded-lg shadow">
                    <div class="stat-figure text-secondary">
                        <i class="fas fa-tags text-3xl"></i>
                    </div>
                    <div class="stat-title">Categories</div>
                    <div class="stat-value text-secondary">{total_categories}</div>
                    <div class="stat-actions">
                        <button class="btn btn-sm btn-secondary" onclick="location.href='/admin/categories'">Manage</button>
                    </div>
                </div>
                
                <div class="stat bg-base-100 rounded-lg shadow">
                    <div class="stat-figure text-accent">
                        <i class="fas fa-users text-3xl"></i>
                    </div>
                    <div class="stat-title">Users</div>
                    <div class="stat-value text-accent">{total_users}</div>
                    <div class="stat-actions">
                        <button class="btn btn-sm btn-accent" onclick="location.href='/admin/users'">View</button>
                    </div>
                </div>
                
                <div class="stat bg-base-100 rounded-lg shadow">
                    <div class="stat-figure text-warning">
                        <i class="fas fa-shopping-cart text-3xl"></i>
                    </div>
                    <div class="stat-title">Orders</div>
                    <div class="stat-value text-warning">{total_orders}</div>
                    <div class="stat-actions">
                        <button class="btn btn-sm btn-warning" onclick="location.href='/admin/orders'">View</button>
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title">
                            <i class="fas fa-plus text-success"></i>
                            Add Product
                        </h2>
                        <p>Add new products to your inventory</p>
                        <div class="card-actions justify-end">
                            <button class="btn btn-success" onclick="location.href='/admin/products/add'">
                                <i class="fas fa-plus mr-2"></i>Add Product
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title">
                            <i class="fas fa-upload text-info"></i>
                            Bulk Upload
                        </h2>
                        <p>Upload multiple products via CSV</p>
                        <div class="card-actions justify-end">
                            <button class="btn btn-info" onclick="location.href='/admin/bulk-upload'">
                                <i class="fas fa-upload mr-2"></i>Upload CSV
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title">
                            <i class="fas fa-chart-bar text-primary"></i>
                            Analytics
                        </h2>
                        <p>View sales and performance data</p>
                        <div class="card-actions justify-end">
                            <button class="btn btn-primary" onclick="location.href='/admin/analytics'">
                                <i class="fas fa-chart-bar mr-2"></i>View Stats
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
            // Theme toggle
            const themeController = document.querySelector('.theme-controller');
            themeController.addEventListener('change', function() {{
                document.documentElement.setAttribute('data-theme', this.checked ? 'dark' : 'light');
            }});
        </script>
    </body>
    </html>
    """)

@router.get("/logout")
async def logout():
    response = RedirectResponse(url="/admin/login", status_code=302)
    response.delete_cookie("admin_token")
    return response