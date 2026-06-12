import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { type DefaultizedProps } from '@mui/x-internals/types';
import {
  type DateCalendarSlots,
  type DateCalendarSlotProps,
  type ExportedDateCalendarProps,
} from '../DateCalendar/DateCalendar.types';
import { applyDefaultViewProps } from '../internals/utils/views';
import { type DateValidationError, type DateView } from '../models';
import { type BasePickerInputProps } from '../internals/models/props/basePickerProps';
import {
  type LocalizedComponent,
  type PickersInputLocaleText,
} from '../locales/utils/pickersLocaleTextApi';
import {
  DatePickerToolbar,
  type DatePickerToolbarProps,
  type ExportedDatePickerToolbarProps,
} from './DatePickerToolbar';
import { type PickerViewRendererLookup } from '../internals/hooks/usePicker';
import { type DateViewRendererProps } from '../dateViewRenderers';
import { type PickerValue } from '../internals/models';
import { type ValidateDatePropsToDefault } from '../validation/validateDate';
import { useApplyDefaultValuesToDateValidationProps } from '../managers/useDateManager';

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

export type DatePickerViewRenderers<TView extends DateView> = PickerViewRendererLookup<
  PickerValue,
  TView,
  DateViewRendererProps<TView>
>;

export interface BaseDatePickerProps
  extends
    BasePickerInputProps<PickerValue, DateView, DateValidationError>,
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
      datePickerToolbarTitle: themeProps.localeText.toolbarTitle,
    };
  }, [themeProps.localeText]);

  return {
    ...themeProps,
    ...validationProps,
    localeText,
    ...applyDefaultViewProps({
      views: themeProps.views,
      openTo: themeProps.openTo,
      defaultViews: ['year', 'day'],
      defaultOpenTo: 'day',
    }),
    slots: { toolbar: DatePickerToolbar, ...themeProps.slots },
  };
}
