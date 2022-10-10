import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { useDefaultDates, useUtils } from '../internals/hooks/useUtils';
import { CalendarPickerView, MuiPickersAdapter } from '../internals/models';
import {
  CalendarPickerSlotsComponent,
  CalendarPickerSlotsComponentsProps,
  ExportedCalendarPickerProps,
} from '../CalendarPicker/CalendarPicker';
import { DateValidationError } from '../internals/hooks/validation/useDateValidation';
import { ValidationCommonProps } from '../internals/hooks/validation/useValidation';
import { ExportedDateInputProps } from '../internals/components/PureDateInput';
import { BasePickerProps } from '../internals/models/props/basePickerProps';
import { PickerStateValueManager } from '../internals/hooks/usePickerState';
import { applyDefaultDate, replaceInvalidDateByNull } from '../internals/utils/date-utils';
import {
  BaseToolbarProps,
  ExportedBaseToolbarProps,
} from '../internals/models/props/baseToolbarProps';
import { DefaultizedProps } from '../internals/models/helpers';
import { BaseDateValidationProps } from '../internals/hooks/validation/models';
import { DatePickerToolbar } from './DatePickerToolbar';
import { isYearOnlyView, isYearAndMonthViews } from '../internals/utils/views';

export interface BaseDatePickerSlotsComponent<TDate> extends CalendarPickerSlotsComponent<TDate> {
  /**
   * Custom component for the toolbar rendered above the views.
   * @default DatePickerToolbar
   */
  Toolbar?: React.JSXElementConstructor<BaseToolbarProps<TDate, TDate | null>>;
}

export interface BaseDatePickerSlotsComponentsProps<TDate>
  extends CalendarPickerSlotsComponentsProps<TDate> {
  toolbar?: ExportedBaseToolbarProps;
}

export interface BaseDatePickerProps<TDate>
  extends ExportedCalendarPickerProps<TDate>,
    BasePickerProps<TDate | null>,
    ValidationCommonProps<DateValidationError, TDate | null>,
    ExportedDateInputProps<TDate> {
  /**
   * Callback fired on view change.
   * @param {CalendarPickerView} view The new view.
   */
  onViewChange?: (view: CalendarPickerView) => void;
  /**
   * First view to show.
   * Must be a valid option from `views` list
   * @default 'day'
   */
  openTo?: CalendarPickerView;
  /**
   * Array of views to show.
   * @default ['year', 'day']
   */
  views?: readonly CalendarPickerView[];
  /**
   * Overrideable components.
   * @default {}
   */
  components?: Partial<BaseDatePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: Partial<BaseDatePickerSlotsComponentsProps<TDate>>;
}

const getFormatAndMaskByViews = <TDate>(
  views: readonly CalendarPickerView[],
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
): DefaultizedProps<
  Props,
  'openTo' | 'views' | keyof BaseDateValidationProps<TDate>,
  { inputFormat: string }
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

  return {
    openTo: 'day',
    disableFuture: false,
    disablePast: false,
    ...getFormatAndMaskByViews(views, utils),
    ...themeProps,
    views,
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
    components: { Toolbar: DatePickerToolbar, ...themeProps.components },
    componentsProps: {
      ...themeProps.componentsProps,
      toolbar: { toolbarTitle: themeProps.label, ...themeProps.componentsProps?.toolbar },
    },
  };
}

export const datePickerValueManager: PickerStateValueManager<any, any> = {
  emptyValue: null,
  getTodayValue: (utils) => utils.date()!,
  cleanValue: replaceInvalidDateByNull,
  areValuesEqual: (utils, a, b) => utils.isEqual(a, b),
};
