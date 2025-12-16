#!/usr/bin/env python3
import requests
import json

def create_superadmin():
    """Create new super admin user"""
    
    # Try different API endpoints
    endpoints = [
        "http://localhost:8000/api/v1/auth/register",
        "http://localhost:8001/api/v1/auth/register",
        "https://opulonhq.com/api/v1/auth/register"
    ]
    
    admin_data = {
        "email": "superadmin@opulon.com",
        "password": "SuperAdmin123!",
        "first_name": "Super",
        "last_name": "Admin",
        "full_name": "Super Admin"
    }
    
    for endpoint in endpoints:
        try:
            print(f"Trying: {endpoint}")
            response = requests.post(endpoint, json=admin_data, timeout=10)
            print(f"Status: {response.status_code}")
            
            if response.status_code in [200, 201]:
                print("✅ Super Admin Created!")
                print("Email: superadmin@opulon.com")
                print("Password: SuperAdmin123!")
                return True
            else:
                print(f"Response: {response.text}")
                
        except Exception as e:
            print(f"Failed: {e}")
    
    return False

if __name__ == "__main__":
    create_superadmin()