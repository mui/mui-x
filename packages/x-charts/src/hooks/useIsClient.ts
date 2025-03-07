'use client';
import * as React from 'react';

/** Returns true after this hook runs the client.
 *
 * Basically a implementation of Option 2 of this gist: https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85#option-2-lazily-show-component-with-uselayouteffect. */
export function useIsClient() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
