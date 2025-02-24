import * as React from 'react';
import { PickerValidDate } from '../../../../../models';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';
import { BaseCalendarSection } from './types';

/**
 * Internal utility hook to handle a list of cells:
 * - Registers the section in the Calendar Root.
 * - Focuses the first tabbable child on mount if `props.focusOnMount` is `true`.
 * - Scrolls the scroller to center the focused element if it is not visible.
 * @param {useCellList.Parameters} parameters The parameters of the hook.
 * @returns {useCellList.ReturnValue} The return value of the hook.
 */
export function useCellList(parameters: useCellList.Parameters): useCellList.ReturnValue {
  const { section, value, focusOnMount = false } = parameters;
  const baseRootContext = useBaseCalendarRootContext();

  const registerSection = baseRootContext.registerSection;
  React.useEffect(() => {
    return registerSection({ type: section, value });
  }, [registerSection, value, section]);

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

namespace useCellList {
  export interface PublicParameters {
    /**
     * If `true`, the first tabbable children inside this component will be focused on mount.
     * @default false
     */
    focusOnMount?: boolean;
  }

  export interface Parameters extends PublicParameters {
    /**
     * The type of the section.
     */
    section: BaseCalendarSection;
    /**
     * The value of the section.
     */
    value: PickerValidDate;
  }

  export interface ReturnValue {
    /**
     * The ref that must be attached to the scroller element.
     */
    scrollerRef: React.RefObject<HTMLElement | null>;
  }
}
