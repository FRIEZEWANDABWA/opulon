"""
Security Test Runner - Run all security tests
"""
import subprocess
import sys
import os

def run_test(test_file, description):
    """Run a test file and display results"""
    print(f"\n🔍 {description}")
    print("=" * 60)
    
    try:
        result = subprocess.run([sys.executable, test_file], 
                              capture_output=True, text=True, cwd=os.path.dirname(__file__))
        
        if result.returncode == 0:
            print(result.stdout)
            if result.stderr:
                print("Warnings:")
                print(result.stderr)
        else:
            print(f"❌ Test failed with return code {result.returncode}")
            print("STDOUT:", result.stdout)
            print("STDERR:", result.stderr)
            
    except Exception as e:
        print(f"❌ Error running test: {e}")

def main():
    """Run all security tests"""
    print("🛡️  OPULON SECURITY TEST SUITE")
    print("=" * 60)
    print("Running comprehensive security tests...")
    
    # Test files and descriptions
    tests = [
        ("clean_test.py", "Core Security Components"),
        ("integration_test.py", "Integration Security Tests"),
        ("penetration_test.py", "Penetration Testing")
    ]
    
    for test_file, description in tests:
        if os.path.exists(test_file):
            run_test(test_file, description)
        else:
            print(f"\n⚠️  {test_file} not found - skipping {description}")
    
    print("\n" + "=" * 60)
    print("🎯 ALL SECURITY TESTS COMPLETED!")
    print("\n📋 Manual Testing Checklist:")
    print("□ Test with real user registration/login")
    print("□ Verify SSL/TLS configuration")
    print("□ Check security headers in browser")
    print("□ Test 2FA functionality for admin users")
    print("□ Verify rate limiting in production")
    print("□ Test CSRF protection with forms")
    print("□ Validate audit logging")
    print("□ Check session timeout behavior")
    print("\n🔧 Production Testing:")
    print("1. Start backend: docker-compose up")
    print("2. Run tests: python run_all_tests.py")
    print("3. Check logs: docker-compose logs")
    print("4. Monitor metrics: Check rate limiting, failed logins")

if __name__ == "__main__":
    main()