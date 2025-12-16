#!/usr/bin/env python3
"""
Opulon Security Audit Script
Performs comprehensive security checks on the application
"""

import os
import re
import json
import subprocess
import sys
from pathlib import Path

class SecurityAuditor:
    def __init__(self):
        self.issues = []
        self.warnings = []
        self.passed = []
        
    def log_issue(self, category, message, severity="HIGH"):
        self.issues.append({
            "category": category,
            "message": message,
            "severity": severity
        })
        
    def log_warning(self, category, message):
        self.warnings.append({
            "category": category,
            "message": message
        })
        
    def log_passed(self, category, message):
        self.passed.append({
            "category": category,
            "message": message
        })

    def check_environment_files(self):
        """Check for secure environment configuration"""
        print("🔍 Checking environment files...")
        
        # Check backend .env files
        backend_env_files = [
            "backend/.env",
            "backend/.env.prod"
        ]
        
        for env_file in backend_env_files:
            if os.path.exists(env_file):
                with open(env_file, 'r') as f:
                    content = f.read()
                    
                # Check for weak secrets
                if "your-secret-key-here" in content or "placeholder" in content:
                    self.log_issue("Environment", f"Weak or placeholder secrets in {env_file}")
                else:
                    self.log_passed("Environment", f"No placeholder secrets in {env_file}")
                    
                # Check for debug mode in production
                if env_file.endswith('.prod') and "DEBUG=True" in content:
                    self.log_issue("Environment", f"Debug mode enabled in production file {env_file}")
                elif env_file.endswith('.prod'):
                    self.log_passed("Environment", f"Debug mode properly disabled in {env_file}")
                    
                # Check for strong database passwords
                db_match = re.search(r'DATABASE_URL=.*://.*:(.*?)@', content)
                if db_match:
                    password = db_match.group(1)
                    if len(password) < 12 or password in ['password', '123456', 'admin']:
                        self.log_issue("Database", f"Weak database password in {env_file}")
                    else:
                        self.log_passed("Database", f"Strong database password in {env_file}")

    def check_docker_security(self):
        """Check Docker configuration security"""
        print("🐳 Checking Docker security...")
        
        # Check docker-compose files
        compose_files = [
            "docker-compose.yml",
            "docker-compose.prod.yml"
        ]
        
        for compose_file in compose_files:
            if os.path.exists(compose_file):
                with open(compose_file, 'r') as f:
                    content = f.read()
                    
                # Check for exposed ports
                if re.search(r'ports:\s*\n\s*-\s*["\']?\d+:\d+["\']?', content):
                    if "127.0.0.1" not in content:
                        self.log_warning("Docker", f"Ports may be exposed to all interfaces in {compose_file}")
                    else:
                        self.log_passed("Docker", f"Ports properly bound to localhost in {compose_file}")
                        
                # Check for root user usage
                if "USER root" in content:
                    self.log_issue("Docker", f"Root user detected in {compose_file}")
                elif "USER " in content:
                    self.log_passed("Docker", f"Non-root user configured in {compose_file}")

    def check_code_security(self):
        """Check application code for security issues"""
        print("🔒 Checking code security...")
        
        # Check for hardcoded secrets
        code_files = []
        for ext in ['*.py', '*.js', '*.ts', '*.tsx']:
            code_files.extend(Path('.').rglob(ext))
            
        secret_patterns = [
            r'password\s*=\s*["\'][^"\']{1,20}["\']',
            r'secret\s*=\s*["\'][^"\']{1,50}["\']',
            r'api_key\s*=\s*["\'][^"\']{10,}["\']',
            r'token\s*=\s*["\'][^"\']{10,}["\']'
        ]
        
        hardcoded_secrets = 0
        for file_path in code_files:
            if 'node_modules' in str(file_path) or '.git' in str(file_path):
                continue
                
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    for pattern in secret_patterns:
                        if re.search(pattern, content, re.IGNORECASE):
                            hardcoded_secrets += 1
                            self.log_issue("Code", f"Potential hardcoded secret in {file_path}")
            except:
                continue
                
        if hardcoded_secrets == 0:
            self.log_passed("Code", "No hardcoded secrets detected")

    def check_dependencies(self):
        """Check for vulnerable dependencies"""
        print("📦 Checking dependencies...")
        
        # Check Python dependencies
        if os.path.exists("backend/requirements.txt"):
            try:
                result = subprocess.run(
                    ["pip", "list", "--outdated", "--format=json"],
                    capture_output=True,
                    text=True,
                    cwd="backend"
                )
                if result.returncode == 0:
                    outdated = json.loads(result.stdout)
                    if len(outdated) > 10:
                        self.log_warning("Dependencies", f"{len(outdated)} Python packages are outdated")
                    else:
                        self.log_passed("Dependencies", "Python dependencies are reasonably up to date")
            except:
                self.log_warning("Dependencies", "Could not check Python dependencies")
                
        # Check Node.js dependencies
        if os.path.exists("frontend/package.json"):
            try:
                result = subprocess.run(
                    ["npm", "audit", "--json"],
                    capture_output=True,
                    text=True,
                    cwd="frontend"
                )
                if result.returncode == 0:
                    audit_data = json.loads(result.stdout)
                    vulnerabilities = audit_data.get('metadata', {}).get('vulnerabilities', {})
                    high_vuln = vulnerabilities.get('high', 0)
                    critical_vuln = vulnerabilities.get('critical', 0)
                    
                    if critical_vuln > 0:
                        self.log_issue("Dependencies", f"{critical_vuln} critical vulnerabilities in Node.js dependencies")
                    elif high_vuln > 0:
                        self.log_warning("Dependencies", f"{high_vuln} high severity vulnerabilities in Node.js dependencies")
                    else:
                        self.log_passed("Dependencies", "No critical vulnerabilities in Node.js dependencies")
            except:
                self.log_warning("Dependencies", "Could not check Node.js dependencies")

    def check_ssl_configuration(self):
        """Check SSL/TLS configuration"""
        print("🔐 Checking SSL configuration...")
        
        nginx_configs = [
            "infra/nginx/nginx.conf",
            "infra/nginx/nginx.prod.conf"
        ]
        
        for config_file in nginx_configs:
            if os.path.exists(config_file):
                with open(config_file, 'r') as f:
                    content = f.read()
                    
                # Check for SSL protocols
                if "ssl_protocols" in content:
                    if "TLSv1.3" in content:
                        self.log_passed("SSL", f"Modern TLS protocols configured in {config_file}")
                    elif "TLSv1.2" in content:
                        self.log_passed("SSL", f"Secure TLS protocols configured in {config_file}")
                    else:
                        self.log_issue("SSL", f"Outdated TLS protocols in {config_file}")
                        
                # Check for security headers
                security_headers = [
                    "Strict-Transport-Security",
                    "X-Frame-Options",
                    "X-Content-Type-Options"
                ]
                
                missing_headers = []
                for header in security_headers:
                    if header not in content:
                        missing_headers.append(header)
                        
                if missing_headers:
                    self.log_warning("SSL", f"Missing security headers in {config_file}: {', '.join(missing_headers)}")
                else:
                    self.log_passed("SSL", f"All security headers present in {config_file}")

    def generate_report(self):
        """Generate security audit report"""
        print("\n" + "="*60)
        print("🛡️  OPULON SECURITY AUDIT REPORT")
        print("="*60)
        
        # Summary
        total_issues = len(self.issues)
        total_warnings = len(self.warnings)
        total_passed = len(self.passed)
        
        print(f"\n📊 SUMMARY:")
        print(f"   ✅ Passed: {total_passed}")
        print(f"   ⚠️  Warnings: {total_warnings}")
        print(f"   ❌ Issues: {total_issues}")
        
        # Security Score
        total_checks = total_issues + total_warnings + total_passed
        if total_checks > 0:
            score = ((total_passed + (total_warnings * 0.5)) / total_checks) * 100
            print(f"   🎯 Security Score: {score:.1f}%")
            
            if score >= 90:
                print("   🟢 EXCELLENT - Production ready!")
            elif score >= 75:
                print("   🟡 GOOD - Minor improvements needed")
            elif score >= 60:
                print("   🟠 FAIR - Several issues to address")
            else:
                print("   🔴 POOR - Major security concerns!")
        
        # Detailed Issues
        if self.issues:
            print(f"\n❌ CRITICAL ISSUES ({len(self.issues)}):")
            for i, issue in enumerate(self.issues, 1):
                print(f"   {i}. [{issue['category']}] {issue['message']}")
                
        if self.warnings:
            print(f"\n⚠️  WARNINGS ({len(self.warnings)}):")
            for i, warning in enumerate(self.warnings, 1):
                print(f"   {i}. [{warning['category']}] {warning['message']}")
                
        if self.passed:
            print(f"\n✅ SECURITY MEASURES IN PLACE ({len(self.passed)}):")
            for i, passed in enumerate(self.passed, 1):
                print(f"   {i}. [{passed['category']}] {passed['message']}")
        
        print("\n" + "="*60)
        print("🔗 NEXT STEPS:")
        print("1. Address all critical issues before deployment")
        print("2. Review warnings and implement fixes where possible")
        print("3. Run this audit regularly (weekly recommended)")
        print("4. Monitor application logs for security events")
        print("5. Keep dependencies updated")
        print("="*60)
        
        return total_issues == 0

def main():
    print("🛡️  Starting Opulon Security Audit...")
    print("This may take a few minutes...\n")
    
    auditor = SecurityAuditor()
    
    # Run all security checks
    auditor.check_environment_files()
    auditor.check_docker_security()
    auditor.check_code_security()
    auditor.check_dependencies()
    auditor.check_ssl_configuration()
    
    # Generate report
    is_secure = auditor.generate_report()
    
    # Exit with appropriate code
    sys.exit(0 if is_secure else 1)

if __name__ == "__main__":
    main()