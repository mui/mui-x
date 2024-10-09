import * as React from 'react';
import useControlled from '@mui/utils/useControlled';
import { useRtl } from '@mui/system/RtlProvider';
import { usePickersTranslations } from '../../../hooks/usePickersTranslations';
import { useUtils, useLocalizationContext } from '../useUtils';
import {
  UseFieldState,
  FieldParsedSelectedSections,
  FieldChangeHandlerContext,
  FieldSectionsValueBoundaries,
  UseFieldForwardedProps,
} from './useField.types';
import {
  mergeDateIntoReferenceDate,
  getSectionsBoundaries,
  validateSections,
  getDateFromDateSections,
  parseSelectedSections,
  getLocalizedDigits,
} from './useField.utils';
import { buildSectionsFromFormat } from './buildSectionsFromFormat';
import {
  FieldSection,
  FieldSelectedSections,
  PickerAnyValueManagerV8,
  PickersTimezone,
  PickerManagerProperties,
} from '../../../models';
import { useValueWithTimezone } from '../useValueWithTimezone';
import {
  GetDefaultReferenceDateProps,
  getSectionTypeGranularity,
} from '../../utils/getDefaultReferenceDate';

export interface UpdateSectionValueParams<TSection extends FieldSection> {
  /**
   * The section on which we want to apply the new value.
   */
  activeSection: TSection;
  /**
   * Value to apply to the active section.
   */
  newSectionValue: string;
  /**
   * If `true`, the focus will move to the next section.
   */
  shouldGoToNextSection: boolean;
}

