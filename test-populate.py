"""
Populate test database with safe test data
"""
import requests
import json
import time

def wait_for_backend(url="http://localhost:8001", max_attempts=30):
    """Wait for backend to be ready"""
    for i in range(max_attempts):
        try:
            response = requests.get(f"{url}/health", timeout=5)
            if response.status_code == 200:
                print("✅ Backend is ready!")
                return True
        except:
            pass
        print(f"⏳ Waiting for backend... ({i+1}/{max_attempts})")
        time.sleep(2)
    return False

def create_test_admin():
    """Create test admin user"""
    admin_data = {
        "email": "test.admin@opulon.test",
        "password": "TestAdmin123!",
        "first_name": "Test",
        "last_name": "Admin",
        "role": "ADMIN"
    }
    
    try:
        response = requests.post("http://localhost:8001/api/v1/auth/register", json=admin_data)
        if response.status_code in [200, 201]:
            print("✅ Test admin created")
            return True
        else:
            print(f"⚠️  Admin creation: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error creating admin: {e}")
        return False

def create_test_products():
    """Create test products"""
    products = [
        {
            "name": "Test Medical Device A",
            "description": "Safe test medical device for testing",
            "price": 99.99,
            "category": "Medical Devices",
            "stock_quantity": 10,
            "sku": "TEST-MED-001"
        },
        {
            "name": "Test Pharmaceutical B", 
            "description": "Safe test pharmaceutical for testing",
            "price": 49.99,
            "category": "Pharmaceuticals",
            "stock_quantity": 25,
            "sku": "TEST-PHARM-001"
        },
        {
            "name": "Test Equipment C",
            "description": "Safe test equipment for testing",
            "price": 199.99,
            "category": "Equipment",
            "stock_quantity": 5,
            "sku": "TEST-EQUIP-001"
        }
    ]
    
    # Login as admin first
    login_data = {
        "email": "test.admin@opulon.test",
        "password": "TestAdmin123!"
    }
    
    session = requests.Session()
    
    try:
        login_response = session.post("http://localhost:8001/api/v1/auth/login", json=login_data)
        if login_response.status_code != 200:
            print("❌ Could not login as admin")
            return False
        
        created_count = 0
        for product in products:
            response = session.post("http://localhost:8001/api/v1/admin/products", json=product)
            if response.status_code in [200, 201]:
                created_count += 1
                print(f"✅ Created: {product['name']}")
            else:
                print(f"⚠️  Failed to create: {product['name']} ({response.status_code})")
        
        print(f"✅ Created {created_count}/{len(products)} test products")
        return created_count > 0
        
    except Exception as e:
        print(f"❌ Error creating products: {e}")
        return False

def create_test_user():
    """Create regular test user"""
    user_data = {
        "email": "test.user@opulon.test",
        "password": "TestUser123!",
        "first_name": "Test",
        "last_name": "User"
    }
    
    try:
        response = requests.post("http://localhost:8001/api/v1/auth/register", json=user_data)
        if response.status_code in [200, 201]:
            print("✅ Test user created")
            return True
        else:
            print(f"⚠️  User creation: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error creating user: {e}")
        return False

def main():
    """Populate test environment"""
    print("🔧 Populating Test Environment")
    print("=" * 40)
    
    # Wait for backend
    if not wait_for_backend():
        print("❌ Backend not ready - cannot populate")
        return
    
    print("\n📝 Creating test data...")
    
    # Create test users
    create_test_admin()
    create_test_user()
    
    # Create test products
    create_test_products()
    
    print("\n" + "=" * 40)
    print("🎯 Test Environment Populated!")
    print("\n🔑 Test Credentials:")
    print("   Admin: test.admin@opulon.test / TestAdmin123!")
    print("   User:  test.user@opulon.test / TestUser123!")
    print("\n🌐 Access URLs:")
    print("   Website: http://localhost:3001")
    print("   API:     http://localhost:8001/docs")

if __name__ == "__main__":
    main()