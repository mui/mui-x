import * as React from 'react';

/**
 * Internal utility hook to handle a the focus and scroll in a list of options / cells:
 * - Focuses the first tabbable child on mount if `props.focusOnMount` is `true`.
 * - Scrolls the scroller to center the focused element if it is not visible.
 * @param {useScrollableList.Parameters} parameters The parameters of the hook.
 * @returns {useScrollableList.ReturnValue} The return value of the hook.
 */
export function useScrollableList(
  parameters: useScrollableList.Parameters,
): useScrollableList.ReturnValue {
  const { focusOnMount = false } = parameters;
  const initialFocusOnMount = React.useRef(focusOnMount);
  const scrollerRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (scrollerRef.current === null) {
      return;
    }

    const tabbableButton = scrollerRef.current.querySelector<HTMLElement>('[tabindex="0"]');
    if (!tabbableButton) {
      return;
    }

    if (initialFocusOnMount.current) {
      tabbableButton.focus();
    }

    // Taken from useScroll in x-data-grid, but vertically centered
    const offsetHeight = tabbableButton.offsetHeight;
    const offsetTop = tabbableButton.offsetTop;

    const clientHeight = scrollerRef.current.clientHeight;
    const scrollTop = scrollerRef.current.scrollTop;

    const elementBottom = offsetTop + offsetHeight;

    if (offsetHeight > clientHeight || offsetTop < scrollTop) {
      // Button already visible
      return;
    }

    scrollerRef.current.scrollTop = elementBottom - clientHeight / 2 - offsetHeight / 2;
  }, []);

  return { scrollerRef };
}

export namespace useScrollableList {
  export interface Parameters {
    /**
     * If `true`, the first tabbable children inside this component will be focused on mount.
     * Warning: If several components are rendered at the same time with focusOnMount={true}, the result might be unpredictable.
     * @default false
     */
    focusOnMount?: boolean;
  }

  export interface ReturnValue {
    /**
     * The ref that must be attached to the scroller element.
     */
    scrollerRef: React.RefObject<HTMLElement | null>;
  }
}
