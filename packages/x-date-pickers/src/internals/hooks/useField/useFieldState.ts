import * as React from 'react';
import useControlled from '@mui/utils/useControlled';
import useTimeout from '@mui/utils/useTimeout';
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
import { useControlledValue } from '../useControlledValue';
import {
  GetDefaultReferenceDateProps,
  getSectionTypeGranularity,
} from '../../utils/getDefaultReferenceDate';
import { PickerValidValue } from '../../models';

export interface UpdateSectionValueParams<TValue extends PickerValidValue> {
  /**
   * The section on which we want to apply the new value.
   */
  section: InferFieldSection<TValue>;
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
  value: TValue;
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

  const { value, handleValueChange, timezone } = useControlledValue({
    name: 'a field component',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    referenceDate: referenceDateProp,
    onChange,
    valueManager,
  });
  const valueRef = React.useRef(value);
  React.useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const localizedDigits = React.useMemo(() => getLocalizedDigits(utils), [utils]);

  const sectionsValueBoundaries = React.useMemo(
    () => getSectionsBoundaries(utils, localizedDigits, timezone),
    [utils, localizedDigits, timezone],
  );

  const getSectionsFromValue = React.useCallback(
    (valueToAnalyze: TValue) =>
      fieldValueManager.getSectionsFromValue(valueToAnalyze, (date) =>
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
    const sections = getSectionsFromValue(value);
    validateSections(sections, valueType);

    const stateWithoutReferenceDate: Omit<UseFieldState<TValue>, 'referenceValue'> = {
      sections,
      lastExternalValue: value,
      lastSectionsDependencies: { format, isRtl, locale: utils.locale },
      tempValueStrAndroid: null,
    };

    const granularity = getSectionTypeGranularity(sections);
    const referenceValue = valueManager.getInitialReferenceValue({
      referenceDate: referenceDateProp,
      value,
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

  const publishValue = (newValue: TValue) => {
    const context: FieldChangeHandlerContext<InferError<TInternalProps>> = {
      validationError: validator({
        adapter,
        value: newValue,
        timezone,
        props: internalProps,
      }),
    };

    handleValueChange(newValue, context);
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

  const sectionToUpdateOnNextInvalidDateRef = React.useRef<{
    sectionIndex: number;
    value: string;
  } | null>(null);
  const timeoutToUpdateSectionValueOnNextInvalidDate = useTimeout();
  const setSectionUpdateToApplyOnNextInvalidDate = (newSectionValue: string) => {
    if (activeSectionIndex == null) {
      return;
    }

    sectionToUpdateOnNextInvalidDateRef.current = {
      sectionIndex: activeSectionIndex,
      value: newSectionValue,
    };
    timeoutToUpdateSectionValueOnNextInvalidDate.start(0, () => {
      sectionToUpdateOnNextInvalidDateRef.current = null;
    });
  };

  const clearValue = () => {
    if (valueManager.areValuesEqual(utils, value, valueManager.emptyValue)) {
      setState((prevState) => ({
        ...prevState,
        sections: prevState.sections.map((section) => ({ ...section, value: '' })),
        tempValueStrAndroid: null,
      }));
    } else {
      publishValue(valueManager.emptyValue);
    }
  };

  const clearActiveSection = () => {
    if (activeSectionIndex == null) {
      return;
    }

    const activeSection = state.sections[activeSectionIndex];
    if (activeSection.value === '') {
      return;
    }

    setSectionUpdateToApplyOnNextInvalidDate('');

    if (fieldValueManager.getDateFromSection(value, activeSection) === null) {
      setState((prevState) => ({
        ...prevState,
        sections: setSectionValue(activeSectionIndex, ''),
        tempValueStrAndroid: null,
      }));
    } else {
      publishValue(fieldValueManager.updateDateInValue(value, activeSection, null));
    }
  };

  const updateValueFromValueStr = (valueStr: string) => {
    const parseDateStr = (dateStr: string, referenceDate: PickerValidDate) => {
      const date = utils.parse(dateStr, format);
      if (!utils.isValid(date)) {
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
    publishValue(newValue);
  };

  const timeoutToCleanActiveDateSectionsIfValueNull = useTimeout();
  const updateSectionValue = ({
    section,
    newSectionValue,
    shouldGoToNextSection,
  }: UpdateSectionValueParams<TValue>) => {
    timeoutToUpdateSectionValueOnNextInvalidDate.clear();
    timeoutToCleanActiveDateSectionsIfValueNull.clear();

    const activeDate = fieldValueManager.getDateFromSection(value, section);

    /**
     * Decide which section should be focused
     */
    if (shouldGoToNextSection && activeSectionIndex! < state.sections.length - 1) {
      setSelectedSections(activeSectionIndex! + 1);
    }

    /**
     * Try to build a valid date from the new section value
     */
    const newSections = setSectionValue(activeSectionIndex!, newSectionValue);
    const newActiveDateSections = fieldValueManager.getDateSectionsFromValue(newSections, section);
    const newActiveDate = getDateFromDateSections(utils, newActiveDateSections, localizedDigits);

    /**
     * If the new date is valid,
     * Then we merge the value of the modified sections into the reference date.
     * This makes sure that we don't lose some information of the initial date (like the time on a date field).
     */
    if (utils.isValid(newActiveDate)) {
      const mergedDate = mergeDateIntoReferenceDate(
        utils,
        newActiveDate,
        newActiveDateSections,
        fieldValueManager.getDateFromSection(state.referenceValue as any, section)!,
        true,
      );

      if (activeDate == null) {
        timeoutToCleanActiveDateSectionsIfValueNull.start(0, () => {
          if (valueRef.current === value) {
            setState((prevState) => ({
              ...prevState,
              sections: fieldValueManager.clearDateSections(state.sections, section),
              tempValueStrAndroid: null,
            }));
          }
        });
      }

      return publishValue(fieldValueManager.updateDateInValue(value, section, mergedDate));
    }

    /**
     * If all the sections are filled but the date is invalid,
     * Then we publish an invalid date.
     */
    if (newActiveDateSections.every((sectionBis) => sectionBis.value !== '')) {
      setSectionUpdateToApplyOnNextInvalidDate(newSectionValue);
      return publishValue(fieldValueManager.updateDateInValue(value, section, newActiveDate));
    }

    /**
     * If the previous date is not null,
     * Then we publish the date as `null`.
     */
    if (activeDate != null) {
      setSectionUpdateToApplyOnNextInvalidDate(newSectionValue);
      return publishValue(fieldValueManager.updateDateInValue(value, section, null));
    }

    /**
     * If the previous date is already null,
     * Then we don't publish the date and we update the sections.
     */
    return setState((prevState) => ({
      ...prevState,
      sections: newSections,
      tempValueStrAndroid: null,
    }));
  };

  const setTempAndroidValueStr = (tempValueStrAndroid: string | null) =>
    setState((prev) => ({ ...prev, tempValueStrAndroid }));

  // If `prop.value` changes, we update the state to reflect the new value
  if (value !== state.lastExternalValue) {
    let sections: InferFieldSection<TValue>[];
    if (
      sectionToUpdateOnNextInvalidDateRef.current != null &&
      !utils.isValid(
        fieldValueManager.getDateFromSection(
          value,
          state.sections[sectionToUpdateOnNextInvalidDateRef.current.sectionIndex],
        ),
      )
    ) {
      sections = setSectionValue(
        sectionToUpdateOnNextInvalidDateRef.current.sectionIndex,
        sectionToUpdateOnNextInvalidDateRef.current.value,
      );
    } else {
      sections = getSectionsFromValue(value);
    }

    setState((prevState) => ({
      ...prevState,
      lastExternalValue: value,
      sections,
      sectionsDependencies: { format, isRtl, locale: utils.locale },
      referenceValue: fieldValueManager.updateReferenceValue(
        utils,
        value,
        prevState.referenceValue,
      ),
      tempValueStrAndroid: null,
    }));
  }

  if (
    isRtl !== state.lastSectionsDependencies.isRtl ||
    format !== state.lastSectionsDependencies.format ||
    utils.locale !== state.lastSectionsDependencies.locale
  ) {
    const sections = getSectionsFromValue(value);
    validateSections(sections, valueType);
    setState((prevState) => ({
      ...prevState,
      lastSectionsDependencies: { format, isRtl, locale: utils.locale },
      sections,
      tempValueStrAndroid: null,
    }));
  }

  React.useEffect(() => {
    if (sectionToUpdateOnNextInvalidDateRef.current != null) {
      sectionToUpdateOnNextInvalidDateRef.current = null;
    }
  });

  return {
    state,
    value,
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
