-- ============================================================
-- Script d'initialisation des données (RG-01)
-- Pas d'auto-inscription : le tout premier compte administrateur
-- est créé exclusivement par ce script.
--
-- Identifiants par défaut (à changer immédiatement après la
-- première connexion, ou à adapter avant exécution) :
--   email    : admin@example.com
--   password : Admin123!
--
-- Le mot de passe est haché ici avec pgcrypto (crypt/gen_salt('bf')),
-- qui produit un hash bcrypt standard ($2a$...), donc parfaitement
-- vérifiable côté Node avec bcrypt.compare().
-- ============================================================

INSERT INTO users (email, password_hash, role, full_name, active)
VALUES (
    'admin@example.com',
    crypt('Admin123!', gen_salt('bf')),
    'admin',
    'Administrateur',
    TRUE
)
ON CONFLICT (email) DO NOTHING;
