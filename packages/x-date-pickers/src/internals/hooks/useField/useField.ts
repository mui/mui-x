'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { warnOnce } from '@mui/x-internals/warning';
import { parseSelectedSections } from './useField.utils';
import {
  UseFieldDOMGetters,
  UseFieldParameters,
  UseFieldProps,
  UseFieldReturnValue,
} from './useField.types';
import { getActiveElement } from '../../utils/utils';
import { FieldSectionType } from '../../../models';
import { useSplitFieldProps } from '../../../hooks';
import { PickersSectionElement, PickersSectionListRef } from '../../../PickersSectionList';
import { useFieldCharacterEditing } from './useFieldCharacterEditing';
import { useFieldState } from './useFieldState';
import { useFieldInternalPropsWithDefaults } from './useFieldInternalPropsWithDefaults';
import { PickerValidValue } from '../../models';
import { syncSelectionToDOM } from './syncSelectionToDOM';
import { useFieldRootProps } from './useFieldRootProps';
import { useFieldHiddenInputProps } from './useFieldHiddenInputProps';
import { useFieldSectionContainerProps } from './useFieldSectionContainerProps';
import { useFieldSectionContentProps } from './useFieldSectionContentProps';

export const useField = <
  TValue extends PickerValidValue,
  TError,
  TValidationProps extends {},
  TProps extends UseFieldProps,
