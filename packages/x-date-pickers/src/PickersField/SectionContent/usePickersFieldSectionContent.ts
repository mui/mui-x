import * as React from 'react';
import { mergeReactProps } from '@base_ui/react/utils/mergeReactProps';
import { usePickersFieldSectionContext } from '../Section/PickersFieldSectionProvider';
import { usePickersFieldContext } from '../Root/PickersFieldProvider';

export function usePickersFieldSectionContent(): UsePickersFieldSectionContent.ReturnValue {
  const { index, element } = usePickersFieldSectionContext();
  const { registerSectionContentRef } = usePickersFieldContext();

  const getSectionContentProps: UsePickersFieldSectionContent.ReturnValue['getSectionContentProps'] =
    React.useCallback(
      (externalProps) =>
        mergeReactProps(externalProps, {
          ...element.content,
          ref: (elementRef) => registerSectionContentRef(index, elementRef),
          suppressContentEditableWarning: true,
        }),
      [element.content, index, registerSectionContentRef],
    );

  return React.useMemo(() => ({ getSectionContentProps }), [getSectionContentProps]);
}

export namespace UsePickersFieldSectionContent {
  export interface Parameters {}

  export interface ReturnValue {
    /**
     * Resolver for the section content element's props.
     * @param {React.ComponentPropsWithRef<'span'>} externalProps custom props for the section content element
     * @returns {React.ComponentPropsWithRef<'span'>} props that should be spread on the section content element
     */
    getSectionContentProps: (
      externalProps?: React.ComponentPropsWithRef<'span'>,
    ) => React.ComponentPropsWithRef<'span'>;
  }
}
