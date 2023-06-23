import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { LocalizedComponent, PickersInputLocaleText } from '@mui/x-date-pickers/locales';
import {
  DefaultizedProps,
  BasePickerInputProps,
  PickerViewRendererLookup,
  UncapitalizeObjectKeys,
  uncapitalizeObjectKeys,
  BaseTimeValidationProps,
  BaseClockProps,
  ExportedBaseClockProps,
  TimeViewWithMeridiem,
  useUtils,
} from '@mui/x-date-pickers/internals';
import {
  TimeClockSlotsComponent,
  TimeClockSlotsComponentsProps,
} from '@mui/x-date-pickers/TimeClock';
import { TimeViewRendererProps } from '@mui/x-date-pickers/timeViewRenderers';
// TODO: Fix nested import
import {
  TimePickerToolbar,
  TimePickerToolbarProps,
  ExportedTimePickerToolbarProps,
} from '@mui/x-date-pickers/TimePicker/TimePickerToolbar';
import { TimeRangeValidationError } from '../models';
import { DateRange } from '../internal/models';

export interface BaseTimeRangePickerSlotsComponent<TDate> extends TimeClockSlotsComponent {
  /**
   * Custom component for the toolbar rendered above the views.
   * @default DateTimePickerToolbar
   */
  Toolbar?: React.JSXElementConstructor<TimePickerToolbarProps<TDate>>;
}

export interface BaseTimeRangePickerSlotsComponentsProps extends TimeClockSlotsComponentsProps {
  toolbar?: ExportedTimePickerToolbarProps;
}

export interface BaseTimeRangePickerProps<TDate, TView extends TimeViewWithMeridiem>
  extends Omit<
      BasePickerInputProps<DateRange<TDate>, TDate, TView, TimeRangeValidationError>,
      'view' | 'views' | 'openTo' | 'onViewChange' | 'orientation'
    >,
    ExportedBaseClockProps<TDate> {
  /**
   * Display ampm controls under the clock (instead of in the toolbar).
   * @default true on desktop, false on mobile
   */
  ampmInClock?: boolean;
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: BaseTimeRangePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: BaseTimeRangePickerSlotsComponentsProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<BaseTimeRangePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BaseTimeRangePickerSlotsComponentsProps;
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be the used.
   */
  viewRenderers?: Partial<
    PickerViewRendererLookup<
      DateRange<TDate>,
      TView,
      TimeViewRendererProps<TView, BaseClockProps<TDate, TView>>,
      {}
    >
  >;
}

type UseTimeRangePickerDefaultizedProps<
  TDate,
  TView extends TimeViewWithMeridiem,
  Props extends BaseTimeRangePickerProps<TDate, TView>,
> = LocalizedComponent<TDate, DefaultizedProps<Props, keyof BaseTimeValidationProps>>;

export function useTimeRangePickerDefaultizedProps<
  TDate,
  TView extends TimeViewWithMeridiem,
  Props extends BaseTimeRangePickerProps<TDate, TView>,
>(
  props: Props,
  name: string,
): UseTimeRangePickerDefaultizedProps<TDate, TView, Omit<Props, 'components' | 'componentsProps'>> {
  const utils = useUtils<TDate>();

  const themeProps = useThemeProps({
    props,
    name,
  });

  const ampm = themeProps.ampm ?? utils.is12HourCycleInCurrentLocale();

  const localeText = React.useMemo<PickersInputLocaleText<TDate> | undefined>(() => {
    if (themeProps.localeText?.toolbarTitle == null) {
      return themeProps.localeText;
    }

    return {
      ...themeProps.localeText,
      dateRangePickerToolbarTitle: themeProps.localeText.toolbarTitle,
    };
  }, [themeProps.localeText]);

  const slots = themeProps.slots ?? uncapitalizeObjectKeys(themeProps.components);
  const slotProps = themeProps.slotProps ?? themeProps.componentsProps;

  return {
    ...themeProps,
    localeText,
    disableFuture: themeProps.disableFuture ?? false,
    disablePast: themeProps.disablePast ?? false,
    slots: {
      toolbar: TimePickerToolbar,
      ...slots,
    },
    slotProps: {
      ...slotProps,
      toolbar: {
        ampm,
        ampmInClock: themeProps.ampmInClock,
        ...slotProps?.toolbar,
      },
    },
  };
}
