-- apps/api/reset.sql
-- Demo Reset Script
-- WARNING: This will delete all data and restore the pristine demo state

-- 1. Truncate all tables
TRUNCATE TABLE check_ins CASCADE;
TRUNCATE TABLE goals CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE thrust_areas CASCADE;
TRUNCATE TABLE departments CASCADE;
TRUNCATE TABLE organizations CASCADE;

-- 2. Reload the seed data
-- (In PostgreSQL, you can use \i seed.sql if running from psql, 
-- or just execute the contents of seed.sql programmatically)
