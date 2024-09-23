import * as React from 'react';
import { PickersFieldSectionProvider } from './PickersFieldSectionProvider';
import { usePickersFieldContext } from '../Root/PickersFieldProvider';

export function usePickersFieldSection(
  params: UsePickersFieldSection.Parameters,
): UsePickersFieldSection.ReturnValue {
  const { section } = params;
  const { fieldResponse } = usePickersFieldContext();

  const element = fieldResponse.elements[section];

  const getSectionProps: UsePickersFieldSection.ReturnValue['getSectionProps'] = React.useCallback(
    (externalProps = {}) => {
      return {
        ...element.container,
        children: externalProps.children,
      };
    },
    [element.container],
  );

  // TODO: Memoize?
  const contextValue: PickersFieldSectionProvider.ContextValue = { element };

  // TODO: Memoize?
  return { getSectionProps, contextValue };
}

export namespace UsePickersFieldSection {
  export interface Parameters {
    section: number;
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
