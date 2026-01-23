# Web Design & Frontend Excellence

## Goal: 100% Fidelity to Stitch & Premium Aesthetics

These guidelines ensure every component feels handcrafted, premium, and aligns with the high standards of the project.

### 1. Typography & Hierarchy
- **Characterful Choices:** Avoid generic system fonts. Use distinctive pairings (e.g., a bold display font for headers and a highly readable serif/sans for body).
- **Rhythmic Spacing:** Use a consistent 4px/8px grid. Ensure generous white space to allow the "premium" feel to breathe.

### 2. Modern Visual Details
- **Surfaces & Depth:** Use "Glassmorphism" (backdrop-filter) sparingly for overlays. Apply subtle gradients and grain textures instead of flat solid colors.
- **Accents:** Use dominant corporate colors with sharp, high-contrast accents.
- **Borders & Shapes:** For Super Aguilares, use the "ticket cutout" (bordes troquelados) effect for receipts and cards, as per Stitch designs.

### 3. Motion & Micro-interactions
- **Staggered Reveals:** Use `animation-delay` for page loads to create a "bloom" effect of content appearing.
- **Feedback:** Every interaction (hover, click, drag) must have a subtle, smooth motion response.
- **Spring Physics:** Use spring-based animations (Framer Motion / Motion) for a more natural, premium feel.

### 4. Component Integrity
- **No Placeholders:** Never use generic or broken images. Use high-resolution fallbacks or generated assets.
- **Refinement:** Zoom in on details—custom scrollbars, focus rings, and selection colors should all be themed.

### 5. Implementation (Tailwind)
- Use arbitrary values `[...]` only when necessary; prefer a well-defined `tailwind.config.ts`.
- Maintain a clean HTML structure with semantic tags for accessibility.
