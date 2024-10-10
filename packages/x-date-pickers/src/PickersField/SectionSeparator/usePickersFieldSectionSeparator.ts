import * as React from 'react';
import { mergeReactProps } from '@base_ui/react/utils/mergeReactProps';
import { usePickersFieldSectionContext } from '../Section/PickersFieldSectionProvider';

export function usePickersFieldSectionSeparator(
  params: UsePickersFieldSectionSeparator.Parameters,
): UsePickersFieldSectionSeparator.ReturnValue {
  const { position } = params;
  const { element } = usePickersFieldSectionContext();

  const getSectionSeparatorProps: UsePickersFieldSectionSeparator.ReturnValue['getSectionSeparatorProps'] =
    React.useCallback(
      (externalProps) =>
        mergeReactProps(externalProps, position === 'before' ? element.before : element.after),
      [element.before, element.after, position],
    );

  return React.useMemo(() => ({ getSectionSeparatorProps }), [getSectionSeparatorProps]);
}

export namespace UsePickersFieldSectionSeparator {
  export interface Parameters {
    position: 'before' | 'after';
  }

  export interface ReturnValue {
    /**
     * Resolver for the section separator element's props.
     * @param {React.ComponentPropsWithRef<'span'>} externalProps custom props for the section separator element
     * @returns {React.ComponentPropsWithRef<'span'>} props that should be spread on the section separator element
     */
    getSectionSeparatorProps: (
      externalProps?: React.ComponentPropsWithRef<'span'>,
    ) => React.ComponentPropsWithRef<'span'>;
  }
}
