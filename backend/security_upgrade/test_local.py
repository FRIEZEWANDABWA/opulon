"""
Local Testing Script for Enhanced Security
Run this to test the new authentication system
"""
import asyncio
import httpx
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

async def test_enhanced_auth():
    """Test the enhanced authentication system"""
    
    async with httpx.AsyncClient() as client:
        print("🧪 Testing Enhanced Authentication System\n")
        
        # Test 1: Health Check
        print("1️⃣ Testing Health Check...")
        response = await client.get(f"{BASE_URL}/health")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}\n")
        
        # Test 2: Register New User
        print("2️⃣ Testing User Registration...")
        register_data = {
            "email": "testuser@example.com",
            "username": "testuser",
            "full_name": "Test User",
            "password": "TestPassword123!"
        }
        
        response = await client.post(f"{BASE_URL}/auth/register", json=register_data)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"   User ID: {result['user']['id']}")
            print(f"   CSRF Token: {result['csrf_token'][:20]}...")
            
            # Extract cookies
            cookies = response.cookies
            print(f"   Cookies: {list(cookies.keys())}")
        else:
            print(f"   Error: {response.text}")
        print()
        
        # Test 3: Login
        print("3️⃣ Testing User Login...")
        login_data = {
            "email": "testuser@example.com",
            "password": "TestPassword123!"
        }
        
        response = await client.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"   User: {result['user']['username']}")
            print(f"   Roles: {result['user']['roles']}")
            print(f"   2FA Enabled: {result['user']['two_fa_enabled']}")
            
            # Save cookies for next requests
            auth_cookies = response.cookies
        else:
            print(f"   Error: {response.text}")
        print()
        
        # Test 4: Get Current User Info
        print("4️⃣ Testing Get Current User...")
        response = await client.get(f"{BASE_URL}/auth/me", cookies=auth_cookies)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"   User: {result['username']}")
            print(f"   Permissions: {result['permissions']}")
        else:
            print(f"   Error: {response.text}")
        print()
        
        # Test 5: Test Rate Limiting
        print("5️⃣ Testing Rate Limiting...")
        for i in range(7):
            response = await client.post(f"{BASE_URL}/auth/login", json={
                "email": "wrong@example.com",
                "password": "wrongpassword"
            })
            print(f"   Attempt {i+1}: {response.status_code}")
            if response.status_code == 429:
                print("   ✅ Rate limiting working!")
                break
        print()
        
        # Test 6: Test Admin Endpoints (should fail)
        print("6️⃣ Testing Admin Access (should fail)...")
        response = await client.get(f"{BASE_URL}/admin/users", cookies=auth_cookies)
        print(f"   Status: {response.status_code}")
        print(f"   Expected: 403 (Forbidden)")
        print()
        
        # Test 7: Logout
        print("7️⃣ Testing Logout...")
        response = await client.post(f"{BASE_URL}/auth/logout", cookies=auth_cookies)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ Logout successful")
        print()
        
        # Test 8: Access after logout (should fail)
        print("8️⃣ Testing Access After Logout...")
        response = await client.get(f"{BASE_URL}/auth/me", cookies=auth_cookies)
        print(f"   Status: {response.status_code}")
        print(f"   Expected: 401 (Unauthorized)")
        print()

if __name__ == "__main__":
    print("🚀 Starting Enhanced Security Tests")
    print("Make sure your backend is running on http://localhost:8000\n")
    
    try:
        asyncio.run(test_enhanced_auth())
        print("✅ All tests completed!")
    except Exception as e:
        print(f"❌ Test failed: {e}")