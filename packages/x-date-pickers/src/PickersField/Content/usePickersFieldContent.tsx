import * as React from 'react';
import { mergeReactProps } from '@base_ui/react/utils/mergeReactProps';
import { visuallyHidden } from '@base_ui/react/utils/visuallyHidden';
import { usePickersFieldContext } from '../Root/PickersFieldProvider';

export function usePickersFieldContent(
  params: UsePickersFieldContent.Parameters,
): UsePickersFieldContent.ReturnValue {
  const { renderSection } = params;
  const {
    elements,
    contentEditable,
    propsForwardedToContent,
    propsForwardedToHiddenInput,
    sectionListRef,
    sectionsRef,
    sectionsContentRef,
  } = usePickersFieldContext();

  // TODO: Clean the registration of the refs.
  // We should be able to drop `sectionListRef` and pass a param to `useField` instead.
  const contentRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(sectionListRef, () => ({
    // TODO: Rename "getContent" to match the component name in PickersField instead of the one in PickersSectionList.
    getRoot() {
      if (!contentRef.current) {
        throw new Error(
          `MUI X: Cannot call sectionListRef.getRoot before the mount of the component.`,
        );
      }

      return contentRef.current;
    },
    // TODO: Rename "getSection" to match the component name in PickersField instead of the one in PickersSectionList.
    getSectionContainer(index) {
      const sectionRef = sectionsRef.current[index];
      if (!sectionRef) {
        throw new Error(
          `MUI X: Cannot call sectionListRef.getSectionContainer before the mount of the component.`,
        );
      }

      return sectionRef;
    },
    getSectionContent(index) {
      const sectionContentRef = sectionsContentRef.current[index];
      if (!contentRef.current) {
        throw new Error(
          `MUI X: Cannot call sectionListRef.getSectionContent before the mount of the component.`,
        );
      }

      return sectionContentRef;
    },
    getSectionIndexFromDOMElement(element) {
      if (!contentRef.current) {
        throw new Error(
          `MUI X: Cannot call sectionListRef.getSectionIndexFromDOMElement before the mount of the component.`,
        );
      }

      if (element == null || !contentRef.current.contains(element)) {
        return null;
      }

      const matchingSectionIndex = Object.keys(sectionsRef.current).find((sectionIndex) =>
        sectionsRef.current[sectionIndex].contains(element),
      );
      if (matchingSectionIndex == null) {
        return null;
      }

      return Number(matchingSectionIndex);
    },
  }));

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
     * @param externalProps custom props for the Content element
     * @returns props that should be spread on the Content element
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
