import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { useDefaultDates, useUtils } from '../internals/hooks/useUtils';
import { DateView, MuiPickersAdapter } from '../internals/models';
import {
  DateCalendarSlotsComponent,
  DateCalendarSlotsComponentsProps,
  ExportedDateCalendarProps,
} from '../DateCalendar/DateCalendar.types';
import { DateValidationError } from '../internals/hooks/validation/useDateValidation';
import { ValidationCommonProps } from '../internals/hooks/validation/useValidation';
import { ExportedDateInputProps } from '../internals/components/PureDateInput';
import { BasePickerProps } from '../internals/models/props/basePickerProps';
import { applyDefaultDate } from '../internals/utils/date-utils';
import { DefaultizedProps } from '../internals/models/helpers';
import { BaseDateValidationProps } from '../internals/hooks/validation/models';
import {
  DatePickerToolbar,
  DatePickerToolbarProps,
  ExportedDatePickerToolbarProps,
} from './DatePickerToolbar';
import { isYearOnlyView, isYearAndMonthViews } from '../internals/utils/views';
import { LocalizedComponent, PickersInputLocaleText } from '../locales/utils/pickersLocaleTextApi';

export interface BaseDatePickerSlotsComponent<TDate> extends DateCalendarSlotsComponent<TDate> {
  /**
   * Custom component for the toolbar rendered above the views.
   * @default DatePickerToolbar
   */
  Toolbar?: React.JSXElementConstructor<DatePickerToolbarProps<TDate>>;
}

export interface BaseDatePickerSlotsComponentsProps<TDate>
  extends DateCalendarSlotsComponentsProps<TDate> {
  toolbar?: ExportedDatePickerToolbarProps;
}

export interface BaseDatePickerProps<TDate>
  extends Omit<ExportedDateCalendarProps<TDate>, 'value' | 'onChange' | 'defaultValue'>,
    BasePickerProps<TDate | null, TDate>,
    ValidationCommonProps<DateValidationError, TDate | null>,
    ExportedDateInputProps<TDate> {
  /**
   * Callback fired on view change.
   * @param {DateView} view The new view.
   */
  onViewChange?: (view: DateView) => void;
  /**
   * First view to show.
   * Must be a valid option from `views` list
   * @default 'day'
   */
  openTo?: DateView;
  /**
   * Array of views to show.
   * @default ['year', 'day']
   */
  views?: readonly DateView[];
  /**
   * Overrideable components.
   * @default {}
   */
  components?: BaseDatePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: BaseDatePickerSlotsComponentsProps<TDate>;
}

const getFormatAndMaskByViews = <TDate>(
  views: readonly DateView[],
  utils: MuiPickersAdapter<TDate>,
): { disableMaskedInput?: boolean; inputFormat: string; mask?: string } => {
  if (isYearOnlyView(views)) {
    return {
      inputFormat: utils.formats.year,
    };
  }

  if (isYearAndMonthViews(views)) {
    return {
      disableMaskedInput: true,
      inputFormat: utils.formats.monthAndYear,
    };
  }

  return {
    inputFormat: utils.formats.keyboardDate,
  };
};

export function useDatePickerDefaultizedProps<TDate, Props extends BaseDatePickerProps<TDate>>(
  props: Props,
  name: string,
): LocalizedComponent<
  TDate,
  DefaultizedProps<
    Props,
    'openTo' | 'views' | keyof BaseDateValidationProps<TDate>,
    { inputFormat: string }
  >
> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();

  // This is technically unsound if the type parameters appear in optional props.
  // Optional props can be filled by `useThemeProps` with types that don't match the type parameters.
  const themeProps = useThemeProps({
    props,
    name,
  });

  const views = themeProps.views ?? ['year', 'day'];

  const localeText = React.useMemo<PickersInputLocaleText<TDate> | undefined>(() => {
    if (themeProps.localeText?.toolbarTitle == null) {
      return themeProps.localeText;
    }

    return {
      ...themeProps.localeText,
      datePickerToolbarTitle: themeProps.localeText.toolbarTitle,
    };
  }, [themeProps.localeText]);

  return {
    openTo: 'day',
    disableFuture: false,
    disablePast: false,
    ...getFormatAndMaskByViews(views, utils),
    ...themeProps,
    views,
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
    localeText,
    components: { Toolbar: DatePickerToolbar, ...themeProps.components },
  };
}
