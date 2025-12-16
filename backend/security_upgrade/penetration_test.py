"""
Security Penetration Testing Script
Tests common attack vectors and vulnerabilities
"""
import requests
import json
import time
import base64
from urllib.parse import quote

class PenetrationTester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.session = requests.Session()
        
    def test_sql_injection(self):
        """Test SQL injection vulnerabilities"""
        print("💉 Testing SQL Injection Protection")
        
        sql_payloads = [
            "' OR '1'='1",
            "'; DROP TABLE users; --",
            "' UNION SELECT * FROM users --",
            "admin'--",
            "' OR 1=1#"
        ]
        
        for payload in sql_payloads:
            login_data = {
                "email": payload,
                "password": "test"
            }
            
            try:
                response = self.session.post(f"{self.base_url}/api/v1/auth/login", json=login_data)
                if response.status_code == 500:
                    print(f"   SQL Payload: ❌ VULNERABLE (500 error)")
                elif response.status_code in [400, 401]:
                    print(f"   SQL Payload: ✅ PROTECTED")
                else:
                    print(f"   SQL Payload: ⚠️  Unexpected response ({response.status_code})")
            except requests.exceptions.ConnectionError:
                print("   ⚠️  Backend not running")
                break
        
        print()
    
    def test_xss_protection(self):
        """Test XSS protection"""
        print("🚨 Testing XSS Protection")
        
        xss_payloads = [
            "<script>alert('XSS')</script>",
            "javascript:alert('XSS')",
            "<img src=x onerror=alert('XSS')>",
            "';alert('XSS');//",
            "<svg onload=alert('XSS')>"
        ]
        
        for payload in xss_payloads:
            register_data = {
                "email": "test@example.com",
                "password": "Test123!",
                "first_name": payload,
                "last_name": "Test"
            }
            
            try:
                response = self.session.post(f"{self.base_url}/api/v1/auth/register", json=register_data)
                
                if response.status_code == 400:
                    print(f"   XSS Payload: ✅ REJECTED")
                elif response.status_code == 201:
                    # Check if payload was sanitized
                    profile_response = self.session.get(f"{self.base_url}/api/v1/auth/profile")
                    if profile_response.status_code == 200:
                        profile_data = profile_response.json()
                        if payload in str(profile_data):
                            print(f"   XSS Payload: ❌ STORED UNSANITIZED")
                        else:
                            print(f"   XSS Payload: ✅ SANITIZED")
                    else:
                        print(f"   XSS Payload: ⚠️  Cannot verify sanitization")
                else:
                    print(f"   XSS Payload: ⚠️  Unexpected response ({response.status_code})")
            except requests.exceptions.ConnectionError:
                print("   ⚠️  Backend not running")
                break
        
        print()
    
    def test_authentication_bypass(self):
        """Test authentication bypass attempts"""
        print("🔓 Testing Authentication Bypass")
        
        # Test JWT manipulation
        fake_tokens = [
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjk5OTk5OTk5OTl9.invalid",
            "Bearer admin_token",
            "null",
            "",
            "undefined"
        ]
        
        for token in fake_tokens:
            headers = {"Authorization": f"Bearer {token}"}
            
            try:
                response = self.session.get(f"{self.base_url}/api/v1/auth/profile", headers=headers)
                if response.status_code == 200:
                    print(f"   Fake Token: ❌ BYPASSED AUTHENTICATION")
                elif response.status_code == 401:
                    print(f"   Fake Token: ✅ REJECTED")
                else:
                    print(f"   Fake Token: ⚠️  Unexpected response ({response.status_code})")
            except requests.exceptions.ConnectionError:
                print("   ⚠️  Backend not running")
                break
        
        print()
    
    def test_directory_traversal(self):
        """Test directory traversal attacks"""
        print("📁 Testing Directory Traversal Protection")
        
        traversal_payloads = [
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32\\drivers\\etc\\hosts",
            "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd",
            "....//....//....//etc/passwd"
        ]
        
        for payload in traversal_payloads:
            try:
                # Test file access endpoints
                response = self.session.get(f"{self.base_url}/api/v1/files/{quote(payload)}")
                if response.status_code == 200 and ("root:" in response.text or "localhost" in response.text):
                    print(f"   Directory Traversal: ❌ VULNERABLE")
                elif response.status_code in [400, 403, 404]:
                    print(f"   Directory Traversal: ✅ PROTECTED")
                else:
                    print(f"   Directory Traversal: ⚠️  Endpoint not found")
            except requests.exceptions.ConnectionError:
                print("   ⚠️  Backend not running")
                break
        
        print()
    
    def test_session_security(self):
        """Test session security"""
        print("🍪 Testing Session Security")
        
        try:
            # Login to get session
            login_data = {"email": "test@example.com", "password": "Test123!"}
            response = self.session.post(f"{self.base_url}/api/v1/auth/login", json=login_data)
            
            if response.status_code == 200:
                # Check cookie security attributes
                cookies = response.cookies
                
                for cookie in cookies:
                    secure = cookie.secure
                    httponly = getattr(cookie, 'httponly', False)
                    samesite = getattr(cookie, 'samesite', None)
                    
                    print(f"   Cookie '{cookie.name}':")
                    print(f"     Secure: {'✅' if secure else '❌'}")
                    print(f"     HttpOnly: {'✅' if httponly else '❌'}")
                    print(f"     SameSite: {'✅' if samesite else '❌'}")
                
                # Test session fixation
                old_session = self.session.cookies.copy()
                
                # Try to use old session after logout
                self.session.post(f"{self.base_url}/api/v1/auth/logout")
                
                # Restore old cookies and test
                self.session.cookies.update(old_session)
                response = self.session.get(f"{self.base_url}/api/v1/auth/profile")
                
                if response.status_code == 401:
                    print("   Session Invalidation: ✅ WORKING")
                else:
                    print("   Session Invalidation: ❌ VULNERABLE")
            else:
                print("   ⚠️  Cannot test - login failed")
                
        except requests.exceptions.ConnectionError:
            print("   ⚠️  Backend not running")
        
        print()
    
    def test_brute_force_protection(self):
        """Test brute force protection"""
        print("🔨 Testing Brute Force Protection")
        
        # Rapid login attempts
        login_data = {"email": "admin@example.com", "password": "wrong"}
        
        blocked = False
        for i in range(10):
            try:
                start_time = time.time()
                response = self.session.post(f"{self.base_url}/api/v1/auth/login", json=login_data)
                end_time = time.time()
                
                if response.status_code == 429:
                    print(f"   Attempt {i+1}: ✅ BLOCKED (Rate Limited)")
                    blocked = True
                    break
                elif end_time - start_time > 2:  # Artificial delay
                    print(f"   Attempt {i+1}: ✅ DELAYED ({end_time - start_time:.2f}s)")
                else:
                    print(f"   Attempt {i+1}: {response.status_code} ({end_time - start_time:.2f}s)")
                
                time.sleep(0.1)  # Small delay between attempts
                
            except requests.exceptions.ConnectionError:
                print("   ⚠️  Backend not running")
                break
        
        if not blocked:
            print("   ⚠️  No brute force protection detected")
        
        print()

def main():
    """Run all penetration tests"""
    print("🔍 Security Penetration Testing")
    print("=" * 50)
    print("⚠️  WARNING: These tests simulate real attacks")
    print("   Only run against your own systems!")
    print("=" * 50)
    print()
    
    tester = PenetrationTester()
    
    tester.test_sql_injection()
    tester.test_xss_protection()
    tester.test_authentication_bypass()
    tester.test_directory_traversal()
    tester.test_session_security()
    tester.test_brute_force_protection()
    
    print("=" * 50)
    print("🎯 Penetration Testing Complete!")
    print()
    print("📊 Security Assessment:")
    print("✅ = Protected against attack")
    print("❌ = Vulnerable to attack")
    print("⚠️  = Needs investigation")
    print()
    print("🔧 Next Steps:")
    print("1. Fix any vulnerabilities found")
    print("2. Run tests against production environment")
    print("3. Implement additional monitoring")
    print("4. Schedule regular security audits")

if __name__ == "__main__":
    main()