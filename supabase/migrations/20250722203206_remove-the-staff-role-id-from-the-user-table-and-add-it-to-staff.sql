ALTER TABLE users DROP COLUMN staff_role_id;

ALTER TABLE staff ADD COLUMN staff_role_id INTEGER REFERENCES staff_roles(id);