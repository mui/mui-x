import * as React from 'react';
import { PickerValidDate } from '../../../../../models';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';

export function useCellList(parameters: useCellList.Parameters): useCellList.ReturnValue {
  const { section, value } = parameters;
  const baseRootContext = useBaseCalendarRootContext();

  const registerSection = baseRootContext.registerSection;
  React.useEffect(() => {
    return registerSection({ type: section, value });
  }, [registerSection, value, section]);

  const scrollerRef = React.useRef<HTMLElement>(null);
  React.useEffect(
    () => {
      // TODO: Make sure this behavior remain consistent once auto focus is implemented.
      if (/* autoFocus || */ scrollerRef.current === null) {
        return;
      }
      const tabbableButton = scrollerRef.current.querySelector<HTMLElement>('[tabindex="0"]');
      if (!tabbableButton) {
        return;
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
    },
    [
      /* autoFocus */
    ],
  );

  return { scrollerRef };
}

export namespace useCellList {
  export interface Parameters {
    section: 'month' | 'year';
    value: PickerValidDate;
  }

  export interface ReturnValue {
    scrollerRef: React.RefObject<HTMLElement | null>;
  }
}
