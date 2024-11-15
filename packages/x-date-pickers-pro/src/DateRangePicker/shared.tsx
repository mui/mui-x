import * as React from 'react';
import { DefaultizedProps } from '@mui/x-internals/types';
import { useThemeProps } from '@mui/material/styles';
import { LocalizedComponent, PickersInputLocaleText } from '@mui/x-date-pickers/locales';
import {
  useDefaultDates,
  useUtils,
  applyDefaultDate,
  BaseDateValidationProps,
  BasePickerInputProps,
  PickerViewRendererLookup,
  PickerRangeValue,
} from '@mui/x-date-pickers/internals';
import { DateRangeValidationError } from '../models';
import {
  DateRangeCalendarSlots,
  DateRangeCalendarSlotProps,
  ExportedDateRangeCalendarProps,
} from '../DateRangeCalendar';
import {
  DateRangePickerToolbar,
  DateRangePickerToolbarProps,
  ExportedDateRangePickerToolbarProps,
} from './DateRangePickerToolbar';
import { DateRangeViewRendererProps } from '../dateRangeViewRenderers';

export interface BaseDateRangePickerSlots extends DateRangeCalendarSlots {
  /**
   * Custom component for the toolbar rendered above the views.
   * @default DateTimePickerToolbar
   */
  toolbar?: React.JSXElementConstructor<DateRangePickerToolbarProps>;
}

export interface BaseDateRangePickerSlotProps extends DateRangeCalendarSlotProps {
  toolbar?: ExportedDateRangePickerToolbarProps;
}

export interface BaseDateRangePickerProps
  extends Omit<
      BasePickerInputProps<PickerRangeValue, 'day', DateRangeValidationError>,
      'view' | 'views' | 'openTo' | 'onViewChange' | 'orientation'
    >,
    ExportedDateRangeCalendarProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BaseDateRangePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BaseDateRangePickerSlotProps;
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be used.
   */
  viewRenderers?: Partial<
    PickerViewRendererLookup<PickerRangeValue, 'day', DateRangeViewRendererProps<'day'>, {}>
  >;
}

type UseDateRangePickerDefaultizedProps<Props extends BaseDateRangePickerProps> =
  LocalizedComponent<DefaultizedProps<Props, keyof BaseDateValidationProps>>;

export function useDateRangePickerDefaultizedProps<Props extends BaseDateRangePickerProps>(
  props: Props,
  name: string,
): UseDateRangePickerDefaultizedProps<Props> {
  const utils = useUtils();
  const defaultDates = useDefaultDates();
  const themeProps = useThemeProps({
    props,
    name,
  });

  const localeText = React.useMemo<PickersInputLocaleText | undefined>(() => {
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
      ...themeProps.slots,
    },
  };
}
