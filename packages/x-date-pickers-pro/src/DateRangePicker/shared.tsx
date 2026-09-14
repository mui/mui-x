import * as React from 'react';
import type { DefaultizedProps } from '@mui/x-internals/types';
import type { WithDataAttributes } from '@mui/utils/types';
import { useThemeProps } from '@mui/material/styles';
import type { LocalizedComponent, PickersInputLocaleText } from '@mui/x-date-pickers/locales';
import type {
  BasePickerInputProps,
  PickerViewRendererLookup,
  PickerRangeValue,
} from '@mui/x-date-pickers/internals';
import { useApplyDefaultValuesToDateValidationProps } from '@mui/x-date-pickers/internals';
import type { DateRangeValidationError } from '../models';
import type {
  DateRangeCalendarSlots,
  DateRangeCalendarSlotProps,
  ExportedDateRangeCalendarProps,
} from '../DateRangeCalendar';
import type {
  DateRangePickerToolbarProps,
  ExportedDateRangePickerToolbarProps,
} from './DateRangePickerToolbar';
import { DateRangePickerToolbar } from './DateRangePickerToolbar';
import type { DateRangeViewRendererProps } from '../dateRangeViewRenderers';
import type { ValidateDateRangePropsToDefault } from '../validation/validateDateRange';

export interface BaseDateRangePickerSlots extends DateRangeCalendarSlots {
  /**
   * Custom component for the toolbar rendered above the views.
   * @default DateTimePickerToolbar
   */
  toolbar?: React.JSXElementConstructor<DateRangePickerToolbarProps>;
}

export interface BaseDateRangePickerSlotProps extends DateRangeCalendarSlotProps {
  toolbar?: WithDataAttributes<ExportedDateRangePickerToolbarProps>;
}

export interface BaseDateRangePickerProps
  extends
    Omit<
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
    PickerViewRendererLookup<PickerRangeValue, 'day', DateRangeViewRendererProps<'day'>>
  >;
}

type UseDateRangePickerDefaultizedProps<Props extends BaseDateRangePickerProps> =
  LocalizedComponent<DefaultizedProps<Props, ValidateDateRangePropsToDefault>>;

export function useDateRangePickerDefaultizedProps<Props extends BaseDateRangePickerProps>(
  props: Props,
  name: string,
): UseDateRangePickerDefaultizedProps<Props> {
  const themeProps = useThemeProps({
    props,
    name,
  });

  const validationProps = useApplyDefaultValuesToDateValidationProps(themeProps);

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
    ...validationProps,
    localeText,
    slots: {
      toolbar: DateRangePickerToolbar,
      ...themeProps.slots,
    },
  };
}
