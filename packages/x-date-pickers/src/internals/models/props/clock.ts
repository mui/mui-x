import { SxProps, Theme } from '@mui/material/styles';
import { BaseTimeValidationProps, TimeValidationProps } from '../../hooks/validation/models';
import { PickerSelectionState } from '../../hooks/usePicker/usePickerValue.types';
import { TimeView } from '../../../models';
import type { ExportedDigitalClockProps } from '../../../DigitalClock/DigitalClock.types';
import type { ExportedUseViewsOptions } from '../../hooks/useViews';

export interface ExportedBaseClockProps<TDate>
  extends TimeValidationProps<TDate>,
    BaseTimeValidationProps {
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm?: boolean;
}

export interface BaseClockProps<TDate>
  extends ExportedUseViewsOptions<TimeView>,
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
   * The time interval between two `minutes` or `seconds` options.
   * For example, if `timeStep = 8`, then the available options will be `[0, 8, 16, 24, 32, 40, 48, 56]`.
   * @default 5
   */
  timeStep?: number;
}
