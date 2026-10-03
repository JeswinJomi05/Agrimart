# Agrimart Wayanad

A responsive React landing page recreated from the supplied `1.png` design, using original artwork from `assets/`.

## Development

- `npm install`
- `npm run dev` — development server
- `npm run build` — TypeScript checks and production output in `dist/`
- `npm run lint` — ESLint checks
- `npm run preview` — preview the production build

## Structure

The project uses React 19, TypeScript and Vite 8. It is a client-side application; no backend, database, authentication or product API is present.

- `src/main.tsx`: React entry point.
- `src/App.tsx`: semantic header, navigation, hero, product category grid, About section and native dialogs. React state controls the mobile menu and selected dialog.
- `src/App.css`: layout, interactive states and responsive styles. Desktop proportions follow the 1440px hero artwork and the scaled reference; container-relative units prevent the layout from expanding beyond its maximum width.
- `src/index.css`: base typography, reset, focus styles and reduced-motion support.
- `assets/`: original logo, hero landscape, six transparent product images and an additional tractor photograph. Assets are imported directly so Vite bundles and fingerprints them.
- `public/images/store.png`: storefront photo extracted from `1.png`, because an original storefront image was not supplied in `assets/`.
- `index.html`: page metadata and entry point.
- `public/agrimart.svg`: favicon.
- `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`: tooling configuration.

## UI

All headings, descriptions, category labels and controls are live HTML. The hero uses the original 1440×500 landscape with a CSS gradient for text contrast. The six category images use the original transparent PNGs.

Desktop includes all six categories in one row. At 600px and below, the navigation collapses into a menu, the hero text reflows, categories use three columns and the About section stacks. At 360px and below, categories use two columns.

Home, Products and About navigate to sections. Category cards and View All Products open browsable dialogs. Services and Contact show information dialogs. Native dialogs provide keyboard focus containment and Escape dismissal; clicking outside a dialog also dismisses it. A skip link, visible focus indicators and reduced-motion styles support accessibility.

The reference supplies no phone number or detailed inventory. Call Us opens the contact dialog until a verified phone number can be configured. Category dialogs provide general product information without inventing prices or availability.

## Validation

The production build and ESLint pass. Visual browser verification was unavailable because no browser was connected. The storefront image remains limited to the resolution of the reference screenshot.
