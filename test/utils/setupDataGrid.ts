import { afterEach } from 'vitest';
import { unstable_resetCleanupTracking } from '@mui/x-data-grid';

// Only registered by the Data Grid projects. Loading `@mui/x-data-grid` evaluates the whole
// grid source graph (~650 modules plus `@mui/material`), so keeping it out of the shared
// `setupVitest.ts` avoids pulling it into every other project's browser page.
// `@mui/x-data-grid-pro` re-exports `@mui/x-data-grid/hooks`, so it shares this exact
// registry and does not need a second reset.
afterEach(() => {
  unstable_resetCleanupTracking();
});
