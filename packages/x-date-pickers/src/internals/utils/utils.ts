import * as React from 'react';

/* Use it instead of .includes method for IE support */
export function arrayIncludes<T>(array: T[] | readonly T[], itemOrItems: T | T[]) {
  if (Array.isArray(itemOrItems)) {
    return itemOrItems.every((item) => array.indexOf(item) !== -1);
  }

  return array.indexOf(itemOrItems) !== -1;
}

export const onSpaceOrEnter =
  (
    innerFn: (ev: React.MouseEvent<any> | React.KeyboardEvent<any>) => void,
    externalEvent?: (event: React.KeyboardEvent<any>) => void,
  ) =>
  (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      innerFn(event);

      // prevent any side effects
      event.preventDefault();
      event.stopPropagation();
    }

    if (externalEvent) {
      externalEvent(event);
    }
  };

export const executeInTheNextEventLoopTick = (fn: () => void) => {
  setTimeout(fn, 0);
};

// https://www.abeautifulsite.net/posts/finding-the-active-element-in-a-shadow-root/
export const getActiveElement = (root: Document | ShadowRoot = document): Element | null => {
  const activeEl = root.activeElement;

  if (!activeEl) {
    return null;
  }

  if (activeEl.shadowRoot) {
    return getActiveElement(activeEl.shadowRoot);
  }

  return activeEl;
};

export const DEFAULT_DESKTOP_MODE_MEDIA_QUERY = '@media (hover: hover) and (pointer: fine)';
