import * as React from 'react';
import { DefaultizedProps } from '../internals/models/helpers';
import { useUtils } from '../internals/hooks/useUtils';
import { TimeClockSlots, TimeClockSlotProps } from '../TimeClock/TimeClock.types';
import { BasePickerInputProps } from '../internals/models/props/basePickerProps';
import { BaseTimeValidationProps } from '../internals/models/validation';
import { LocalizedComponent, PickersInputLocaleText } from '../locales/utils/pickersLocaleTextApi';
import {
  TimePickerToolbarProps,
  ExportedTimePickerToolbarProps,
  TimePickerToolbar,
} from './TimePickerToolbar';
import { PickerValidDate, TimeValidationError } from '../models';
import { PickerViewRendererLookup } from '../internals/hooks/usePicker/usePickerViews';
import { TimeViewRendererProps } from '../timeViewRenderers';
import { applyDefaultViewProps } from '../internals/utils/views';
import { BaseClockProps, ExportedBaseClockProps } from '../internals/models/props/clock';
import { TimeViewWithMeridiem } from '../internals/models';

export interface BaseTimePickerSlots<TDate extends PickerValidDate> extends TimeClockSlots {
  /**
   * Custom component for the toolbar rendered above the views.
   * @default TimePickerToolbar
   */
  toolbar?: React.JSXElementConstructor<TimePickerToolbarProps<TDate>>;
}

export interface BaseTimePickerSlotProps extends TimeClockSlotProps {
  toolbar?: ExportedTimePickerToolbarProps;
}

export type TimePickerViewRenderers<
  TDate extends PickerValidDate,
  TView extends TimeViewWithMeridiem,
  TAdditionalProps extends {} = {},
> = PickerViewRendererLookup<
  TDate | null,
  TView,
  TimeViewRendererProps<TView, BaseClockProps<TDate, TView>>,
  TAdditionalProps
>;

export interface BaseTimePickerProps<
  TDate extends PickerValidDate,
  TView extends TimeViewWithMeridiem,
> extends BasePickerInputProps<TDate | null, TDate, TView, TimeValidationError>,
    ExportedBaseClockProps<TDate> {
  /**
   * Display ampm controls under the clock (instead of in the toolbar).
   * @default true on desktop, false on mobile
   */
  ampmInClock?: boolean;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BaseTimePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BaseTimePickerSlotProps;
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be used.
   */
  viewRenderers?: Partial<TimePickerViewRenderers<TDate, TView>>;
}

type UseTimePickerDefaultizedProps<
  TDate extends PickerValidDate,
  TView extends TimeViewWithMeridiem,
  Props extends BaseTimePickerProps<TDate, TView>,
> = LocalizedComponent<
  TDate,
  DefaultizedProps<Props, 'views' | 'openTo' | 'ampm' | keyof BaseTimeValidationProps>
>;

export function useTimePickerDefaultizedProps<
  TDate extends PickerValidDate,
  TView extends TimeViewWithMeridiem,
  Props extends BaseTimePickerProps<TDate, TView>,
>(props: Props): UseTimePickerDefaultizedProps<TDate, TView, Props> {
  const utils = useUtils<TDate>();

  const ampm = props.ampm ?? utils.is12HourCycleInCurrentLocale();

  const localeText = React.useMemo<PickersInputLocaleText<TDate> | undefined>(() => {
    if (props.localeText?.toolbarTitle == null) {
      return props.localeText;
    }

    return {
      ...props.localeText,
      timePickerToolbarTitle: props.localeText.toolbarTitle,
    };
  }, [props.localeText]);

  return {
    ...props,
    ampm,
    localeText,
    ...applyDefaultViewProps({
      views: props.views,
      openTo: props.openTo,
      defaultViews: ['hours', 'minutes'] as TView[],
      defaultOpenTo: 'hours' as TView,
    }),
    disableFuture: props.disableFuture ?? false,
    disablePast: props.disablePast ?? false,
    slots: {
      toolbar: TimePickerToolbar,
      ...props.slots,
    },
    slotProps: {
      ...props.slotProps,
      toolbar: {
        ampm,
        ampmInClock: props.ampmInClock,
        ...props.slotProps?.toolbar,
      },
    },
  };
}
