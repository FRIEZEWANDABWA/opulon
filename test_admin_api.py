#!/usr/bin/env python3
import urllib.request
import urllib.parse
import json

def test_admin_endpoints():
    """Test admin user management endpoints"""
    
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
            if response.status != 200:
                print("Login failed")
                return
            
            result = json.loads(response.read().decode())
            token = result.get('access_token')
            
            if not token:
                print("No token received")
                return
            
            print("✅ Login successful")
            
            # Test endpoints
            endpoints = [
                ("GET", "/api/v1/admin/dashboard", None),
                ("GET", "/api/v1/admin/users", None),
                ("POST", "/api/v1/admin/users", {
                    "email": "newuser@test.com",
                    "username": "newuser",
                    "full_name": "New Test User",
                    "password": "NewUser123!",
                    "role": "user"
                })
            ]
            
            for method, endpoint, data in endpoints:
                try:
                    url = f"http://localhost:8000{endpoint}"
                    headers = {
                        'Authorization': f'Bearer {token}',
                        'Content-Type': 'application/json'
                    }
                    
                    if method == "GET":
                        req = urllib.request.Request(url, headers=headers)
                    else:
                        req = urllib.request.Request(
                            url,
                            data=json.dumps(data).encode() if data else None,
                            headers=headers
                        )
                        req.get_method = lambda: method
                    
                    with urllib.request.urlopen(req, timeout=10) as resp:
                        result = json.loads(resp.read().decode())
                        print(f"✅ {method} {endpoint}: {resp.status}")
                        
                        if endpoint == "/api/v1/admin/users" and method == "GET":
                            print(f"   Found {len(result)} users")
                        elif endpoint == "/api/v1/admin/dashboard":
                            print(f"   Users: {result.get('total_users', 'N/A')}")
                            
                except Exception as e:
                    print(f"❌ {method} {endpoint}: {str(e)[:50]}")
            
    except Exception as e:
        print(f"Login error: {e}")

if __name__ == "__main__":
    test_admin_endpoints()