import * as React from 'react';
import { BrandingProvider } from '@mui/internal-core-docs/branding';

// The overview composites from `docs/src/modules/components/overview/...` are
// authored to run inside the Next.js docs site and read the docs branding
// theme (`palette.gradients`, `palette.primaryDark`, `applyDarkStyles`, ...).
// This wrapper supplies it so they render in the regression fixture.
export default function OverviewWrapper({ children }: { children: React.ReactNode }) {
  return <BrandingProvider mode="light">{children}</BrandingProvider>;
}
