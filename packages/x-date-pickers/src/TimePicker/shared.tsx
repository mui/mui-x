import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DefaultizedProps } from '../internals/models/helpers';
import { TimeView } from '../internals/models/views';
import { useUtils } from '../internals/hooks/useUtils';
import {
  TimeClockSlotsComponent,
  TimeClockSlotsComponentsProps,
  ExportedTimeClockProps,
} from '../TimeClock/TimeClock.types';
import { BasePickerInputProps } from '../internals/models/props/basePickerProps';
import { BaseTimeValidationProps } from '../internals/hooks/validation/models';
import { LocalizedComponent, PickersInputLocaleText } from '../locales/utils/pickersLocaleTextApi';
import {
  TimePickerToolbarProps,
  ExportedTimePickerToolbarProps,
  TimePickerToolbar,
} from './TimePickerToolbar';
import { TimeValidationError } from '../internals/hooks/validation/useTimeValidation';
import { PickerViewRendererLookup } from '../internals/hooks/usePicker/usePickerViews';
import { TimeViewRendererProps } from '../timeViewRenderers';
import { applyDefaultViewProps } from '../internals/utils/views';
import { uncapitalizeObjectKeys, UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
import { ExportedDigitalClockProps } from '../DigitalClock/DigitalClock.types';
import { BaseClockProps } from '../internals/models/props/clock';

export interface BaseTimePickerSlotsComponent<TDate> extends TimeClockSlotsComponent {
  /**
   * Custom component for the toolbar rendered above the views.
   * @default TimePickerToolbar
   */
  Toolbar?: React.JSXElementConstructor<TimePickerToolbarProps<TDate>>;
}

export interface BaseTimePickerSlotsComponentsProps extends TimeClockSlotsComponentsProps {
  toolbar?: ExportedTimePickerToolbarProps;
}

export interface BaseTimePickerProps<TDate>
  extends BasePickerInputProps<TDate | null, TDate, TimeView, TimeValidationError>,
    ExportedTimeClockProps<TDate>,
    ExportedDigitalClockProps<TDate> {
  /**
   * Overrideable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: BaseTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: BaseTimePickerSlotsComponentsProps;
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<BaseTimePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BaseTimePickerSlotsComponentsProps;
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be the used.
   */
  viewRenderers?: Partial<
    PickerViewRendererLookup<
      TDate | null,
      TimeView,
      TimeViewRendererProps<TimeView, BaseClockProps<TDate>>,
      {}
    >
  >;
}

type UseTimePickerDefaultizedProps<
  TDate,
  Props extends BaseTimePickerProps<TDate>,
> = LocalizedComponent<
  TDate,
  Omit<
    DefaultizedProps<Props, 'views' | 'openTo' | keyof BaseTimeValidationProps>,
    'components' | 'componentsProps'
  >
>;

export function useTimePickerDefaultizedProps<TDate, Props extends BaseTimePickerProps<TDate>>(
  props: Props,
  name: string,
  isDesktop?: boolean,
): UseTimePickerDefaultizedProps<TDate, Props> {
  const utils = useUtils<TDate>();
  const themeProps = useThemeProps({
    props,
    name,
  });

  const ampm = themeProps.ampm ?? utils.is12HourCycleInCurrentLocale();
  const renderAsDigitalThreshold = themeProps.renderAsDigitalThreshold ?? 24;
  const timeStep = themeProps.timeStep ?? 5;

  const localeText = React.useMemo<PickersInputLocaleText<TDate> | undefined>(() => {
    if (themeProps.localeText?.toolbarTitle == null) {
      return themeProps.localeText;
    }

    return {
      ...themeProps.localeText,
      timePickerToolbarTitle: themeProps.localeText.toolbarTitle,
    };
  }, [themeProps.localeText]);

  const slots = themeProps.slots ?? uncapitalizeObjectKeys(themeProps.components);
  const slotProps = themeProps.slotProps ?? themeProps.componentsProps;
  const shouldRenderDigital = isDesktop && (24 * 60) / timeStep <= renderAsDigitalThreshold;
  return {
    ...themeProps,
    ampm,
    localeText,
    ...applyDefaultViewProps({
      views: themeProps.views,
      openTo: themeProps.openTo,
      defaultViews: shouldRenderDigital ? ['digital'] : ['hours', 'minutes'],
      defaultOpenTo: shouldRenderDigital ? 'digital' : 'hours',
    }),
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
