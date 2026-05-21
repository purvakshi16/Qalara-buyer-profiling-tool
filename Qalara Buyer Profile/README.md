# Qalara Buyer Profiling Tool

Internal web app for Qalara Account Managers to create Apollo-enriched buyer profiles, review/edit them, and save them to Supabase Postgres.

## Phase 1 Includes

- React + Vite + Tailwind frontend
- Supabase email/password login and signup
- Spring Boot 3 backend with Supabase JWT validation
- Buyer CRUD with soft-delete-ready schema
- Apollo people + organization enrichment
- Placeholder service boundaries for Firecrawl, ImportYeti, OpenAI, and HubSpot
- Supabase migration for `profiles` and `buyers`
- Swagger UI at `/swagger-ui`

## Local Setup

1. Apply `database/migrations/001_initial_schema.sql` in the Supabase SQL editor.
2. Copy `backend/.env.example` to `backend/.env` and fill values.
3. Copy `frontend/.env.example` to `frontend/.env` and fill values.
4. Run the backend:

```bash
cd backend
mvn spring-boot:run
```

5. Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend defaults to `http://localhost:5173`; backend defaults to `http://localhost:8080`.

## GitHub Codespaces Setup

You can run this project in GitHub Codespaces without installing Node, npm, Java, Maven, or Git locally.

1. Push this repo to GitHub.
2. Open the repo on GitHub.
3. Choose `Code` -> `Codespaces` -> `Create codespace on main`.
4. Add Codespaces secrets for:

```text
DATABASE_URL
DATABASE_USERNAME
DATABASE_PASSWORD
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
APOLLO_API_KEY
```

5. In the Codespaces terminal, run:

```bash
cd backend
mvn spring-boot:run
```

6. Open a second terminal:

```bash
cd frontend
npm run dev
```

Codespaces will forward ports `5173` and `8080`.

## GitHub Actions

The workflow at `.github/workflows/build.yml` verifies the backend compile and frontend build on pushes and pull requests to `main`.

## Notes

- Email is required for enrichment and saving.
- Duplicate buyer emails return a conflict so the UI can show a friendly message.
- Phase 1 treats every logged-in user as an AM and shows only profiles created by that user.
- HubSpot sync and re-enrichment buttons are visible on the detail page but disabled until later phases.
