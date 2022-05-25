import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { useDefaultDates, useUtils } from '../internals/hooks/useUtils';
import { CalendarPickerView, MuiPickersAdapter } from '../internals/models';
import { ExportedCalendarPickerProps } from '../CalendarPicker/CalendarPicker';
import { DateValidationError } from '../internals/hooks/validation/useDateValidation';
import { ValidationProps } from '../internals/hooks/validation/useValidation';
import { ExportedDateInputProps } from '../internals/components/PureDateInput';
import { BasePickerProps } from '../internals/models/props/basePickerProps';
import { PickerStateValueManager } from '../internals/hooks/usePickerState';
import { parsePickerInputValue } from '../internals/utils/date-utils';
import { BaseToolbarProps } from '../internals/models/props/baseToolbarProps';

export interface BaseDatePickerProps<TInputDate, TDate>
  extends ExportedCalendarPickerProps<TDate>,
    BasePickerProps<TInputDate | null, TDate | null>,
    ValidationProps<DateValidationError, TInputDate | null>,
    ExportedDateInputProps<TInputDate, TDate> {
  /**
   * Callback fired on view change.
   * @param {CalendarPickerView} view The new view.
   */
  onViewChange?: (view: CalendarPickerView) => void;
  /**
   * First view to show.
   */
  openTo?: CalendarPickerView;
  /**
   * Component that will replace default toolbar renderer.
   * @default DatePickerToolbar
   */
  ToolbarComponent?: React.JSXElementConstructor<BaseToolbarProps<TDate, TDate | null>>;
  /**
   * Mobile picker date value placeholder, displaying if `value` === `null`.
   * @default '–'
   */
  toolbarPlaceholder?: React.ReactNode;
  /**
   * Date format, that is displaying in toolbar.
   */
  toolbarFormat?: string;
  /**
   * Mobile picker title, displaying in the toolbar.
   * @default 'Select date'
   */
  toolbarTitle?: React.ReactNode;
  /**
   * Array of views to show.
   */
  views?: readonly CalendarPickerView[];
}

export const isYearOnlyView = (
  views: readonly CalendarPickerView[],
): views is ReadonlyArray<'year'> => views.length === 1 && views[0] === 'year';

export const isYearAndMonthViews = (
  views: readonly CalendarPickerView[],
): views is ReadonlyArray<'month' | 'year'> =>
  views.length === 2 && views.indexOf('month') !== -1 && views.indexOf('year') !== -1;

const getFormatAndMaskByViews = <TDate>(
  views: readonly CalendarPickerView[],
  utils: MuiPickersAdapter<TDate>,
): { disableMaskedInput?: boolean; inputFormat: string; mask?: string } => {
  if (isYearOnlyView(views)) {
    return {
      mask: '____',
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
    mask: '__/__/____',
    inputFormat: utils.formats.keyboardDate,
  };
};

export type DefaultizedProps<Props> = Props & { inputFormat: string };

export function useDatePickerDefaultizedProps<
  TInputDate,
  TDate,
  Props extends BaseDatePickerProps<TInputDate, TDate>,
>(
  props: Props,
  name: string,
): DefaultizedProps<Props> &
  Required<Pick<BaseDatePickerProps<TInputDate, TDate>, 'openTo' | 'views'>> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates();

  // This is technically unsound if the type parameters appear in optional props.
  // Optional props can be filled by `useThemeProps` with types that don't match the type parameters.
  const themeProps = useThemeProps({
    props,
    name,
  });

  const views = themeProps.views ?? ['year', 'day'];

  return {
    openTo: 'day',
    minDate: defaultDates.minDate,
    maxDate: defaultDates.maxDate,
    ...getFormatAndMaskByViews(views, utils),
    ...themeProps,
    views,
  };
}

export const datePickerValueManager: PickerStateValueManager<any, any, any> = {
  emptyValue: null,
  getTodayValue: (utils) => utils.date()!,
  parseInput: parsePickerInputValue,
  areValuesEqual: (utils, a, b) => utils.isEqual(a, b),
};
