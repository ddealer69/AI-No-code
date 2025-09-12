AI-No-code

## Overview
This project was created using Vite + React + TypeScript and styled primarily with Tailwind CSS utility classes plus a small layer of custom component utilities.

## Responsive Design Improvements (Sept 2025)
The application has been refactored to provide a significantly better mobile and tablet experience:

### Key Changes
- Header: Added sticky top bar, mobile hamburger toggle for user actions, truncated long usernames, improved touch targets.
- Dashboard: Responsive padding, stacked filters on narrow screens, cards and sections reflow gracefully, typography scales with breakpoints, added horizontal overflow protection for wide content blocks.
- AI Use Cases Page: Cards adapt to single-column on small screens, reduced padding, compressed tag and meta text, accessible focus states.
- Current State Analysis Wizard: Layout stacks below large breakpoint, sticky score panel on desktop only, buttons wrap, reduced padding on small screens.
- Utility CSS: Added safe area padding helper, horizontal scroll helper, and text line-clamp utilities.

### Follow-up Opportunities
- Implement dynamic code splitting to reduce initial JS bundle (>500kB build warning currently).
- Audit future state wizard components (`futureSteps/`) for further micro-optimizations.
- Add automated visual regression tests (e.g., Playwright) for key breakpoints.
- Consider theming (dark mode) with Tailwind's media or class strategy.

### Testing Notes
Run a production build (npm run build) and test layouts at 320px, 375px, 768px, 1024px, and 1440px widths. No TypeScript errors were introduced with these changes.

## Scripts
- dev: Start development server
- build: Production build
- preview: Preview production build locally

## License
Internal / Unspecified – add a license if distributing.
