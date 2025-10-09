-- Create database schema and initial data
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    bvn VARCHAR(11) UNIQUE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
    status VARCHAR(30) DEFAULT 'pending_verification' CHECK (status IN ('active', 'inactive', 'suspended', 'pending_verification')),
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_bvn_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    phone_verification_code VARCHAR(10),
    email_verification_expires TIMESTAMP,
    phone_verification_expires TIMESTAMP,
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    last_login_at TIMESTAMP,
    last_login_ip VARCHAR(50),
    preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create meters table
CREATE TABLE IF NOT EXISTS meters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meter_number VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('prepaid', 'postpaid')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'disconnected')),
    disco VARCHAR(30) NOT NULL CHECK (disco IN ('ikeja_electric', 'eko_disco', 'abuja_disco', 'phed', 'kaedc', 'aedc', 'bedc', 'eedc', 'ibedc', 'jedc', 'kedco')),
    tariff_code VARCHAR(100) NOT NULL,
    current_balance DECIMAL(10,2) DEFAULT 0,
    last_recharge_amount DECIMAL(10,2) DEFAULT 0,
    last_recharge_date TIMESTAMP,
    total_consumption DECIMAL(10,2) DEFAULT 0,
    average_monthly_usage DECIMAL(10,2) DEFAULT 0,
    meter_data JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMP,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference VARCHAR(100) UNIQUE NOT NULL,
    gateway_reference VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    fee DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'successful', 'failed', 'cancelled', 'refunded')),
    method VARCHAR(20) NOT NULL CHECK (method IN ('card', 'bank_transfer', 'ussd', 'wallet')),
    gateway VARCHAR(20) NOT NULL CHECK (gateway IN ('flutterwave', 'interswitch')),
    type VARCHAR(20) NOT NULL CHECK (type IN ('prepaid_recharge', 'postpaid_bill')),
    description VARCHAR(255),
    channel VARCHAR(100),
    currency VARCHAR(50),
    ip_address VARCHAR(50),
    gateway_response JSONB,
    metadata JSONB,
    paid_at TIMESTAMP,
    failed_at TIMESTAMP,
    failure_reason VARCHAR(255),
    is_refunded BOOLEAN DEFAULT FALSE,
    refunded_amount DECIMAL(10,2) DEFAULT 0,
    refunded_at TIMESTAMP,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    meter_id UUID NOT NULL REFERENCES meters(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tokens table
CREATE TABLE IF NOT EXISTS tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_code VARCHAR(20) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    units DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'generated' CHECK (status IN ('generated', 'used', 'expired', 'invalid')),
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    disco_response JSONB,
    disco_reference VARCHAR(100),
    instructions TEXT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    meter_id UUID NOT NULL REFERENCES meters(id) ON DELETE CASCADE,
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'sms', 'push', 'in_app')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'read')),
    category VARCHAR(30) NOT NULL CHECK (category IN ('payment_success', 'payment_failed', 'token_generated', 'low_balance', 'bill_reminder', 'account_verification', 'security_alert', 'promotion', 'system_update')),
    recipient VARCHAR(255),
    data JSONB,
    metadata JSONB,
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    read_at TIMESTAMP,
    failed_at TIMESTAMP,
    failure_reason VARCHAR(255),
    external_id VARCHAR(100),
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_bvn ON users(bvn);
CREATE INDEX IF NOT EXISTS idx_meters_number ON meters(meter_number);
CREATE INDEX IF NOT EXISTS idx_meters_user_status ON meters(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference);
CREATE INDEX IF NOT EXISTS idx_payments_user_status ON payments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_meter_status ON payments(meter_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_ref ON payments(gateway, gateway_reference);
CREATE INDEX IF NOT EXISTS idx_tokens_code ON tokens(token_code);
CREATE INDEX IF NOT EXISTS idx_tokens_meter_status ON tokens(meter_id, status);
CREATE INDEX IF NOT EXISTS idx_tokens_payment ON tokens(payment_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_status ON notifications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_type_status ON notifications(type, status);
CREATE INDEX IF NOT EXISTS idx_notifications_category ON notifications(category);

-- Create super admin user
INSERT INTO users (
    first_name, 
    last_name, 
    email, 
    phone, 
    password, 
    role, 
    status, 
    is_email_verified, 
    is_phone_verified
) VALUES (
    'Super', 
    'Admin', 
    'admin@powerpay.ng', 
    '+2348000000000', 
    '$2b$12$LQv3c1yqBwEHxE6FHrX3lOJBfp/5v2Y8i2kqIXz1bqU4wZV9s4K1u', -- SuperSecurePassword123!
    'super_admin', 
    'active', 
    true, 
    true
) ON CONFLICT (email) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meters_updated_at BEFORE UPDATE ON meters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tokens_updated_at BEFORE UPDATE ON tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();