// Do not remove the `.d.ts` file extension, it allows to keep the `@ts-expect-error` below after the build.
import { IUtils } from '@date-io/core/IUtils';

// TODO: Maybe we should add the same constraint.
// @ts-ignore TDate in our codebase does not have the `ExtendableDateType` constraint.
export type MuiPickersAdapter<TDate> = IUtils<TDate> & {
  isMUIAdapter: boolean;

  formatTokenMap: FieldFormatTokenMap;

  /**
   * Characters used to start and end an escaped message in the format.
   */
  escapedCharacters: { start: string; end: string };

  expandFormat: (format: string) => string;

  getWeekNumber: (date: TDate) => number;
};

export type FieldSectionType =
  | 'year'
  | 'month'
  | 'day'
  | 'weekDay'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'meridiem';

export type FieldFormatTokenMap = {
  [formatToken: string]:
    | FieldSectionType
    | { sectionType: FieldSectionType; contentType: 'digit' | 'letter' };
};
