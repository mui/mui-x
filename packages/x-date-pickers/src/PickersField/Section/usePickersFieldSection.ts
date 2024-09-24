import * as React from 'react';
import { mergeReactProps } from '@base_ui/react/utils/mergeReactProps';
import { PickersFieldSectionProvider } from './PickersFieldSectionProvider';
import { usePickersFieldContext } from '../Root/PickersFieldProvider';

export function usePickersFieldSection(
  params: UsePickersFieldSection.Parameters,
): UsePickersFieldSection.ReturnValue {
  const { index } = params;
  const { elements, registerSectionRef } = usePickersFieldContext();
  const element = elements[index];

  const getSectionProps: UsePickersFieldSection.ReturnValue['getSectionProps'] = React.useCallback(
    (externalProps = {}) =>
      mergeReactProps(externalProps, {
        ...element.container,
        ref: (elementRef) => registerSectionRef(index, elementRef),
      }),
    [element.container, registerSectionRef, index],
  );

  const contextValue = React.useMemo<PickersFieldSectionProvider.ContextValue>(
    () => ({ element, index }),
    [element, index],
  );

  return React.useMemo(() => ({ getSectionProps, contextValue }), [getSectionProps, contextValue]);
}

export namespace UsePickersFieldSection {
  export interface Parameters {
    index: number;
  }

  export interface ReturnValue {
    /**
     * Resolver for the section element's props.
     * @param {React.ComponentPropsWithRef<'span'>} externalProps custom props for the section element
     * @returns {React.ComponentPropsWithRef<'span'>} props that should be spread on the section element
     */
    getSectionProps: (
      externalProps?: React.ComponentPropsWithRef<'span'>,
    ) => React.ComponentPropsWithRef<'span'>;
    contextValue: PickersFieldSectionProvider.ContextValue;
  }
}
