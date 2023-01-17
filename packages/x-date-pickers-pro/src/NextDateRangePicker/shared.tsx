import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { LocalizedComponent, PickersInputLocaleText } from '@mui/x-date-pickers';
import {
  DefaultizedProps,
  useDefaultDates,
  useUtils,
  applyDefaultDate,
  BaseDateValidationProps,
  BaseNextPickerInputProps,
  PickerViewRendererLookup,
  UncapitalizeObjectKeys,
  uncapitalizeObjectKeys,
} from '@mui/x-date-pickers/internals';
import { DateRangeValidationError } from '../internal/hooks/validation/useDateRangeValidation';
import { DateRange } from '../internal/models';
import {
  DateRangeCalendarSlotsComponent,
  DateRangeCalendarSlotsComponentsProps,
  ExportedDateRangeCalendarProps,
} from '../DateRangeCalendar';
import {
  DateRangePickerToolbar,
  DateRangePickerToolbarProps,
  ExportedDateRangePickerToolbarProps,
} from './DateRangePickerToolbar';
import { DateRangeViewRendererProps } from '../dateRangeViewRenderers';

export interface BaseNextDateRangePickerSlotsComponent<TDate>
  extends DateRangeCalendarSlotsComponent<TDate> {
  /**
   * Custom component for the toolbar rendered above the views.
   * @default DateTimePickerToolbar
   */
  Toolbar?: React.JSXElementConstructor<DateRangePickerToolbarProps<TDate>>;
}

export interface BaseNextDateRangePickerSlotsComponentsProps<TDate>
  extends DateRangeCalendarSlotsComponentsProps<TDate> {
  toolbar?: ExportedDateRangePickerToolbarProps;
}

export interface BaseNextDateRangePickerProps<TDate>
  extends Omit<
      BaseNextPickerInputProps<DateRange<TDate>, TDate, 'day', DateRangeValidationError>,
      'view' | 'views' | 'openTo' | 'onViewChange' | 'orientation'
    >,
    ExportedDateRangeCalendarProps<TDate>,
    BaseDateValidationProps<TDate> {
  /**
   * Overrideable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: BaseNextDateRangePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: BaseNextDateRangePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<BaseNextDateRangePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BaseNextDateRangePickerSlotsComponentsProps<TDate>;
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be the used.
   */
  viewRenderers?: Partial<
    PickerViewRendererLookup<DateRange<TDate>, 'day', DateRangeViewRendererProps<TDate, 'day'>, {}>
  >;
}

type UseNextDateRangePickerDefaultizedProps<
  TDate,
  Props extends BaseNextDateRangePickerProps<TDate>,
> = LocalizedComponent<TDate, DefaultizedProps<Props, keyof BaseDateValidationProps<TDate>>>;

export function useNextDateRangePickerDefaultizedProps<
  TDate,
  Props extends BaseNextDateRangePickerProps<TDate>,
>(
  props: Props,
  name: string,
): UseNextDateRangePickerDefaultizedProps<TDate, Omit<Props, 'components' | 'componentsProps'>> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const { components, componentsProps, ...themeProps } = useThemeProps({
    props,
    name,
  });

  const localeText = React.useMemo<PickersInputLocaleText<TDate> | undefined>(() => {
    if (themeProps.localeText?.toolbarTitle == null) {
      return themeProps.localeText;
    }

    return {
      ...themeProps.localeText,
      dateRangePickerToolbarTitle: themeProps.localeText.toolbarTitle,
    };
  }, [themeProps.localeText]);

  return {
    ...themeProps,
    localeText,
    disableFuture: themeProps.disableFuture ?? false,
    disablePast: themeProps.disablePast ?? false,
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
    slots: {
      toolbar: DateRangePickerToolbar,
      ...(themeProps.slots ?? uncapitalizeObjectKeys(components)),
    },
    slotProps: themeProps.slotProps ?? componentsProps,
  };
}
