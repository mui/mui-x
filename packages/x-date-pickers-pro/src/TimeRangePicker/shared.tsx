import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { LocalizedComponent, PickersInputLocaleText } from '@mui/x-date-pickers/locales';
import { TimeStepOptions } from '@mui/x-date-pickers/models';
import {
  DefaultizedProps,
  BasePickerInputProps,
  PickerViewRendererLookup,
  BaseTimeValidationProps,
  BaseClockProps,
  ExportedBaseClockProps,
  TimeViewWithMeridiem,
  useUtils,
  applyDefaultViewProps,
} from '@mui/x-date-pickers/internals';
import {
  TimeClockSlotsComponent,
  TimeClockSlotsComponentsProps,
} from '@mui/x-date-pickers/TimeClock';
import { TimeViewRendererProps } from '@mui/x-date-pickers/timeViewRenderers';
import {
  TimeRangePickerToolbar,
  TimeRangePickerToolbarProps,
  ExportedTimeRangePickerToolbarProps,
} from './TimeRangePickerToolbar';
import { TimeRangeValidationError } from '../models';
import { DateRange } from '../internals/models';

export interface BaseTimeRangePickerSlotsComponent<TDate> extends TimeClockSlotsComponent {
  /**
   * Custom component for the toolbar rendered above the views.
   * @default DateTimePickerToolbar
   */
  Toolbar?: React.JSXElementConstructor<TimeRangePickerToolbarProps<TDate>>;
}

export interface BaseTimeRangePickerSlotsComponentsProps extends TimeClockSlotsComponentsProps {
  toolbar?: ExportedTimeRangePickerToolbarProps;
}

export interface BaseTimeRangePickerProps<TDate, TView extends TimeViewWithMeridiem>
  extends Omit<
      BasePickerInputProps<DateRange<TDate>, TDate, TView, TimeRangeValidationError>,
      'orientation'
    >,
    ExportedBaseClockProps<TDate> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BaseTimeRangePickerSlotsComponent<TDate>;
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
  /**
   * Amount of time options below or at which the single column time renderer is used.
   * @default 24
   */
  thresholdToRenderTimeInASingleColumn?: number;
  /**
   * The time steps between two time unit options.
   * For example, if `timeStep.minutes = 8`, then the available minute options will be `[0, 8, 16, 24, 32, 40, 48, 56]`.
   * When single column time renderer is used, only `timeStep.minutes` will be used.
   * @default{ hours: 1, minutes: 5, seconds: 5 }
   */
  timeSteps?: TimeStepOptions;
}

type UseTimeRangePickerDefaultizedProps<
  TDate,
  TView extends TimeViewWithMeridiem,
  Props extends BaseTimeRangePickerProps<TDate, TView>,
> = Omit<
  LocalizedComponent<
    TDate,
    DefaultizedProps<Props, 'views' | 'openTo' | 'ampm' | keyof BaseTimeValidationProps>
  >,
  'components' | 'componentsProps'
>;

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
      timeRangePickerToolbarTitle: themeProps.localeText.toolbarTitle,
    };
  }, [themeProps.localeText]);

  const slots = themeProps.slots ?? uncapitalizeObjectKeys(themeProps.components);
  const slotProps = themeProps.slotProps ?? themeProps.componentsProps;

  return {
    ...themeProps,
    ampm,
    localeText,
    ...applyDefaultViewProps({
      views: themeProps.views,
      openTo: themeProps.openTo,
      defaultViews: ['hours', 'minutes'] as TView[],
      defaultOpenTo: 'hours' as TView,
    }),
    disableFuture: themeProps.disableFuture ?? false,
    disablePast: themeProps.disablePast ?? false,
    slots: {
      toolbar: TimeRangePickerToolbar,
      ...slots,
    },
    slotProps: {
      ...slotProps,
      toolbar: {
        ampm,
        ...slotProps?.toolbar,
      },
    },
  };
}
