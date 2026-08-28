INSERT INTO users (email, password_hash, role, full_name, active)
VALUES (
    'admin@example.com',
    crypt('Admin123!', gen_salt('bf')),
    'admin',
    'Administrateur',
    TRUE
)
ON CONFLICT (email) DO NOTHING;
