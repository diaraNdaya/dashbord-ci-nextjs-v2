# Page Titles Configuration

This directory contains the centralized configuration for page titles used throughout the application.

## Files

- `page-titles.ts` - Centralized page titles configuration
- `site.config.ts` - Site-wide configuration including metadata helper

## Maintaining Synchronization

To ensure consistency between page metadata and UI display, follow these steps when adding or modifying pages:

### 1. Update page-titles.ts

Add or modify the page title in the `PAGE_TITLES` object:

```typescript
export const PAGE_TITLES = {
  "/your-new-page": "Your New Page Title",
  // ... other pages
} as const;
```

### 2. Update page metadata

In your `page.tsx` file, use the same title in the metadata:

```typescript
export const metadata = metaObject("Your New Page Title");
```

### 3. For nested pages

If your page has a parent (like configuration pages), make sure to update the `getParentPath` function in `page-titles.ts` if needed.

## Usage

### In Components

Use the `usePageTitle` hook:

```typescript
import { usePageTitle } from "@/hooks/use-page-title";

function MyComponent() {
  const pageTitle = usePageTitle();
  return <h1>{pageTitle}</h1>;
}
```

### In Breadcrumbs

The `SidebarContentHeader` component automatically uses the centralized configuration to build breadcrumbs.

### Direct Access

```typescript
import { getPageTitle, buildBreadcrumbTrail } from "@/lib/config/page-titles";

const title = getPageTitle("/dashboard");
const breadcrumbs = buildBreadcrumbTrail("/configuration/categories");
```

## Benefits

1. **Single Source of Truth**: All page titles are defined in one place
2. **Type Safety**: TypeScript ensures consistency across the application
3. **Easy Maintenance**: Changes to page titles only need to be made in two places
4. **Automatic Breadcrumbs**: Breadcrumb navigation is automatically generated
5. **SEO Consistency**: Page titles match between metadata and UI display
