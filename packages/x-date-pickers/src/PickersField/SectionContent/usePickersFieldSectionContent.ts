import * as React from 'react';
import { usePickersFieldSectionContext } from '../Section/PickersFieldSectionProvider';
import { usePickersFieldContext } from '../Root/PickersFieldProvider';

export function usePickersFieldSectionContent(
  params: UsePickersFieldSectionContent.Parameters,
): UsePickersFieldSectionContent.ReturnValue {
  const { index, element } = usePickersFieldSectionContext();
  const { registerSectionContentRef } = usePickersFieldContext();

  const getSectionContentProps: UsePickersFieldSectionContent.ReturnValue['getSectionContentProps'] =
    React.useCallback(() => {
      return {
        ...element.content,
        ref: (elementRef) => registerSectionContentRef(index, elementRef),
        suppressContentEditableWarning: true,
      };
    }, [element.content, index, registerSectionContentRef]);

  // TODO: Memoize?
  return { getSectionContentProps };
}

export namespace UsePickersFieldSectionContent {
  export interface Parameters {}

  export interface ReturnValue {
    /**
     * Resolver for the section content element's props.
     * @param externalProps custom props for the section content element
     * @returns props that should be spread on the section content element
     */
    getSectionContentProps: (
      externalProps?: React.ComponentPropsWithRef<'span'>,
    ) => React.ComponentPropsWithRef<'span'>;
  }
}
