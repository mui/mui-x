import { SxProps, Theme } from '@mui/material/styles';
import { BaseTimeValidationProps, TimeValidationProps } from '../../hooks/validation/models';
import { PickerSelectionState } from '../../hooks/usePicker/usePickerValue';
import { TimeView } from '../views';
import type { ExportedTimeClockProps } from '../../../TimeClock/TimeClock.types';
import type { ExportedDigitalClockProps } from '../../../DigitalClock/DigitalClock.types';

export interface ExportedBaseClockProps<TDate>
  extends TimeValidationProps<TDate>,
    BaseTimeValidationProps {
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm?: boolean;
}

export interface BaseClockProps<TDate> {
  className?: string;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Set to `true` if focus should be moved to time digital picker.
   */
  autoFocus?: boolean;
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
   * Controlled open view.
   */
  view?: TimeView;
  /**
   * Views displaying digital clock time sections.
   * @default ['hours', 'minutes']
   */
  views?: readonly TimeView[];
  /**
   * Callback fired on view change.
   * @param {TimeView} view The new view.
   */
  onViewChange?: (view: TimeView) => void;
  /**
   * Initially open view.
   * @default 'hours'
   */
  openTo?: TimeView;
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the picker and text field are readOnly.
   * @default false
   */
  readOnly?: boolean;
}

export interface BaseCommonTimePickerProps<TDate>
  extends ExportedTimeClockProps<TDate>,
    ExportedDigitalClockProps<TDate> {
  /**
   * Number of possible time options at which the component uses `digital` view.
   * Used only in `desktop` mode.
   * @default 24
   */
  renderAsDigitalThreshold?: number;
}
