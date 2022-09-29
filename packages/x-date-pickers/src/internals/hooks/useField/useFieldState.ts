import * as React from 'react';
import useControlled from '@mui/utils/useControlled';
import { MuiPickerFieldAdapter } from '../../models/muiPickersAdapter';
import { useUtils } from '../useUtils';
import {
  FieldSection,
  UseFieldForwardedProps,
  UseFieldInternalProps,
  UseFieldParams,
  UseFieldState,
  FieldSelectedSectionsIndexes,
  FieldSelectedSections,
} from './useField.interfaces';
import {
  addPositionPropertiesToSections,
  applySectionValueToDate,
  createDateStrFromSections,
  validateSections,
} from './useField.utils';

interface UpdateSectionValueParams<TDate, TSection> {
  setSectionValueOnDate: (activeSection: TSection, activeDate: TDate) => TDate;
  setSectionValueOnSections: (activeSection: TSection, referenceActiveDate: TDate) => string;
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
  const utils = useUtils<TDate>() as MuiPickerFieldAdapter<TDate>;

  const {
    valueManager,
    fieldValueManager,
    supportedDateSections,
    internalProps: {
      value: valueProp,
      defaultValue,
      onChange,
      readOnly,
      format,
      selectedSections: selectedSectionsProp,
      onSelectedSectionsChange,
    },
  } = params;

  const firstDefaultValue = React.useRef(defaultValue);
  const valueFromTheOutside = valueProp ?? firstDefaultValue.current ?? valueManager.emptyValue;

  const [state, setState] = React.useState<UseFieldState<TValue, TSection>>(() => {
    const sections = fieldValueManager.getSectionsFromValue(
      utils,
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
      selectedSectionIndexes: null,
    };
  });

  const [selectedSections, setSelectedSection] = useControlled({
    controlled: selectedSectionsProp,
    default: null,
    name: 'useField',
    state: 'selectedSectionIndexes',
  });

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
      state.sections,
      value,
      format,
    );

    setState((prevState) => ({
      ...prevState,
      sections: newSections,
      value,
      referenceValue,
    }));

    onChange?.(value);
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
    const activeDateManager = fieldValueManager.getActiveDateManager(state, activeSection);

    const newSections = setSectionValue(selectedSectionIndexes.startIndex, '');

    return setState((prevState) => ({
      ...prevState,
      sections: newSections,
      value: activeDateManager.setActiveDateAsInvalid(),
    }));
  };

  const updateSectionValue = ({
    setSectionValueOnDate,
    setSectionValueOnSections,
  }: UpdateSectionValueParams<TDate, TSection>) => {
    if (readOnly || selectedSectionIndexes == null) {
      return undefined;
    }

    const activeSection = state.sections[selectedSectionIndexes.startIndex];
    const activeDateManager = fieldValueManager.getActiveDateManager(state, activeSection);

    if (activeDateManager.activeDate != null && utils.isValid(activeDateManager.activeDate)) {
      const newDate = setSectionValueOnDate(activeSection, activeDateManager.activeDate);
      return publishValue(activeDateManager.getNewValueFromNewActiveDate(newDate));
    }

    // The date is not valid, we have to update the section value rather than date itself.
    const newSectionValue = setSectionValueOnSections(
      activeSection,
      activeDateManager.referenceActiveDate,
    );
    const newSections = setSectionValue(selectedSectionIndexes.startIndex, newSectionValue);
    const activeDateSections = fieldValueManager.getActiveDateSections(newSections, activeSection);
    const newDate = utils.parse(createDateStrFromSections(activeDateSections), format);

    if (newDate != null && utils.isValid(newDate)) {
      let mergedDate = activeDateManager.referenceActiveDate;

      activeDateSections.forEach((section) => {
        if (section.edited) {
          mergedDate = applySectionValueToDate({
            utils,
            date: mergedDate,
            dateSectionName: section.dateSectionName,
            getSectionValue: (getter) => getter(newDate),
          });
        }
      });

      return publishValue(activeDateManager.getNewValueFromNewActiveDate(mergedDate));
    }

    return setState((prevState) => ({
      ...prevState,
      sections: newSections,
      value: activeDateManager.setActiveDateAsInvalid(),
    }));
  };

  const setSelectedSections = (newSelectedSections: FieldSelectedSections) => {
    setSelectedSection(newSelectedSections);
    onSelectedSectionsChange?.(newSelectedSections);

    setState((prevState) => ({
      ...prevState,
      selectedSectionQuery: null,
    }));
  };

  React.useEffect(() => {
    if (!valueManager.areValuesEqual(utils, state.value, valueFromTheOutside)) {
      const sections = fieldValueManager.getSectionsFromValue(
        utils,
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
      state.sections,
      state.value,
      format,
    );
    validateSections(sections, supportedDateSections);
    setState((prevState) => ({
      ...prevState,
      sections,
    }));
  }, [format]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    state,
    selectedSectionIndexes,
    setSelectedSections,
    clearValue,
    clearActiveSection,
    updateSectionValue,
  };
};
