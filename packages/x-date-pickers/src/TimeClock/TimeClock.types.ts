import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { TimeClockClasses } from './timeClockClasses';
import { TimeValidationProps, BaseTimeValidationProps } from '../internals/hooks/validation/models';
import {
  PickersArrowSwitcherSlotsComponent,
  PickersArrowSwitcherSlotsComponentsProps,
} from '../internals/components/PickersArrowSwitcher';
import { TimeView } from '../models';
import { PickerSelectionState } from '../internals/hooks/usePicker/usePickerValue.types';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';

export interface ExportedTimeClockProps<TDate>
  extends TimeValidationProps<TDate>,
    BaseTimeValidationProps {
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm?: boolean;
  /**
   * Display ampm controls under the clock (instead of in the toolbar).
   * @default false
   */
  ampmInClock?: boolean;
}

export interface TimeClockSlotsComponent extends PickersArrowSwitcherSlotsComponent {}

export interface TimeClockSlotsComponentsProps extends PickersArrowSwitcherSlotsComponentsProps {}

export interface TimeClockProps<TDate> extends ExportedTimeClockProps<TDate> {
  className?: string;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Set to `true` if focus should be moved to clock picker.
   */
  autoFocus?: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<TimeClockClasses>;
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: TimeClockSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: TimeClockSlotsComponentsProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<TimeClockSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TimeClockSlotsComponentsProps;
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
  showViewSwitcher?: boolean;
  /**
   * Controlled open view.
   */
  view?: TimeView;
  /**
   * Views for calendar picker.
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
   * Make picker read only.
   * @default false
   */
  readOnly?: boolean;
}
