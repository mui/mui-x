import useEventCallback from '@mui/utils/useEventCallback';
import { UseFieldStateReturnValue } from './useFieldState';
import {
  FieldSection,
  MuiPickersAdapter,
  PickerAnyValueManagerV8,
  PickerManagerProperties,
  PickersTimezone,
  PickerValidDate,
} from '../../../models';
import {
  getLetterEditingOptions,
  cleanDigitSectionValue,
  removeLocalizedDigits,
  buildDefaultSectionOrdering,
} from './useField.utils';
import {
  FieldSectionsValueBoundaries,
  SectionOrdering,
  UseFieldForwardedProps,
  UseFieldInternalPropsFromManager,
} from './useField.types';
import { useUtils } from '../useUtils';
import { UseFieldCharacterEditingReturnValue } from './useFieldCharacterEditing';

type AvailableAdjustKeyCode = 'ArrowUp' | 'ArrowDown' | 'PageUp' | 'PageDown' | 'Home' | 'End';

const getDeltaFromKeyCode = (keyCode: Omit<AvailableAdjustKeyCode, 'Home' | 'End'>) => {
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
};

export const adjustSectionValue = <TDate extends PickerValidDate, TSection extends FieldSection>(
  utils: MuiPickersAdapter<TDate>,
  timezone: PickersTimezone,
  section: TSection,
  keyCode: AvailableAdjustKeyCode,
  sectionsValueBoundaries: FieldSectionsValueBoundaries<TDate>,
  localizedDigits: string[],
  activeDate: TDate | null,
  stepsAttributes?: { minutesStep?: number },
): string => {
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
};

export const useFieldHandleKeyDown = <TManager extends PickerAnyValueManagerV8>(
  parameters: UseFieldHandleKeyDownParameters<TManager>,
) => {
  type ManagerProperties = PickerManagerProperties<TManager>;
  type TDate = ManagerProperties['date'];

  const utils = useUtils<TDate>();

  const {
    valueManager: { fieldValueManager },
    stateResponse: {
      setSelectedSections,
      parsedSelectedSections,
      activeSectionIndex,
      clearValue,
      clearActiveSection,
      updateSectionValue,
      sectionsValueBoundaries,
      localizedDigits,
      state,
      timezone,
    },
    internalPropsWithDefaults: { disabled, readOnly, minutesStep },
    forwardedProps: { onKeyDown },
    characterEditingResponse: { resetCharacterQuery },
    sectionOrder = buildDefaultSectionOrdering(state.sections.length),
  } = parameters;

  return useEventCallback((event: React.KeyboardEvent<HTMLSpanElement>) => {
    onKeyDown?.(event);

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
          const nextSectionIndex = sectionOrder.getSectionOnTheRight(parsedSelectedSections);
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
          const nextSectionIndex = sectionOrder.getSectionOnTheLeft(parsedSelectedSections);
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
        resetCharacterQuery();
        break;
      }

      // Increment / decrement the selected section value
      case ['ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key): {
        event.preventDefault();

        if (readOnly || activeSectionIndex == null) {
          break;
        }

        const activeSection = state.sections[activeSectionIndex];
        const activeDateManager = fieldValueManager.getActiveDateManager(
          utils,
          state,
          activeSection,
        );

        const newSectionValue = adjustSectionValue(
          utils,
          timezone,
          activeSection,
          event.key as AvailableAdjustKeyCode,
          sectionsValueBoundaries,
          localizedDigits,
          activeDateManager.date,
          { minutesStep },
        );

        updateSectionValue({
          activeSection,
          newSectionValue,
          shouldGoToNextSection: false,
        });
        break;
      }
    }
  });
};

interface UseFieldHandleKeyDownParameters<TManager extends PickerAnyValueManagerV8> {
  valueManager: TManager;
  forwardedProps: UseFieldForwardedProps<
    PickerManagerProperties<TManager>['enableAccessibleFieldDOMStructure']
  >;
  internalPropsWithDefaults: UseFieldInternalPropsFromManager<TManager> & {
    minutesStep?: number;
  };
  stateResponse: UseFieldStateReturnValue<TManager>;
  characterEditingResponse: UseFieldCharacterEditingReturnValue;
  /**
   * Only define when used with the legacy DOM structure.
   * TODO v9: Remove
   */
  sectionOrder?: SectionOrdering;
}
