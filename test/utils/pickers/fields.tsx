import * as React from 'react';
import { expect } from 'chai';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createRenderer, screen, act, fireEvent } from '@mui/internal-test-utils';
import { FieldRef, FieldSection, FieldSectionType } from '@mui/x-date-pickers/models';
import { pickersSectionListClasses } from '@mui/x-date-pickers/PickersSectionList';
import { pickersInputBaseClasses } from '@mui/x-date-pickers/PickersTextField';
import userEvent from '@testing-library/user-event';
import { expectFieldValueV7, expectFieldValueV6 } from './assertions';

export const getTextbox = (): HTMLInputElement => screen.getByRole('textbox');

interface BuildFieldInteractionsParams<P extends {}> {
  // TODO: Export `Clock` from monorepo
  clock: ReturnType<typeof createRenderer>['clock'];
  render: ReturnType<typeof createRenderer>['render'];
  Component: React.FunctionComponent<P>;
}

export type FieldSectionSelector = (
  selectedSection: FieldSectionType | undefined,
  index?: 'first' | 'last',
) => Promise<void>;

export type FieldSectionSelectorSync = (
  selectedSection: FieldSectionType | undefined,
  index?: 'first' | 'last',
) => void;

export type FieldPressCharacter = (character: string) => Promise<void>;

export interface BuildFieldInteractionsResponse<P extends {}> {
  renderWithProps: (
    props: P & { enableAccessibleFieldDOMStructure: boolean },
    config?: {
      hook?: (props: P) => Record<string, any>;
      componentFamily?: 'picker' | 'field';
      direction?: 'rtl' | 'ltr';
    },
  ) => ReturnType<ReturnType<typeof createRenderer>['render']> & {
    selectSection: FieldSectionSelector;
    selectSectionSync: FieldSectionSelectorSync;
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
     * Press a character on the active section.
     * @param {number | undefined | null} sectionIndex If null presses on the fieldContainer, otherwise if defined asserts that the active section is the expected one
     * @param {string} character The character to press.
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
      skipV7?: boolean;
      finalCallback?: () => void;
    },
  ) => Promise<void>;
}

const RTL_THEME = createTheme({
  direction: 'rtl',
});

export const buildFieldInteractions = <P extends {}>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clock,
  render,
  Component,
}: BuildFieldInteractionsParams<P>): BuildFieldInteractionsResponse<P> => {
  const renderWithProps: BuildFieldInteractionsResponse<P>['renderWithProps'] = (
    props,
    { hook, componentFamily = 'field', direction = 'ltr' } = {},
  ) => {
    let fieldRef: React.RefObject<FieldRef<FieldSection>> = { current: null };

    function WrappedComponent(propsFromRender: any) {
      fieldRef = React.useRef<FieldRef<FieldSection>>(null);
      const hookResult = hook?.(propsFromRender);

      const allProps = {
        ...propsFromRender,
        ...hookResult,
      } as any;

      if (componentFamily === 'field') {
        allProps.unstableFieldRef = fieldRef;
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
          allProps.slots?.field?.fieldType !== 'single-input';
        if (hasMultipleInputs) {
          allProps.slotProps.field.unstableStartFieldRef = fieldRef;
        } else {
          allProps.slotProps.field.unstableFieldRef = fieldRef;
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
      if (!props.enableAccessibleFieldDOMStructure) {
        throw new Error('Cannot use fake input with v6 TextField');
      }

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

      if (!props.enableAccessibleFieldDOMStructure) {
        await act(async () => {
          getTextbox().focus();
        });
      }

      if (props.enableAccessibleFieldDOMStructure) {
        await act(async () => {
          getSection(sectionIndexToSelect).focus();
        });
      }
      await act(async () => {
        fieldRef.current!.setSelectedSections(sectionIndexToSelect);
      });
    };

    const selectSectionSync: FieldSectionSelectorSync = (selectedSection, index = 'first') => {
      let sectionIndexToSelect: number;
      if (selectedSection === undefined) {
        sectionIndexToSelect = 0;
      } else {
        const sections = fieldRef.current!.getSections();
        sectionIndexToSelect = sections[index === 'first' ? 'findIndex' : 'findLastIndex'](
          (section) => section.type === selectedSection,
        );
      }

      if (!props.enableAccessibleFieldDOMStructure) {
        act(() => {
          getTextbox().focus();
        });
      }

      if (props.enableAccessibleFieldDOMStructure) {
        act(() => {
          getSection(sectionIndexToSelect).focus();
        });
      }
      act(() => {
        fieldRef.current!.setSelectedSections(sectionIndexToSelect);
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
        await userEvent.keyboard(`{${key}}`);
      } else {
        await userEvent.keyboard(key);
      }
    };

    return {
      selectSection,
      selectSectionSync,
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
    // Test with v7 input
    const v7Response = renderWithProps({
      ...props,
      enableAccessibleFieldDOMStructure: true,
    } as any);
    await v7Response.selectSection(selectedSection);
    await v7Response.pressKey(key);
    expectFieldValueV7(v7Response.getSectionsContainer(), expectedValue);
    v7Response.unmount();

    // Test with v6 input
    const v6Response = renderWithProps({
      ...props,
      enableAccessibleFieldDOMStructure: false,
    } as any);
    await v6Response.selectSection(selectedSection);
    const input = getTextbox();
    await v6Response.pressKey(key);
    expectFieldValueV6(input, expectedValue);
    v6Response.unmount();
  };

  const testFieldChange: BuildFieldInteractionsResponse<P>['testFieldChange'] = async ({
    keyStrokes,
    selectedSection,
    skipV7,
    finalCallback,
    ...props
  }) => {
    let view: ReturnType<typeof renderWithProps>;
    if (!skipV7) {
      // Test with v7 input
      view = renderWithProps({
        ...props,
        enableAccessibleFieldDOMStructure: true,
      } as any);
      await view.selectSection(selectedSection);
      keyStrokes.forEach(async (keyStroke) => {
        if (keyStroke.value === ' ') {
          await view.user.keyboard('{Space}');
        } else if (keyStroke.value === '') {
          await view.user.keyboard('{Backspace}');
        } else {
          await view.user.keyboard(keyStroke.value);
        }
        expectFieldValueV7(
          view.getSectionsContainer(),
          keyStroke.expected,
          (props as any).shouldRespectLeadingZeros ? 'singleDigit' : undefined,
        );
      });
      view.unmount();
    }

    // Test with v6 input
    view = renderWithProps({
      ...props,
      enableAccessibleFieldDOMStructure: false,
    } as any);
    await view.selectSection(selectedSection);

    keyStrokes.forEach(async (keyStroke) => {
      if (keyStroke.value === ' ') {
        await view.user.keyboard('{Space}');
      } else if (keyStroke.value === '') {
        await view.user.keyboard('{Backspace}');
      } else {
        await view.user.keyboard(keyStroke.value);
      }
      const input = getTextbox();
      expectFieldValueV6(
        input,
        keyStroke.expected,
        (props as any).shouldRespectLeadingZeros ? 'singleDigit' : undefined,
      );
    });
    view.unmount();
    finalCallback?.();
  };

  return { testFieldKeyPress, testFieldChange, renderWithProps };
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
