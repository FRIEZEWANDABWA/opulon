#!/usr/bin/env python3
import urllib.request
import urllib.parse
import json

class AdminDemo:
    def __init__(self):
        self.token = None
        self.base_url = "http://localhost:8000"
    
    def login(self):
        """Login as admin"""
        login_data = json.dumps({
            "email": "afubwa@opulonhq.com",
            "password": "Afubwa@123"
        }).encode()
        
        req = urllib.request.Request(
            f"{self.base_url}/api/v1/auth/login",
            data=login_data,
            headers={'Content-Type': 'application/json'}
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode())
            self.token = result.get('access_token')
            return self.token is not None
    
    def make_request(self, method, endpoint, data=None):
        """Make authenticated request"""
        url = f"{self.base_url}{endpoint}"
        headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }
        
        if method == "GET":
            req = urllib.request.Request(url, headers=headers)
        else:
            req = urllib.request.Request(
                url,
                data=json.dumps(data).encode() if data else None,
                headers=headers
            )
            req.get_method = lambda: method
        
        with urllib.request.urlopen(req, timeout=10) as response:
            return response.status, json.loads(response.read().decode())
    
    def list_users(self):
        """List all users"""
        status, users = self.make_request("GET", "/api/v1/admin/users")
        print(f"\n=== ALL USERS ({len(users)}) ===")
        for user in users:
            active = "ACTIVE" if user['is_active'] else "INACTIVE"
            print(f"{user['id']:2d}. {user['email']:25s} | {user['role']:10s} | {active}")
        return users
    
    def create_user(self):
        """Create new user"""
        user_data = {
            "email": "demo.user@opulon.com",
            "username": "demouser",
            "full_name": "Demo User",
            "password": "DemoUser123!",
            "role": "user",
            "is_active": True
        }
        
        try:
            status, result = self.make_request("POST", "/api/v1/admin/users", user_data)
            print(f"\nCREATE USER: {status} - {result.get('message', 'Success')}")
            return result
        except Exception as e:
            print(f"CREATE USER ERROR: {str(e)[:50]}")
    
    def update_user(self, user_id):
        """Update user information"""
        update_data = {
            "full_name": "Updated Demo User",
            "phone": "+1234567890"
        }
        
        try:
            status, result = self.make_request("PUT", f"/api/v1/admin/users/{user_id}", update_data)
            print(f"UPDATE USER: {status} - {result.get('message', 'Success')}")
            return result
        except Exception as e:
            print(f"UPDATE USER ERROR: {str(e)[:50]}")
    
    def promote_user(self, user_id):
        """Promote user to admin (requires superadmin)"""
        try:
            status, result = self.make_request("PUT", f"/api/v1/admin/users/{user_id}/promote?role=admin")
            print(f"PROMOTE USER: {status} - {result.get('message', 'Success')}")
            return result
        except Exception as e:
            print(f"PROMOTE USER ERROR: {str(e)[:50]}")
    
    def toggle_user_status(self, user_id):
        """Toggle user active status"""
        try:
            status, result = self.make_request("PUT", f"/api/v1/admin/users/{user_id}/toggle-status")
            print(f"TOGGLE STATUS: {status} - {result.get('message', 'Success')}")
            return result
        except Exception as e:
            print(f"TOGGLE STATUS ERROR: {str(e)[:50]}")
    
    def delete_user(self, user_id):
        """Delete user"""
        try:
            status, result = self.make_request("DELETE", f"/api/v1/admin/users/{user_id}")
            print(f"DELETE USER: {status} - {result.get('message', 'Success')}")
            return result
        except Exception as e:
            print(f"DELETE USER ERROR: {str(e)[:50]}")
    
    def demo_all_features(self):
        """Demonstrate all admin features"""
        print("=== ADMIN USER MANAGEMENT DEMO ===")
        
        # Login
        if not self.login():
            print("LOGIN FAILED")
            return
        print("LOGIN: Success")
        
        # List users
        users = self.list_users()
        
        # Create user
        new_user = self.create_user()
        if new_user and 'user' in new_user:
            new_user_id = new_user['user']['id']
            
            # Update user
            self.update_user(new_user_id)
            
            # Toggle status
            self.toggle_user_status(new_user_id)
            
            # List users again
            self.list_users()
            
            # Delete user
            self.delete_user(new_user_id)
        
        print("\n=== DEMO COMPLETE ===")

if __name__ == "__main__":
    demo = AdminDemo()
    demo.demo_all_features()