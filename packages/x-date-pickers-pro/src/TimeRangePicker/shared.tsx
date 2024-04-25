import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { LocalizedComponent, PickersInputLocaleText } from '@mui/x-date-pickers/locales';
import { PickerValidDate, TimeStepOptions, TimeView } from '@mui/x-date-pickers/models';
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
  resolveTimeViewsResponse,
  UseViewsOptions,
} from '@mui/x-date-pickers/internals';
import { TimeClockSlots, TimeClockSlotProps } from '@mui/x-date-pickers/TimeClock';
import { TimeViewRendererProps } from '@mui/x-date-pickers/timeViewRenderers';
import {
  TimeRangePickerToolbar,
  TimeRangePickerToolbarProps,
  ExportedTimeRangePickerToolbarProps,
} from './TimeRangePickerToolbar';
import { DateRange, TimeRangeValidationError } from '../models';

export interface BaseTimeRangePickerSlots<TDate extends PickerValidDate> extends TimeClockSlots {
  /**
   * Custom component for the toolbar rendered above the views.
   * @default DateTimePickerToolbar
   */
  Toolbar?: React.JSXElementConstructor<TimeRangePickerToolbarProps<TDate>>;
}

export interface BaseTimeRangePickerSlotProps extends TimeClockSlotProps {
  toolbar?: ExportedTimeRangePickerToolbarProps;
}

export type TimeRangePickerRenderers<
  TDate extends PickerValidDate,
  TView extends TimeViewWithMeridiem,
  TAdditionalProps extends {} = {},
> = PickerViewRendererLookup<
  DateRange<TDate>,
  TView,
  TimeViewRendererProps<TimeViewWithMeridiem, BaseClockProps<TDate, TimeViewWithMeridiem>> & {
    view: TView;
  },
  TAdditionalProps
>;

export interface BaseTimeRangePickerProps<TDate extends PickerValidDate>
  extends Omit<
      BasePickerInputProps<DateRange<TDate>, TDate, TimeViewWithMeridiem, TimeRangeValidationError>,
      'orientation' | 'views' | 'openTo'
    >,
    ExportedBaseClockProps<TDate>,
    Partial<Pick<UseViewsOptions<DateRange<TDate>, TimeView>, 'openTo' | 'views'>> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BaseTimeRangePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BaseTimeRangePickerSlotProps;
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be the used.
   */
  viewRenderers?: TimeRangePickerRenderers<TDate, TimeViewWithMeridiem>;
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
  TDate extends PickerValidDate,
  Props extends BaseTimeRangePickerProps<TDate>,
> = LocalizedComponent<
  TDate,
  Omit<
    DefaultizedProps<Props, 'views' | 'openTo' | 'ampm' | keyof BaseTimeValidationProps>,
    'views'
  >
> & {
  shouldRenderTimeInASingleColumn: boolean;
  views: readonly TimeViewWithMeridiem[];
};

export function useTimeRangePickerDefaultizedProps<
  TDate extends PickerValidDate,
  Props extends BaseTimeRangePickerProps<TDate>,
>(props: Props, name: string): UseTimeRangePickerDefaultizedProps<TDate, Props> {
  const utils = useUtils<TDate>();

  const themeProps = useThemeProps({
    props,
    name,
  });

  const ampm = themeProps.ampm ?? utils.is12HourCycleInCurrentLocale();
  const { openTo, views: defaultViews } = applyDefaultViewProps<TimeView>({
    views: themeProps.views,
    openTo: themeProps.openTo,
    defaultViews: ['hours', 'minutes'],
    defaultOpenTo: 'hours',
  });

  const localeText = React.useMemo<PickersInputLocaleText<TDate> | undefined>(() => {
    if (themeProps.localeText?.toolbarTitle == null) {
      return themeProps.localeText;
    }

    return {
      ...themeProps.localeText,
      timeRangePickerToolbarTitle: themeProps.localeText.toolbarTitle,
    };
  }, [themeProps.localeText]);

  const {
    shouldRenderTimeInASingleColumn,
    thresholdToRenderTimeInASingleColumn,
    views,
    timeSteps,
  } = resolveTimeViewsResponse<TDate, TimeView, TimeViewWithMeridiem>({
    thresholdToRenderTimeInASingleColumn: themeProps.thresholdToRenderTimeInASingleColumn,
    ampm,
    timeSteps: themeProps.timeSteps,
    views: defaultViews,
  });

  return {
    ...themeProps,
    localeText,
    timeSteps,
    openTo,
    shouldRenderTimeInASingleColumn,
    thresholdToRenderTimeInASingleColumn,
    views,
    ampm,
    disableFuture: themeProps.disableFuture ?? false,
    disablePast: themeProps.disablePast ?? false,
    slots: {
      toolbar: TimeRangePickerToolbar,
      ...themeProps.slots,
    },
    slotProps: {
      ...themeProps.slotProps,
      toolbar: {
        ampm,
        ...themeProps.slotProps?.toolbar,
      },
    },
  };
}
