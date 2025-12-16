#!/usr/bin/env python3
import urllib.request
import json

def demo_audit_features():
    """Demo audit log features"""
    
    print("=== AUDIT LOG SYSTEM DEMO ===")
    
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
        with urllib.request.urlopen(req, timeout=5) as response:
            result = json.loads(response.read().decode())
            token = result.get('access_token')
            
            if not token:
                print("ERROR: Login failed")
                return
            
            print("SUCCESS: Admin logged in")
            
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            
            # Test audit endpoints
            endpoints = [
                ("GET", "/api/v1/admin/audit-logs", "Get audit logs"),
                ("GET", "/api/v1/admin/audit-logs/stats", "Get audit statistics"),
                ("GET", "/api/v1/admin/audit-logs?action=login", "Filter by login action"),
                ("GET", "/api/v1/admin/audit-logs?resource_type=user", "Filter by user resource")
            ]
            
            for method, endpoint, description in endpoints:
                try:
                    req = urllib.request.Request(
                        f"http://localhost:8000{endpoint}",
                        headers=headers
                    )
                    
                    with urllib.request.urlopen(req, timeout=5) as resp:
                        data = json.loads(resp.read().decode())
                        
                        if 'logs' in data:
                            print(f"SUCCESS: {description} - Found {len(data['logs'])} logs")
                        elif 'total_logs' in data:
                            print(f"SUCCESS: {description} - Total: {data['total_logs']}")
                        else:
                            print(f"SUCCESS: {description}")
                            
                except Exception as e:
                    print(f"ERROR: {description} - {str(e)[:30]}")
            
            print("\n=== AUDIT FEATURES AVAILABLE ===")
            print("1. View all audit logs with pagination")
            print("2. Filter by action (login, create, update, delete)")
            print("3. Filter by resource type (user, product, order)")
            print("4. Filter by date range")
            print("5. Search in descriptions and details")
            print("6. Export logs as CSV or JSON")
            print("7. Edit log descriptions (admin only)")
            print("8. Delete logs (superadmin only)")
            print("9. View detailed statistics")
            print("10. Track IP addresses and user agents")
            
    except Exception as e:
        print(f"Connection error: {e}")
        print("\nTo test audit system:")
        print("1. Start backend: docker-compose up")
        print("2. Run: python audit_demo_simple.py")

if __name__ == "__main__":
    demo_audit_features()