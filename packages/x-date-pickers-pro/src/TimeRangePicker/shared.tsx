import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DefaultizedProps } from '@mui/x-internals/types';
import { LocalizedComponent, PickersInputLocaleText } from '@mui/x-date-pickers/locales';
import { TimeStepOptions, TimeView } from '@mui/x-date-pickers/models';
import {
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
  PickerRangeValue,
  PickerValue,
  useApplyDefaultValuesToTimeValidationProps,
} from '@mui/x-date-pickers/internals';
import { TimeClockSlots, TimeClockSlotProps } from '@mui/x-date-pickers/TimeClock';
import { DigitalClockSlots, DigitalClockSlotProps } from '@mui/x-date-pickers/DigitalClock';
import {
  MultiSectionDigitalClockSlots,
  MultiSectionDigitalClockSlotProps,
} from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { TimeViewRendererProps } from '@mui/x-date-pickers/timeViewRenderers';
import {
  TimeRangePickerToolbar,
  TimeRangePickerToolbarProps,
  ExportedTimeRangePickerToolbarProps,
} from './TimeRangePickerToolbar';
import { TimeRangeValidationError } from '../models';
import {
  ExportedTimeRangePickerTabsProps,
  TimeRangePickerTabs,
  TimeRangePickerTabsProps,
} from './TimeRangePickerTabs';

export interface BaseTimeRangePickerSlots
  extends TimeClockSlots,
    DigitalClockSlots,
    MultiSectionDigitalClockSlots {
  /**
   * Tabs enabling toggling between start and end time.
   * @default TimeRangePickerTabs
   */
  tabs?: React.ElementType<TimeRangePickerTabsProps>;
  /**
   * Custom component for the toolbar rendered above the views.
   * @default TimeRangePickerToolbar
   */
  Toolbar?: React.JSXElementConstructor<TimeRangePickerToolbarProps>;
}

export interface BaseTimeRangePickerSlotProps
  extends TimeClockSlotProps,
    DigitalClockSlotProps,
    MultiSectionDigitalClockSlotProps {
  /**
   * Props passed down to the tabs component.
   */
  tabs?: ExportedTimeRangePickerTabsProps;
  /**
   * Props passed down to the toolbar component.
   */
  toolbar?: ExportedTimeRangePickerToolbarProps;
}

export type TimeRangePickerRenderers = PickerViewRendererLookup<
  PickerValue,
  TimeViewWithMeridiem,
  TimeViewRendererProps<TimeViewWithMeridiem, BaseClockProps<TimeViewWithMeridiem>> & {
    view: TimeViewWithMeridiem;
  }
>;

export interface BaseTimeRangePickerProps
  extends Omit<
      BasePickerInputProps<PickerRangeValue, TimeViewWithMeridiem, TimeRangeValidationError>,
      'orientation' | 'views' | 'openTo'
    >,
    ExportedBaseClockProps,
    Partial<Pick<UseViewsOptions<PickerRangeValue, TimeView>, 'openTo' | 'views'>> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BaseTimeRangePickerSlots;
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
  viewRenderers?: TimeRangePickerRenderers;
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

type UseTimeRangePickerDefaultizedProps<Props extends BaseTimeRangePickerProps> =
  LocalizedComponent<
    Omit<
      DefaultizedProps<Props, 'views' | 'openTo' | 'ampm' | keyof BaseTimeValidationProps>,
      'views'
    >
  > & {
    shouldRenderTimeInASingleColumn: boolean;
    views: readonly TimeViewWithMeridiem[];
  };

export function useTimeRangePickerDefaultizedProps<Props extends BaseTimeRangePickerProps>(
  props: Props,
  name: string,
): UseTimeRangePickerDefaultizedProps<Props> {
  const utils = useUtils();
  const themeProps = useThemeProps({
    props,
    name,
  });

  const validationProps = useApplyDefaultValuesToTimeValidationProps(themeProps);
  const ampm = themeProps.ampm ?? utils.is12HourCycleInCurrentLocale();

  const { openTo, views: defaultViews } = applyDefaultViewProps<TimeView>({
    views: themeProps.views,
    openTo: themeProps.openTo,
    defaultViews: ['hours', 'minutes'],
    defaultOpenTo: 'hours',
  });

  const localeText = React.useMemo<PickersInputLocaleText | undefined>(() => {
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
  } = resolveTimeViewsResponse<TimeView, TimeViewWithMeridiem>({
    thresholdToRenderTimeInASingleColumn: themeProps.thresholdToRenderTimeInASingleColumn,
    ampm,
    timeSteps: themeProps.timeSteps,
    views: defaultViews,
  });

  return {
    ...themeProps,
    ...validationProps,
    localeText,
    timeSteps,
    openTo,
    shouldRenderTimeInASingleColumn,
    thresholdToRenderTimeInASingleColumn,
    views,
    ampm,
    slots: {
      tabs: TimeRangePickerTabs,
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
