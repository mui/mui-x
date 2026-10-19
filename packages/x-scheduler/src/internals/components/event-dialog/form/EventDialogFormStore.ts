import { createSelectorMemoized } from '@base-ui/utils/store';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import type { ResourceSelectionMode } from '@mui/x-scheduler-internals/internals';
import type { EventDialogFormValues } from '../utils';
import {
  SchedulerFormStore,
  schedulerFormSelectors,
} from '../../scheduler-form/SchedulerFormStore';
import type {
  SchedulerFormErrorMessage,
  SchedulerFormParameters,
  SchedulerFormState,
  SchedulerFormValidator,
  SchedulerFormValidatorResult,
} from '../../scheduler-form/SchedulerFormStore';

export type EventDialogFormState<TValues extends Record<string, unknown> = EventDialogFormValues> =
  SchedulerFormState<TValues>;

/**
 * Message(s) that can be rendered for a failing field: any React node except
 * booleans, which are excluded so a `condition && 'message'` shorthand is a
 * type error instead of a silently stored `false`.
 */
export type EventDialogFormErrorMessage = SchedulerFormErrorMessage;

/**
 * Error message(s) for a field, or `null` when the value is valid
 * (an empty string or array also counts as valid). An array is a list
 * of messages, not a single node.
 */
export type EventDialogFormValidatorResult = SchedulerFormValidatorResult;

export type EventDialogFormValidator<
  TValues extends Record<string, unknown> = EventDialogFormValues,
> = SchedulerFormValidator<TValues>;

export interface EventDialogFormParameters<
  TValues extends Record<string, unknown> = EventDialogFormValues,
> extends SchedulerFormParameters<TValues> {
  /**
   * The occurrence the editing session targets. Captured when the dialog opens.
   */
  occurrence: SchedulerRenderableEventOccurrence;
  /**
   * Whether the resource picker of the editing session is single- or multi-select.
   * Captured when the dialog opens.
   */
  resourceSelectionMode: ResourceSelectionMode;
}

export const eventDialogFormSelectors = {
  ...schedulerFormSelectors,
  /**
   * The values `computeRange` reads, as one stable object per distinct combination.
   */
  rangeValues: createSelectorMemoized(
    (state: EventDialogFormState) => state.values.startDate,
    (state: EventDialogFormState) => state.values.startTime,
    (state: EventDialogFormState) => state.values.endDate,
    (state: EventDialogFormState) => state.values.endTime,
    (state: EventDialogFormState) => state.values.allDay,
    (startDate, startTime, endDate, endTime, allDay) => ({
      startDate,
      startTime,
      endDate,
      endTime,
      allDay,
    }),
  ),
};

/**
 * Draft store backing the event dialog form, with the constants of the editing session
 * (`occurrence`, `resourceSelectionMode`).
 */
export class EventDialogFormStore<
  TValues extends Record<string, unknown> = EventDialogFormValues,
> extends SchedulerFormStore<TValues> {
  /**
   * The occurrence the editing session targets. Constant for the lifetime of the store.
   */
  declare public readonly occurrence: SchedulerRenderableEventOccurrence;

  /**
   * Whether the resource picker of the editing session is single- or multi-select.
   * Constant for the lifetime of the store: the resource Select and the submit
   * logic must read the same value.
   */
  declare public readonly resourceSelectionMode: ResourceSelectionMode;

  constructor(initialValues: TValues, parameters: EventDialogFormParameters<TValues>) {
    super(initialValues, parameters);
    this.occurrence = parameters.occurrence;
    this.resourceSelectionMode = parameters.resourceSelectionMode;
  }
}
