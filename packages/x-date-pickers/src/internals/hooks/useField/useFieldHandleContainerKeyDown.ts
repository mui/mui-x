import useEventCallback from '@mui/utils/useEventCallback';
import {
  InferFieldSection,
  MuiPickersAdapter,
  PickerManager,
  PickersTimezone,
  PickerValidDate,
} from '../../../models';
import { PickerValidValue } from '../../models';
import { UseFieldStateReturnValue } from './useFieldState';
import { useUtils } from '../useUtils';
import { FieldSectionsValueBoundaries, UseFieldInternalProps } from './useField.types';
import {
  cleanDigitSectionValue,
  getLetterEditingOptions,
  removeLocalizedDigits,
} from './useField.utils';

export function useFieldHandleContainerKeyDown<TValue extends PickerValidValue>(
  parameters: UseFieldOnKeyDownParameters<TValue>,
) {
  const utils = useUtils();

  const {
    manager: { internal_fieldValueManager: fieldValueManager },
    internalPropsWithDefaults: { minutesStep, disabled, readOnly },
    stateResponse: {
      // States and derived values
      state,
      value,
      activeSectionIndex,
      parsedSelectedSections,
      sectionsValueBoundaries,
      localizedDigits,
      timezone,
      sectionOrder,

      // Methods to update the states
      clearValue,
      clearActiveSection,
      setSelectedSections,
      updateSectionValue,
    },
  } = parameters;

  return useEventCallback((event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (disabled) {
      return;
    }
    // eslint-disable-next-line default-case
    switch (true) {
      // Select all
      case (event.ctrlKey || event.metaKey) &&
        String.fromCharCode(event.keyCode) === 'A' &&
        !event.shiftKey &&
        !event.altKey: {
        // prevent default to make sure that the next line "select all" while updating
        // the internal state at the same time.
        event.preventDefault();
        setSelectedSections('all');
        break;
      }

      // Move selection to next section
      case event.key === 'ArrowRight': {
        event.preventDefault();

        if (parsedSelectedSections == null) {
          setSelectedSections(sectionOrder.startIndex);
        } else if (parsedSelectedSections === 'all') {
          setSelectedSections(sectionOrder.endIndex);
        } else {
          const nextSectionIndex = sectionOrder.neighbors[parsedSelectedSections].rightIndex;
          if (nextSectionIndex !== null) {
            setSelectedSections(nextSectionIndex);
          }
        }
        break;
      }

      // Move selection to previous section
      case event.key === 'ArrowLeft': {
        event.preventDefault();

        if (parsedSelectedSections == null) {
          setSelectedSections(sectionOrder.endIndex);
        } else if (parsedSelectedSections === 'all') {
          setSelectedSections(sectionOrder.startIndex);
        } else {
          const nextSectionIndex = sectionOrder.neighbors[parsedSelectedSections].leftIndex;
          if (nextSectionIndex !== null) {
            setSelectedSections(nextSectionIndex);
          }
        }
        break;
      }

      // Reset the value of the selected section
      case event.key === 'Delete': {
        event.preventDefault();

        if (readOnly) {
          break;
        }

        if (parsedSelectedSections == null || parsedSelectedSections === 'all') {
          clearValue();
        } else {
          clearActiveSection();
        }
        break;
      }

      // Increment / decrement the selected section value
      case ['ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key): {
        event.preventDefault();

        if (readOnly || activeSectionIndex == null) {
          break;
        }

        // if all sections are selected, mark the currently editing one as selected
        if (parsedSelectedSections === 'all') {
          setSelectedSections(activeSectionIndex);
        }

        const activeSection = state.sections[activeSectionIndex];

        const newSectionValue = adjustSectionValue(
          utils,
          timezone,
          activeSection,
          event.key as AvailableAdjustKeyCode,
          sectionsValueBoundaries,
          localizedDigits,
          fieldValueManager.getDateFromSection(value, activeSection),
          { minutesStep },
        );

        updateSectionValue({
          section: activeSection,
          newSectionValue,
          shouldGoToNextSection: false,
        });
        break;
      }
    }
  });
}

