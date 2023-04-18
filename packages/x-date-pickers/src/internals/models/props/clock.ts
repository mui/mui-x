import { SxProps, Theme } from '@mui/material/styles';
import { BaseTimeValidationProps, TimeValidationProps } from '../../hooks/validation/models';
import { PickerSelectionState } from '../../hooks/usePicker/usePickerValue.types';
import { TimeStepOptions, TimeView } from '../../../models';
import type { ExportedDigitalClockProps } from '../../../DigitalClock/DigitalClock.types';
import type { ExportedUseViewsOptions } from '../../hooks/useViews';
import { TimeViewWithMeridiem } from '../common';

export interface ExportedBaseClockProps<TDate>
  extends TimeValidationProps<TDate>,
    BaseTimeValidationProps {
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm?: boolean;
}

export interface BaseClockProps<TDate, TView extends TimeViewWithMeridiem | TimeView>
  extends ExportedUseViewsOptions<TView>,
    ExportedBaseClockProps<TDate> {
  className?: string;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value?: TDate | null;
  /**
   * The default selected value.
   * Used when the component is not controlled.
   */
  defaultValue?: TDate | null;
  /**
   * Callback fired when the value changes.
   * @template TDate
   * @param {TDate | null} value The new value.
   * @param {PickerSelectionState | undefined} selectionState Indicates if the date selection is complete.
   */
  onChange?: (value: TDate | null, selectionState?: PickerSelectionState) => void;
  /**
   * If `true`, the picker views and text field are disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the picker views and text field are read-only.
   * @default false
   */
  readOnly?: boolean;
}

export interface DesktopOnlyTimePickerProps<TDate> extends ExportedDigitalClockProps<TDate> {
  /**
   * Amount of time options below or at which the single column time renderer is used.
   * @default 24
   */
  thresholdToRenderTimeInASingleColumn?: number;
}

export interface DigitalClockOnlyProps {
  /**
   * The time steps between two time unit options.
   * For example, if `timeStep.minutes = 8`, then the available minute options will be `[0, 8, 16, 24, 32, 40, 48, 56]`.
   * @default{ hours: 1, minutes: 5, seconds: 5 }
   */
  timeSteps?: TimeStepOptions;
}
