"""
Simple test script to verify Opulon project structure
"""
import os

def check_file_exists(path, description):
    exists = os.path.exists(path)
    status = "OK" if exists else "MISSING"
    print(f"{status}: {description} - {path}")
    return exists

def test_opulon_structure():
    print("OPULON PROJECT STRUCTURE TEST")
    print("=" * 50)
    
    base_path = "."
    
    # Key files to check
    files_to_check = [
        ("backend/app/main.py", "FastAPI main application"),
        ("backend/requirements.txt", "Python dependencies"),
        ("frontend/package.json", "Node.js dependencies"),
        ("frontend/app/layout.tsx", "Root layout"),
        ("docker-compose.yml", "Docker compose config"),
        ("README.md", "Project documentation"),
    ]
    
    score = 0
    for file_path, desc in files_to_check:
        if check_file_exists(file_path, desc):
            score += 1
    
    print("\nSUMMARY:")
    print(f"Files found: {score}/{len(files_to_check)}")
    print(f"Completion: {score/len(files_to_check)*100:.1f}%")
    
    if score == len(files_to_check):
        print("\nSUCCESS: All core files are present!")
        print("Ready for Docker deployment.")
    else:
        print(f"\nWARNING: {len(files_to_check) - score} files missing.")

if __name__ == "__main__":
    test_opulon_structure()