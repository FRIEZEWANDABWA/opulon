-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(20) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(50),
    description TEXT NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_id ON audit_logs(resource_id);

-- Insert sample audit logs for testing
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, description, ip_address) VALUES
(1, 'login', 'user', '1', 'Admin user logged in', '127.0.0.1'),
(1, 'create', 'user', '2', 'Created new user account', '127.0.0.1'),
(1, 'update', 'product', '1', 'Updated product information', '127.0.0.1'),
(NULL, 'system', 'database', NULL, 'System backup completed', NULL),
(1, 'delete', 'user', '3', 'Deleted inactive user account', '127.0.0.1');