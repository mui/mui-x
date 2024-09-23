import * as React from 'react';
import { usePickersFieldContext } from '../Root/PickersFieldProvider';

export function usePickersFieldContent(
  params: UsePickersFieldContent.Parameters,
): UsePickersFieldContent.ReturnValue {
  const { renderSection } = params;
  const { elements, contentEditable, contentRef, propsForwardedToContent } =
    usePickersFieldContext();

  const contentEditableValue = elements
    .map(({ content, before, after }) => `${before.children}${content.children}${after.children}`)
    .join('');

  const getContentProps: UsePickersFieldContent.ReturnValue['getContentProps'] = React.useCallback(
    (externalProps = {}) => {
      return {
        ref: contentRef,
        suppressContentEditableWarning: true,
        contentEditable,
        role: 'group',
        children: contentEditable
          ? contentEditableValue
          : elements.map((_, elementIndex) => (
              <React.Fragment key={elementIndex}>{renderSection(elementIndex)}</React.Fragment>
            )),
        ...propsForwardedToContent,
      };
    },
    [
      contentEditableValue,
      contentEditable,
      elements,
      renderSection,
      contentRef,
      propsForwardedToContent,
    ],
  );

  return React.useMemo(() => ({ getContentProps }), [getContentProps]);
}

export namespace UsePickersFieldContent {
  export interface Parameters {
    renderSection: (section: number) => React.ReactNode;
  }

  export interface ReturnValue {
    /**
     * Resolver for the Content element's props.
     * @param externalProps custom props for the Content element
     * @returns props that should be spread on the Content element
     */
    getContentProps: (
      externalProps?: Omit<React.ComponentPropsWithRef<'div'>, 'children'>,
    ) => React.ComponentPropsWithRef<'div'>;
  }
}
