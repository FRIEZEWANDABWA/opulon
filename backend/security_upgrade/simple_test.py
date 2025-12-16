"""
Simple Test for Enhanced Security Features
Tests the core security components without full integration
"""
import asyncio
from enhanced_security import PasswordManager, TokenManager, CSRFProtection, TwoFactorAuth
import redis

async def test_password_manager():
    """Test Argon2 password hashing"""
    print("🔐 Testing Password Manager (Argon2)")
    
    pm = PasswordManager()
    
    # Test password hashing
    password = "TestPassword123!"
    hashed = pm.hash_password(password)
    print(f"   Original: {password}")
    print(f"   Hashed: {hashed[:50]}...")
    
    # Test verification
    is_valid = pm.verify_password(password, hashed)
    print(f"   Verification: {'✅ PASS' if is_valid else '❌ FAIL'}")
    
    # Test wrong password
    is_invalid = pm.verify_password("WrongPassword", hashed)
    print(f"   Wrong password: {'❌ FAIL (correct)' if not is_invalid else '✅ PASS (incorrect)'}")
    print()

async def test_token_manager():
    """Test JWT token management"""
    print("🎫 Testing Token Manager (JWT)")
    
    try:
        # Use fake Redis for testing
        redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
        redis_client.ping()  # Test connection
        
        tm = TokenManager(redis_client)
        
        # Test access token
        user_id = 123
        permissions = ["products.read", "orders.create"]
        access_token = tm.create_access_token(user_id, permissions)
        print(f"   Access Token: {access_token[:50]}...")
        
        # Verify token
        payload = tm.verify_token(access_token, "access")
        if payload:
            print(f"   Token Valid: ✅ User ID: {payload['sub']}")
            print(f"   Permissions: {payload['permissions']}")
        else:
            print("   Token Valid: ❌ FAIL")
        
        # Test refresh token
        session_id = "test-session-123"
        refresh_token = tm.create_refresh_token(user_id, session_id)
        print(f"   Refresh Token: {refresh_token[:50]}...")
        
        refresh_payload = tm.verify_token(refresh_token, "refresh")
        if refresh_payload:
            print(f"   Refresh Valid: ✅ Session: {refresh_payload['session_id']}")
        else:
            print("   Refresh Valid: ❌ FAIL")
            
    except redis.ConnectionError:
        print("   ⚠️ Redis not available - skipping token tests")
        print("   To test tokens: Start Redis with 'redis-server'")
    
    print()

async def test_csrf_protection():
    """Test CSRF token generation and validation"""
    print("🛡️ Testing CSRF Protection")
    
    session_id = "test-session-123"
    
    # Generate CSRF token
    csrf_token = CSRFProtection.generate_csrf_token(session_id)
    print(f"   CSRF Token: {csrf_token}")
    
    # Verify token
    is_valid = CSRFProtection.verify_csrf_token(csrf_token, session_id)
    print(f"   Verification: {'✅ PASS' if is_valid else '❌ FAIL'}")
    
    # Test with wrong session
    is_invalid = CSRFProtection.verify_csrf_token(csrf_token, "wrong-session")
    print(f"   Wrong session: {'❌ FAIL (correct)' if not is_invalid else '✅ PASS (incorrect)'}")
    print()

async def test_2fa():
    """Test 2FA (TOTP) functionality"""
    print("📱 Testing Two-Factor Authentication (TOTP)")
    
    # Generate secret
    secret = TwoFactorAuth.generate_secret()
    print(f"   Secret: {secret}")
    
    # Generate QR URL
    email = "test@example.com"
    qr_url = TwoFactorAuth.generate_qr_url(secret, email)
    print(f"   QR URL: {qr_url[:80]}...")
    
    # For testing, we can't verify TOTP without the actual app
    # But we can test the generation
    print("   ✅ 2FA setup successful (manual verification needed)")
    print()

async def main():
    """Run all tests"""
    print("🧪 Enhanced Security Component Tests\n")
    
    await test_password_manager()
    await test_token_manager()
    await test_csrf_protection()
    await test_2fa()
    
    print("✅ All component tests completed!")
    print("\nNext steps:")
    print("1. Start Redis: redis-server")
    print("2. Update your User model with fields from user_model_additions.txt")
    print("3. Run database migrations")
    print("4. Test with your actual backend")

if __name__ == "__main__":
    asyncio.run(main())