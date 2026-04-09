import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createRenderer, act, fireEvent } from '@mui/internal-test-utils';
import { FieldRef, FieldSectionType } from '@mui/x-date-pickers/models';
import { pickersSectionListClasses } from '@mui/x-date-pickers/PickersSectionList';
import { pickersInputBaseClasses } from '@mui/x-date-pickers/PickersTextField';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { expectFieldValue } from './assertions';

interface BuildFieldInteractionsParams<P extends {}> {
  render: ReturnType<typeof createRenderer>['render'];
  Component: React.FunctionComponent<P>;
}

export type FieldSectionSelector = (
  selectedSection: FieldSectionType | undefined,
  index?: 'first' | 'last',
) => Promise<void>;

export type FieldPressCharacter = (character: string) => Promise<void>;

export interface BuildFieldInteractionsResponse<P extends {}> {
  renderWithProps: (
    props: P,
    config?: {
      hook?: (props: P) => Record<string, any>;
      componentFamily?: 'picker' | 'field';
      direction?: 'rtl' | 'ltr';
    },
  ) => ReturnType<ReturnType<typeof createRenderer>['render']> & {
    /**
     * Helper that simplifies selecting a section of the date field.
     * @param {FieldSectionType | undefined} selectedSection The requested section to select.
     * @param {'first' | 'last'} index The index of the section to select.
     */
    selectSection: FieldSectionSelector;
    getSectionsContainer: () => HTMLDivElement;
    /**
     * Returns the contentEditable DOM node of the requested section.
     * @param {number} sectionIndex The index of the requested section.
     * @returns {HTMLSpanElement} The contentEditable DOM node of the requested section.
     */
    getSection: (sectionIndex: number) => HTMLSpanElement;
    /**
     * Returns the contentEditable DOM node of the active section.
     * @param {number | undefined} sectionIndex If defined, asserts that the active section is the expected one.
     * @returns {HTMLSpanElement} The contentEditable DOM node of the active section.
     */
    getActiveSection: (sectionIndex: number | undefined) => HTMLSpanElement;
    /**
     * Press a character on the currently focused section using user-event.
     * The section must be focused first via `selectSection`.
     * @param {string} character The character to press. Navigation keys like
     *   `ArrowUp`, `Backspace`, `Delete` are mapped to their user-event
     *   curly-brace form (`{ArrowUp}`); other strings are typed as text.
     */
    pressKey: FieldPressCharacter;
    getHiddenInput: () => HTMLInputElement;
  };
  testFieldKeyPress: (
    params: P & {
      key: string;
      expectedValue: string;
      selectedSection?: FieldSectionType;
    },
  ) => Promise<void>;
  testFieldChange: (
    params: P & {
      keyStrokes: { value: string; expected: string }[];
      selectedSection?: FieldSectionType;
    },
  ) => Promise<void>;
}

const RTL_THEME = createTheme({
  direction: 'rtl',
});

