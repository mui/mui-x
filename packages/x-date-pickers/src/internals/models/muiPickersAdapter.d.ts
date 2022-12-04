// Do not remove the `.d.ts` file extension, it allows to keep the `@ts-expect-error` below after the build.
import { IUtils } from '@date-io/core/IUtils';

// TODO: Maybe we should add the same constraint.
// @ts-ignore TDate in our codebase does not have the `ExtendableDateType` constraint.
export type MuiPickersAdapter<TDate> = IUtils<TDate> & {
  isMUIAdapter: boolean;

  formatTokenMap: MuiFormatTokenMap;

  expandFormat: (format: string) => string;

  getWeekNumber: (date: TDate) => number;
};

export type MuiDateSectionName =
  | 'year'
  | 'month'
  | 'day'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'meridiem';

export type MuiFormatTokenMap = {
  [formatToken: string]:
    | MuiDateSectionName
    | { sectionName: MuiDateSectionName; contentType: 'digit' | 'letter' };
};
