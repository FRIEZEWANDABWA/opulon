"""
Test script to verify Opulon project structure and components
"""
import os
import json

def check_file_exists(path, description):
    exists = os.path.exists(path)
    status = "✅" if exists else "❌"
    print(f"{status} {description}: {path}")
    return exists

def test_opulon_structure():
    print("🏥 OPULON PROJECT STRUCTURE TEST")
    print("=" * 50)
    
    base_path = "C:/websites/opilon"
    
    # Backend files
    print("\n📁 BACKEND FILES:")
    backend_files = [
        ("backend/app/main.py", "FastAPI main application"),
        ("backend/app/models/__init__.py", "Database models"),
        ("backend/app/api/v1/auth.py", "Authentication routes"),
        ("backend/app/api/v1/products.py", "Product routes"),
        ("backend/requirements.txt", "Python dependencies"),
        ("backend/Dockerfile", "Backend Docker config"),
    ]
    
    backend_score = 0
    for file_path, desc in backend_files:
        if check_file_exists(os.path.join(base_path, file_path), desc):
            backend_score += 1
    
    # Frontend files
    print("\n📁 FRONTEND FILES:")
    frontend_files = [
        ("frontend/app/layout.tsx", "Root layout"),
        ("frontend/app/page.tsx", "Home page"),
        ("frontend/app/products/page.tsx", "Products page"),
        ("frontend/app/admin/layout.tsx", "Admin layout"),
        ("frontend/components/navbar.tsx", "Navigation component"),
        ("frontend/package.json", "Node.js dependencies"),
        ("frontend/Dockerfile", "Frontend Docker config"),
    ]
    
    frontend_score = 0
    for file_path, desc in frontend_files:
        if check_file_exists(os.path.join(base_path, file_path), desc):
            frontend_score += 1
    
    # Docker files
    print("\n🐳 DOCKER FILES:")
    docker_files = [
        ("docker-compose.yml", "Production Docker compose"),
        ("docker-compose.dev.yml", "Development Docker compose"),
        ("infra/nginx/nginx.conf", "Nginx configuration"),
    ]
    
    docker_score = 0
    for file_path, desc in docker_files:
        if check_file_exists(os.path.join(base_path, file_path), desc):
            docker_score += 1
    
    # Summary
    print("\n📊 PROJECT COMPLETION SUMMARY:")
    print("=" * 50)
    print(f"Backend Components: {backend_score}/{len(backend_files)} ({backend_score/len(backend_files)*100:.1f}%)")
    print(f"Frontend Components: {frontend_score}/{len(frontend_files)} ({frontend_score/len(frontend_files)*100:.1f}%)")
    print(f"Docker Components: {docker_score}/{len(docker_files)} ({docker_score/len(docker_files)*100:.1f}%)")
    
    total_score = backend_score + frontend_score + docker_score
    total_files = len(backend_files) + len(frontend_files) + len(docker_files)
    overall_completion = total_score / total_files * 100
    
    print(f"\n🎯 OVERALL COMPLETION: {total_score}/{total_files} ({overall_completion:.1f}%)")
    
    if overall_completion >= 90:
        print("🎉 EXCELLENT! Opulon is ready for deployment!")
    elif overall_completion >= 70:
        print("👍 GOOD! Most components are in place.")
    else:
        print("⚠️  Some components are missing.")
    
    # Next steps
    print("\n🚀 NEXT STEPS:")
    print("1. Install Docker Desktop for full testing")
    print("2. Run: docker-compose -f docker-compose.dev.yml up --build")
    print("3. Access frontend at http://localhost:3000")
    print("4. Access API docs at http://localhost:8000/docs")
    print("5. Test admin login: admin@opulon.com / admin123")

if __name__ == "__main__":
    test_opulon_structure()