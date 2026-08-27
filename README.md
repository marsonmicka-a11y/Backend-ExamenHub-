# Exam Online — Backend

Backend de l'application de gestion d'examens en ligne (QCM), conforme au
cahier des charges *Examen final WEB 2*.

- **Runtime** : Node.js + Express + TypeScript
- **Base de données** : PostgreSQL, accès en SQL brut via `pg` (aucun ORM),
  requêtes systématiquement paramétrées (`$1, $2, ...`)
- **Authentification** : JWT (`Authorization: Bearer <token>`), mots de
  passe hachés avec bcrypt
- **Architecture** : Controller → Service → Repository → Model → Security

## Structure

```
exam-online-backend/
├── database/
│   ├── init.sql        # schéma complet (tables, contraintes, index)
│   └── seed.sql         # RG-01 : création du 1er compte admin
├── src/
│   ├── config/env.ts
│   ├── database/connection.ts   # pool pg + helper de transaction
│   ├── models/                  # interfaces TypeScript (1 fichier/entité)
│   ├── repositories/            # SQL brut paramétré (1 fichier/entité)
│   ├── services/                 # logique métier / règles de gestion
│   ├── controllers/             # handlers Express
│   ├── routes/                  # définition des routes imposées
│   ├── security/                # JWT + middlewares auth/role
│   ├── middlewares/error.middleware.ts  # ApiError + format {"message":...}
│   └── app.ts                   # point d'entrée
├── docker-compose.yml   # PostgreSQL en conteneur dédié
├── .env.example
└── package.json
```

## Démarrage rapide (avec Docker)

```bash
cp .env.example .env
docker compose up -d          # démarre Postgres et exécute init.sql + seed.sql automatiquement
npm install
npm run dev                    # http://localhost:4000
```

Compte administrateur créé par défaut (`database/seed.sql`) :
- email : `admin@example.com`
- mot de passe : `Admin123!`

⚠️ À changer immédiatement en production (modifiez `seed.sql` avant le
premier démarrage, ou changez le mot de passe via votre propre procédure).

## Démarrage sans Docker (Postgres déjà installé)

```bash
cp .env.example .env      # adaptez DB_HOST/DB_USER/DB_PASSWORD/DB_NAME si besoin
psql -h <host> -U <user> -d <db> -f database/init.sql
psql -h <host> -U <user> -d <db> -f database/seed.sql
npm install
npm run dev
```

## Scripts npm

| Commande        | Description                                  |
|------------------|-----------------------------------------------|
| `npm run dev`    | Démarre en mode développement (ts-node-dev)  |
| `npm run build`  | Compile en JavaScript dans `dist/`           |
| `npm start`      | Démarre la version compilée (`dist/app.js`)  |

## Routes API

### Publique
- `POST /api/auth/login`

### Administrateur (JWT + rôle admin)
- `GET/POST /api/students`, `PUT/DELETE /api/students/:id`
- `GET/POST /api/courses`, `PUT/DELETE /api/courses/:id`
- `GET/POST /api/exams`, `GET/PUT/DELETE /api/exams/:id`
- `GET/POST /api/exams/:id/questions`, `PUT/DELETE /api/questions/:id`
- `GET /api/exams/:id/results`

### Étudiant (JWT + rôle student)
- `GET /api/my/exams`
- `GET /api/my/exams/:id`
- `POST /api/my/exams/:id/submit`
- `GET /api/my/results`

## Règles de gestion implémentées

Toutes les règles RG-01 à RG-13 du cahier des charges sont appliquées côté
serveur (voir commentaires dans `src/services/*.ts` et `database/init.sql`),
notamment :
- RG-02 (unicité de tentative) : contrainte `UNIQUE(student_id, exam_id)`
  en base **et** vérification explicite dans `exam.service.ts`.
- RG-04 (2 à 6 choix, exactement 1 correct) : validée dans
  `question.service.ts` avant toute écriture.
- RG-06 (notation) : calculée exclusivement dans `exam.service.ts`, à
  partir des seuls `choiceId` transmis par le client.
- RG-07 : les endpoints étudiant ne renvoient jamais `is_correct`
  (voir `PublicChoice` / `toPublicChoice`).
- RG-08 (verrouillage) : `question.service.ts` refuse toute création /
  modification / suppression de question dès qu'un examen a une
  tentative enregistrée.
- RG-09 : `course.service.ts` et `exam.service.ts` vérifient l'absence
  d'examens / tentatives avant toute suppression (409 sinon).
- RG-13 : toutes les erreurs passent par `errorMiddleware` et renvoient
  `{"message": "..."}` avec le code HTTP approprié.

Le seuil de réussite (admis / non admis) est fixé à 50 % du score maximum
dans `result.service.ts` (constante `PASS_THRESHOLD_RATIO`, ajustable —
le cahier des charges ne précise pas de barème).

## Tests effectués

L'ensemble du parcours a été testé de bout en bout avec une instance
PostgreSQL réelle : login (succès / mauvais mot de passe / compte
désactivé), création cours/étudiant/examen/question, validations RG-04,
passage d'examen masquant les bonnes réponses (RG-07), soumission avec
notation serveur, refus de double soumission (RG-02), verrouillage de
l'éditeur de questions (RG-08), refus de suppression cours/examen liés
(RG-09), et formats d'erreur (400/401/403/404/409) conformes à RG-13.
