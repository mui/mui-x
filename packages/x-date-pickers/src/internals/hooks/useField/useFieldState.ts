import * as React from 'react';
import useControlled from '@mui/utils/useControlled';
import useTimeout from '@mui/utils/useTimeout';
import useEventCallback from '@mui/utils/useEventCallback';
import { useRtl } from '@mui/system/RtlProvider';
import { usePickerTranslations } from '../../../hooks/usePickerTranslations';
import { useUtils, useLocalizationContext } from '../useUtils';
import {
  UseFieldInternalProps,
  UseFieldState,
  FieldParsedSelectedSections,
  FieldChangeHandlerContext,
  FieldSectionsValueBoundaries,
  SectionOrdering,
  UseFieldForwardedProps,
  CharacterEditingQuery,
} from './useField.types';
import {
  mergeDateIntoReferenceDate,
  getSectionsBoundaries,
  validateSections,
  getDateFromDateSections,
  parseSelectedSections,
  getLocalizedDigits,
  getSectionOrder,
} from './useField.utils';
import { buildSectionsFromFormat } from './buildSectionsFromFormat';
import {
  FieldSelectedSections,
  PickersTimezone,
  PickerValidDate,
  InferFieldSection,
  PickerManager,
} from '../../../models';
import { useValidation } from '../../../validation';
import { useControlledValue } from '../useControlledValue';
import {
  GetDefaultReferenceDateProps,
  getSectionTypeGranularity,
} from '../../utils/getDefaultReferenceDate';
import { PickerValidValue } from '../../models';

const QUERY_LIFE_DURATION_MS = 5000;

export const useFieldState = <
  TValue extends PickerValidValue,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
  TValidationProps extends {},
  TForwardedProps extends UseFieldForwardedProps<TEnableAccessibleFieldDOMStructure>,
