#!/usr/bin/env python3
import urllib.request
import json

def test_frontend_endpoints():
    """Test if frontend can access admin endpoints"""
    
    # Login first
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
            
            print("SUCCESS: Got token for frontend")
            print(f"Token: {token[:20]}...")
            
            # Test the exact endpoints the frontend uses
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            
            endpoints = [
                "/api/v1/admin/users",
                "/api/v1/admin/products", 
                "/api/v1/admin/dashboard"
            ]
            
            for endpoint in endpoints:
                try:
                    req = urllib.request.Request(f"http://localhost:8000{endpoint}", headers=headers)
                    with urllib.request.urlopen(req, timeout=10) as resp:
                        data = json.loads(resp.read().decode())
                        
                        if endpoint.endswith('/users'):
                            print(f"SUCCESS: {endpoint} - {len(data)} users")
                        elif endpoint.endswith('/products'):
                            print(f"SUCCESS: {endpoint} - {len(data)} products")
                        elif endpoint.endswith('/dashboard'):
                            print(f"SUCCESS: {endpoint} - {data.get('total_users')} users, {data.get('total_products')} products")
                            
                except Exception as e:
                    print(f"ERROR: {endpoint} - {str(e)}")
            
            print(f"\nFrontend should use this token: {token}")
            print("Make sure to login at http://localhost:3000/login first")
            
    except Exception as e:
        print(f"Login error: {e}")

if __name__ == "__main__":
    test_frontend_endpoints()