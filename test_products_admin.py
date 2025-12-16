#!/usr/bin/env python3
import urllib.request
import json

def test_product_management():
    """Test product management features"""
    
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
            
            # Test get products
            print("\n=== GET PRODUCTS ===")
            try:
                req = urllib.request.Request("http://localhost:8000/api/v1/admin/products", headers=headers)
                with urllib.request.urlopen(req, timeout=10) as resp:
                    products = json.loads(resp.read().decode())
                    print(f"SUCCESS: Found {len(products)} products")
                    
                    if products:
                        # Test delete first product
                        product_id = products[0]['id']
                        product_name = products[0]['name']
                        
                        print(f"\n=== DELETE PRODUCT ===")
                        req = urllib.request.Request(
                            f"http://localhost:8000/api/v1/admin/products/{product_id}",
                            headers=headers
                        )
                        req.get_method = lambda: 'DELETE'
                        
                        with urllib.request.urlopen(req, timeout=10) as resp:
                            result = json.loads(resp.read().decode())
                            print(f"SUCCESS: Deleted product '{product_name}'")
                    
            except Exception as e:
                print(f"ERROR: Products - {str(e)}")
            
            # Test user deletion with different approach
            print("\n=== TEST USER DELETION ===")
            try:
                # Get users first
                req = urllib.request.Request("http://localhost:8000/api/v1/admin/users", headers=headers)
                with urllib.request.urlopen(req, timeout=10) as resp:
                    users = json.loads(resp.read().decode())
                    
                    # Find a regular user to delete (not admin)
                    target_user = None
                    for user in users:
                        if user['role'] == 'user' and 'test' in user['email'].lower():
                            target_user = user
                            break
                    
                    if target_user:
                        print(f"Attempting to delete user: {target_user['email']}")
                        
                        req = urllib.request.Request(
                            f"http://localhost:8000/api/v1/admin/users/{target_user['id']}",
                            headers=headers
                        )
                        req.get_method = lambda: 'DELETE'
                        
                        with urllib.request.urlopen(req, timeout=10) as resp:
                            result = json.loads(resp.read().decode())
                            print(f"SUCCESS: Deleted user '{target_user['email']}'")
                    else:
                        print("No test users found to delete")
                        
            except Exception as e:
                print(f"ERROR: User deletion - {str(e)}")
                if hasattr(e, 'read'):
                    error_body = e.read().decode()
                    print(f"Error details: {error_body}")
            
    except Exception as e:
        print(f"Login error: {e}")

if __name__ == "__main__":
    test_product_management()