function getDeltaFromKeyCode(keyCode: Omit<AvailableAdjustKeyCode, 'Home' | 'End'>) {
  switch (keyCode) {
    case 'ArrowUp':
      return 1;
    case 'ArrowDown':
      return -1;
    case 'PageUp':
      return 5;
    case 'PageDown':
      return -5;
    default:
      return 0;
  }
}

function adjustSectionValue<TValue extends PickerValidValue>(
  utils: MuiPickersAdapter,
  timezone: PickersTimezone,
  section: InferFieldSection<TValue>,
  keyCode: AvailableAdjustKeyCode,
  sectionsValueBoundaries: FieldSectionsValueBoundaries,
  localizedDigits: string[],
  activeDate: PickerValidDate | null,
  stepsAttributes?: { minutesStep?: number },
): string {
  const delta = getDeltaFromKeyCode(keyCode);
  const isStart = keyCode === 'Home';
  const isEnd = keyCode === 'End';

  const shouldSetAbsolute = section.value === '' || isStart || isEnd;

  const adjustDigitSection = () => {
    const sectionBoundaries = sectionsValueBoundaries[section.type]({
      currentDate: activeDate,
      format: section.format,
      contentType: section.contentType,
    });

    const getCleanValue = (value: number) =>
      cleanDigitSectionValue(utils, value, sectionBoundaries, localizedDigits, section);

    const step =
      section.type === 'minutes' && stepsAttributes?.minutesStep ? stepsAttributes.minutesStep : 1;

    const currentSectionValue = parseInt(removeLocalizedDigits(section.value, localizedDigits), 10);
    let newSectionValueNumber = currentSectionValue + delta * step;

    if (shouldSetAbsolute) {
      if (section.type === 'year' && !isEnd && !isStart) {
        return utils.formatByString(utils.date(undefined, timezone), section.format);
      }

      if (delta > 0 || isStart) {
        newSectionValueNumber = sectionBoundaries.minimum;
      } else {
        newSectionValueNumber = sectionBoundaries.maximum;
      }
    }

    if (newSectionValueNumber % step !== 0) {
      if (delta < 0 || isStart) {
        newSectionValueNumber += step - ((step + newSectionValueNumber) % step); // for JS -3 % 5 = -3 (should be 2)
      }
      if (delta > 0 || isEnd) {
        newSectionValueNumber -= newSectionValueNumber % step;
      }
    }

    if (newSectionValueNumber > sectionBoundaries.maximum) {
      return getCleanValue(
        sectionBoundaries.minimum +
          ((newSectionValueNumber - sectionBoundaries.maximum - 1) %
            (sectionBoundaries.maximum - sectionBoundaries.minimum + 1)),
      );
    }

    if (newSectionValueNumber < sectionBoundaries.minimum) {
      return getCleanValue(
        sectionBoundaries.maximum -
          ((sectionBoundaries.minimum - newSectionValueNumber - 1) %
            (sectionBoundaries.maximum - sectionBoundaries.minimum + 1)),
      );
    }

    return getCleanValue(newSectionValueNumber);
  };

  const adjustLetterSection = () => {
    const options = getLetterEditingOptions(utils, timezone, section.type, section.format);
    if (options.length === 0) {
      return section.value;
    }

    if (shouldSetAbsolute) {
      if (delta > 0 || isStart) {
        return options[0];
      }

      return options[options.length - 1];
    }

    const currentOptionIndex = options.indexOf(section.value);
    const newOptionIndex = (currentOptionIndex + delta) % options.length;
    const clampedIndex = (newOptionIndex + options.length) % options.length;

    return options[clampedIndex];
  };

  if (section.contentType === 'digit' || section.contentType === 'digit-with-letter') {
    return adjustDigitSection();
  }

  return adjustLetterSection();
}

interface UseFieldOnKeyDownParameters<TValue extends PickerValidValue> {
  manager: PickerManager<TValue, any, any, any, any>;
  stateResponse: UseFieldStateReturnValue<TValue>;
  internalPropsWithDefaults: UseFieldInternalProps<TValue, any, any> & { minutesStep?: number };
}

type AvailableAdjustKeyCode = 'ArrowUp' | 'ArrowDown' | 'PageUp' | 'PageDown' | 'Home' | 'End';
