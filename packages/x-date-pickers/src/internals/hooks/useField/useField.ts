import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { MuiDateSectionName, MuiPickerFieldAdapter } from '../../models/muiPickersAdapter';
import { useValidation } from '../validation/useValidation';
import { useUtils } from '../useUtils';
import { PickerStateValueManager } from '../usePickerState';
import {
  FieldSection,
  UseFieldParams,
  UseFieldResponse,
  UseFieldState,
  UseFieldForwardedProps,
  UseFieldInternalProps,
  AvailableAdjustKeyCode,
  FieldValueManager,
} from './useField.interfaces';
import {
  getMonthsMatchingQuery,
  getSectionValueNumericBoundaries,
  getSectionVisibleValue,
  adjustDateSectionValue,
  adjustInvalidDateSectionValue,
  setSectionValue,
  applySectionValueToDate,
  createDateFromSections,
  cleanTrailingZeroInNumericSectionValue,
} from './useField.utils';

const useFieldState = <TValue, TDate, TSection extends FieldSection>({
  fieldValueManager,
  valueManager,
  value: valueProp,
  defaultValue,
  onChange,
  format,
}: {
  valueManager: PickerStateValueManager<TValue, TValue, TDate>;
  fieldValueManager: FieldValueManager<TValue, TDate, TSection, any>;
  defaultValue: TValue | undefined;
  value: TValue | undefined;
  onChange?: (value: TValue) => void;
  format: string;
}) => {
  const utils = useUtils<TDate>() as MuiPickerFieldAdapter<TDate>;

  const firstDefaultValue = React.useRef(defaultValue);
  const valueParsed = React.useMemo(() => {
    // TODO: Avoid this type casting, the emptyValues are both valid TDate and TInputDate
    const value = firstDefaultValue.current ?? valueProp ?? valueManager.emptyValue;

    return valueManager.parseInput(utils, value);
  }, [valueProp, valueManager, utils]);

  const [state, setState] = React.useState<UseFieldState<TValue, TSection>>(() => {
    const sections = fieldValueManager.getSectionsFromValue(utils, null, valueParsed, format);

    return {
      sections,
      value: valueParsed,
      lastPublishedValue: valueParsed,
      referenceValue: valueParsed,
      selectedSectionIndexes: null,
    };
  });

  const publishValue = ({ value, referenceValue }: { value: TValue; referenceValue: TValue }) => {
    const newSections = fieldValueManager.getSectionsFromValue(
      utils,
      state.sections,
      value,
      format,
    );

    setState((prevState) => ({
      ...prevState,
      sections: newSections,
      value,
      lastPublishedValue: value,
      referenceValue,
    }));

    onChange?.(value);
  };

  const updateSections = (sections: TSection[]) => {
    const value = fieldValueManager.getValueFromSections({
      utils,
      sections,
      format,
    });

    setState((prevState) => ({
      ...prevState,
      sections,
      value,
    }));
  };

  const clearValue = () =>
    publishValue({
      value: valueManager.emptyValue,
      referenceValue: state.referenceValue,
    });

  const clearSections = (startIndex: number, endIndex: number) => {
    let sections = state.sections;

    for (let i = startIndex; i <= endIndex; i += 1) {
      sections = setSectionValue(sections, i, '');
    }

    updateSections(sections);
  };

  const updateSectionValue = ({
    setSectionValueOnDate,
    setSectionValueOnSections,
  }: {
    setSectionValueOnDate: (params: { activeSection: TSection; date: TDate }) => TDate;
    setSectionValueOnSections: (params: {
      activeSection: TSection;
      referenceActiveDate: TDate;
    }) => string;
  }) => {
    if (state.selectedSectionIndexes == null) {
      return;
    }

    const activeSection = state.sections[state.selectedSectionIndexes.start];
    const { activeDateSections, activeDate, referenceActiveDate, saveActiveDate } =
      fieldValueManager.getActiveDateFromActiveSection({
        state,
        activeSection,
        publishValue,
      });

    if (activeDate != null && utils.isValid(activeDate)) {
      const newDate = setSectionValueOnDate({ date: activeDate, activeSection });
      saveActiveDate(newDate);
    } else {
      // The date is not valid, we have to update the section value rather than date itself.
      const partialSection = setSectionValueOnSections({
        activeSection,
        referenceActiveDate,
      });
      const newSections = setSectionValue(
        state.sections,
        state.selectedSectionIndexes.start,
        partialSection,
      );
      const newDate = createDateFromSections({ utils, format, sections: newSections });
      if (newDate != null && utils.isValid(newDate)) {
        let mergedDate = referenceActiveDate;

        activeDateSections.forEach((section) => {
          if (section.edited) {
            mergedDate = applySectionValueToDate({
              utils,
              date: newDate,
              dateSectionName: section.dateSectionName,
              getSectionValue: (getter) => getter(newDate),
            });
          }
        });

        saveActiveDate(mergedDate);
      } else {
        updateSections(newSections);
      }
    }
  };

  const setSelectedSections = (start?: number, end?: number) => {
    setState((prevState) => ({
      ...prevState,
      selectedSectionIndexes: start == null ? null : { start, end: end ?? start },
      selectedSectionQuery: null,
    }));
  };

  React.useEffect(() => {
    if (!valueManager.areValuesEqual(utils, state.lastPublishedValue, valueParsed)) {
      const sections = fieldValueManager.getSectionsFromValue(
        utils,
        state.sections,
        valueParsed,
        format,
      );
      setState((prevState) => ({
        ...prevState,
        lastPublishedValue: valueParsed,
        value: valueParsed,
        sections,
      }));
    }
  }, [valueParsed]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    state,
    setSelectedSections,
    clearValue,
    clearSections,
    updateSectionValue,
  };
};

