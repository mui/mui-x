'use client';
import * as React from 'react';
import useControlled from '@mui/utils/useControlled';
import useTimeout from '@mui/utils/useTimeout';
import useEventCallback from '@mui/utils/useEventCallback';
import { useRtl } from '@mui/system/RtlProvider';
import { usePickerAdapter, usePickerTranslations } from '../../../hooks';
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
  const adapter = usePickerAdapter();
  const translations = usePickerTranslations();
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

  const localizedDigits = React.useMemo(() => getLocalizedDigits(adapter), [adapter]);

  const sectionsValueBoundaries = React.useMemo(
    () => getSectionsBoundaries(adapter, localizedDigits, timezone),
    [adapter, localizedDigits, timezone],
  );

  const getSectionsFromValue = React.useCallback(
    (valueToAnalyze: TValue) =>
      fieldValueManager.getSectionsFromValue(valueToAnalyze, (date) =>
        buildSectionsFromFormat({
          adapter,
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
      adapter,
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
      lastSectionsDependencies: { format, isRtl, locale: adapter.locale },
      tempValueStrAndroid: null,
      characterQuery: null,
    };

    const granularity = getSectionTypeGranularity(sections);
    const referenceValue = valueManager.getInitialReferenceValue({
      referenceDate: referenceDateProp,
      value,
      adapter,
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

  // When the field loses focus (no active section), consider partially filled sections as invalid.
  // This enforces that the field must be entirely filled or entirely empty on blur.
  const hasPartiallyFilledSectionsOnBlur = React.useMemo(() => {
    if (activeSectionIndex != null) {
      return false;
    }

    const filledSections = state.sections.filter((s) => s.value !== '');
    return filledSections.length > 0 && state.sections.length - filledSections.length > 0;
  }, [state.sections, activeSectionIndex]);

  const error = React.useMemo(() => {
    if (errorProp !== undefined) {
      return errorProp;
    }

    return hasValidationError || hasPartiallyFilledSectionsOnBlur;
  }, [hasValidationError, hasPartiallyFilledSectionsOnBlur, errorProp]);

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
    if (valueManager.areValuesEqual(adapter, value, valueManager.emptyValue)) {
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
      const date = adapter.parse(dateStr, format);
      if (!adapter.isValid(date)) {
        return null;
      }

      const sections = buildSectionsFromFormat({
        adapter,
        localeText: translations,
        localizedDigits,
        format,
        date,
        formatDensity,
        shouldRespectLeadingZeros,
        enableAccessibleFieldDOMStructure,
        isRtl,
      });
      return mergeDateIntoReferenceDate(adapter, date, sections, referenceDate, false);
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
    const newActiveDate = getDateFromDateSections(adapter, newActiveDateSections, localizedDigits);

    /**
     * If the new date is valid,
     * Then we merge the value of the modified sections into the reference date.
     * This makes sure that we don't lose some information of the initial date (like the time on a date field).
     */
    if (adapter.isValid(newActiveDate)) {
      const mergedDate = mergeDateIntoReferenceDate(
        adapter,
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
     * If all the sections are filled but the date is invalid and the previous date is valid or null,
     * Then we publish an invalid date.
     */
    if (
      newActiveDateSections.every((sectionBis) => sectionBis.value !== '') &&
      (activeDate == null || adapter.isValid(activeDate))
    ) {
      setSectionUpdateToApplyOnNextInvalidDate(newSectionValue);
      return publishValue(fieldValueManager.updateDateInValue(value, section, newActiveDate));
    }

    /**
     * If the previous date is not null,
     * Then we publish the date as `newActiveDate to prevent error state oscillation`.
     * @link: https://github.com/mui/mui-x/issues/17967
     */
    if (activeDate != null) {
      setSectionUpdateToApplyOnNextInvalidDate(newSectionValue);
      publishValue(fieldValueManager.updateDateInValue(value, section, newActiveDate));
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
    const isActiveDateInvalid =
      sectionToUpdateOnNextInvalidDateRef.current != null &&
      !adapter.isValid(
        fieldValueManager.getDateFromSection(
          value,
          state.sections[sectionToUpdateOnNextInvalidDateRef.current.sectionIndex],
        ),
      );
    let sections: InferFieldSection<TValue>[];
    if (isActiveDateInvalid) {
      sections = setSectionValue(
        sectionToUpdateOnNextInvalidDateRef.current!.sectionIndex,
        sectionToUpdateOnNextInvalidDateRef.current!.value,
      );
    } else {
      sections = getSectionsFromValue(value);
    }

    setState((prevState) => ({
      ...prevState,
      lastExternalValue: value,
      sections,
      sectionsDependencies: { format, isRtl, locale: adapter.locale },
      referenceValue: isActiveDateInvalid
        ? prevState.referenceValue
        : fieldValueManager.updateReferenceValue(adapter, value, prevState.referenceValue),
      tempValueStrAndroid: null,
    }));
  }

  if (
    isRtl !== state.lastSectionsDependencies.isRtl ||
    format !== state.lastSectionsDependencies.format ||
    adapter.locale !== state.lastSectionsDependencies.locale
  ) {
    const sections = getSectionsFromValue(value);
    validateSections(sections, valueType);
    setState((prevState) => ({
      ...prevState,
      lastSectionsDependencies: { format, isRtl, locale: adapter.locale },
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
