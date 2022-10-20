import { IUtils } from '@date-io/core/IUtils';

// TODO: Maybe we should add the same constraint.
// @ts-ignore TDate in our codebase does not have the `ExtendableDateType` constraint.
export type MuiPickersAdapter<TDate> = IUtils<TDate>;

export type MuiDateSectionName = 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second' | 'am-pm';

export type MuiFormatTokenMap = { [formatToken: string]: MuiDateSectionName };

export interface MuiPickerFieldAdapter<TDate> extends MuiPickersAdapter<TDate> {
  formatTokenMap: MuiFormatTokenMap;

  expandFormat: (format: string) => string;
}
