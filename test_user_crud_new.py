#!/usr/bin/env python3
import urllib.request
import json
import random

def test_user_crud():
    """Test user CRUD operations with unique email"""
    
    # Login as admin
    login_data = json.dumps({
        "email": "afubwa@opulonhq.com",
        "password": "Afubwa@123"
    }).encode()
    
    req = urllib.request.Request(
        "http://localhost:8000/api/v1/auth/login",
        data=login_data,
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode())
            token = result.get('access_token')
            
            if not token:
                print("Login failed")
                return
            
            print("SUCCESS: Admin logged in")
            
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            
            # Test create user with unique email
            print("\n=== CREATE USER ===")
            unique_id = random.randint(1000, 9999)
            user_data = {
                "email": f"test{unique_id}@opulon.com",
                "username": f"test{unique_id}",
                "full_name": f"Test User {unique_id}",
                "password": "TestUser123!",
                "role": "user"
            }
            
            try:
                req = urllib.request.Request(
                    "http://localhost:8000/api/v1/admin/users",
                    data=json.dumps(user_data).encode(),
                    headers=headers
                )
                req.get_method = lambda: 'POST'
                
                with urllib.request.urlopen(req, timeout=10) as resp:
                    if resp.status == 200:
                        result = json.loads(resp.read().decode())
                        print("SUCCESS: User created")
                        new_user_id = result.get('user', {}).get('id')
                        
                        if new_user_id:
                            # Test update user
                            print("\n=== UPDATE USER ===")
                            update_data = {
                                "full_name": f"Updated Test User {unique_id}",
                                "phone": "+1234567890"
                            }
                            
                            req = urllib.request.Request(
                                f"http://localhost:8000/api/v1/admin/users/{new_user_id}",
                                data=json.dumps(update_data).encode(),
                                headers=headers
                            )
                            req.get_method = lambda: 'PUT'
                            
                            with urllib.request.urlopen(req, timeout=10) as resp:
                                if resp.status == 200:
                                    print("SUCCESS: User updated")
                                else:
                                    print(f"ERROR: Update failed - {resp.status}")
                            
                            # Test delete user
                            print("\n=== DELETE USER ===")
                            req = urllib.request.Request(
                                f"http://localhost:8000/api/v1/admin/users/{new_user_id}",
                                headers=headers
                            )
                            req.get_method = lambda: 'DELETE'
                            
                            with urllib.request.urlopen(req, timeout=10) as resp:
                                if resp.status == 200:
                                    print("SUCCESS: User deleted")
                                else:
                                    print(f"ERROR: Delete failed - {resp.status}")
                                    error_body = resp.read().decode()
                                    print(f"Error details: {error_body}")
                    else:
                        print(f"ERROR: Create failed - {resp.status}")
                        error_body = resp.read().decode()
                        print(f"Error details: {error_body}")
                        
            except Exception as e:
                print(f"ERROR: {str(e)}")
                if hasattr(e, 'read'):
                    error_body = e.read().decode()
                    print(f"Error details: {error_body}")
            
            # Test admin dashboard
            print("\n=== ADMIN DASHBOARD ===")
            try:
                req = urllib.request.Request("http://localhost:8000/api/v1/admin/dashboard", headers=headers)
                with urllib.request.urlopen(req, timeout=10) as resp:
                    dashboard = json.loads(resp.read().decode())
                    print(f"SUCCESS: Dashboard - Users: {dashboard.get('total_users')}, Products: {dashboard.get('total_products')}")
            except Exception as e:
                print(f"ERROR: Dashboard - {str(e)}")
            
            # Test audit logs
            print("\n=== AUDIT LOGS ===")
            try:
                req = urllib.request.Request("http://localhost:8000/api/v1/admin/audit-logs", headers=headers)
                with urllib.request.urlopen(req, timeout=10) as resp:
                    audit_data = json.loads(resp.read().decode())
                    logs = audit_data.get('logs', [])
                    print(f"SUCCESS: Audit logs - Found {len(logs)} logs")
            except Exception as e:
                print(f"ERROR: Audit logs - {str(e)}")
            
    except Exception as e:
        print(f"Login error: {e}")

if __name__ == "__main__":
    test_user_crud()