export const useFieldState = <TManager extends PickerAnyValueManagerV8>(
  parameters: UseFieldStateParameters<TManager>,
): UseFieldStateReturnValue<TManager> => {
  type ManagerProperties = PickerManagerProperties<TManager>;
  type TDate = ManagerProperties['date'];
  type TValue = ManagerProperties['value'];
  type TSection = ManagerProperties['section'];

  const utils = useUtils<TDate>();
  const translations = usePickersTranslations<TDate>();
  const adapter = useLocalizationContext<TDate>();
  const isRtl = useRtl();

  const {
    valueManager: { legacyValueManager, fieldValueManager, valueType, validator },
    internalPropsWithDefaults,
    internalPropsWithDefaults: {
      value: valueProp,
      defaultValue,
      referenceDate: referenceDateProp,
      onChange,
      format,
      formatDensity = 'dense',
      selectedSections: selectedSectionsProp,
      onSelectedSectionsChange,
      shouldRespectLeadingZeros = false,
      timezone: timezoneProp,
      enableAccessibleFieldDOMStructure = false,
    },
  } = parameters;

  const {
    timezone,
    value: valueFromTheOutside,
    handleValueChange,
  } = useValueWithTimezone({
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    onChange,
    valueManager: legacyValueManager,
  });

  const localizedDigits = React.useMemo(() => getLocalizedDigits(utils), [utils]);

  const sectionsValueBoundaries = React.useMemo(
    () => getSectionsBoundaries<TDate>(utils, localizedDigits, timezone),
    [utils, localizedDigits, timezone],
  );

  const getSectionsFromValue = React.useCallback(
    (value: TValue, fallbackSections: TSection[] | null = null) =>
      fieldValueManager.getSectionsFromValue(utils, value, fallbackSections, (date) =>
        buildSectionsFromFormat({
          utils,
          localeText: translations,
          localizedDigits,
          format,
          date,
          formatDensity,
          shouldRespectLeadingZeros,
          enableAccessibleFieldDOMStructure,
          isRtl,
        }),
      ),
    [
      fieldValueManager,
      format,
      translations,
      localizedDigits,
      isRtl,
      shouldRespectLeadingZeros,
      utils,
      formatDensity,
      enableAccessibleFieldDOMStructure,
    ],
  );

  const [state, setState] = React.useState<UseFieldState<TManager>>(() => {
    const sections = getSectionsFromValue(valueFromTheOutside);
    validateSections(sections, valueType);

    const stateWithoutReferenceDate: UseFieldState<TManager> = {
      sections,
      value: valueFromTheOutside,
      referenceValue: legacyValueManager.emptyValue,
      tempValueStrAndroid: null,
    };

    const granularity = getSectionTypeGranularity(sections);
    const referenceValue = legacyValueManager.getInitialReferenceValue({
      referenceDate: referenceDateProp,
      value: valueFromTheOutside,
      utils,
      props: internalPropsWithDefaults as GetDefaultReferenceDateProps<TDate>,
      granularity,
      timezone,
    });

    return {
      ...stateWithoutReferenceDate,
      referenceValue,
    };
  });

  const [selectedSections, innerSetSelectedSections] = useControlled({
    controlled: selectedSectionsProp,
    default: null,
    name: 'useField',
    state: 'selectedSections',
  });

  const setSelectedSections = (newSelectedSections: FieldSelectedSections) => {
    innerSetSelectedSections(newSelectedSections);
    onSelectedSectionsChange?.(newSelectedSections);
  };

  const parsedSelectedSections = React.useMemo<FieldParsedSelectedSections>(
    () => parseSelectedSections(selectedSections, state.sections),
    [selectedSections, state.sections],
  );

  const activeSectionIndex = parsedSelectedSections === 'all' ? 0 : parsedSelectedSections;

  const publishValue = ({
    value,
    referenceValue,
    sections,
  }: Pick<UseFieldState<TManager>, 'value' | 'referenceValue' | 'sections'>) => {
    setState((prevState) => ({
      ...prevState,
      sections,
      value,
      referenceValue,
      tempValueStrAndroid: null,
    }));

    if (legacyValueManager.areValuesEqual(utils, state.value, value)) {
      return;
    }

    const context: FieldChangeHandlerContext<unknown> = {
      validationError: validator({
        adapter,
        value,
        timezone,
        props: internalPropsWithDefaults,
      }),
    };

    handleValueChange(value, context);
  };

  const setSectionValue = (sectionIndex: number, newSectionValue: string) => {
    const newSections = [...state.sections];

    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      value: newSectionValue,
      modified: true,
    };

    return newSections;
  };

  const clearValue = () => {
    publishValue({
      value: legacyValueManager.emptyValue,
      referenceValue: state.referenceValue,
      sections: getSectionsFromValue(legacyValueManager.emptyValue),
    });
  };

  const clearActiveSection = () => {
    if (activeSectionIndex == null) {
      return;
    }

    const activeSection = state.sections[activeSectionIndex];
    const activeDateManager = fieldValueManager.getActiveDateManager(utils, state, activeSection);

    const nonEmptySectionCountBefore = activeDateManager
      .getSections(state.sections)
      .filter((section) => section.value !== '').length;
    const hasNoOtherNonEmptySections =
      nonEmptySectionCountBefore === (activeSection.value === '' ? 0 : 1);

    const newSections = setSectionValue(activeSectionIndex, '');
    const newActiveDate = hasNoOtherNonEmptySections ? null : utils.getInvalidDate();
    const newValues = activeDateManager.getNewValuesFromNewActiveDate(newActiveDate);

    publishValue({ ...newValues, sections: newSections });
  };

  const updateValueFromValueStr = (valueStr: string) => {
    const parseDateStr = (dateStr: string, referenceDate: TDate) => {
      const date = utils.parse(dateStr, format);
      if (date == null || !utils.isValid(date)) {
        return null;
      }

      const sections = buildSectionsFromFormat({
        utils,
        localeText: translations,
        localizedDigits,
        format,
        date,
        formatDensity,
        shouldRespectLeadingZeros,
        enableAccessibleFieldDOMStructure,
        isRtl,
      });
      return mergeDateIntoReferenceDate(utils, date, sections, referenceDate, false);
    };

    const newValue = fieldValueManager.parseValueStr(valueStr, state.referenceValue, parseDateStr);

    const newReferenceValue = fieldValueManager.updateReferenceValue(
      utils,
      newValue,
      state.referenceValue,
    );

    publishValue({
      value: newValue,
      referenceValue: newReferenceValue,
      sections: getSectionsFromValue(newValue, state.sections),
    });
  };

  const updateSectionValue = ({
    activeSection,
    newSectionValue,
    shouldGoToNextSection,
  }: UpdateSectionValueParams<TSection>) => {
    /**
     * 1. Decide which section should be focused
     */
    if (shouldGoToNextSection && activeSectionIndex! < state.sections.length - 1) {
      setSelectedSections(activeSectionIndex! + 1);
    }

    /**
     * 2. Try to build a valid date from the new section value
     */
    const activeDateManager = fieldValueManager.getActiveDateManager(utils, state, activeSection);
    const newSections = setSectionValue(activeSectionIndex!, newSectionValue);
    const newActiveDateSections = activeDateManager.getSections(newSections);
    const newActiveDate = getDateFromDateSections(utils, newActiveDateSections, localizedDigits);

    let values: Pick<UseFieldState<TManager>, 'value' | 'referenceValue'>;
    let shouldPublish: boolean;

    /**
     * If the new date is valid,
     * Then we merge the value of the modified sections into the reference date.
     * This makes sure that we don't lose some information of the initial date (like the time on a date field).
     */
    if (newActiveDate != null && utils.isValid(newActiveDate)) {
      const mergedDate = mergeDateIntoReferenceDate(
        utils,
        newActiveDate,
        newActiveDateSections,
        activeDateManager.referenceDate,
        true,
      );

      values = activeDateManager.getNewValuesFromNewActiveDate(mergedDate);
      shouldPublish = true;
    } else {
      values = activeDateManager.getNewValuesFromNewActiveDate(newActiveDate);
      shouldPublish =
        (newActiveDate != null && !utils.isValid(newActiveDate)) !==
        (activeDateManager.date != null && !utils.isValid(activeDateManager.date));
    }

    /**
     * Publish or update the internal state with the new value and sections.
     */
    if (shouldPublish) {
      return publishValue({ ...values, sections: newSections });
    }

    return setState((prevState) => ({
      ...prevState,
      ...values,
      sections: newSections,
      tempValueStrAndroid: null,
    }));
  };

  const setTempAndroidValueStr = (tempValueStrAndroid: string | null) =>
    setState((prev) => ({ ...prev, tempValueStrAndroid }));

  React.useEffect(() => {
    const sections = getSectionsFromValue(state.value);
    validateSections(sections, valueType);
    setState((prevState) => ({
      ...prevState,
      sections,
    }));
  }, [format, utils.locale, isRtl]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    let shouldUpdate: boolean;
    if (!legacyValueManager.areValuesEqual(utils, state.value, valueFromTheOutside)) {
      shouldUpdate = true;
    } else {
      shouldUpdate =
        legacyValueManager.getTimezone(utils, state.value) !==
        legacyValueManager.getTimezone(utils, valueFromTheOutside);
    }

    if (shouldUpdate) {
      setState((prevState) => ({
        ...prevState,
        value: valueFromTheOutside,
        referenceValue: fieldValueManager.updateReferenceValue(
          utils,
          valueFromTheOutside,
          prevState.referenceValue,
        ),
        sections: getSectionsFromValue(valueFromTheOutside),
      }));
    }
  }, [valueFromTheOutside]); // eslint-disable-line react-hooks/exhaustive-deps

  const areAllSectionsEmpty = legacyValueManager.areValuesEqual(
    utils,
    state.value,
    legacyValueManager.emptyValue,
  );

  return {
    state,
    activeSectionIndex,
    parsedSelectedSections,
    setSelectedSections,
    clearValue,
    clearActiveSection,
    updateSectionValue,
    updateValueFromValueStr,
    setTempAndroidValueStr,
    getSectionsFromValue,
    sectionsValueBoundaries,
    localizedDigits,
    timezone,
    areAllSectionsEmpty,
  };
};

