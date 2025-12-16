from sqlalchemy.orm import Session
from fastapi import Request
from typing import Optional
import json
from ..models.audit_log import AuditLog, AuditAction
from ..models.user import User

class AuditLogger:
    def __init__(self, db: Session):
        self.db = db
    
    def log(
        self,
        action: AuditAction,
        resource_type: str,
        description: str,
        user: Optional[User] = None,
        resource_id: Optional[str] = None,
        details: Optional[dict] = None,
        request: Optional[Request] = None
    ):
        """Log an audit event"""
        
        # Get IP and user agent from request
        ip_address = None
        user_agent = None
        
        if request:
            ip_address = request.client.host if request.client else None
            user_agent = request.headers.get("user-agent")
        
        # Create audit log entry
        audit_log = AuditLog(
            user_id=user.id if user else None,
            action=action,
            resource_type=resource_type,
            resource_id=str(resource_id) if resource_id else None,
            description=description,
            details=json.dumps(details) if details else None,
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        self.db.add(audit_log)
        self.db.commit()
        return audit_log

# Helper functions for common audit events
def log_user_action(db: Session, user: User, action: AuditAction, description: str, request: Request = None, details: dict = None):
    """Log user-related actions"""
    logger = AuditLogger(db)
    return logger.log(action, "user", description, user, user.id, details, request)

def log_admin_action(db: Session, admin: User, action: AuditAction, resource_type: str, resource_id: str, description: str, request: Request = None, details: dict = None):
    """Log admin actions"""
    logger = AuditLogger(db)
    return logger.log(action, resource_type, f"Admin {admin.email}: {description}", admin, resource_id, details, request)

def log_system_action(db: Session, action: AuditAction, resource_type: str, description: str, details: dict = None):
    """Log system actions"""
    logger = AuditLogger(db)
    return logger.log(action, resource_type, f"System: {description}", None, None, details, None)