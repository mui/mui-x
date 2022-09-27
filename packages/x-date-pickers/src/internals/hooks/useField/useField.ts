import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { MuiDateSectionName, MuiPickerFieldAdapter } from '../../models/muiPickersAdapter';
import { useValidation } from '../validation/useValidation';
import { useUtils } from '../useUtils';
import {
  FieldSection,
  UseFieldParams,
  UseFieldResponse,
  UseFieldForwardedProps,
  UseFieldInternalProps,
  AvailableAdjustKeyCode,
} from './useField.interfaces';
import {
  getMonthsMatchingQuery,
  getSectionValueNumericBoundaries,
  getSectionVisibleValue,
  adjustDateSectionValue,
  adjustInvalidDateSectionValue,
  applySectionValueToDate,
  cleanTrailingZeroInNumericSectionValue,
} from './useField.utils';
import { useFieldState } from './useFieldState';

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
    state,
    selectedSectionIndexes,
    setSelectedSections,
    clearValue,
    clearActiveSection,
    updateSectionValue,
  } = useFieldState(params);

  const {
    internalProps: { readOnly = false },
    forwardedProps: { onClick, onKeyDown, onFocus, onBlur, ...otherForwardedProps },
    fieldValueManager,
    validator,
  } = params;

  const focusTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

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
        setSelectedSections({ startIndex: 0, endIndex: state.sections.length - 1 });
      } else {
        handleInputClick();
      }
    });
  });

  const handleInputBlur = useEventCallback((...args) => {
    onBlur?.(...(args as []));
    setSelectedSections(null);
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
        setSelectedSections({ startIndex: 0, endIndex: state.sections.length - 1 });
        return;
      }

      // Move selection to next section
      case event.key === 'ArrowRight': {
        event.preventDefault();

        if (selectedSectionIndexes == null) {
          setSelectedSections(0);
        } else if (selectedSectionIndexes.startIndex < state.sections.length - 1) {
          setSelectedSections(selectedSectionIndexes.startIndex + 1);
        } else if (selectedSectionIndexes.startIndex !== selectedSectionIndexes.endIndex) {
          setSelectedSections(selectedSectionIndexes.endIndex);
        }

        return;
      }

      // Move selection to previous section
      case event.key === 'ArrowLeft': {
        event.preventDefault();

        if (selectedSectionIndexes == null) {
          setSelectedSections(state.sections.length - 1);
        } else if (selectedSectionIndexes.startIndex !== selectedSectionIndexes.endIndex) {
          setSelectedSections(selectedSectionIndexes.startIndex);
        } else if (selectedSectionIndexes.startIndex > 0) {
          setSelectedSections(selectedSectionIndexes.startIndex - 1);
        }
        return;
      }

      // Reset the value of the selected section
      case ['Backspace', 'Delete'].includes(event.key): {
        event.preventDefault();

        if (readOnly) {
          return;
        }

        if (
          selectedSectionIndexes == null ||
          (selectedSectionIndexes.startIndex === 0 &&
            selectedSectionIndexes.endIndex === state.sections.length - 1)
        ) {
          clearValue();
        } else {
          clearActiveSection();
        }
        break;
      }

      // Increment / decrement the selected section value
      case ['ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key): {
        event.preventDefault();

        updateSectionValue({
          setSectionValueOnDate: (activeSection, activeDate) =>
            adjustDateSectionValue(
              utils,
              activeDate,
              activeSection.dateSectionName,
              event.key as AvailableAdjustKeyCode,
            ),
          setSectionValueOnSections: (activeSection) =>
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

          // Remove the trailing `0` (`01` => `1`)
          const currentSectionValue = Number(activeSection.value).toString();

          let newSectionValue = `${currentSectionValue}${event.key}`;
          while (newSectionValue.length > 0 && Number(newSectionValue) > boundaries.maximum) {
            newSectionValue = newSectionValue.slice(1);
          }

          // In the unlikely scenario where max < 9, we could type a single digit that already exceeds the maximum.
          if (newSectionValue.length === 0) {
            newSectionValue = boundaries.minimum.toString();
          }

          if (fixedWidth) {
            return cleanTrailingZeroInNumericSectionValue(newSectionValue, boundaries.maximum);
          }

          return newSectionValue;
        };

        updateSectionValue({
          setSectionValueOnDate: (activeSection, activeDate) => {
            // TODO: Support digit edition on full letter sections.
            // TODO: Do not hardcode the compatible formatValue
            if (
              activeSection.formatValue.includes('MMM') ||
              activeSection.formatValue.includes('LLL')
            ) {
              return activeDate;
            }

            return applySectionValueToDate({
              utils,
              dateSectionName: activeSection.dateSectionName,
              date: activeDate,
              getSectionValue: (getter) => {
                const sectionValueStr = getNewSectionValueStr({
                  activeSection,
                  date: activeDate,
                  fixedWidth: false,
                });
                const sectionDate = utils.parse(sectionValueStr, activeSection.formatValue)!;

                return getter(sectionDate);
              },
            });
          },
          setSectionValueOnSections: (activeSection, referenceActiveDate) =>
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

        const getNewSectionValueStr = ({ activeSection }: { activeSection: TSection }): string => {
          // TODO: Do not hardcode the compatible formatValue
          if (
            !activeSection.formatValue.includes('MMM') &&
            !activeSection.formatValue.includes('LLL')
          ) {
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
          setSectionValueOnDate: (activeSection, activeDate) =>
            applySectionValueToDate({
              utils,
              dateSectionName: activeSection.dateSectionName,
              date: activeDate,
              getSectionValue: (getter) => {
                const sectionValueStr = getNewSectionValueStr({ activeSection });
                const sectionDate = utils.parse(sectionValueStr, activeSection.formatValue)!;
                return getter(sectionDate);
              },
            }),
          setSectionValueOnSections: (activeSection) => getNewSectionValueStr({ activeSection }),
        });
      }
    }
  });

  useEnhancedEffect(() => {
    if (selectedSectionIndexes == null) {
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

    const firstSelectedSection = state.sections[selectedSectionIndexes.startIndex];
    const lastSelectedSection = state.sections[selectedSectionIndexes.endIndex];
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