>(
  parameters: UseFieldParameters<TValue, TError, TValidationProps, TProps>,
): UseFieldReturnValue<TProps> => {
  const {
    props,
    manager,
    skipContextFieldRefAssignment,
    manager: { valueType, internal_useOpenPickerButtonAriaLabel: useOpenPickerButtonAriaLabel },
  } = parameters;

  const { internalProps, forwardedProps } = useSplitFieldProps(props, valueType);

  if (process.env.NODE_ENV !== 'production') {
    if ((forwardedProps as any).enableAccessibleFieldDOMStructure != null) {
      warnOnce([
        'MUI X: The `enableAccessibleFieldDOMStructure` prop has been removed.',
        'The accessible DOM structure is now the default and only option.',
        'You can safely remove the prop from your code.',
        'For more information, please have a look at the migration guide (https://mui.com/x/migration/migration-pickers-v8/).',
      ]);
    }
  }

  const internalPropsWithDefaults = useFieldInternalPropsWithDefaults({
    manager,
    internalProps,
    skipContextFieldRefAssignment,
  });

  const {
    sectionListRef: sectionListRefProp,
    onBlur,
    onClick,
    onFocus,
    onInput,
    onPaste,
    onKeyDown,
    onClear,
    clearable,
  } = forwardedProps;

  const {
    disabled = false,
    readOnly = false,
    autoFocus = false,
    focused: focusedProp,
    fieldRef,
  } = internalPropsWithDefaults;

  const sectionListRef = React.useRef<PickersSectionListRef>(null);
  const handleSectionListRef = useForkRef(sectionListRefProp, sectionListRef);

  const domGetters = React.useMemo<UseFieldDOMGetters>(
    () => ({
      isReady: () => sectionListRef.current != null,
      getRoot: () => sectionListRef.current!.getRoot(),
      getSectionContainer: (sectionIndex: number) =>
        sectionListRef.current!.getSectionContainer(sectionIndex),
      getSectionContent: (sectionIndex: number) =>
        sectionListRef.current!.getSectionContent(sectionIndex),
      getSectionIndexFromDOMElement: (element: Element | null | undefined) =>
        sectionListRef.current!.getSectionIndexFromDOMElement(element),
    }),
    [sectionListRef],
  );

  // Tracks the most recent `mousedown` target across the page. Used to detect
  // Chromium's quirk where clicking outside the field's `contenteditable`
  // section spans (e.g. on a parent that visually surrounds the field) still
  // delegates focus to the nearest section. The section's `onFocus` consults
  // this ref to identify and undo such delegated focus.
  // See https://stackoverflow.com/questions/34354085/clicking-outside-a-contenteditable-div-stills-give-focus-to-it
  const lastMouseDownTargetRef = React.useRef<EventTarget | null>(null);
  React.useEffect(() => {
    const handler = (event: MouseEvent) => {
      lastMouseDownTargetRef.current = event.target;
      // Clear in the next macrotask so any synchronous `focus` event arriving
      // from the same `mousedown` (the Chromium delegation case) still sees
      // the target, but subsequent keyboard / programmatic focus events do
      // not get gated on stale state.
      setTimeout(() => {
        if (lastMouseDownTargetRef.current === event.target) {
          lastMouseDownTargetRef.current = null;
        }
      }, 0);
    };
    // Capture phase so we record the target before any other handler can stop
    // propagation.
    document.addEventListener('mousedown', handler, true);
    return () => {
      document.removeEventListener('mousedown', handler, true);
    };
  }, []);

  const stateResponse = useFieldState({ manager, internalPropsWithDefaults, forwardedProps });
  const {
    // States and derived states
    areAllSectionsEmpty,
    error,
    parsedSelectedSections,
    sectionOrder,
    state,
    value,

    // Methods to update the states
    clearValue,
    setSelectedSections,
  } = stateResponse;

  const applyCharacterEditing = useFieldCharacterEditing({ stateResponse });
  const openPickerAriaLabel = useOpenPickerButtonAriaLabel(value);
  const [focused, setFocused] = React.useState(false);

  function focusField(newSelectedSections: number | FieldSectionType = 0) {
    if (
      disabled ||
      !sectionListRef.current ||
      // if the field is already focused, we don't need to focus it again
      getActiveSectionIndex(sectionListRef) != null
    ) {
      return;
    }

    const newParsedSelectedSections = parseSelectedSections(
      newSelectedSections,
      state.sections,
    ) as number;

    setFocused(true);
    sectionListRef.current.getSectionContent(newParsedSelectedSections).focus();
  }

  const rootProps = useFieldRootProps({
    manager,
    internalPropsWithDefaults,
    stateResponse,
    applyCharacterEditing,
    focused,
    setFocused,
    domGetters,
  });
  const hiddenInputProps = useFieldHiddenInputProps({ manager, stateResponse });
  const createSectionContainerProps = useFieldSectionContainerProps({
    stateResponse,
    internalPropsWithDefaults,
  });
  const createSectionContentProps = useFieldSectionContentProps({
    manager,
    stateResponse,
    applyCharacterEditing,
    internalPropsWithDefaults,
    domGetters,
    focused,
    lastMouseDownTargetRef,
  });

  const handleRootKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    rootProps.onKeyDown(event);
  });

  const handleRootBlur = useEventCallback((event: React.FocusEvent<HTMLDivElement>) => {
    rootProps.onBlur(event);
    // Skip the user callback when focus is only moving to another element inside the field
    // (e.g. the section that gains focus after the focusable root gives it up).
    const next = event.relatedTarget;
    if (domGetters.isReady() && next instanceof Node && domGetters.getRoot().contains(next)) {
      return;
    }
    onBlur?.(event);
  });

  const handleRootFocus = useEventCallback((event: React.FocusEvent<HTMLDivElement>) => {
    rootProps.onFocus(event);
    // Skip the user callback when focus is only arriving from another element inside the field
    // (e.g. the focusable root receiving it before it is forwarded to a section, and the section
    // focus event bubbling back up to the root).
    const previous = event.relatedTarget;
    if (
      domGetters.isReady() &&
      previous instanceof Node &&
      domGetters.getRoot().contains(previous)
    ) {
      return;
    }
    onFocus?.(event);
  });

  const handleRootClick = useEventCallback((event: React.MouseEvent<HTMLDivElement>) => {
    // The click event on the clear or open button would propagate to the input, trigger this handler and result in an inadvertent section selection.
    // We avoid this by checking if the call of `handleInputClick` is actually intended, or a propagated call, which should be skipped.
    if (event.isDefaultPrevented()) {
      return;
    }
    onClick?.(event);
    rootProps.onClick(event);
  });

  const handleRootPaste = useEventCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    onPaste?.(event);
    rootProps.onPaste(event);
  });

  const handleRootInput = useEventCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    onInput?.(event);
    rootProps.onInput(event);
  });

  const handleClear = useEventCallback((event: React.MouseEvent, ...args) => {
    event.preventDefault();
    onClear?.(event, ...(args as []));
    clearValue();

    if (!isFieldFocused(sectionListRef)) {
      // setSelectedSections is called internally
      focusField(0);
    } else {
      setSelectedSections(sectionOrder.startIndex);
    }
  });

  const elements = React.useMemo<PickersSectionElement[]>(() => {
    return state.sections.map((section, sectionIndex) => {
      const content = createSectionContentProps(section, sectionIndex);
      return {
        container: createSectionContainerProps(sectionIndex),
        content,
        before: {
          children: section.startSeparator,
        },
        after: {
          children: section.endSeparator,
          'data-range-position': section.isEndFormatSeparator
            ? content['data-range-position']
            : undefined,
        },
      };
    });
  }, [state.sections, createSectionContainerProps, createSectionContentProps]);

  React.useEffect(() => {
    if (sectionListRef.current == null) {
      throw new Error(
        `MUI X: The \`sectionListRef\` prop has not been initialized by \`PickersSectionList\`
You probably tried to pass a component to the \`textField\` slot that contains an \`<input />\` element instead of a \`PickersSectionList\`.

Learn more about the field accessible DOM structure on the MUI documentation: https://mui.com/x/react-date-pickers/fields/#fields-to-edit-a-single-element`,
      );
    }

    if (autoFocus && !disabled) {
      sectionListRef.current.getSectionContent(sectionOrder.startIndex).focus();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEnhancedEffect(() => {
    if (!focused || !sectionListRef.current) {
      return;
    }

    if (parsedSelectedSections === 'all') {
      sectionListRef.current.getRoot().focus();
    } else if (typeof parsedSelectedSections === 'number') {
      const domElement = sectionListRef.current.getSectionContent(parsedSelectedSections);
      if (domElement) {
        domElement.focus();
      }
    }
  }, [parsedSelectedSections, focused]);

  useEnhancedEffect(() => {
    syncSelectionToDOM({ focused, domGetters, stateResponse });
  });

  React.useImperativeHandle(fieldRef, () => ({
    getSections: () => state.sections,
    getActiveSectionIndex: () => getActiveSectionIndex(sectionListRef),
    setSelectedSections: (newSelectedSections) => {
      if (disabled || !sectionListRef.current) {
        return;
      }

      const newParsedSelectedSections = parseSelectedSections(newSelectedSections, state.sections);
      const newActiveSectionIndex =
        newParsedSelectedSections === 'all' ? 0 : newParsedSelectedSections;
      setFocused(newActiveSectionIndex !== null);
      setSelectedSections(newSelectedSections);
    },
    focusField,
    isFieldFocused: () => isFieldFocused(sectionListRef),
    clearValue,
  }));

  return {
    // Forwarded
    ...forwardedProps,

    // Root props
    ...rootProps,
    onBlur: handleRootBlur,
    onClick: handleRootClick,
    onFocus: handleRootFocus,
    onInput: handleRootInput,
    onPaste: handleRootPaste,
    onKeyDown: handleRootKeyDown,
    onClear: handleClear,

    // Hidden input props
    ...hiddenInputProps,

    error,
    clearable: Boolean(clearable && !areAllSectionsEmpty && !readOnly && !disabled),
    focused: focusedProp ?? focused,
    sectionListRef: handleSectionListRef,
    // Additional
    elements,
    areAllSectionsEmpty,
    disabled,
    readOnly,
    autoFocus,
    openPickerAriaLabel,
  };
};

function getActiveSectionIndex(sectionListRef: React.RefObject<PickersSectionListRef | null>) {
  const activeElement = getActiveElement(sectionListRef.current?.getRoot());
  if (
    !activeElement ||
    !sectionListRef.current ||
    !sectionListRef.current.getRoot().contains(activeElement)
  ) {
    return null;
  }

  return sectionListRef.current.getSectionIndexFromDOMElement(activeElement);
}

function isFieldFocused(sectionListRef: React.RefObject<PickersSectionListRef | null>) {
  const activeElement = getActiveElement(sectionListRef.current?.getRoot());
  return !!sectionListRef.current && sectionListRef.current.getRoot().contains(activeElement);
}
