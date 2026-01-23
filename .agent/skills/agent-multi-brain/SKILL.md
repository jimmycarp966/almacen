# Agent Multi-Brain: Gemini & Opus Collaboration

## Status: ACTIVE (Pair-Programming Optimization)

This skill optimizes the workflow when multiple agents (Antigravity, Gemini, Opus) are working on the same codebase.

### 1. Cross-Agent Communication
- **Documentation First:** Update `ARCHITECTURE.md` and `ARCHITECTURE_SUMMARY.md` after any major change so other agents can pick up the context instantly.
- **Traceability:** Leave clear, concise comments on why a specific complex logic was implemented (not just what it does).

### 2. Systematic Debugging
- **Phase 1: Investigation:** Gather logs, check network requests, and isolate the smallest possible reproduction case.
- **Phase 2: Pattern Analysis:** Compare the current issue with known Next.js/Supabase common pitfalls.
- **Phase 3: Hypothesis:** State the hypothesis clearly before changing code.
- **Phase 4: Verification:** Always run `npm run build` or relevant tests after a fix.

### 3. Research & Verification
- **Browser Research:** Use the `agent-browser` (or `read_url_content`) to verify latest documentation (Next.js 15, Tailwind, Supabase) before recommending outdated patterns.
- **Dependency Checks:** Check `package.json` versions before proposing new library features.

### 4. Code Quality
- **Review before pushing:** Act as a "code reviewer" for the other agent's likely output.
- **Linter Fidelity:** Respect `.eslintrc` and `.prettierrc` settings strictly.
