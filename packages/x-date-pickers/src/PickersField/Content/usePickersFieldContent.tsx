import * as React from 'react';
import { usePickersFieldContext } from '../Root/PickersFieldProvider';
// TODO: Stop using those classes
import { PickersSectionElement, pickersSectionListClasses } from '../../PickersSectionList';

export function usePickersFieldContent(
  params: UsePickersFieldContent.Parameters,
): UsePickersFieldContent.ReturnValue {
  const { renderSection } = params;
  const { fieldResponse } = usePickersFieldContext();
  const rootRef = React.useRef<HTMLDivElement>(null);

  const getRoot = (methodName: string) => {
    if (!rootRef.current) {
      throw new Error(
        `MUI X: Cannot call sectionListRef.${methodName} before the mount of the component.`,
      );
    }

    return rootRef.current;
  };

  React.useImperativeHandle(fieldResponse.sectionListRef, () => ({
    getRoot() {
      return getRoot('getRoot');
    },
    getSectionContainer(index) {
      const root = getRoot('getSectionContainer');
      return root.querySelector<HTMLSpanElement>(
        `.${pickersSectionListClasses.section}[data-sectionindex="${index}"]`,
      )!;
    },
    getSectionContent(index) {
      const root = getRoot('getSectionContent');
      return root.querySelector<HTMLSpanElement>(
        `.${pickersSectionListClasses.section}[data-sectionindex="${index}"] .${pickersSectionListClasses.sectionContent}`,
      )!;
    },
    getSectionIndexFromDOMElement(element) {
      const root = getRoot('getSectionIndexFromDOMElement');

      if (element == null || !root.contains(element)) {
        return null;
      }

      let sectionContainer: HTMLSpanElement | null = null;
      if (element.classList.contains(pickersSectionListClasses.section)) {
        sectionContainer = element as HTMLSpanElement;
      } else if (element.classList.contains(pickersSectionListClasses.sectionContent)) {
        sectionContainer = element.parentElement as HTMLSpanElement;
      }

      if (sectionContainer == null) {
        return null;
      }

      return Number(sectionContainer.dataset.sectionindex);
    },
  }));

  const contentEditableValue = fieldResponse.elements
    .map(({ content, before, after }) => `${before.children}${content.children}${after.children}`)
    .join('');

  const getContentProps: UsePickersFieldContent.ReturnValue['getContentProps'] = React.useCallback(
    (externalProps = {}) => {
      return {
        ref: rootRef,
        suppressContentEditableWarning: true,
        children: fieldResponse.contentEditable
          ? contentEditableValue
          : fieldResponse.elements.map((element, elementIndex) => (
              <React.Fragment key={elementIndex}>{renderSection(element)}</React.Fragment>
            )),
      };
    },
    [contentEditableValue, fieldResponse.contentEditable, fieldResponse.elements, renderSection],
  );

  return React.useMemo(() => ({ getContentProps }), [getContentProps]);
}

export namespace UsePickersFieldContent {
  export interface Parameters {
    renderSection: (section: PickersSectionElement) => React.ReactNode;
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
