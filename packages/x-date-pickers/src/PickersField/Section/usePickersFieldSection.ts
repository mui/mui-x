import * as React from 'react';
import { PickersFieldSectionProvider } from './PickersFieldSectionProvider';
import { usePickersFieldContext } from '../Root/PickersFieldProvider';

export function usePickersFieldSection(
  params: UsePickersFieldSection.Parameters,
): UsePickersFieldSection.ReturnValue {
  const { index } = params;
  const { elements, registerSectionRef } = usePickersFieldContext();

  const element = elements[index];

  const getSectionProps: UsePickersFieldSection.ReturnValue['getSectionProps'] = React.useCallback(
    (externalProps = {}) => {
      return {
        ...element.container,
        ref: (elementRef) => registerSectionRef(index, elementRef),
        children: externalProps.children,
      };
    },
    [element.container, registerSectionRef, index],
  );

  // TODO: Memoize?
  const contextValue: PickersFieldSectionProvider.ContextValue = { element, index };

  // TODO: Memoize?
  return { getSectionProps, contextValue };
}

export namespace UsePickersFieldSection {
  export interface Parameters {
    index: number;
  }

  export interface ReturnValue {
    /**
     * Resolver for the section element's props.
     * @param externalProps custom props for the section element
     * @returns props that should be spread on the section element
     */
    getSectionProps: (
      externalProps?: React.ComponentPropsWithRef<'span'>,
    ) => React.ComponentPropsWithRef<'span'>;
    contextValue: PickersFieldSectionProvider.ContextValue;
  }
}
