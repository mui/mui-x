import * as React from 'react';
import useControlled from '@mui/utils/useControlled';
import { useRtl } from '@mui/system/RtlProvider';
import { usePickerTranslations } from '../../../hooks/usePickerTranslations';
import { useUtils, useLocalizationContext } from '../useUtils';
import {
  UseFieldInternalProps,
  UseFieldParams,
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
  FieldSelectedSections,
  PickersTimezone,
  PickerValidDate,
  InferError,
  InferFieldSection,
} from '../../../models';
import { useValueWithTimezone } from '../useValueWithTimezone';
import {
  GetDefaultReferenceDateProps,
  getSectionTypeGranularity,
} from '../../utils/getDefaultReferenceDate';
import { PickerValidValue } from '../../models';

export interface UpdateSectionValueParams<TValue extends PickerValidValue> {
  /**
   * The section on which we want to apply the new value.
   */
  activeSection: InferFieldSection<TValue>;
  /**
   * Value to apply to the active section.
   */
  newSectionValue: string;
  /**
   * If `true`, the focus will move to the next section.
   */
  shouldGoToNextSection: boolean;
}

export interface UseFieldStateResponse<TValue extends PickerValidValue> {
  state: UseFieldState<TValue>;
  activeSectionIndex: number | null;
  parsedSelectedSections: FieldParsedSelectedSections;
  setSelectedSections: (sections: FieldSelectedSections) => void;
  clearValue: () => void;
  clearActiveSection: () => void;
  updateSectionValue: (params: UpdateSectionValueParams<TValue>) => void;
  updateValueFromValueStr: (valueStr: string) => void;
  setTempAndroidValueStr: (tempAndroidValueStr: string | null) => void;
  sectionsValueBoundaries: FieldSectionsValueBoundaries;
  getSectionsFromValue: (
    value: TValue,
    fallbackSections?: InferFieldSection<TValue>[] | null,
  ) => InferFieldSection<TValue>[];
  localizedDigits: string[];
  timezone: PickersTimezone;
}

export const useFieldState = <
  TValue extends PickerValidValue,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TForwardedProps extends UseFieldForwardedProps<TEnableAccessibleFieldDOMStructure>,
  TInternalProps extends UseFieldInternalProps<TValue, TEnableAccessibleFieldDOMStructure, any>,
>(
  params: UseFieldParams<
    TValue,
    TEnableAccessibleFieldDOMStructure,
    TForwardedProps,
    TInternalProps
  >,
): UseFieldStateResponse<TValue> => {
  const utils = useUtils();
  const translations = usePickerTranslations();
  const adapter = useLocalizationContext();
  const isRtl = useRtl();

  const {
    valueManager,
    fieldValueManager,
    valueType,
    validator,
    internalProps,
    internalProps: {
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
      enableAccessibleFieldDOMStructure = true,
    },
  } = params;

  const {
    timezone,
    value: valueFromTheOutside,
    handleValueChange,
  } = useValueWithTimezone({
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    referenceDate: referenceDateProp,
    onChange,
    valueManager,
  });

  const localizedDigits = React.useMemo(() => getLocalizedDigits(utils), [utils]);

  const sectionsValueBoundaries = React.useMemo(
    () => getSectionsBoundaries(utils, localizedDigits, timezone),
    [utils, localizedDigits, timezone],
  );

  const getSectionsFromValue = React.useCallback(
    (value: TValue, fallbackSections: InferFieldSection<TValue>[] | null = null) =>
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

  const [state, setState] = React.useState<UseFieldState<TValue>>(() => {
    const sections = getSectionsFromValue(valueFromTheOutside);
    validateSections(sections, valueType);

    const stateWithoutReferenceDate: Omit<UseFieldState<TValue>, 'referenceValue'> = {
      sections,
      value: valueFromTheOutside,
      tempValueStrAndroid: null,
    };

    const granularity = getSectionTypeGranularity(sections);
    const referenceValue = valueManager.getInitialReferenceValue({
      referenceDate: referenceDateProp,
      value: valueFromTheOutside,
      utils,
      props: internalProps as GetDefaultReferenceDateProps,
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
  }: Pick<UseFieldState<TValue>, 'value' | 'referenceValue' | 'sections'>) => {
    setState((prevState) => ({
      ...prevState,
      sections,
      value,
      referenceValue,
      tempValueStrAndroid: null,
    }));

    if (valueManager.areValuesEqual(utils, state.value, value)) {
      return;
    }

    const context: FieldChangeHandlerContext<InferError<TInternalProps>> = {
      validationError: validator({
        adapter,
        value,
        timezone,
        props: internalProps,
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
      value: valueManager.emptyValue,
      referenceValue: state.referenceValue,
      sections: getSectionsFromValue(valueManager.emptyValue),
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
    const parseDateStr = (dateStr: string, referenceDate: PickerValidDate) => {
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
  }: UpdateSectionValueParams<TValue>) => {
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

    let values: Pick<UseFieldState<TValue>, 'value' | 'referenceValue'>;
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
    if (!valueManager.areValuesEqual(utils, state.value, valueFromTheOutside)) {
      shouldUpdate = true;
    } else {
      shouldUpdate =
        valueManager.getTimezone(utils, state.value) !==
        valueManager.getTimezone(utils, valueFromTheOutside);
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
  };
};
