#!/usr/bin/env python3
import urllib.request
import urllib.parse
import json

def test_audit_system():
    """Test audit log system"""
    
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
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode())
            token = result.get('access_token')
            
            if not token:
                print("Login failed")
                return
            
            print("SUCCESS: Admin logged in")
            
            # Test audit endpoints
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            
            # Get audit logs
            try:
                req = urllib.request.Request(
                    "http://localhost:8000/api/v1/admin/audit-logs",
                    headers=headers
                )
                
                with urllib.request.urlopen(req, timeout=10) as resp:
                    audit_data = json.loads(resp.read().decode())
                    logs = audit_data.get('logs', [])
                    print(f"SUCCESS: Found {len(logs)} audit logs")
                    
                    # Show recent logs
                    for log in logs[:5]:
                        print(f"  - {log['action']} on {log['resource_type']} by {log.get('user_email', 'System')}")
                        
            except Exception as e:
                print(f"ERROR getting audit logs: {str(e)[:50]}")
            
            # Get audit stats
            try:
                req = urllib.request.Request(
                    "http://localhost:8000/api/v1/admin/audit-logs/stats",
                    headers=headers
                )
                
                with urllib.request.urlopen(req, timeout=10) as resp:
                    stats = json.loads(resp.read().decode())
                    print(f"SUCCESS: Audit stats - Total logs: {stats.get('total_logs')}")
                    
                    actions = stats.get('actions', [])
                    for action in actions[:3]:
                        print(f"  - {action['action']}: {action['count']} times")
                        
            except Exception as e:
                print(f"ERROR getting audit stats: {str(e)[:50]}")
            
            # Create a test user to generate audit log
            try:
                user_data = json.dumps({
                    "email": "audit.test@opulon.com",
                    "username": "audittest",
                    "full_name": "Audit Test User",
                    "password": "AuditTest123!",
                    "role": "user"
                }).encode()
                
                req = urllib.request.Request(
                    "http://localhost:8000/api/v1/admin/users",
                    data=user_data,
                    headers=headers
                )
                req.get_method = lambda: 'POST'
                
                with urllib.request.urlopen(req, timeout=10) as resp:
                    result = json.loads(resp.read().decode())
                    print("SUCCESS: Created test user - audit log generated")
                    
            except Exception as e:
                print(f"ERROR creating test user: {str(e)[:50]}")
            
    except Exception as e:
        print(f"Login error: {e}")

if __name__ == "__main__":
    test_audit_system()