# Supabase & Postgres Best Practices

## Goal: High-performance, Secure Data Management

### 1. Database Schema
- **Partial Indexes:** Use indexes with `WHERE` clauses for large tables (e.g., indexed only for `status = 'pending'`).
- **Data Types:** Use the most efficient types (e.g., `text` instead of `varchar(n)` in Postgres, `timestamptz` for all times).

### 2. Query Optimization
- **Selecting specific columns:** Never use `SELECT *`. Only fetch columns needed for the specific UI component.
- **Deduplication:** Leverage `React.cache` or server-side caching for repeated lookups within a single request.

### 3. Security (RLS)
- **Deny by Default:** Ensure every table has `row level security enabled`.
- **Granular Policies:** Create separate policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
- **UID Checks:** Always use `auth.uid()` to restrict data access to the authenticated owner.

### 4. Logic Placement
- **Server Actions:** Use Server Actions for complex logic that involves multiple DB operations.
- **Edge Functions:** Use only for logic that requires secrecy (API keys) or happens outside the main request/response cycle.