interface UseFieldStateParameters<TManager extends PickerAnyValueManagerV8> {
  valueManager: TManager;
  forwardedProps: UseFieldForwardedProps<
    PickerManagerProperties<TManager>['enableAccessibleFieldDOMStructure']
  >;
  internalPropsWithDefaults: PickerManagerProperties<TManager>['internalPropsWithDefaults'];
}

export interface UseFieldStateReturnValue<TManager extends PickerAnyValueManagerV8> {
  state: UseFieldState<TManager>;
  activeSectionIndex: number | null;
  parsedSelectedSections: FieldParsedSelectedSections;
  setSelectedSections: (sections: FieldSelectedSections) => void;
  clearValue: () => void;
  clearActiveSection: () => void;
  updateSectionValue: (
    params: UpdateSectionValueParams<PickerManagerProperties<TManager>['section']>,
  ) => void;
  updateValueFromValueStr: (valueStr: string) => void;
  // TODO v9: Remove
  setTempAndroidValueStr: (tempAndroidValueStr: string | null) => void;
  sectionsValueBoundaries: FieldSectionsValueBoundaries<PickerManagerProperties<TManager>['date']>;
  getSectionsFromValue: (
    value: PickerManagerProperties<TManager>['value'],
    fallbackSections?: PickerManagerProperties<TManager>['section'][] | null,
  ) => PickerManagerProperties<TManager>['section'][];
  localizedDigits: string[];
  timezone: PickersTimezone;
  areAllSectionsEmpty: boolean;
}
