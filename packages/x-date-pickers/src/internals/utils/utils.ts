import { Theme } from '@mui/material/styles';
import { SxProps, SystemStyleObject } from '@mui/system';
import ownerDocument from '@mui/utils/ownerDocument';
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
const getActiveElementInternal = (root: Document | ShadowRoot = document): Element | null => {
  const activeEl = root.activeElement;

  if (!activeEl) {
    return null;
  }

  if (activeEl.shadowRoot) {
    return getActiveElementInternal(activeEl.shadowRoot);
  }

  return activeEl;
};

/**
 * Gets the currently active element within a given node's document.
 * This function traverses shadow DOM if necessary.
 * @param node - The node from which to get the active element.
 * @returns The currently active element, or null if none is found.
 */
export const getActiveElement = (node: Node | null | undefined): Element | null => {
  return getActiveElementInternal(ownerDocument(node));
};

/**
 * Gets the index of the focused list item in a given ul list element.
 *
 * @param {HTMLUListElement} listElement - The list element to search within.
 * @returns {number} The index of the focused list item, or -1 if none is focused.
 */
export const getFocusedListItemIndex = (listElement: HTMLUListElement): number => {
  const children = Array.from(listElement.children);
  return children.indexOf(getActiveElement(listElement)!);
};

export const DEFAULT_DESKTOP_MODE_MEDIA_QUERY = '@media (pointer: fine)';

export function mergeSx(
  ...sxProps: (SxProps<Theme> | undefined)[]
): ReadonlyArray<
  boolean | SystemStyleObject<Theme> | ((theme: Theme) => SystemStyleObject<Theme>)
> {
  return sxProps.reduce((acc, sxProp) => {
    if (Array.isArray(sxProp)) {
      acc.push(...sxProp);
    } else if (sxProp != null) {
      acc.push(sxProp);
    }

    return acc;
  }, [] as any);
}
