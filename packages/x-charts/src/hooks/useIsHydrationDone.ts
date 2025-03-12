'use client';
import * as React from 'react';

/** Returns true after hydration is done on the client.
 *
 * Basically a implementation of Option 2 of this gist: https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85#option-2-lazily-show-component-with-uselayouteffect. */
export function useIsHydrationDone() {
  const [isHydrationDone, setIsHydrationDone] = React.useState(false);

  React.useEffect(() => {
    setIsHydrationDone(true);
  }, []);

  return isHydrationDone;
}
