import * as React from 'react';

export const useTreeViewVirtualScroller = () => {
  const rootRef = React.useRef<HTMLDivElement>(null);

  const getRootProps = () => ({ ref: rootRef });

  return {
    getRootProps,
  };
};
