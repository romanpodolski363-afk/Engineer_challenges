# Challenge Tasks

Complete these 4 tasks in order. Run `npm test` to check your progress.

Read `CONVENTIONS.md` before you start — your code must follow the project's
established patterns.

---

## Task 1 — Schema Design (~3 min)

**File:** `db/seed.sql`

Create the `deployments` table following the requirements in the TODO comment.
Then populate the `models` table with **at least 3 current AI models** from any
of the listed providers. Use real, current model identifiers as they appear in
each provider's API documentation.

After modifying seed.sql, apply your changes:

```bash
npm run seed:reset
```

---

## Task 2 — Data Query (~4 min)

**File:** `src/app/dashboard/page.tsx`

Write the SQL query to fetch models with their provider information. Check
`lib/db.ts` for the query helper, and `lib/types.ts` for the return type.

---

## Task 3 — Server Action (~5 min)

**File:** `src/actions/models.ts`

Complete the `addModel` server action. Check `lib/validations.ts` for the Zod
schema, `lib/db.ts` for the query helper, and `CONVENTIONS.md` for the error
handling and INSERT patterns.

---

## Task 4 — Security Bug Fix (~3 min)

**File:** `src/app/api/models/[id]/route.ts`

Find and fix the security vulnerability in the DELETE handler. There are
**two issues** to fix. Add a comment explaining what was wrong.
