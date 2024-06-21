import * as React from 'react';

export const useTreeViewVirtualScroller = () => {
  const rootRef = React.useRef<HTMLUListElement>(null);
  const scrollbarRef = React.useRef<HTMLDivElement>(null);

  const getRootProps = () => ({ ref: rootRef });

  const getScrollbarProps = () => ({ ref: scrollbarRef });

  return {
    getRootProps,
    getScrollbarProps,
  };
};
