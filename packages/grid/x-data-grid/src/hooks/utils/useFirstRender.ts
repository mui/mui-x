import * as React from 'react';

export const useFirstRender = (callback: () => void) => {
  const isFirstRender = React.useRef(true);

  if (isFirstRender.current) {
    isFirstRender.current = false;
    callback();
  }
};
