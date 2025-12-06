-- Initialize Opulon Database
-- This script runs when the PostgreSQL container starts

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert sample categories
INSERT INTO categories (name, description, is_active) VALUES
('Pharmaceuticals', 'Prescription and over-the-counter medications', true),
('Medical Supplies', 'Essential medical supplies and equipment', true),
('Vitamins & Supplements', 'Health supplements and vitamins', true),
('First Aid', 'First aid supplies and emergency medical items', true)
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, sku, stock_quantity, category_id, manufacturer, is_active) VALUES
('Aspirin 325mg', 'Pain reliever and fever reducer', 12.99, 'ASP-325-100', 150, 1, 'PharmaCorp', true),
('Digital Thermometer', 'Fast and accurate digital thermometer', 24.99, 'THERM-DIG-001', 75, 2, 'MedTech', true),
('Vitamin D3 1000IU', 'Essential vitamin D supplement', 18.99, 'VIT-D3-1000', 200, 3, 'HealthPlus', true),
('Bandage Roll 3"', 'Sterile gauze bandage roll', 8.99, 'BAND-3IN-001', 300, 4, 'MedSupply', true),
('Ibuprofen 200mg', 'Anti-inflammatory pain reliever', 15.99, 'IBU-200-100', 120, 1, 'PharmaCorp', true),
('Blood Pressure Monitor', 'Automatic digital blood pressure monitor', 89.99, 'BP-MON-001', 25, 2, 'MedTech', true)
ON CONFLICT (sku) DO NOTHING;

-- Create admin user (password: admin123)
INSERT INTO users (email, username, full_name, hashed_password, role, is_active, is_verified) VALUES
('admin@opulon.com', 'admin', 'System Administrator', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3L3jzjvG4i', 'superadmin', true, true)
ON CONFLICT (email) DO NOTHING;