>(
  parameters: UseFieldStateParameters<
    TValue,
    TEnableAccessibleFieldDOMStructure,
    TError,
    TValidationProps,
    TForwardedProps
  >,
): UseFieldStateReturnValue<TValue> => {
  const utils = useUtils();
  const translations = usePickerTranslations();
  const adapter = useLocalizationContext();
  const isRtl = useRtl();

  const {
    manager: {
      validator,
      valueType,
      internal_valueManager: valueManager,
      internal_fieldValueManager: fieldValueManager,
    },
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
      enableAccessibleFieldDOMStructure = true,
    },
    forwardedProps: { error: errorProp },
  } = parameters;

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

  const { hasValidationError } = useValidation({
    props: internalPropsWithDefaults,
    validator,
    timezone,
    value,
    onError: internalPropsWithDefaults.onError,
  });

  const error = React.useMemo(() => {
    // only override when `error` is undefined.
    // in case of multi input fields, the `error` value is provided externally and will always be defined.
    if (errorProp !== undefined) {
      return errorProp;
    }

    return hasValidationError;
  }, [hasValidationError, errorProp]);

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
      characterQuery: null,
    };

    const granularity = getSectionTypeGranularity(sections);
    const referenceValue = valueManager.getInitialReferenceValue({
      referenceDate: referenceDateProp,
      value,
      utils,
      props: internalPropsWithDefaults as GetDefaultReferenceDateProps,
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

  const sectionOrder = React.useMemo(
    () => getSectionOrder(state.sections, isRtl && !enableAccessibleFieldDOMStructure),
    [state.sections, isRtl, enableAccessibleFieldDOMStructure],
  );

  const areAllSectionsEmpty = React.useMemo(
    () => state.sections.every((section) => section.value === ''),
    [state.sections],
  );

  const publishValue = (newValue: TValue) => {
    const context: FieldChangeHandlerContext<TError> = {
      validationError: validator({
        adapter,
        value: newValue,
        timezone,
        props: internalPropsWithDefaults,
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
  const updateSectionValueOnNextInvalidDateTimeout = useTimeout();
  const setSectionUpdateToApplyOnNextInvalidDate = (newSectionValue: string) => {
    if (activeSectionIndex == null) {
      return;
    }

    sectionToUpdateOnNextInvalidDateRef.current = {
      sectionIndex: activeSectionIndex,
      value: newSectionValue,
    };
    updateSectionValueOnNextInvalidDateTimeout.start(0, () => {
      sectionToUpdateOnNextInvalidDateRef.current = null;
    });
  };

  const clearValue = () => {
    if (valueManager.areValuesEqual(utils, value, valueManager.emptyValue)) {
      setState((prevState) => ({
        ...prevState,
        sections: prevState.sections.map((section) => ({ ...section, value: '' })),
        tempValueStrAndroid: null,
        characterQuery: null,
      }));
    } else {
      setState((prevState) => ({ ...prevState, characterQuery: null }));
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
        characterQuery: null,
      }));
    } else {
      setState((prevState) => ({ ...prevState, characterQuery: null }));
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

  const cleanActiveDateSectionsIfValueNullTimeout = useTimeout();
  const updateSectionValue = ({
    section,
    newSectionValue,
    shouldGoToNextSection,
  }: UpdateSectionValueParameters<TValue>) => {
    updateSectionValueOnNextInvalidDateTimeout.clear();
    cleanActiveDateSectionsIfValueNullTimeout.clear();

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
        cleanActiveDateSectionsIfValueNullTimeout.start(0, () => {
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
    setState((prevState) => ({ ...prevState, tempValueStrAndroid }));

  const setCharacterQuery = useEventCallback((newCharacterQuery: CharacterEditingQuery | null) => {
    setState((prevState) => ({ ...prevState, characterQuery: newCharacterQuery }));
  });

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
      characterQuery: null,
    }));
  }

  if (state.characterQuery != null && !error && activeSectionIndex == null) {
    setCharacterQuery(null);
  }

  if (
    state.characterQuery != null &&
    state.sections[state.characterQuery.sectionIndex]?.type !== state.characterQuery.sectionType
  ) {
    setCharacterQuery(null);
  }

  React.useEffect(() => {
    if (sectionToUpdateOnNextInvalidDateRef.current != null) {
      sectionToUpdateOnNextInvalidDateRef.current = null;
    }
  });

  const cleanCharacterQueryTimeout = useTimeout();
  React.useEffect(() => {
    if (state.characterQuery != null) {
      cleanCharacterQueryTimeout.start(QUERY_LIFE_DURATION_MS, () => setCharacterQuery(null));
    }

    return () => {};
  }, [state.characterQuery, setCharacterQuery, cleanCharacterQueryTimeout]);

  // If `tempValueStrAndroid` is still defined for some section when running `useEffect`,
  // Then `onChange` has only been called once, which means the user pressed `Backspace` to reset the section.
  // This causes a small flickering on Android,
  // But we can't use `useEnhancedEffect` which is always called before the second `onChange` call and then would cause false positives.
  React.useEffect(() => {
    if (state.tempValueStrAndroid != null && activeSectionIndex != null) {
      clearActiveSection();
    }
  }, [state.sections]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // States and derived states
    activeSectionIndex,
    areAllSectionsEmpty,
    error,
    localizedDigits,
    parsedSelectedSections,
    sectionOrder,
    sectionsValueBoundaries,
    state,
    timezone,
    value,

    // Methods to update the states
    clearValue,
    clearActiveSection,
    setCharacterQuery,
    setSelectedSections,
    setTempAndroidValueStr,
    updateSectionValue,
    updateValueFromValueStr,

    // Utilities methods
    getSectionsFromValue,
  };
};

interface UseFieldStateParameters<
  TValue extends PickerValidValue,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
  TValidationProps extends {},
  TForwardedProps extends UseFieldForwardedProps<TEnableAccessibleFieldDOMStructure>,
> {
  manager: PickerManager<TValue, TEnableAccessibleFieldDOMStructure, TError, TValidationProps, any>;
  internalPropsWithDefaults: UseFieldInternalProps<
    TValue,
    TEnableAccessibleFieldDOMStructure,
    TError
  > &
    TValidationProps;
  forwardedProps: TForwardedProps;
}

export interface UpdateSectionValueParameters<TValue extends PickerValidValue> {
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

export interface UseFieldStateReturnValue<TValue extends PickerValidValue> {
  // States and derived states
  activeSectionIndex: number | null;
  areAllSectionsEmpty: boolean;
  error: boolean;
  localizedDigits: string[];
  parsedSelectedSections: FieldParsedSelectedSections;
  sectionOrder: SectionOrdering;
  sectionsValueBoundaries: FieldSectionsValueBoundaries;
  state: UseFieldState<TValue>;
  timezone: PickersTimezone;
  value: TValue;

  // Methods to update the states
  clearValue: () => void;
  clearActiveSection: () => void;
  setCharacterQuery: (characterQuery: CharacterEditingQuery | null) => void;
  setSelectedSections: (sections: FieldSelectedSections) => void;
  setTempAndroidValueStr: (tempAndroidValueStr: string | null) => void;
  updateSectionValue: (parameters: UpdateSectionValueParameters<TValue>) => void;
  updateValueFromValueStr: (valueStr: string) => void;

  // Utilities methods
  getSectionsFromValue: (
    value: TValue,
    fallbackSections?: InferFieldSection<TValue>[] | null,
  ) => InferFieldSection<TValue>[];
}
