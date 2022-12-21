import * as React from 'react';
import { ponyfillGlobal } from '@mui/utils';
import { useTheme } from '@mui/material/styles';
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
  FieldSectionsValueBoundaries,
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

export interface UpdateSectionValueParams<TDate, TSection extends FieldSection> {
  /**
   * The section on which we want to apply the new value.
   */
  activeSection: TSection;
  /**
   * Function called if the current date is valid.
   * It must return a new date with the value of the active section updated.
   * If it returns null, the update will be ignored.
   * @template TDate, TSection
   * @param {TDate} activeDate The date to modify.
   * @param {FieldSectionsValueBoundaries<TDate, TSection>} sectionsValueBoundaries The minimum and maximum value of each section.
   * @returns {{ date: TDate; shouldGoToNextSection: boolean } | null} The modified active date and a boolean indicating if the focus should move to the next section.
   */
  setSectionValueOnDate: (
    activeDate: TDate,
    sectionsValueBoundaries: FieldSectionsValueBoundaries<TDate, TSection>,
  ) => { date: TDate; shouldGoToNextSection: boolean } | null;
  /**
   * Function called if the current date is not valid.
   * It must return the new value of the active section.
   * If it returns null, the update will be ignored.
   * @template TDate, TSection
   * @param {FieldSectionsValueBoundaries<TDate, TSection>} sectionsValueBoundaries The minimum and maximum value of each section.
   * @returns {{ sectionValue: string; shouldGoToNextSection: boolean } | null} The new value of the active section and a boolean indicating if the focus should move to the next section.
   */
  setSectionValueOnSections: (
    sectionsValueBoundaries: FieldSectionsValueBoundaries<TDate, TSection>,
  ) => { sectionValue: string; shouldGoToNextSection: boolean } | null;
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
  const utils = useUtils<TDate>();
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

  const sectionsValueBoundaries = React.useMemo(
    () => getSectionsBoundaries<TDate, TSection>(utils),
    [utils],
  );

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
    setSectionValueOnDate,
    setSectionValueOnSections,
  }: UpdateSectionValueParams<TDate, TSection>) => {
    const commit = (
      commitParams: {
        shouldGoToNextSection: boolean;
        shouldPublish: boolean;
        values: Pick<UseFieldState<TValue, TSection>, 'value' | 'referenceValue'>;
        sections?: TSection[];
      } | null,
    ) => {
      if (commitParams === null) {
        return setState((prev) => ({ ...prev, tempValueStrAndroid: null }));
      }

      const { shouldGoToNextSection, shouldPublish, values, sections } = commitParams;

      if (
        // eslint-disable-next-line no-underscore-dangle
        ponyfillGlobal.__MUI__PICKERS_ENABLE_AUTOMATIC_SECTION_SWTICH__ &&
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
        return publishValue(values);
      }

      return setState((prev) => ({
        ...prev,
        tempValueStrAndroid: null,
        ...values,
        sections: sections ?? prev.sections,
      }));
    };

    const activeDateManager = fieldValueManager.getActiveDateManager(utils, state, activeSection);
    if (activeDateManager.activeDate != null && utils.isValid(activeDateManager.activeDate)) {
      const validDateResponse = setSectionValueOnDate(
        activeDateManager.activeDate,
        sectionsValueBoundaries,
      );
      if (validDateResponse == null) {
        // The section was not updated
        return commit(null);
      }

      return commit({
        shouldGoToNextSection: validDateResponse.shouldGoToNextSection,
        shouldPublish: true,
        values: activeDateManager.getNewValueFromNewActiveDate(validDateResponse.date),
      });
    }

    // The date is not valid, we have to update the section value rather than date itself.
    const invalidDateResponse = setSectionValueOnSections(sectionsValueBoundaries);

    if (invalidDateResponse == null) {
      // The section was not updated
      return commit(null);
    }

    const newSections = setSectionValue(
      selectedSectionIndexes!.startIndex,
      invalidDateResponse.sectionValue,
    );
    const activeDateSections = fieldValueManager.getActiveDateSections(newSections, activeSection);
    let newDate = getDateFromDateSections(utils, activeDateSections);

    // When all the sections are filled but the date is invalid, it can be because the month has fewer days than asked.
    // We can try to set the day to the maximum boundary.
    if (
      !utils.isValid(newDate) &&
      activeDateSections.every((section) => section.value !== '') &&
      activeDateSections.some((section) => section.dateSectionName === 'day')
    ) {
      const cleanSections = clampDaySection(utils, activeDateSections, sectionsValueBoundaries);
      if (cleanSections != null) {
        newDate = getDateFromDateSections(utils, cleanSections);
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

      return commit({
        shouldGoToNextSection: invalidDateResponse.shouldGoToNextSection,
        shouldPublish: true,
        values: activeDateManager.getNewValueFromNewActiveDate(mergedDate),
      });
    }

    return commit({
      shouldGoToNextSection: invalidDateResponse.shouldGoToNextSection,
      shouldPublish: false,
      values: activeDateManager.getNewValueFromNewActiveDate(newDate),
      sections: newSections,
    });
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
