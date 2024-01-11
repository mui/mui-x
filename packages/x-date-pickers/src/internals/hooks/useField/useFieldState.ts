import * as React from 'react';
import useControlled from '@mui/utils/useControlled';
import { useTheme } from '@mui/material/styles';
import { useUtils, useLocaleText, useLocalizationContext } from '../useUtils';
import {
  UseFieldForwardedProps,
  UseFieldInternalProps,
  UseFieldParams,
  UseFieldState,
  FieldSelectedSectionsIndexes,
  FieldChangeHandlerContext,
} from './useField.types';
import {
  addPositionPropertiesToSections,
  splitFormatIntoSections,
  mergeDateIntoReferenceDate,
  getSectionsBoundaries,
  validateSections,
  getDateFromDateSections,
} from './useField.utils';
import { InferError } from '../useValidation';
import { FieldSection, FieldSelectedSections } from '../../../models';
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

export const useFieldState = <
  TValue,
  TDate,
  TSection extends FieldSection,
  TForwardedProps extends UseFieldForwardedProps,
  TInternalProps extends UseFieldInternalProps<any, any, any, any>,
>(
  params: UseFieldParams<TValue, TDate, TSection, TForwardedProps, TInternalProps>,
) => {
  const utils = useUtils<TDate>();
  const localeText = useLocaleText<TDate>();
  const adapter = useLocalizationContext<TDate>();
  const theme = useTheme();
  const isRTL = theme.direction === 'rtl';

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
    onChange,
    valueManager,
  });

  const sectionsValueBoundaries = React.useMemo(
    () => getSectionsBoundaries<TDate>(utils, timezone),
    [utils, timezone],
  );

  const getSectionsFromValue = React.useCallback(
    (value: TValue, fallbackSections: TSection[] | null = null) =>
      fieldValueManager.getSectionsFromValue(utils, value, fallbackSections, isRTL, (date) =>
        splitFormatIntoSections(
          utils,
          timezone,
          localeText,
          format,
          date,
          formatDensity,
          shouldRespectLeadingZeros,
          isRTL,
        ),
      ),
    [
      fieldValueManager,
      format,
      localeText,
      isRTL,
      shouldRespectLeadingZeros,
      utils,
      formatDensity,
      timezone,
    ],
  );

  const placeholder = React.useMemo(
    () =>
      fieldValueManager.getValueStrFromSections(
        getSectionsFromValue(valueManager.emptyValue),
        isRTL,
      ),
    [fieldValueManager, getSectionsFromValue, valueManager.emptyValue, isRTL],
  );

  const [state, setState] = React.useState<UseFieldState<TValue, TSection>>(() => {
    const sections = getSectionsFromValue(valueFromTheOutside);
    validateSections(sections, valueType);

    const stateWithoutReferenceDate: UseFieldState<TValue, TSection> = {
      sections,
      value: valueFromTheOutside,
      referenceValue: valueManager.emptyValue,
      tempValueStrAndroid: null,
    };

    const granularity = getSectionTypeGranularity(sections);
    const referenceValue = valueManager.getInitialReferenceValue({
      referenceDate: referenceDateProp,
      value: valueFromTheOutside,
      utils,
      props: internalProps as GetDefaultReferenceDateProps<TDate>,
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
    state: 'selectedSectionIndexes',
  });

  const setSelectedSections = (newSelectedSections: FieldSelectedSections) => {
    innerSetSelectedSections(newSelectedSections);
    onSelectedSectionsChange?.(newSelectedSections);

    setState((prevState) => ({
      ...prevState,
      selectedSectionQuery: null,
    }));
  };

  const selectedSectionIndexes = React.useMemo<FieldSelectedSectionsIndexes | null>(() => {
    if (selectedSections == null) {
      return null;
    }

    if (selectedSections === 'all') {
      return {
        startIndex: 0,
        endIndex: state.sections.length - 1,
        shouldSelectBoundarySelectors: true,
      };
    }

    if (typeof selectedSections === 'number') {
      return {
        startIndex: selectedSections,
        endIndex: selectedSections,
        shouldSelectBoundarySelectors: state.sections[selectedSections].type === 'empty',
      };
    }

    if (typeof selectedSections === 'string') {
      const selectedSectionIndex = state.sections.findIndex(
        (section) => section.type === selectedSections,
      );

      return {
        startIndex: selectedSectionIndex,
        endIndex: selectedSectionIndex,
        shouldSelectBoundarySelectors: state.sections[selectedSectionIndex].type === 'empty',
      };
    }

    return {
      ...selectedSections,
      shouldSelectBoundarySelectors:
        selectedSections.startIndex === selectedSections.endIndex &&
        state.sections[selectedSections.startIndex].type === 'empty',
    };
  }, [selectedSections, state.sections]);

  const publishValue = ({
    value,
    referenceValue,
    sections,
  }: Pick<UseFieldState<TValue, TSection>, 'value' | 'referenceValue' | 'sections'>) => {
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
        props: { ...internalProps, value, timezone },
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

    return addPositionPropertiesToSections<TSection>(newSections, isRTL);
  };

  const clearValue = () => {
    publishValue({
      value: valueManager.emptyValue,
      referenceValue: state.referenceValue,
      sections: getSectionsFromValue(valueManager.emptyValue),
    });
  };

  const clearActiveSection = () => {
    if (selectedSectionIndexes == null) {
      return;
    }

    const activeSection = state.sections[selectedSectionIndexes.startIndex];
    const activeDateManager = fieldValueManager.getActiveDateManager(utils, state, activeSection);

    const nonEmptySectionCountBefore = activeDateManager
      .getSections(state.sections)
      .filter((section) => section.value !== '').length;
    const hasNoOtherNonEmptySections =
      nonEmptySectionCountBefore === (activeSection.value === '' ? 0 : 1);

    const newSections = setSectionValue(selectedSectionIndexes.startIndex, '');
    const newActiveDate = hasNoOtherNonEmptySections ? null : utils.getInvalidDate();
    const newValues = activeDateManager.getNewValuesFromNewActiveDate(newActiveDate);

    if (
      (newActiveDate != null && !utils.isValid(newActiveDate)) !==
      (activeDateManager.date != null && !utils.isValid(activeDateManager.date))
    ) {
      publishValue({ ...newValues, sections: newSections });
    } else {
      setState((prevState) => ({
        ...prevState,
        ...newValues,
        sections: newSections,
        tempValueStrAndroid: null,
      }));
    }
  };

  const updateValueFromValueStr = (valueStr: string) => {
    const parseDateStr = (dateStr: string, referenceDate: TDate) => {
      const date = utils.parse(dateStr, format);
      if (date == null || !utils.isValid(date)) {
        return null;
      }

      const sections = splitFormatIntoSections(
        utils,
        timezone,
        localeText,
        format,
        date,
        formatDensity,
        shouldRespectLeadingZeros,
        isRTL,
      );
      return mergeDateIntoReferenceDate(utils, timezone, date, sections, referenceDate, false);
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
    if (
      shouldGoToNextSection &&
      selectedSectionIndexes &&
      selectedSectionIndexes.startIndex < state.sections.length - 1
    ) {
      setSelectedSections(selectedSectionIndexes.startIndex + 1);
    } else if (
      selectedSectionIndexes &&
      selectedSectionIndexes.startIndex !== selectedSectionIndexes.endIndex
    ) {
      setSelectedSections(selectedSectionIndexes.startIndex);
    }

    /**
     * 2. Try to build a valid date from the new section value
     */
    const activeDateManager = fieldValueManager.getActiveDateManager(utils, state, activeSection);
    const newSections = setSectionValue(selectedSectionIndexes!.startIndex, newSectionValue);
    const newActiveDateSections = activeDateManager.getSections(newSections);
    const newActiveDate = getDateFromDateSections(utils, newActiveDateSections);

    let values: Pick<UseFieldState<TValue, TSection>, 'value' | 'referenceValue'>;
    let shouldPublish: boolean;

    /**
     * If the new date is valid,
     * Then we merge the value of the modified sections into the reference date.
     * This makes sure that we don't lose some information of the initial date (like the time on a date field).
     */
    if (newActiveDate != null && utils.isValid(newActiveDate)) {
      const mergedDate = mergeDateIntoReferenceDate(
        utils,
        timezone,
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
  }, [format, utils.locale]); // eslint-disable-line react-hooks/exhaustive-deps

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
    selectedSectionIndexes,
    setSelectedSections,
    clearValue,
    clearActiveSection,
    updateSectionValue,
    updateValueFromValueStr,
    setTempAndroidValueStr,
    sectionsValueBoundaries,
    placeholder,
    timezone,
  };
};
