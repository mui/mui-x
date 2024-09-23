import * as React from 'react';
import { usePickersFieldSectionContext } from '../Section/PickersFieldSectionProvider';

export function usePickersFieldSectionSeparator(
  params: UsePickersFieldSectionSeparator.Parameters,
): UsePickersFieldSectionSeparator.ReturnValue {
  const { position } = params;
  const { element } = usePickersFieldSectionContext();

  const getSectionSeparatorProps: UsePickersFieldSectionSeparator.ReturnValue['getSectionSeparatorProps'] =
    React.useCallback(() => {
      return position === 'before' ? element.before : element.after;
    }, [element.before, element.after, position]);

  // TODO: Memoize?
  return { getSectionSeparatorProps };
}

export namespace UsePickersFieldSectionSeparator {
  export interface Parameters {
    position: 'before' | 'after';
  }

  export interface ReturnValue {
    /**
     * Resolver for the section separator element's props.
     * @param externalProps custom props for the section separator element
     * @returns props that should be spread on the section separator element
     */
    getSectionSeparatorProps: (
      externalProps?: React.ComponentPropsWithRef<'span'>,
    ) => React.ComponentPropsWithRef<'span'>;
  }
}
