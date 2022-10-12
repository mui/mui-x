import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DefaultizedProps, MakeOptional } from '../internals/models/helpers';
import { ClockPicker, ClockPickerProps, ClockPickerView } from '../ClockPicker';
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

export interface BaseTimePicker2SlotsComponent extends Partial<ClockPickerSlotsComponent> {}

export interface BaseTimePicker2SlotsComponentsProps
  extends Partial<ClockPickerSlotsComponentsProps> {}

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
}

export function useTimePicker2DefaultizedProps<TDate, Props extends BaseTimePicker2Props<TDate>>(
  props: Props,
  name: string,
): DefaultizedProps<Props, 'views' | 'openTo' | keyof BaseTimeValidationProps> {
  const utils = useUtils<TDate>();
  const themeProps = useThemeProps({
    props,
    name,
  });

  const views = themeProps.views ?? ['hours', 'minutes'];
  const ampm = themeProps.ampm ?? utils.is12HourCycleInCurrentLocale();

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
    views,
    openTo: themeProps.openTo ?? 'hours',
    disableFuture: themeProps.disableFuture ?? false,
    disablePast: themeProps.disablePast ?? false,
  };
}

export const renderTimeViews = <TDate extends unknown>(props: ClockPickerProps<TDate>) => (
  <ClockPicker<TDate> {...props} autoFocus />
);
