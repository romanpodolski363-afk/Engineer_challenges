# Coding Conventions

Follow these conventions for all code in this repository.

## SQL

- Use `snake_case` for all table and column names
- All tables must include `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- All tables must include `created_at TIMESTAMPTZ DEFAULT NOW()`
- Use parameterised queries (`$1`, `$2`, …) — NEVER string interpolation in SQL
- All INSERT and DELETE statements must include `RETURNING *`
- Use `JOIN` when the foreign key column is `NOT NULL`
- Name all constraints explicitly: `CONSTRAINT fk_<table>_<column> FOREIGN KEY …`
- Name unique constraints: `CONSTRAINT uq_<table>_<columns> UNIQUE (…)`

## Server Actions

- Return `{ success: true }` on success
- Return `{ error: "<descriptive message>" }` on failure
- NEVER throw errors from server actions — always return error objects
- Validate ALL input with Zod `.safeParse()` before any database operation
- Always call `revalidatePath()` after successful mutations

## TypeScript

- Use the type definitions from `lib/types.ts` — do not redefine
- Use the `query<T>()` generic for typed query results
