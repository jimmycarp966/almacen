# Responsive & Mobile-First Design

## Goal: Perfect UI across all devices (Mobile, Tablet, Desktop)

### 1. Breakpoint Strategy
- **Mobile-First:** Write base styles for mobile and use `md:`, `lg:` for larger screens. 
- **Content-Driven:** Breakpoints should be defined by where the content starts looking broken, not just standard device widths.

### 2. Fluid Layouts
- **Clamp:** Use `clamp(min, preferred, max)` for fluid typography and spacing that scales smoothly.
- **Relative Units:** Favor `rem`, `em`, `%`, `vw`, and `vh` over fixed `px`.
- **Dynamic Viewport Height:** Use `100dvh` for full-screen mobile layouts to avoid browser UI overlap.

### 3. Layout Patterns
- **Flexbox/Grid:** Use `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))` for automatic card grids as a default.
- **Container Queries:** (Future-proof) Use `@container` for components that need to change layout based on their parent's width, not the whole screen.

### 4. Touch & Interaction
- **Minimum Target Size:** Ensure all interactive elements are at least `44x44px` on mobile.
- **Scroll Hijacking:** Avoid it. Respect native mobile scrolling behaviors.
- **No Hover Dependencies:** Ensure all functionality is accessible on touch devices where hover states don't exist.

### 5. Images & Media
- **Object-Fit:** Use `object-cover` or `object-contain` for consistent image aspect ratios.
- **Responsive Images:** Use proper `sizes` attribute with Next.js `Image` component.
