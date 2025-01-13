import * as React from 'react';
import { PickerValidDate } from '../../../../../models';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';

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

export namespace useCellList {
  export interface PublicParameters {
    /**
     * If `true`, the first tabbable children inside this component will be focused on mount.
     * @default false
     */
    focusOnMount?: boolean;
  }

  export interface Parameters extends PublicParameters {
    section: 'day' | 'month' | 'year';
    value: PickerValidDate;
  }

  export interface ReturnValue {
    scrollerRef: React.RefObject<HTMLElement | null>;
  }
}
