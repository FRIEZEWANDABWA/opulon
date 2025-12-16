import os
import re

def check_security():
    print("OPULON SECURITY AUDIT")
    print("=" * 40)
    
    issues = []
    warnings = []
    passed = []
    
    # Check environment files
    print("Checking environment files...")
    
    env_files = ["backend/.env", "backend/.env.prod"]
    for env_file in env_files:
        if os.path.exists(env_file):
            with open(env_file, 'r') as f:
                content = f.read()
                
            # Check for weak secrets
            if "placeholder" in content or "your-secret-key-here" in content:
                issues.append(f"Weak secrets in {env_file}")
            else:
                passed.append(f"No placeholder secrets in {env_file}")
                
            # Check debug mode in production
            if env_file.endswith('.prod') and "DEBUG=True" in content:
                issues.append(f"Debug enabled in production {env_file}")
            elif env_file.endswith('.prod'):
                passed.append(f"Debug disabled in {env_file}")
                
            # Check database password strength
            db_match = re.search(r'DATABASE_URL=.*://.*:(.*?)@', content)
            if db_match:
                password = db_match.group(1)
                if len(password) < 12:
                    issues.append(f"Weak database password in {env_file}")
                else:
                    passed.append(f"Strong database password in {env_file}")
    
    # Check Docker configuration
    print("Checking Docker configuration...")
    
    if os.path.exists("docker-compose.prod.yml"):
        with open("docker-compose.prod.yml", 'r') as f:
            content = f.read()
            
        # Check port binding
        if "127.0.0.1" in content:
            passed.append("Ports bound to localhost only")
        else:
            warnings.append("Some ports may be exposed to all interfaces")
            
        # Check for non-root users
        if "USER " in content and "USER root" not in content:
            passed.append("Non-root users configured")
        elif "USER root" in content:
            issues.append("Root user detected in Docker configuration")
    
    # Generate report
    print("\nSECURITY AUDIT RESULTS")
    print("=" * 40)
    print(f"PASSED: {len(passed)}")
    print(f"WARNINGS: {len(warnings)}")
    print(f"ISSUES: {len(issues)}")
    
    if issues:
        print("\nCRITICAL ISSUES:")
        for i, issue in enumerate(issues, 1):
            print(f"  {i}. {issue}")
    
    if warnings:
        print("\nWARNINGS:")
        for i, warning in enumerate(warnings, 1):
            print(f"  {i}. {warning}")
    
    if passed:
        print("\nSECURITY MEASURES IN PLACE:")
        for i, p in enumerate(passed, 1):
            print(f"  {i}. {p}")
    
    # Security score
    total = len(issues) + len(warnings) + len(passed)
    if total > 0:
        score = ((len(passed) + len(warnings) * 0.5) / total) * 100
        print(f"\nSECURITY SCORE: {score:.1f}%")
        
        if score >= 90:
            print("STATUS: EXCELLENT - Production ready!")
        elif score >= 75:
            print("STATUS: GOOD - Minor improvements needed")
        else:
            print("STATUS: NEEDS IMPROVEMENT")
    
    return len(issues) == 0

if __name__ == "__main__":
    is_secure = check_security()
    print("\n" + "=" * 40)
    if is_secure:
        print("READY FOR DEPLOYMENT")
    else:
        print("FIX ISSUES BEFORE DEPLOYMENT")
    print("=" * 40)