import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import useControlled from '@mui/utils/useControlled';
import { MuiPickersAdapter } from '../../models/muiPickersAdapter';
import { useUtils, useLocaleText, useLocalizationContext } from '../useUtils';
import {
  FieldSection,
  UseFieldForwardedProps,
  UseFieldInternalProps,
  UseFieldParams,
  UseFieldState,
  FieldSelectedSectionsIndexes,
  FieldSelectedSections,
  FieldBoundaries,
  FieldChangeHandlerContext,
} from './useField.interfaces';
import {
  addPositionPropertiesToSections,
  splitFormatIntoSections,
  clampDaySection,
  mergeDateIntoReferenceDate,
  createDateStrFromSections,
  getSectionBoundaries,
  validateSections,
} from './useField.utils';
import { InferError } from '../validation/useValidation';

interface UpdateSectionValueParams<TDate, TSection extends FieldSection> {
  activeSection: TSection;
  setSectionValueOnDate: (activeDate: TDate, boundaries: FieldBoundaries<TDate, TSection>) => TDate;
  setSectionValueOnSections: (boundaries: FieldBoundaries<TDate, TSection>) => string;
}

export const useFieldState = <
  TValue,
  TDate,
  TSection extends FieldSection,
  TForwardedProps extends UseFieldForwardedProps,
  TInternalProps extends UseFieldInternalProps<any, any>,
>(
  params: UseFieldParams<TValue, TDate, TSection, TForwardedProps, TInternalProps>,
) => {
  const utils = useUtils<TDate>() as MuiPickersAdapter<TDate>;
  const localeText = useLocaleText<TDate>();
  const adapter = useLocalizationContext<TDate>();
  const theme = useTheme();
  const isRTL = theme.direction === 'rtl';

  const {
    valueManager,
    fieldValueManager,
    supportedDateSections,
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
  const boundaries = React.useMemo(() => getSectionBoundaries<TDate, TSection>(utils), [utils]);

  const [sectionOrder, setSectionOrder] = React.useState(() =>
    fieldValueManager.getSectionOrder(utils, localeText, format, isRTL),
  );
  React.useEffect(() => {
    setSectionOrder(fieldValueManager.getSectionOrder(utils, localeText, format, isRTL));
  }, [fieldValueManager, format, isRTL, localeText, utils]);

  const [state, setState] = React.useState<UseFieldState<TValue, TSection>>(() => {
    const sections = fieldValueManager.getSectionsFromValue(
      utils,
      localeText,
      null,
      valueFromTheOutside,
      format,
    );
    validateSections(sections, supportedDateSections);

    return {
      sections,
      value: valueFromTheOutside,
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

    if (typeof selectedSections === 'number') {
      return { startIndex: selectedSections, endIndex: selectedSections };
    }

    if (typeof selectedSections === 'string') {
      const selectedSectionIndex = state.sections.findIndex(
        (section) => section.dateSectionName === selectedSections,
      );

      return { startIndex: selectedSectionIndex, endIndex: selectedSectionIndex };
    }

    return selectedSections;
  }, [selectedSections, state.sections]);

  const publishValue = ({
    value,
    referenceValue,
  }: Pick<UseFieldState<TValue, TSection>, 'value' | 'referenceValue'>) => {
    const newSections = fieldValueManager.getSectionsFromValue(
      utils,
      localeText,
      state.sections,
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
      edited: true,
    };

    return addPositionPropertiesToSections<TSection>(newSections);
  };

  const clearValue = () =>
    publishValue({
      value: valueManager.emptyValue,
      referenceValue: state.referenceValue,
    });

  const clearActiveSection = () => {
    if (selectedSectionIndexes == null) {
      return undefined;
    }

    const activeSection = state.sections[selectedSectionIndexes.startIndex];
    const activeDateManager = fieldValueManager.getActiveDateManager(utils, state, activeSection);

    const newSections = setSectionValue(selectedSectionIndexes.startIndex, '');

    return setState((prevState) => ({
      ...prevState,
      sections: newSections,
      ...activeDateManager.getNewValueFromNewActiveDate(null),
    }));
  };

  const updateValueFromValueStr = (valueStr: string) => {
    const getValueFromDateStr = (dateStr: string, referenceDate: TDate) => {
      const date = utils.parse(dateStr, format);
      if (date == null || !utils.isValid(date)) {
        return null;
      }

      const sections = splitFormatIntoSections(utils, localeText, format, date);
      return mergeDateIntoReferenceDate(utils, date, sections, referenceDate, false);
    };

    const newValue = fieldValueManager.parseValueStr(
      valueStr,
      state.referenceValue,
      getValueFromDateStr,
    );

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
    setSectionValueOnDate,
    setSectionValueOnSections,
  }: UpdateSectionValueParams<TDate, TSection>) => {
    const activeDateManager = fieldValueManager.getActiveDateManager(utils, state, activeSection);

    if (
      selectedSectionIndexes &&
      selectedSectionIndexes.startIndex !== selectedSectionIndexes.endIndex
    ) {
      setSelectedSections(selectedSectionIndexes.startIndex);
    }

    if (activeDateManager.activeDate != null && utils.isValid(activeDateManager.activeDate)) {
      const newDate = setSectionValueOnDate(activeDateManager.activeDate, boundaries);
      return publishValue(activeDateManager.getNewValueFromNewActiveDate(newDate));
    }

    // The date is not valid, we have to update the section value rather than date itself.
    const newSectionValue = setSectionValueOnSections(boundaries);
    const newSections = setSectionValue(selectedSectionIndexes!.startIndex, newSectionValue);
    const activeDateSections = fieldValueManager.getActiveDateSections(newSections, activeSection);
    let newDate = utils.parse(createDateStrFromSections(activeDateSections, false), format);

    // When all the sections are filled but the date is invalid, it can be because the month has fewer days than asked.
    // We can try to set the day to the maximum boundary.
    if (
      !utils.isValid(newDate) &&
      activeDateSections.every((section) => section.value !== '') &&
      activeDateSections.some((section) => section.dateSectionName === 'day')
    ) {
      const cleanSections = clampDaySection(utils, activeDateSections, boundaries, format);
      if (cleanSections != null) {
        newDate = utils.parse(createDateStrFromSections(cleanSections, false), format);
      }
    }

    if (newDate != null && utils.isValid(newDate)) {
      const mergedDate = mergeDateIntoReferenceDate(
        utils,
        newDate,
        activeDateSections,
        activeDateManager.referenceActiveDate,
        true,
      );

      return publishValue(activeDateManager.getNewValueFromNewActiveDate(mergedDate));
    }

    return setState((prevState) => ({
      ...prevState,
      sections: newSections,
      tempValueStrAndroid: null,
      ...activeDateManager.getNewValueFromNewActiveDate(newDate),
    }));
  };

  const setTempAndroidValueStr = (tempValueStrAndroid: string) =>
    setState((prev) => ({ ...prev, tempValueStrAndroid }));

  React.useEffect(() => {
    if (!valueManager.areValuesEqual(utils, state.value, valueFromTheOutside)) {
      const sections = fieldValueManager.getSectionsFromValue(
        utils,
        localeText,
        state.sections,
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
      state.sections,
      state.value,
      format,
    );
    validateSections(sections, supportedDateSections);
    setState((prevState) => ({
      ...prevState,
      sections,
    }));
  }, [format, utils.locale]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    state,
    selectedSectionIndexes,
    setSelectedSections,
    clearValue,
    clearActiveSection,
    updateSectionValue,
    updateValueFromValueStr,
    setTempAndroidValueStr,
    sectionOrder,
  };
};
