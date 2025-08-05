CREATE TABLE modules_roles (
    id SERIAL PRIMARY KEY,
    module_id INT REFERENCES modules(id) ON DELETE CASCADE,
    role_id INT REFERENCES staff_roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
)