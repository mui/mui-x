import { IUtils } from '@date-io/core/IUtils';

// @ts-ignore TDate in our codebase does not have the `ExtendableDateType` constraint.
// TODO: Maybe we should add the same constraint.
export type MuiPickersAdapter<TDate> = IUtils<TDate>;
