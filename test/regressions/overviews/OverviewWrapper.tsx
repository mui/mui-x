import * as React from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import { BrandingProvider } from '@mui/internal-core-docs/branding';

// The overview composites from `docs/src/modules/components/overview/...` are
// authored to run inside the Next.js docs site and read the docs branding
// theme (`palette.gradients`, `palette.primaryDark`, `applyDarkStyles`, ...).
// This wrapper supplies it so they render in the regression fixture.
//
// PickersCustomization re-skins `StaticDateRangePicker` with a custom theme
// that shrinks day cells to 32px while the picker's internal slide-transition
// container is still sized for the default 36px cells. In the live docs the
// surrounding chrome absorbs the 64px difference, but in the isolated fixture
// it leaks out and shifts the day grid one column to the right of the weekday
// header. Pin the inner containers to fit-content so the day grid lines up
// with the header again.
export default function OverviewWrapper({ children }: { children: React.ReactNode }) {
  return (
    <BrandingProvider mode="light">
      <GlobalStyles
        styles={{
          '.MuiDayCalendar-slideTransition, .MuiDayCalendar-monthContainer': {
            width: 'fit-content',
            minWidth: 0,
          },
        }}
      />
      {children}
    </BrandingProvider>
  );
}
