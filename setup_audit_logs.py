#!/usr/bin/env python3
import psycopg2
import sys

def setup_audit_logs():
    """Setup audit logs table in database"""
    
    try:
        # Connect to database
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            database="opulon_db",
            user="opulon",
            password="securepassword123"
        )
        
        cursor = conn.cursor()
        
        # Read and execute migration
        with open('backend/migrations/add_audit_logs.sql', 'r') as f:
            sql = f.read()
        
        cursor.execute(sql)
        conn.commit()
        
        print("SUCCESS: Audit logs table created")
        
        # Verify table exists
        cursor.execute("SELECT COUNT(*) FROM audit_logs")
        count = cursor.fetchone()[0]
        print(f"SUCCESS: Found {count} sample audit logs")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    setup_audit_logs()