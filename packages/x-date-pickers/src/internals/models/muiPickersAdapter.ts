import { IUtils } from '@date-io/core/IUtils';

export type MuiPickersAdapter<TDate> = IUtils<TDate extends {}>;

export type MuiDateSectionName = 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second' | 'am-pm';

export type MuiFormatTokenMap = { [formatToken: string]: MuiDateSectionName };

export interface MuiPickerFieldAdapter<TDate> extends MuiPickersAdapter<TDate> {
  formatTokenMap: MuiFormatTokenMap;

  expandFormat: (format: string) => string;
}
