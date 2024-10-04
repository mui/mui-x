import * as React from 'react';
import { mergeReactProps } from '@base_ui/react/utils/mergeReactProps';
import { visuallyHidden } from '@base_ui/react/utils/visuallyHidden';
import { usePickersFieldContext } from '../Root/PickersFieldProvider';

export function usePickersFieldContent(
  params: UsePickersFieldContent.Parameters,
): UsePickersFieldContent.ReturnValue {
  const { renderSection } = params;
  const { elements, contentEditable, propsForwardedToContent, propsForwardedToHiddenInput } =
    usePickersFieldContext();

  const contentEditableValue = elements
    .map(({ content, before, after }) => `${before.children}${content.children}${after.children}`)
    .join('');

  const getContentProps: UsePickersFieldContent.ReturnValue['getContentProps'] = React.useCallback(
    (externalProps) =>
      mergeReactProps(externalProps, {
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
      }),
    [
      contentEditableValue,
      contentEditable,
      elements,
      renderSection,
      contentRef,
      propsForwardedToContent,
    ],
  );

  const getInputProps: UsePickersFieldContent.ReturnValue['getInputProps'] = React.useCallback(
    (externalProps) =>
      mergeReactProps(externalProps, {
        tabIndex: -1,
        style: visuallyHidden,
        'aria-hidden': true,
        ...propsForwardedToHiddenInput,
      }),
    [propsForwardedToHiddenInput],
  );

  return React.useMemo(
    () => ({ getContentProps, getInputProps }),
    [getContentProps, getInputProps],
  );
}

export namespace UsePickersFieldContent {
  export interface Parameters {
    renderSection: (section: number) => React.ReactNode;
  }

  export interface ReturnValue {
    /**
     * Resolver for the Content element's props.
     * @param {Omit<React.ComponentPropsWithRef<'div'>, 'children'>} externalProps custom props for the Content element
     * @returns {React.ComponentPropsWithRef<'div'>} props that should be spread on the Content element
     */
    getContentProps: (
      externalProps?: Omit<React.ComponentPropsWithRef<'div'>, 'children'>,
    ) => React.ComponentPropsWithRef<'div'>;

    /**
     * Resolver for the input element's props.
     * @param {React.ComponentPropsWithRef<'input'>} externalProps custom props for the input element
     * @returns {React.ComponentPropsWithRef<'input'>} props that should be spread on the input element
     */
    getInputProps: (
      externalProps?: React.ComponentPropsWithRef<'input'>,
    ) => React.ComponentPropsWithRef<'input'>;
  }
}