export const buildFieldInteractions = <P extends {}>({
  render,
  Component,
}: BuildFieldInteractionsParams<P>): BuildFieldInteractionsResponse<P> => {
  const renderWithProps: BuildFieldInteractionsResponse<P>['renderWithProps'] = (
    props,
    { hook, componentFamily = 'field', direction = 'ltr' } = {},
  ) => {
    let fieldRef: React.RefObject<FieldRef<PickerValue> | null> = { current: null };

    function WrappedComponent(propsFromRender: any) {
      fieldRef = React.useRef<FieldRef<PickerValue>>(null);
      const hookResult = hook?.(propsFromRender);

      const allProps = {
        ...propsFromRender,
        ...hookResult,
      } as any;

      if (componentFamily === 'field') {
        allProps.fieldRef = fieldRef;
      } else {
        if (!allProps.slotProps) {
          allProps.slotProps = {};
        }

        if (!allProps.slotProps.field) {
          allProps.slotProps.field = {};
        }

        const hasMultipleInputs =
          // @ts-ignore
          Component.render.name.includes('Range') &&
          allProps.slots?.field?.fieldType === 'multi-input';
        if (hasMultipleInputs) {
          allProps.slotProps.field.startFieldRef = fieldRef;
        } else {
          allProps.slotProps.field.fieldRef = fieldRef;
        }
      }

      if (direction === 'rtl') {
        return (
          <ThemeProvider theme={RTL_THEME}>
            <Component {...(allProps as P)} />
          </ThemeProvider>
        );
      }

      return <Component {...(allProps as P)} />;
    }

    const result = render(<WrappedComponent {...(props as any)} />);

    const getSectionsContainer = () => {
      return document.querySelector<HTMLDivElement>(`.${pickersSectionListClasses.root}`)!;
    };

    const getHiddenInput = () => {
      return document.querySelector('input')!;
    };

    const getSection = (sectionIndex: number) =>
      getSectionsContainer().querySelector<HTMLSpanElement>(
        `.${pickersSectionListClasses.section}[data-sectionindex="${sectionIndex}"] .${pickersSectionListClasses.sectionContent}`,
      )!;

    const selectSection: FieldSectionSelector = async (selectedSection, index = 'first') => {
      let sectionIndexToSelect: number;
      if (selectedSection === undefined) {
        sectionIndexToSelect = 0;
      } else {
        const sections = fieldRef.current!.getSections();
        sectionIndexToSelect = sections[index === 'first' ? 'findIndex' : 'findLastIndex'](
          (section) => section.type === selectedSection,
        );
      }

      await act(async () => {
        fieldRef.current!.setSelectedSections(sectionIndexToSelect);
      });

      await act(async () => {
        getSection(sectionIndexToSelect).focus();
      });
    };

    const getActiveSection = (sectionIndex: number | undefined) => {
      const activeElement = document.activeElement! as HTMLSpanElement;

      if (sectionIndex !== undefined) {
        const activeSectionIndex = activeElement.parentElement!.dataset.sectionindex;
        expect(activeSectionIndex).to.equal(
          sectionIndex.toString(),
          `The active section should be ${sectionIndex.toString()} instead of ${activeSectionIndex}`,
        );
      }

      return activeElement;
    };

    const pressKey: FieldPressCharacter = async (key) => {
      if (
        [
          'ArrowUp',
          'ArrowDown',
          'PageUp',
          'PageDown',
          'Home',
          'End',
          'Delete',
          'Backspace',
          'ArrowLeft',
          'ArrowRight',
        ].includes(key)
      ) {
        await result.user.keyboard(`{${key}}`);
      } else if (key === ' ') {
        await result.user.keyboard('{Space}');
      } else if (key === '') {
        // The legacy sync helper passed an empty string to fire
        // `input({ textContent: '' })`, which cleared the section. The
        // equivalent user-event gesture is pressing Backspace.
        await result.user.keyboard('{Backspace}');
      } else {
        await result.user.keyboard(key);
      }
    };

    return {
      selectSection,
      getActiveSection,
      getSection,
      pressKey,
      getHiddenInput,
      getSectionsContainer,
      ...result,
    };
  };

  const testFieldKeyPress: BuildFieldInteractionsResponse<P>['testFieldKeyPress'] = async ({
    key,
    expectedValue,
    selectedSection,
    ...props
  }) => {
    const response = renderWithProps({
      ...props,
    } as any);
    await response.selectSection(selectedSection);
    await response.pressKey(key);
    expectFieldValue(response.getSectionsContainer(), expectedValue);
    response.unmount();
  };

  const testFieldChange: BuildFieldInteractionsResponse<P>['testFieldChange'] = async ({
    keyStrokes,
    selectedSection,
    ...props
  }) => {
    const response = renderWithProps({
      ...props,
    } as any);
    await response.selectSection(selectedSection);
    for (const keyStroke of keyStrokes) {
      // eslint-disable-next-line no-await-in-loop
      await response.pressKey(keyStroke.value);
      expectFieldValue(
        response.getSectionsContainer(),
        keyStroke.expected,
        (props as any).shouldRespectLeadingZeros ? 'singleDigit' : undefined,
      );
    }
    response.unmount();
  };

  return {
    testFieldKeyPress,
    testFieldChange,
    renderWithProps,
  };
};

export const cleanText = (text: string, specialCase?: 'singleDigit' | 'RTL') => {
  let clean = text.replace(/\u202f/g, ' ');
  clean = text.replace(/\u200b/g, '');
  switch (specialCase) {
    case 'singleDigit':
      return clean.replace(/\u200e/g, '');
    case 'RTL':
      return clean.replace(/\u2066|\u2067|\u2068|\u2069/g, '');
    default:
      return clean;
  }
};

export const getCleanedSelectedContent = () => {
  // In JSDOM env, document.getSelection() does not work on inputs.
  if (document.activeElement?.tagName === 'INPUT') {
    const input = document.activeElement as HTMLInputElement;
    return cleanText(input.value.slice(input.selectionStart ?? 0, input.selectionEnd ?? 0));
  }

  return cleanText(document.getSelection()?.toString() ?? '');
};

export const setValueOnFieldInput = (value: string, index = 0) => {
  const hiddenInput = document.querySelectorAll<HTMLDivElement>(
    `.${pickersInputBaseClasses.input}`,
  )[index];

  fireEvent.change(hiddenInput, { target: { value } });
};

export const getAllFieldInputRoot = () =>
  document.querySelectorAll<HTMLDivElement>(`.${pickersInputBaseClasses.root}`);

export const getFieldInputRoot = (index = 0) => getAllFieldInputRoot()[index];

export const getFieldSectionsContainer = (index = 0) =>
  document.querySelectorAll<HTMLDivElement>(`.${pickersSectionListClasses.root}`)[index];
