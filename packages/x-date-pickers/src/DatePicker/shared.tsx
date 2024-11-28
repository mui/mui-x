import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DefaultizedProps } from '@mui/x-internals/types';
import {
  DateCalendarSlots,
  DateCalendarSlotProps,
  ExportedDateCalendarProps,
} from '../DateCalendar/DateCalendar.types';
import { useDefaultDates, useUtils } from '../internals/hooks/useUtils';
import { applyDefaultViewProps } from '../internals/utils/views';
import { DateValidationError, DateView } from '../models';
import { BasePickerInputProps } from '../internals/models/props/basePickerProps';
import { applyDefaultDate } from '../internals/utils/date-utils';
import { LocalizedComponent, PickersInputLocaleText } from '../locales/utils/pickersLocaleTextApi';
import {
  DatePickerToolbar,
  DatePickerToolbarProps,
  ExportedDatePickerToolbarProps,
} from './DatePickerToolbar';
import { PickerViewRendererLookup } from '../internals/hooks/usePicker/usePickerViews';
import { DateViewRendererProps } from '../dateViewRenderers';
import { PickerValue } from '../internals/models';
import { ValidateDatePropsToDefault } from '../validation/validateDate';

export interface BaseDatePickerSlots extends DateCalendarSlots {
  /**
   * Custom component for the toolbar rendered above the views.
   * @default DatePickerToolbar
   */
  toolbar?: React.JSXElementConstructor<DatePickerToolbarProps>;
}

export interface BaseDatePickerSlotProps extends DateCalendarSlotProps {
  toolbar?: ExportedDatePickerToolbarProps;
}

export type DatePickerViewRenderers<
  TView extends DateView,
  TAdditionalProps extends {} = {},
> = PickerViewRendererLookup<PickerValue, TView, DateViewRendererProps<TView>, TAdditionalProps>;

export interface BaseDatePickerProps
  extends BasePickerInputProps<PickerValue, DateView, DateValidationError>,
    ExportedDateCalendarProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BaseDatePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BaseDatePickerSlotProps;
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be used.
   */
  viewRenderers?: Partial<DatePickerViewRenderers<DateView>>;
}

type UseDatePickerDefaultizedProps<Props extends BaseDatePickerProps> = LocalizedComponent<
  DefaultizedProps<Props, 'views' | 'openTo' | ValidateDatePropsToDefault>
>;

export function useDatePickerDefaultizedProps<Props extends BaseDatePickerProps>(
  props: Props,
  name: string,
): UseDatePickerDefaultizedProps<Props> {
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
    slots: { toolbar: DatePickerToolbar, ...themeProps.slots },
  };
}
