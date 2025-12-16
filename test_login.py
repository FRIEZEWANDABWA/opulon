#!/usr/bin/env python3
import urllib.request
import urllib.parse
import json

def test_credentials():
    """Test existing credentials"""
    
    credentials = [
        ("afubwa@opulonhq.com", "Afubwa@123"),
        ("admin@opulon.com", "admin123"),
        ("user@opulon.com", "user123"),
        ("test5@example.com", "Test123!"),
        ("browsertest@example.com", "BrowserTest123!")
    ]
    
    endpoints = [
        "http://localhost:8000/api/v1/auth/login",
        "https://opulonhq.com/api/v1/auth/login"
    ]
    
    for endpoint in endpoints:
        print(f"\n🔍 Testing: {endpoint}")
        
        for email, password in credentials:
            try:
                data = json.dumps({"email": email, "password": password}).encode()
                req = urllib.request.Request(
                    endpoint,
                    data=data,
                    headers={'Content-Type': 'application/json'}
                )
                
                with urllib.request.urlopen(req, timeout=10) as response:
                    if response.status == 200:
                        print(f"✅ {email} / {password}")
                        return email, password
                    else:
                        print(f"❌ {email} - Status: {response.status}")
                        
            except Exception as e:
                print(f"❌ {email} - Error: {str(e)[:50]}")
    
    return None, None

if __name__ == "__main__":
    email, password = test_credentials()
    if email:
        print(f"\n🎯 WORKING CREDENTIALS:")
        print(f"Email: {email}")
        print(f"Password: {password}")
    else:
        print("\n❌ No working credentials found")