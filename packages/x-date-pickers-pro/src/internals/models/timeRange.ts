import {
  BaseTimeValidationProps,
  TimeValidationProps,
  MakeOptional,
  UseFieldInternalProps,
} from '@mui/x-date-pickers/internals';
import {
  TimeRangeValidationError,
  RangeFieldSection,
  DateRange,
  RangeFieldSeparatorProps,
} from '../../models';

export interface UseTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      Omit<
        UseFieldInternalProps<
          DateRange,
          RangeFieldSection,
          TEnableAccessibleFieldDOMStructure,
          TimeRangeValidationError
        >,
        'unstableFieldRef'
      >,
      'format'
    >,
    RangeFieldSeparatorProps,
    TimeValidationProps,
    BaseTimeValidationProps {
  /**
   * 12h/24h view for hour selection clock.
   * @default utils.is12HourCycleInCurrentLocale()
   */
  ampm?: boolean;
}
