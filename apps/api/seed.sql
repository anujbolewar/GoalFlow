-- apps/api/seed.sql
-- Seed Data for Meridian Technologies Pvt. Ltd.

INSERT INTO organizations (id, name, created_at, updated_at) VALUES 
('org-1', 'Meridian Technologies Pvt. Ltd.', NOW(), NOW());

INSERT INTO departments (id, org_id, name, created_at, updated_at) VALUES 
('dept-sales', 'org-1', 'Sales', NOW(), NOW()),
('dept-ops', 'org-1', 'Operations', NOW(), NOW()),
('dept-eng', 'org-1', 'Engineering', NOW(), NOW()),
('dept-hr', 'org-1', 'HR', NOW(), NOW()),
('dept-fin', 'org-1', 'Finance', NOW(), NOW());

INSERT INTO thrust_areas (id, org_id, name, created_at, updated_at) VALUES 
('ta-1', 'org-1', 'Revenue Growth', NOW(), NOW()),
('ta-2', 'org-1', 'Cost Reduction', NOW(), NOW()),
('ta-3', 'org-1', 'Customer Experience', NOW(), NOW()),
('ta-4', 'org-1', 'People Development', NOW(), NOW()),
('ta-5', 'org-1', 'Innovation', NOW(), NOW());

-- Users (Passwords should be hashed in reality, assuming 'Demo@123' bcrypt hash here)
INSERT INTO users (id, org_id, dept_id, role, name, email, password_hash, manager_id, created_at, updated_at) VALUES 
-- Admin
('u-admin', 'org-1', 'dept-hr', 'ADMIN', 'Anita Desai', 'admin@goalflow.demo', '$2b$12$eImiTXuWVxfM37uY4JANjQ==', NULL, NOW(), NOW()),

-- Managers
('u-mgr-sales', 'org-1', 'dept-sales', 'MANAGER', 'Vikram Nair', 'manager@goalflow.demo', '$2b$12$eImiTXuWVxfM37uY4JANjQ==', NULL, NOW(), NOW()),
('u-mgr-ops', 'org-1', 'dept-ops', 'MANAGER', 'Sanjay Patel', 'sanjay.patel@goalflow.demo', '$2b$12$eImiTXuWVxfM37uY4JANjQ==', NULL, NOW(), NOW()),
('u-mgr-eng', 'org-1', 'dept-eng', 'MANAGER', 'Neha Gupta', 'neha.gupta@goalflow.demo', '$2b$12$eImiTXuWVxfM37uY4JANjQ==', NULL, NOW(), NOW()),

-- Employees
('u-emp-1', 'org-1', 'dept-sales', 'EMPLOYEE', 'Arjun Mehta', 'employee@goalflow.demo', '$2b$12$eImiTXuWVxfM37uY4JANjQ==', 'u-mgr-sales', NOW(), NOW()),
('u-emp-2', 'org-1', 'dept-sales', 'EMPLOYEE', 'Riya Kapoor', 'riya.kapoor@goalflow.demo', '$2b$12$eImiTXuWVxfM37uY4JANjQ==', 'u-mgr-sales', NOW(), NOW()),
('u-emp-3', 'org-1', 'dept-ops', 'EMPLOYEE', 'Priya Sharma', 'priya.sharma@goalflow.demo', '$2b$12$eImiTXuWVxfM37uY4JANjQ==', 'u-mgr-ops', NOW(), NOW()),
('u-emp-4', 'org-1', 'dept-eng', 'EMPLOYEE', 'Rahul Verma', 'rahul.verma@goalflow.demo', '$2b$12$eImiTXuWVxfM37uY4JANjQ==', 'u-mgr-eng', NOW(), NOW());

-- Goals
-- Priya Sharma (APPROVED+LOCKED with Q1 actuals)
INSERT INTO goals (id, user_id, thrust_area_id, title, uom, target, weightage, status, created_at, updated_at) VALUES
('g-1', 'u-emp-3', 'ta-2', 'Reduce Server Costs by 15%', 'PERCENTAGE', 15, 25, 'LOCKED', NOW(), NOW()),
('g-2', 'u-emp-3', 'ta-3', 'Improve SLA resolution to 99%', 'PERCENTAGE', 99, 25, 'LOCKED', NOW(), NOW()),
('g-3', 'u-emp-3', 'ta-3', 'Zero critical downtime incidents', 'ZERO_BASED', 0, 25, 'LOCKED', NOW(), NOW()),
('g-4', 'u-emp-3', 'ta-4', 'Complete AWS Certification', 'TIMELINE', 100, 25, 'LOCKED', NOW(), NOW());

-- Priya's Q1 Check-in
INSERT INTO check_ins (id, goal_id, quarter, actual, manager_comment, status, created_at, updated_at) VALUES
('ci-1', 'g-1', 'Q1', 5, 'Good progress on cost optimization. Keep it up.', 'APPROVED', NOW(), NOW());

-- Arjun Mehta (SUBMITTED)
INSERT INTO goals (id, user_id, thrust_area_id, title, uom, target, weightage, status, created_at, updated_at) VALUES
('g-5', 'u-emp-1', 'ta-1', 'Close $500k in Enterprise Deals', 'NUMERIC', 500000, 40, 'SUBMITTED', NOW(), NOW()),
('g-6', 'u-emp-1', 'ta-1', 'Onboard 10 new channel partners', 'NUMERIC', 10, 30, 'SUBMITTED', NOW(), NOW()),
('g-7', 'u-emp-1', 'ta-3', 'Conduct 20 customer success workshops', 'NUMERIC', 20, 30, 'SUBMITTED', NOW(), NOW());

-- Rahul Verma (DRAFT)
INSERT INTO goals (id, user_id, thrust_area_id, title, uom, target, weightage, status, created_at, updated_at) VALUES
('g-8', 'u-emp-4', 'ta-5', 'Migrate legacy auth to Azure AD', 'TIMELINE', 100, 60, 'DRAFT', NOW(), NOW());

-- Admin Shared Goal (Cascaded to Sales)
INSERT INTO goals (id, user_id, thrust_area_id, title, uom, target, weightage, status, is_cascaded, created_at, updated_at) VALUES
('g-9', 'u-emp-1', 'ta-1', 'Achieve 100% Department Quota Q3', 'PERCENTAGE', 100, 0, 'LOCKED', TRUE, NOW(), NOW()),
('g-10', 'u-emp-2', 'ta-1', 'Achieve 100% Department Quota Q3', 'PERCENTAGE', 100, 0, 'LOCKED', TRUE, NOW(), NOW());
