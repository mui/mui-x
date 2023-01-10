import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { MonthCalendarClasses } from './monthCalendarClasses';
import {
  BaseDateValidationProps,
  MonthValidationProps,
} from '../internals/hooks/validation/models';

export interface MonthCalendarProps<TDate>
  extends MonthValidationProps<TDate>,
    BaseDateValidationProps<TDate> {
  autoFocus?: boolean;
  /**
   * className applied to the root element.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<MonthCalendarClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /** If `true` picker is disabled */
  disabled?: boolean;
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
   */
  onChange?: (value: TDate) => void;
  /** If `true` picker is readonly */
  readOnly?: boolean;
  /**
   * If `true`, today's date is rendering without highlighting with circle.
   * @default false
   */
  disableHighlightToday?: boolean;
  onMonthFocus?: (month: number) => void;
  hasFocus?: boolean;
  onFocusedViewChange?: (hasFocus: boolean) => void;
}
