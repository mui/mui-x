import * as React from 'react';
import useControlled from '@mui/utils/useControlled';
import { useUtils, useLocaleText, useLocalizationContext } from '../useUtils';
import {
  FieldSection,
  UseFieldForwardedProps,
  UseFieldInternalProps,
  UseFieldParams,
  UseFieldState,
  FieldSelectedSectionsIndexes,
  FieldSelectedSections,
  FieldChangeHandlerContext,
} from './useField.types';
import {
  addPositionPropertiesToSections,
  splitFormatIntoSections,
  clampDaySection,
  mergeDateIntoReferenceDate,
  getSectionsBoundaries,
  validateSections,
  getDateFromDateSections,
} from './useField.utils';
import { InferError } from '../validation/useValidation';

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
  TInternalProps extends UseFieldInternalProps<any, any, any>,
>(
  params: UseFieldParams<TValue, TDate, TSection, TForwardedProps, TInternalProps>,
) => {
  const utils = useUtils<TDate>();
  const localeText = useLocaleText<TDate>();
  const adapter = useLocalizationContext<TDate>();

  const {
    valueManager,
    fieldValueManager,
    valueType,
    validator,
    internalProps,
    internalProps: {
      value: valueProp,
      defaultValue,
      onChange,
      format,
      selectedSections: selectedSectionsProp,
      onSelectedSectionsChange,
    },
  } = params;

  const firstDefaultValue = React.useRef(defaultValue);
  const valueFromTheOutside = valueProp ?? firstDefaultValue.current ?? valueManager.emptyValue;

  const sectionsValueBoundaries = React.useMemo(() => getSectionsBoundaries<TDate>(utils), [utils]);

  const placeholder = React.useMemo(
    () =>
      fieldValueManager.getValueStrFromSections(
        fieldValueManager.getSectionsFromValue(
          utils,
          localeText,
          null,
          valueManager.emptyValue,
          format,
        ),
      ),
    [fieldValueManager, format, localeText, utils, valueManager.emptyValue],
  );

  const [state, setState] = React.useState<UseFieldState<TValue, TSection>>(() => {
    const sections = fieldValueManager.getSectionsFromValue(
      utils,
      localeText,
      null,
      valueFromTheOutside,
      format,
    );
    validateSections(sections, valueType);

    return {
      sections,
      value: valueFromTheOutside,
      placeholder,
      referenceValue: fieldValueManager.updateReferenceValue(
        utils,
        valueFromTheOutside,
        valueManager.getTodayValue(utils),
      ),
      tempValueStrAndroid: null,
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
      return { startIndex: selectedSections, endIndex: selectedSections };
    }

    if (typeof selectedSections === 'string') {
      const selectedSectionIndex = state.sections.findIndex(
        (section) => section.type === selectedSections,
      );

      return { startIndex: selectedSectionIndex, endIndex: selectedSectionIndex };
    }

    return selectedSections;
  }, [selectedSections, state.sections]);

  const publishValue = (
    { value, referenceValue }: Pick<UseFieldState<TValue, TSection>, 'value' | 'referenceValue'>,
    sections: TSection[] | null = state.sections,
  ) => {
    const newSections = fieldValueManager.getSectionsFromValue(
      utils,
      localeText,
      sections,
      value,
      format,
    );

    setState((prevState) => ({
      ...prevState,
      sections: newSections,
      value,
      referenceValue,
      tempValueStrAndroid: null,
    }));

    if (onChange) {
      const context: FieldChangeHandlerContext<InferError<TInternalProps>> = {
        validationError: validator({ adapter, value, props: { ...internalProps, value } }),
      };

      onChange(value, context);
    }
  };

  const setSectionValue = (sectionIndex: number, newSectionValue: string) => {
    const newSections = [...state.sections];

    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      value: newSectionValue,
      modified: true,
    };

    return addPositionPropertiesToSections<TSection>(newSections);
  };

  const clearValue = () => {
    if (valueManager.areValuesEqual(utils, state.value, valueManager.emptyValue)) {
      return;
    }

    publishValue(
      {
        value: valueManager.emptyValue,
        referenceValue: state.referenceValue,
      },
      null,
    );
  };

  const clearActiveSection = () => {
    if (selectedSectionIndexes == null) {
      return;
    }

    const activeSection = state.sections[selectedSectionIndexes.startIndex];

    if (activeSection.value === '') {
      return;
    }

    const activeDateManager = fieldValueManager.getActiveDateManager(utils, state, activeSection);
    const activeDateSections = fieldValueManager.getActiveDateSections(
      state.sections,
      activeSection,
    );

    const nonEmptySectionCountBefore = activeDateSections.filter(
      (section) => section.value !== '',
    ).length;
    const isTheOnlyNonEmptySection = nonEmptySectionCountBefore === 1;

    const newSections = setSectionValue(selectedSectionIndexes.startIndex, '');
    const newActiveDate = isTheOnlyNonEmptySection ? null : utils.date(new Date(''));
    const newValue = activeDateManager.getNewValueFromNewActiveDate(newActiveDate);

    if (
      (newActiveDate != null && !utils.isValid(newActiveDate)) !==
      (activeDateManager.activeDate != null && !utils.isValid(activeDateManager.activeDate))
    ) {
      publishValue(newValue, newSections);
    } else {
      setState((prevState) => ({
        ...prevState,
        ...newValue,
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

      const sections = splitFormatIntoSections(utils, localeText, format, date);
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
    });
  };

  const updateSectionValue = ({
    activeSection,
    newSectionValue,
    shouldGoToNextSection,
  }: UpdateSectionValueParams<TSection>) => {
    const commit = ({
      values,
      sections,
      shouldPublish,
    }: {
      values: Pick<UseFieldState<TValue, TSection>, 'value' | 'referenceValue'>;
      sections?: TSection[];
      shouldPublish: boolean;
    }) => {
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

      if (shouldPublish) {
        publishValue(values, sections);
      } else {
        setState((prevState) => ({
          ...prevState,
          ...values,
          sections: sections ?? state.sections,
          tempValueStrAndroid: null,
        }));
      }
    };

    const activeDateManager = fieldValueManager.getActiveDateManager(utils, state, activeSection);
    const newSections = setSectionValue(selectedSectionIndexes!.startIndex, newSectionValue);
    const activeDateSections = fieldValueManager.getActiveDateSections(newSections, activeSection);
    let newActiveDate = getDateFromDateSections(utils, activeDateSections);

    // When all the sections are filled but the date is invalid, it can be because the month has fewer days than asked.
    // We can try to set the day to the maximum boundary.
    if (
      !utils.isValid(newActiveDate) &&
      activeDateSections.every((section) => section.type === 'weekDay' || section.value !== '') &&
      activeDateSections.some((section) => section.type === 'day')
    ) {
      const cleanSections = clampDaySection(utils, activeDateSections, sectionsValueBoundaries);
      if (cleanSections != null) {
        newActiveDate = getDateFromDateSections(utils, cleanSections);
      }
    }

    if (newActiveDate != null && utils.isValid(newActiveDate)) {
      const mergedDate = mergeDateIntoReferenceDate(
        utils,
        newActiveDate,
        activeDateSections,
        activeDateManager.referenceActiveDate,
        true,
      );

      return commit({
        values: activeDateManager.getNewValueFromNewActiveDate(mergedDate),
        shouldPublish: true,
      });
    }

    return commit({
      values: activeDateManager.getNewValueFromNewActiveDate(newActiveDate),
      sections: newSections,
      shouldPublish:
        (newActiveDate != null && !utils.isValid(newActiveDate)) !==
        (activeDateManager.activeDate != null && !utils.isValid(activeDateManager.activeDate)),
    });
  };

  const setTempAndroidValueStr = (tempValueStrAndroid: string | null) =>
    setState((prev) => ({ ...prev, tempValueStrAndroid }));

  React.useEffect(() => {
    if (!valueManager.areValuesEqual(utils, state.value, valueFromTheOutside)) {
      const sections = fieldValueManager.getSectionsFromValue(
        utils,
        localeText,
        null,
        valueFromTheOutside,
        format,
      );

      setState((prevState) => ({
        ...prevState,
        value: valueFromTheOutside,
        referenceValue: fieldValueManager.updateReferenceValue(
          utils,
          valueFromTheOutside,
          prevState.referenceValue,
        ),
        sections,
      }));
    }
  }, [valueFromTheOutside]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    const sections = fieldValueManager.getSectionsFromValue(
      utils,
      localeText,
      null,
      state.value,
      format,
    );
    validateSections(sections, valueType);
    setState((prevState) => ({
      ...prevState,
      sections,
      placeholder,
    }));
  }, [format, utils.locale, placeholder]); // eslint-disable-line react-hooks/exhaustive-deps

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
  };
};