export const useField = <
  TValue,
  TDate,
  TSection extends FieldSection,
  TForwardedProps extends UseFieldForwardedProps,
  TInternalProps extends UseFieldInternalProps<any, any>,
>(
  params: UseFieldParams<TValue, TDate, TSection, TForwardedProps, TInternalProps>,
): UseFieldResponse<TForwardedProps> => {
  const utils = useUtils<TDate>() as MuiPickerFieldAdapter<TDate>;
  if (!utils.formatTokenMap) {
    throw new Error('This adapter is not compatible with the field components');
  }
  const inputRef = React.useRef<HTMLInputElement>(null);
  const queryRef = React.useRef<{ dateSectionName: MuiDateSectionName; value: string } | null>(
    null,
  );

  const {
    internalProps: {
      value: valueProp,
      defaultValue,
      onChange,
      format = utils.formats.keyboardDate,
      readOnly = false,
    },
    forwardedProps: { onClick, onKeyDown, onFocus, onBlur, ...otherForwardedProps },
    valueManager,
    fieldValueManager,
    validator,
  } = params;

  const focusTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const { state, setSelectedSections, clearValue, clearSections, updateSectionValue } =
    useFieldState({
      valueManager,
      fieldValueManager,
      value: valueProp,
      defaultValue,
      onChange,
      format,
    });

  const handleInputClick = useEventCallback((...args) => {
    onClick?.(...(args as []));

    const nextSectionIndex = state.sections.findIndex(
      (section) => section.start > (inputRef.current!.selectionStart ?? 0),
    );
    const sectionIndex = nextSectionIndex === -1 ? state.sections.length - 1 : nextSectionIndex - 1;

    setSelectedSections(sectionIndex);
  });

  const handleInputFocus = useEventCallback((...args) => {
    onFocus?.(...(args as []));
    // The ref is guaranteed to be resolved that this point.
    const input = inputRef.current as HTMLInputElement;

    clearTimeout(focusTimeoutRef.current);
    focusTimeoutRef.current = setTimeout(() => {
      // The ref changed, the component got remounted, the focus event is no longer relevant.
      if (input !== inputRef.current) {
        return;
      }

      if (Number(input.selectionEnd) - Number(input.selectionStart) === input.value.length) {
        setSelectedSections(0, state.sections.length - 1);
      } else {
        handleInputClick();
      }
    });
  });

  const handleInputBlur = useEventCallback((...args) => {
    onBlur?.(...(args as []));
    setSelectedSections();
  });

  const handleInputKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    onKeyDown?.(event);

    // eslint-disable-next-line default-case
    switch (true) {
      // Select all
      case event.key === 'a' && (event.ctrlKey || event.metaKey): {
        // prevent default to make sure that the next line "select all" while updating
        // the internal state at the same time.
        event.preventDefault();
        setSelectedSections(0, state.sections.length - 1);
        return;
      }

      // Move selection to next section
      case event.key === 'ArrowRight': {
        event.preventDefault();

        if (state.selectedSectionIndexes == null) {
          setSelectedSections(0);
        } else if (state.selectedSectionIndexes.start < state.sections.length - 1) {
          setSelectedSections(state.selectedSectionIndexes.start + 1);
        } else if (state.selectedSectionIndexes.start !== state.selectedSectionIndexes.end) {
          setSelectedSections(state.selectedSectionIndexes.end);
        }

        return;
      }

      // Move selection to previous section
      case event.key === 'ArrowLeft': {
        event.preventDefault();

        if (state.selectedSectionIndexes == null) {
          setSelectedSections(state.sections.length - 1);
        } else if (state.selectedSectionIndexes.start !== state.selectedSectionIndexes.end) {
          setSelectedSections(state.selectedSectionIndexes.start);
        } else if (state.selectedSectionIndexes.start > 0) {
          setSelectedSections(state.selectedSectionIndexes.start - 1);
        }
        return;
      }

      // Reset the value of the selected section
      case ['Backspace', 'Delete'].includes(event.key): {
        event.preventDefault();

        if (readOnly) {
          return;
        }

        if (state.selectedSectionIndexes == null) {
          clearValue();
        } else {
          clearSections(state.selectedSectionIndexes.start, state.selectedSectionIndexes.end);
        }
        break;
      }

      // Increment / decrement the selected section value
      case ['ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key): {
        event.preventDefault();

        if (readOnly) {
          return;
        }

        updateSectionValue({
          setSectionValueOnDate: ({ date, activeSection }) =>
            adjustDateSectionValue(
              utils,
              date,
              activeSection.dateSectionName,
              event.key as AvailableAdjustKeyCode,
            ),
          setSectionValueOnSections: ({ activeSection }) =>
            adjustInvalidDateSectionValue(
              utils,
              activeSection,
              event.key as AvailableAdjustKeyCode,
            ),
        });
        return;
      }

      // Apply numeric editing on the selected section value
      case !Number.isNaN(Number(event.key)): {
        event.preventDefault();

        if (readOnly) {
          return;
        }

        const getNewSectionValueStr = ({
          activeSection,
          date,
          fixedWidth,
        }: {
          activeSection: TSection;
          date: TDate;
          fixedWidth: boolean;
        }) => {
          const boundaries = getSectionValueNumericBoundaries(
            utils,
            date,
            activeSection.dateSectionName,
          );

          const concatenatedSectionValue = `${activeSection.value}${event.key}`;
          const newSectionValue =
            Number(concatenatedSectionValue) > boundaries.maximum
              ? event.key
              : concatenatedSectionValue;

          if (fixedWidth) {
            cleanTrailingZeroInNumericSectionValue(newSectionValue, boundaries.maximum);
          }

          return newSectionValue;
        };

        updateSectionValue({
          setSectionValueOnDate: ({ date, activeSection }) =>
            applySectionValueToDate({
              utils,
              dateSectionName: activeSection.dateSectionName,
              date,
              getSectionValue: () =>
                Number(getNewSectionValueStr({ activeSection, date, fixedWidth: false })),
            }),
          setSectionValueOnSections: ({ referenceActiveDate, activeSection }) =>
            getNewSectionValueStr({
              activeSection,
              date: referenceActiveDate,
              fixedWidth: true,
            }),
        });

        return;
      }

      // Apply full letter editing on the selected section value
      case event.key.length === 1: {
        event.preventDefault();

        if (readOnly || state.selectedSectionIndexes == null) {
          return;
        }

        const getNewSectionValueStr = ({ activeSection }: { activeSection: TSection }): string => {
          // TODO: Do not hardcode the compatible formatValue
          if (!activeSection.formatValue.includes('MMM')) {
            return activeSection.value;
          }

          const newQuery = event.key.toLowerCase();

          const currentQuery =
            queryRef.current?.dateSectionName === activeSection.dateSectionName
              ? queryRef.current!.value
              : '';
          const concatenatedQuery = `${currentQuery}${newQuery}`;
          const matchingMonthsWithConcatenatedQuery = getMonthsMatchingQuery(
            utils,
            activeSection.formatValue,
            concatenatedQuery,
          );
          if (matchingMonthsWithConcatenatedQuery.length > 0) {
            queryRef.current = {
              dateSectionName: activeSection.dateSectionName,
              value: concatenatedQuery,
            };
            return matchingMonthsWithConcatenatedQuery[0];
          }

          const matchingMonthsWithNewQuery = getMonthsMatchingQuery(
            utils,
            activeSection.formatValue,
            newQuery,
          );
          if (matchingMonthsWithNewQuery.length > 0) {
            queryRef.current = {
              dateSectionName: activeSection.dateSectionName,
              value: newQuery,
            };
            return matchingMonthsWithNewQuery[0];
          }

          return activeSection.value;
        };

        updateSectionValue({
          setSectionValueOnDate: ({ activeSection, date }) =>
            applySectionValueToDate({
              utils,
              dateSectionName: activeSection.dateSectionName,
              date,
              getSectionValue: (getter) => {
                const sectionValueStr = getNewSectionValueStr({ activeSection });
                const sectionDate = utils.parse(sectionValueStr, activeSection.formatValue)!;
                return getter(sectionDate);
              },
            }),
          setSectionValueOnSections: ({ activeSection }) =>
            getNewSectionValueStr({ activeSection }),
        });
      }
    }
  });

  useEnhancedEffect(() => {
    if (state.selectedSectionIndexes == null) {
      return;
    }

    const updateSelectionRangeIfChanged = (selectionStart: number, selectionEnd: number) => {
      if (
        selectionStart !== inputRef.current!.selectionStart ||
        selectionEnd !== inputRef.current!.selectionEnd
      ) {
        inputRef.current!.setSelectionRange(selectionStart, selectionEnd);
      }
    };

    const firstSelectedSection = state.sections[state.selectedSectionIndexes.start];
    const lastSelectedSection = state.sections[state.selectedSectionIndexes.end];
    updateSelectionRangeIfChanged(
      firstSelectedSection.start,
      lastSelectedSection.start + getSectionVisibleValue(lastSelectedSection).length,
    );
  });

  const validationError = useValidation(
    { ...params.internalProps, value: state.value },
    validator,
    fieldValueManager.isSameError,
  );

  const inputError = React.useMemo(
    () => fieldValueManager.hasError(validationError),
    [fieldValueManager, validationError],
  );

  React.useEffect(() => {
    return () => window.clearTimeout(focusTimeoutRef.current);
  }, []);

  const valueStr = React.useMemo(
    () => fieldValueManager.getValueStrFromSections(state.sections),
    [state.sections, fieldValueManager],
  );

  return {
    inputProps: {
      ...otherForwardedProps,
      value: valueStr,
      onClick: handleInputClick,
      onFocus: handleInputFocus,
      onBlur: handleInputBlur,
      onKeyDown: handleInputKeyDown,
      error: inputError,
    },
    inputRef,
  };
};
