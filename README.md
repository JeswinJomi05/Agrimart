# Agrimart Wayanad

A React 19, TypeScript and Vite website with a full-width agricultural equipment catalog, native information dialogs and scroll animations.

## Development

```sh
npm install
npm run dev
npm run build
npm run lint
```

## Components and styles

- `src/components/ui/testimonial-v2.tsx`: reusable testimonial section adapted from the supplied scrolling-column component.
- `src/components/demo.tsx`: standalone demo with a section-scoped light/dark toggle.
- `src/lib/utils.ts`: shadcn-compatible `cn()` helper using clsx and tailwind-merge.
- `src/App.tsx`: website sections, catalog search/filter state and dialogs. The testimonial component replaces the former static review grid.
- `src/App.css`: website layout and responsive styles.
- `src/index.css`: Tailwind v4 theme/utilities, Agrimart color tokens and base styles. Preflight is omitted to preserve existing styling; legacy resets are in the base layer so component utilities work.
- `src/hooks/useScrollMotion.ts`: native-scroll progress and hero parallax.

The `@/` alias resolves to `src/` in both Vite and TypeScript. Therefore the project's `/components/ui` convention maps to `src/components/ui`, imported as `@/components/ui/...`. Keeping reusable UI here gives the shadcn CLI and developers a consistent destination and keeps it separate from page composition. `components.json` configures these aliases and the stylesheet location.

## Tailwind and shadcn setup

TypeScript was already installed. Tailwind v4 and its Vite plugin are now configured, alongside framer-motion, lucide-react, clsx and tailwind-merge. No context provider is required.

For a fresh copy without dependencies:

```sh
npm install framer-motion lucide-react clsx tailwind-merge
npm install -D tailwindcss @tailwindcss/vite
```

This project already has a manually configured shadcn structure. Add future components with:

```sh
npx shadcn@latest add button
```

For a separate unconfigured Vite project, use `npx shadcn@latest init` after setting up Tailwind and the `@/` alias. Running init again here is unnecessary.

Setup follows the official [Tailwind Vite guide](https://tailwindcss.com/docs/installation/using-vite) and [shadcn components.json configuration](https://ui.shadcn.com/docs/components-json).

## Testimonial integration

```tsx
import TestimonialsSection, { type Testimonial } from '@/components/ui/testimonial-v2'

const reviews: Testimonial[] = [
  { text: 'Your approved review text', name: 'Customer name', role: 'Equipment category', image: '/images/customer.jpg' },
]

<TestimonialsSection testimonials={reviews} sampleContent={false} />
```

Optional props: `id`, `title`, `description`, `sampleContent`, and `showThemeToggle`. All state is local. The default reviews are explicitly labeled illustrative copy with Unsplash stock portraits; replace them with approved customer feedback before publishing. Broken portraits are hidden without affecting the review text.

The component displays one animated column on mobile, two on medium screens, and three on large screens. Identical duplicated groups maintain a seamless loop. Hover pauses the columns; a keyboard-accessible pause/resume button preserves their current position. Offscreen and background-tab movement is suspended. Reduced-motion users get all reviews as static, unmasked cards without duplicate groups. Duplicate groups are hidden from screen readers. The optional dark theme is scoped to the section and does not change the rest of the site.

## Assets and contact details

Original logo, hero and equipment images are in `assets/`. The optimized tractor banner is `assets/field-banner.jpg`; the original is preserved. The storefront photo is `public/images/store.png`.

No backend, phone number, detailed inventory or verified customer reviews were supplied. Contact and category dialogs provide general information without inventing prices or availability.


### Interactive bento gallery

The reusable gallery lives in `src/components/ui/bento-gallery.tsx` and is integrated into the Inside Agrimart section with local showroom photos. `src/components/bento-gallery-demo.tsx` exports a standalone landscape demo using Unsplash images.

This project already supports TypeScript, Tailwind CSS, and the shadcn component structure. `@/components/ui` resolves to `src/components/ui`; styles and theme tokens live in `src/index.css`, with site styles in `src/App.css`. Keep reusable UI components in that folder so shadcn tooling and alias imports resolve consistently. No additional setup or dependency installation is required: `framer-motion`, `lucide-react`, and the `cn` utility are already available.

Pass `imageItems` (each with `id`, `title`, `desc`, `url`, and Tailwind `span` classes), `title`, and `description`. The component owns its selection and drag state and needs no context provider. The Inside Agrimart section uses `layout="grid"` to show all six photos in three columns on desktop, two on tablets, and one on phones. The default `layout="drag"` retains the two-row draggable bento layout for the standalone demo. Images open in a modal with keyboard focus containment, Escape dismissal, and focus restoration.
