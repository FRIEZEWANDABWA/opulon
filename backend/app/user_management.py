from fastapi import APIRouter, Request, Depends, Form, HTTPException
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from .core.database import get_db
from .models.user import User, UserRole
from .secure_admin import verify_admin_session
import hashlib

router = APIRouter(prefix="/admin", tags=["User Management"])

@router.get("/users", response_class=HTMLResponse)
async def users_management(request: Request, db: Session = Depends(get_db), _: bool = Depends(verify_admin_session)):
    users = db.query(User).all()
    
    users_html = ""
    for user in users:
        role_color = {"customer": "info", "staff": "warning", "superadmin": "error"}
        color = role_color.get(user.role.value, "neutral")
        
        users_html += f"""
        <tr>
            <td>{user.id}</td>
            <td>{user.full_name}</td>
            <td>{user.email}</td>
            <td>{user.username}</td>
            <td><div class="badge badge-{color}">{user.role.value}</div></td>
            <td>{'Active' if user.is_active else 'Inactive'}</td>
            <td>{user.created_at.strftime('%Y-%m-%d')}</td>
            <td>
                <select class="select select-xs" onchange="updateUserRole({user.id}, this.value)">
                    <option value="customer" {'selected' if user.role == UserRole.CUSTOMER else ''}>Customer</option>
                    <option value="staff" {'selected' if user.role == UserRole.STAFF else ''}>Staff</option>
                    <option value="superadmin" {'selected' if user.role == UserRole.SUPERADMIN else ''}>Admin</option>
                </select>
                <button class="btn btn-xs btn-error ml-2" onclick="toggleUserStatus({user.id}, {str(user.is_active).lower()})">
                    {'Deactivate' if user.is_active else 'Activate'}
                </button>
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
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold">Users Management</h1>
                <button class="btn btn-primary" onclick="document.getElementById('add_user_modal').showModal()">
                    <i class="fas fa-plus mr-2"></i>Add User
                </button>
            </div>
            
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <div class="overflow-x-auto">
                        <table class="table table-zebra">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users_html}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Add User Modal -->
        <dialog id="add_user_modal" class="modal">
            <div class="modal-box">
                <h3 class="font-bold text-lg mb-4">Add New User</h3>
                <form id="addUserForm" class="space-y-4">
                    <div class="form-control">
                        <label class="label"><span class="label-text">Full Name</span></label>
                        <input type="text" name="full_name" class="input input-bordered" required>
                    </div>
                    <div class="form-control">
                        <label class="label"><span class="label-text">Email</span></label>
                        <input type="email" name="email" class="input input-bordered" required>
                    </div>
                    <div class="form-control">
                        <label class="label"><span class="label-text">Username</span></label>
                        <input type="text" name="username" class="input input-bordered" required>
                    </div>
                    <div class="form-control">
                        <label class="label"><span class="label-text">Password</span></label>
                        <input type="password" name="password" class="input input-bordered" required>
                    </div>
                    <div class="form-control">
                        <label class="label"><span class="label-text">Role</span></label>
                        <select name="role" class="select select-bordered" required>
                            <option value="customer">Customer</option>
                            <option value="staff">Staff</option>
                            <option value="superadmin">Admin</option>
                        </select>
                    </div>
                    <div class="modal-action">
                        <button type="submit" class="btn btn-primary">Create User</button>
                        <button type="button" class="btn" onclick="document.getElementById('add_user_modal').close()">Cancel</button>
                    </div>
                </form>
            </div>
        </dialog>
        
        <script>
            document.getElementById('addUserForm').addEventListener('submit', async function(e) {{
                e.preventDefault();
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                
                try {{
                    const response = await fetch('/admin/create-user', {{
                        method: 'POST',
                        headers: {{'Content-Type': 'application/json'}},
                        body: JSON.stringify(data),
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
            
            async function updateUserRole(userId, newRole) {{
                try {{
                    const response = await fetch(`/admin/users/${{userId}}/role`, {{
                        method: 'PUT',
                        headers: {{'Content-Type': 'application/json'}},
                        body: JSON.stringify({{role: newRole}}),
                        credentials: 'include'
                    }});
                    
                    if (response.ok) {{
                        location.reload();
                    }}
                }} catch (error) {{
                    alert('Error updating role');
                }}
            }}
            
            async function toggleUserStatus(userId, isActive) {{
                try {{
                    const response = await fetch(`/admin/users/${{userId}}/status`, {{
                        method: 'PUT',
                        headers: {{'Content-Type': 'application/json'}},
                        body: JSON.stringify({{is_active: !isActive}}),
                        credentials: 'include'
                    }});
                    
                    if (response.ok) {{
                        location.reload();
                    }}
                }} catch (error) {{
                    alert('Error updating status');
                }}
            }}
        </script>
    </body>
    </html>
    """)

@router.post("/create-user")
async def create_user(request: Request, db: Session = Depends(get_db), _: bool = Depends(verify_admin_session)):
    data = await request.json()
    
    # Check if user exists
    if db.query(User).filter(User.email == data["email"]).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    
    if db.query(User).filter(User.username == data["username"]).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Create user
    password_hash = hashlib.sha256(data["password"].encode()).hexdigest()
    role_mapping = {"customer": UserRole.CUSTOMER, "staff": UserRole.STAFF, "superadmin": UserRole.SUPERADMIN}
    
    user = User(
        email=data["email"],
        username=data["username"],
        full_name=data["full_name"],
        hashed_password=password_hash,
        role=role_mapping[data["role"]]
    )
    
    db.add(user)
    db.commit()
    
    return {"message": "User created successfully"}

@router.put("/users/{user_id}/role")
async def update_user_role(user_id: int, request: Request, db: Session = Depends(get_db), _: bool = Depends(verify_admin_session)):
    data = await request.json()
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    role_mapping = {"customer": UserRole.CUSTOMER, "staff": UserRole.STAFF, "superadmin": UserRole.SUPERADMIN}
    user.role = role_mapping[data["role"]]
    db.commit()
    
    return {"message": "Role updated"}

@router.put("/users/{user_id}/status")
async def update_user_status(user_id: int, request: Request, db: Session = Depends(get_db), _: bool = Depends(verify_admin_session)):
    data = await request.json()
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = data["is_active"]
    db.commit()
    
    return {"message": "Status updated"}