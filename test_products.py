#!/usr/bin/env python3
import urllib.request
import json

def test_products():
    """Test products functionality"""
    
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
            
            print("SUCCESS: Login working")
            
            # Test products endpoints
            endpoints = [
                "http://localhost:8000/api/v1/products",
                "http://localhost:8000/api/v1/admin/products",
                "http://localhost:8000/api/v1/admin/dashboard"
            ]
            
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            
            for endpoint in endpoints:
                try:
                    req = urllib.request.Request(endpoint, headers=headers)
                    
                    with urllib.request.urlopen(req, timeout=10) as resp:
                        data = json.loads(resp.read().decode())
                        
                        if 'products' in endpoint:
                            if isinstance(data, list):
                                print(f"SUCCESS: {endpoint} - Found {len(data)} products")
                            else:
                                print(f"SUCCESS: {endpoint} - Response received")
                        else:
                            print(f"SUCCESS: {endpoint} - Dashboard working")
                            
                except Exception as e:
                    print(f"ERROR: {endpoint} - {str(e)[:50]}")
            
    except Exception as e:
        print(f"Login error: {e}")

if __name__ == "__main__":
    test_products()