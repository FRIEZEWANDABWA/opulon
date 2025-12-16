"""
Integration Security Tests
Tests the complete security system with realistic scenarios
"""
import requests
import json
import time
from datetime import datetime

class SecurityTester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.session = requests.Session()
        
    def test_authentication_flow(self):
        """Test complete authentication flow"""
        print("🔐 Testing Authentication Flow")
        
        # Test registration
        register_data = {
            "email": "security_test@example.com",
            "password": "SecureTest123!",
            "first_name": "Security",
            "last_name": "Tester"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/api/v1/auth/register", json=register_data)
            print(f"   Registration: {response.status_code}")
            
            # Test login
            login_data = {"email": register_data["email"], "password": register_data["password"]}
            response = self.session.post(f"{self.base_url}/api/v1/auth/login", json=login_data)
            print(f"   Login: {response.status_code}")
            
            if response.status_code == 200:
                # Check for secure cookies
                cookies = response.cookies
                has_access_token = 'access_token' in cookies
                has_refresh_token = 'refresh_token' in cookies
                print(f"   Access Token Cookie: {'✅' if has_access_token else '❌'}")
                print(f"   Refresh Token Cookie: {'✅' if has_refresh_token else '❌'}")
                
                # Test protected endpoint
                response = self.session.get(f"{self.base_url}/api/v1/auth/profile")
                print(f"   Protected Endpoint: {response.status_code}")
                
                # Test logout
                response = self.session.post(f"{self.base_url}/api/v1/auth/logout")
                print(f"   Logout: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print("   ⚠️  Backend not running - start with: docker-compose up")
        
        print()
    
    def test_rate_limiting(self):
        """Test rate limiting protection"""
        print("🚦 Testing Rate Limiting")
        
        # Test login rate limiting
        login_data = {"email": "nonexistent@example.com", "password": "wrong"}
        
        blocked_count = 0
        for i in range(7):
            try:
                response = self.session.post(f"{self.base_url}/api/v1/auth/login", json=login_data)
                if response.status_code == 429:  # Too Many Requests
                    blocked_count += 1
                    print(f"   Attempt {i+1}: BLOCKED (429)")
                    break
                else:
                    print(f"   Attempt {i+1}: {response.status_code}")
            except requests.exceptions.ConnectionError:
                print("   ⚠️  Backend not running")
                break
        
        if blocked_count > 0:
            print("   ✅ Rate limiting active")
        else:
            print("   ⚠️  Rate limiting not detected")
        
        print()
    
    def test_csrf_protection(self):
        """Test CSRF protection"""
        print("🛡️  Testing CSRF Protection")
        
        try:
            # Get CSRF token
            response = self.session.get(f"{self.base_url}/api/v1/auth/csrf-token")
            if response.status_code == 200:
                csrf_token = response.json().get('csrf_token')
                print(f"   CSRF Token Retrieved: {'✅' if csrf_token else '❌'}")
                
                # Test request without CSRF token
                response = self.session.post(f"{self.base_url}/api/v1/auth/login", 
                                           json={"email": "test@example.com", "password": "test"})
                print(f"   Request without CSRF: {response.status_code}")
                
                # Test request with CSRF token
                headers = {'X-CSRFToken': csrf_token}
                response = self.session.post(f"{self.base_url}/api/v1/auth/login", 
                                           json={"email": "test@example.com", "password": "test"},
                                           headers=headers)
                print(f"   Request with CSRF: {response.status_code}")
            else:
                print("   ❌ CSRF endpoint not available")
                
        except requests.exceptions.ConnectionError:
            print("   ⚠️  Backend not running")
        
        print()
    
    def test_security_headers(self):
        """Test security headers"""
        print("🔒 Testing Security Headers")
        
        try:
            response = self.session.get(f"{self.base_url}/api/v1/auth/csrf-token")
            headers = response.headers
            
            security_headers = {
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'X-XSS-Protection': '1; mode=block',
                'Strict-Transport-Security': 'max-age=31536000',
                'Content-Security-Policy': 'default-src'
            }
            
            for header, expected in security_headers.items():
                if header in headers:
                    if expected in headers[header]:
                        print(f"   {header}: ✅")
                    else:
                        print(f"   {header}: ⚠️  Present but different value")
                else:
                    print(f"   {header}: ❌ Missing")
                    
        except requests.exceptions.ConnectionError:
            print("   ⚠️  Backend not running")
        
        print()
    
    def test_password_security(self):
        """Test password security requirements"""
        print("🔑 Testing Password Security")
        
        weak_passwords = [
            "123456",
            "password",
            "test",
            "abc123",
            "Password1"  # Missing special character
        ]
        
        for password in weak_passwords:
            register_data = {
                "email": f"test_{int(time.time())}@example.com",
                "password": password,
                "first_name": "Test",
                "last_name": "User"
            }
            
            try:
                response = self.session.post(f"{self.base_url}/api/v1/auth/register", json=register_data)
                if response.status_code == 400:
                    print(f"   Weak password '{password}': ✅ REJECTED")
                else:
                    print(f"   Weak password '{password}': ❌ ACCEPTED ({response.status_code})")
            except requests.exceptions.ConnectionError:
                print("   ⚠️  Backend not running")
                break
        
        print()

def main():
    """Run all security tests"""
    print("🔐 Enhanced Security Integration Tests")
    print("=" * 50)
    print()
    
    tester = SecurityTester()
    
    tester.test_authentication_flow()
    tester.test_rate_limiting()
    tester.test_csrf_protection()
    tester.test_security_headers()
    tester.test_password_security()
    
    print("=" * 50)
    print("🎯 Security Testing Complete!")
    print()
    print("📋 Manual Tests to Perform:")
    print("1. SQL Injection attempts on login forms")
    print("2. XSS payload injection in user inputs")
    print("3. Session hijacking attempts")
    print("4. Brute force attack simulation")
    print("5. SSL/TLS configuration testing")
    print()
    print("🔧 Tools for Advanced Testing:")
    print("- OWASP ZAP for vulnerability scanning")
    print("- Burp Suite for penetration testing")
    print("- SQLMap for SQL injection testing")
    print("- Nmap for port scanning")

if __name__ == "__main__":
    main()