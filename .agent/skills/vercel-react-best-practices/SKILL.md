# Vercel React Best Practices

## Status: CRITICAL (Next.js 15 + React 19)

Focus on eliminating waterfalls, optimizing bundle size, and leveraging modern React 19 / Next.js 15 features.

### 1. Eliminating Waterfalls (CRITICAL)
- **Parallelize independent operations:** Use `Promise.all()` for fetches that don't depend on each other.
- **Defer awaits:** Move `await` into specific branches where the data is actually needed to avoid blocking earlier rendering.
- **Suspense Boundaries:** Use `<Suspense>` to stream slow-loading content without blocking the main layout.

### 2. Bundle Size Optimization
- **Avoid Barrel Files:** Import components directly from their file paths to avoid pulling in entire libraries.
- **Dynamic Imports:** Use `next/dynamic` for heavy components that aren't immediately visible (e.g., Modals, Charts).
- **Conditional Loading:** Only load modules when the specific feature is activated.

### 3. Server-Side Performance
- **React.cache():** Use it for per-request data deduplication if not using `fetch` (which is auto-deduped).
- **Minimal Serialization:** Minimize the amount of data passed from Server Components to Client Components. Only pass what is strictly necessary.
- **Non-blocking logic:** Use `after()` (in Next.js 15) for tasks that don't need to block the response (logging, analytics).

### 4. Re-render Optimization
- **Functional setState:** Use the functional form to avoid stable callback issues.
- **Lazy state init:** Pass a function to `useState(() => init())` for expensive initial values.
- **Transitions:** Use `startTransition` or `useTransition` for non-urgent UI updates to keep the main thread responsive.

### 5. Next.js 15 Specifics
- **Fetch Caching:** Remember that `fetch` is no longer cached by default in Next.js 15. Use `{ cache: 'force-cache' }` or `revalidateTag` explicitly.
- **Server Actions:** Use for all mutations. Ensure they are secure and handle errors gracefully.
