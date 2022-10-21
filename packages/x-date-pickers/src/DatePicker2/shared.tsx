import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DefaultizedProps, MakeOptional } from '../internals/models/helpers';
import {
  DateCalendarSlotsComponent,
  DateCalendarSlotsComponentsProps,
  ExportedDateCalendarProps,
} from '../DateCalendar/DateCalendar';
import { useDefaultDates, useUtils } from '../internals/hooks/useUtils';
import { isYearAndMonthViews, isYearOnlyView } from '../internals/utils/views';
import { ValidationCommonPropsOptionalValue } from '../internals/hooks/validation/useValidation';
import { DateValidationError } from '../internals/hooks/validation/useDateValidation';
import { BasePickerProps2 } from '../internals/models/props/basePickerProps';
import { applyDefaultDate } from '../internals/utils/date-utils';
import { BaseDateValidationProps, CalendarPickerView } from '../internals';
import { LocalizedComponent, PickersInputLocaleText } from '../locales/utils/pickersLocaleTextApi';
import {
  DatePickerToolbar,
  DatePickerToolbarProps,
  ExportedDatePickerToolbarProps,
} from '../DatePicker/DatePickerToolbar';

export interface BaseDatePicker2SlotsComponent<TDate> extends DateCalendarSlotsComponent<TDate> {
  /**
   * Custom component for the toolbar rendered above the views.
   * @default DatePickerToolbar
   */
  Toolbar?: React.JSXElementConstructor<DatePickerToolbarProps<TDate>>;
}

export interface BaseDatePicker2SlotsComponentsProps<TDate>
  extends DateCalendarSlotsComponentsProps<TDate> {
  toolbar?: ExportedDatePickerToolbarProps;
}

export interface BaseDatePicker2Props<TDate>
  extends MakeOptional<
      BasePickerProps2<TDate | null, TDate, CalendarPickerView>,
      'views' | 'openTo'
    >,
    ExportedDateCalendarProps<TDate>,
    ValidationCommonPropsOptionalValue<DateValidationError, TDate | null> {
  /**
   * The label content.
   */
  label?: React.ReactNode;
  /**
   * Pass a ref to the `input` element.
   */
  inputRef?: React.Ref<HTMLInputElement>;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: BaseDatePicker2SlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: BaseDatePicker2SlotsComponentsProps<TDate>;
}

type UseDatePicker2DefaultizedProps<
  TDate,
  Props extends BaseDatePicker2Props<TDate>,
> = LocalizedComponent<
  TDate,
  DefaultizedProps<Props, 'views' | 'openTo' | keyof BaseDateValidationProps<TDate>>
>;

export function useDatePicker2DefaultizedProps<TDate, Props extends BaseDatePicker2Props<TDate>>(
  props: Props,
  name: string,
): UseDatePicker2DefaultizedProps<TDate, Props> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const themeProps = useThemeProps({
    props,
    name,
  });

  const views = themeProps.views ?? ['year', 'day'];

  let inputFormat: string | undefined;
  if (themeProps.inputFormat != null) {
    inputFormat = themeProps.inputFormat;
  } else if (isYearOnlyView(views)) {
    inputFormat = utils.formats.year;
  } else if (isYearAndMonthViews(views)) {
    inputFormat = utils.formats.monthAndYear;
  } else {
    inputFormat = undefined;
  }

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
    ...themeProps,
    inputFormat,
    views,
    localeText,
    openTo: themeProps.openTo ?? 'day',
    disableFuture: themeProps.disableFuture ?? false,
    disablePast: themeProps.disablePast ?? false,
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
    components: { Toolbar: DatePickerToolbar, ...themeProps.components },
  };
}
