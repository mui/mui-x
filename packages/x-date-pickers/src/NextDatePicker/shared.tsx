import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DefaultizedProps } from '../internals/models/helpers';
import {
  DateCalendarSlotsComponent,
  DateCalendarSlotsComponentsProps,
  ExportedDateCalendarProps,
} from '../DateCalendar/DateCalendar.types';
import { useDefaultDates, useUtils } from '../internals/hooks/useUtils';
import {
  applyDefaultViewProps,
  isYearAndMonthViews,
  isYearOnlyView,
} from '../internals/utils/views';
import { DateValidationError } from '../internals/hooks/validation/useDateValidation';
import { BaseNextPickerInputProps } from '../internals/models/props/basePickerProps';
import { applyDefaultDate } from '../internals/utils/date-utils';
import { BaseDateValidationProps, DateView, MuiPickersAdapter } from '../internals';
import { LocalizedComponent, PickersInputLocaleText } from '../locales/utils/pickersLocaleTextApi';
import {
  DatePickerToolbar,
  DatePickerToolbarProps,
  ExportedDatePickerToolbarProps,
} from '../DatePicker/DatePickerToolbar';
import { PickerViewRendererLookup } from '../internals/hooks/usePicker/usePickerViews';
import { DateViewRendererProps } from '../dateViewRenderers';

export interface BaseNextDatePickerSlotsComponent<TDate> extends DateCalendarSlotsComponent<TDate> {
  /**
   * Custom component for the toolbar rendered above the views.
   * @default DatePickerToolbar
   */
  Toolbar?: React.JSXElementConstructor<DatePickerToolbarProps<TDate>>;
}

export interface BaseNextDatePickerSlotsComponentsProps<TDate>
  extends DateCalendarSlotsComponentsProps<TDate> {
  toolbar?: ExportedDatePickerToolbarProps;
}

export interface BaseNextDatePickerProps<TDate>
  extends BaseNextPickerInputProps<TDate | null, TDate, DateView, DateValidationError>,
    ExportedDateCalendarProps<TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: BaseNextDatePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: BaseNextDatePickerSlotsComponentsProps<TDate>;
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be the used.
   */
  viewRenderers?: Partial<
    PickerViewRendererLookup<TDate | null, DateView, DateViewRendererProps<TDate, DateView>, {}>
  >;
}

type UseNextDatePickerDefaultizedProps<
  TDate,
  Props extends BaseNextDatePickerProps<TDate>,
> = LocalizedComponent<
  TDate,
  DefaultizedProps<Props, 'views' | 'openTo' | keyof BaseDateValidationProps<TDate>>
>;

export const getDatePickerFieldFormat = (
  utils: MuiPickersAdapter<any>,
  { format, views }: { format?: string; views: readonly DateView[] },
) => {
  if (format != null) {
    return format;
  }
  if (isYearOnlyView(views)) {
    return utils.formats.year;
  }
  if (isYearAndMonthViews(views)) {
    return utils.formats.monthAndYear;
  }
  return undefined;
};

export function useNextDatePickerDefaultizedProps<
  TDate,
  Props extends BaseNextDatePickerProps<TDate>,
>(props: Props, name: string): UseNextDatePickerDefaultizedProps<TDate, Props> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const themeProps = useThemeProps({
    props,
    name,
  });

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
    localeText,
    ...applyDefaultViewProps({
      views: themeProps.views,
      openTo: themeProps.openTo,
      defaultViews: ['year', 'day'],
      defaultOpenTo: 'day',
    }),
    disableFuture: themeProps.disableFuture ?? false,
    disablePast: themeProps.disablePast ?? false,
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
    components: { Toolbar: DatePickerToolbar, ...themeProps.components },
  };
}
