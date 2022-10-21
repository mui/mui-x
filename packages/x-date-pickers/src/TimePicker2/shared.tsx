import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DefaultizedProps, MakeOptional } from '../internals/models/helpers';
import { ClockPickerView } from '../ClockPicker';
import { useUtils } from '../internals/hooks/useUtils';
import { ValidationCommonPropsOptionalValue } from '../internals/hooks/validation/useValidation';
import { DateValidationError } from '../internals/hooks/validation/useDateValidation';
import {
  ClockPickerSlotsComponent,
  ClockPickerSlotsComponentsProps,
  ExportedClockPickerProps,
} from '../ClockPicker/ClockPicker';
import { BasePickerProps2 } from '../internals/models/props/basePickerProps';
import { BaseTimeValidationProps } from '../internals/hooks/validation/models';
import { LocalizedComponent, PickersInputLocaleText } from '../locales/utils/pickersLocaleTextApi';
import {
  TimePickerToolbarProps,
  ExportedTimePickerToolbarProps,
  TimePickerToolbar,
} from '../TimePicker/TimePickerToolbar';

export interface BaseTimePicker2SlotsComponent<TDate> extends ClockPickerSlotsComponent {
  /**
   * Custom component for the toolbar rendered above the views.
   * @default TimePickerToolbar
   */
  Toolbar?: React.JSXElementConstructor<TimePickerToolbarProps<TDate>>;
}

export interface BaseTimePicker2SlotsComponentsProps extends ClockPickerSlotsComponentsProps {
  toolbar?: ExportedTimePickerToolbarProps;
}

export interface BaseTimePicker2Props<TDate>
  extends MakeOptional<BasePickerProps2<TDate | null, TDate, ClockPickerView>, 'views' | 'openTo'>,
    ExportedClockPickerProps<TDate>,
    ValidationCommonPropsOptionalValue<DateValidationError, TDate | null> {
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm?: boolean;
  /**
   * The label content.
   */
  label?: React.ReactNode;
  /**
   * Pass a ref to the `input` element.
   */
  inputRef?: React.Ref<HTMLInputElement>;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: BaseTimePicker2SlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: BaseTimePicker2SlotsComponentsProps;
}

type UseTimePicker2DefaultizedProps<
  TDate,
  Props extends BaseTimePicker2Props<TDate>,
> = LocalizedComponent<
  TDate,
  DefaultizedProps<Props, 'views' | 'openTo' | keyof BaseTimeValidationProps>
>;

export function useTimePicker2DefaultizedProps<TDate, Props extends BaseTimePicker2Props<TDate>>(
  props: Props,
  name: string,
): UseTimePicker2DefaultizedProps<TDate, Props> {
  const utils = useUtils<TDate>();
  const themeProps = useThemeProps({
    props,
    name,
  });

  const views = themeProps.views ?? ['hours', 'minutes'];
  const ampm = themeProps.ampm ?? utils.is12HourCycleInCurrentLocale();

  const localeText = React.useMemo<PickersInputLocaleText<TDate> | undefined>(() => {
    if (themeProps.localeText?.toolbarTitle == null) {
      return themeProps.localeText;
    }

    return {
      ...themeProps.localeText,
      timePickerToolbarTitle: themeProps.localeText.toolbarTitle,
    };
  }, [themeProps.localeText]);

  // TODO: Move logic inside `TimeField` if it supports the `ampm` prop.
  let inputFormat: string;
  if (themeProps.inputFormat != null) {
    inputFormat = themeProps.inputFormat;
  } else if (ampm) {
    inputFormat = utils.formats.fullTime12h;
  } else {
    inputFormat = utils.formats.fullTime24h;
  }

  return {
    ...themeProps,
    ampm,
    inputFormat,
    localeText,
    views,
    openTo: themeProps.openTo ?? 'hours',
    disableFuture: themeProps.disableFuture ?? false,
    disablePast: themeProps.disablePast ?? false,
    components: {
      Toolbar: TimePickerToolbar,
      ...themeProps.components,
    },
    componentsProps: {
      ...themeProps.componentsProps,
      toolbar: {
        ampm,
        ampmInClock: themeProps.ampmInClock,
        ...themeProps.componentsProps?.toolbar,
      },
    },
  };
}
