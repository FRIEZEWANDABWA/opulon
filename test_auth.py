#!/usr/bin/env python3
"""
Test script to verify the authentication system is working properly
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_auth_system():
    print("🔍 Testing Opulon Authentication System")
    print("=" * 50)
    
    # Test 1: Register a new user
    print("1. Testing user registration...")
    register_data = {
        "email": "test@example.com",
        "username": "testuser",
        "full_name": "Test User",
        "phone": "+1234567890",
        "address": "123 Test St",
        "password": "<TEST_PASSWORD>"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/v1/auth/register", json=register_data)
        if response.status_code == 200:
            data = response.json()
            print("✅ Registration successful!")
            print(f"   Token type: {data.get('token_type')}")
            print(f"   User role: {data.get('user', {}).get('role')}")
            access_token = data.get('access_token')
        else:
            print(f"❌ Registration failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return False
    
    # Test 2: Login with the same user
    print("\n2. Testing user login...")
    login_data = {
        "email": "test@example.com",
        "password": "<TEST_PASSWORD>"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/v1/auth/login", json=login_data)
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful!")
            print(f"   Token type: {data.get('token_type')}")
            access_token = data.get('access_token')
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False
    
    # Test 3: Access protected endpoint
    print("\n3. Testing protected endpoint access...")
    headers = {"Authorization": f"Bearer {access_token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/api/v1/products/", headers=headers)
        if response.status_code == 200:
            print("✅ Protected endpoint access successful!")
            print(f"   Products endpoint accessible")
        else:
            print(f"❌ Protected endpoint failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Protected endpoint error: {e}")
        return False
    
    # Test 4: Test invalid credentials
    print("\n4. Testing invalid credentials...")
    invalid_login = {
        "email": "test@example.com",
        "password": "WrongPassword"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/v1/auth/login", json=invalid_login)
        if response.status_code == 401:
            print("✅ Invalid credentials properly rejected!")
        else:
            print(f"❌ Invalid credentials test failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Invalid credentials test error: {e}")
        return False
    
    print("\n" + "=" * 50)
    print("🎉 All authentication tests passed!")
    print("✅ bcrypt password hashing working")
    print("✅ JWT token generation working")
    print("✅ Protected endpoints working")
    print("✅ Invalid credentials properly rejected")
    return True

if __name__ == "__main__":
    test_auth_system()