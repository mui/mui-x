import type {
  SchedulerEventEditingStartEventDetails,
  SchedulerEventOccurrence,
  SchedulerEventOccurrencePlaceholder,
} from './index';

// Narrowing on `eventDetails.reason` types `eventDetails.occurrence` per branch.
export function narrowEventDetails(details: SchedulerEventEditingStartEventDetails) {
  // Every branch carries the stable positioning anchor alongside the activation trigger.
  details.anchor satisfies HTMLElement | undefined;
  details.trigger satisfies Element | undefined;
  if (details.reason === 'edit') {
    const occurrence: SchedulerEventOccurrence = details.occurrence;
    occurrence.modelInBuiltInFormat.id;
    // @ts-expect-error exception dates belong to the event, not the occurrence
    occurrence.exDates;
  } else if (details.reason === 'view') {
    const occurrence: SchedulerEventOccurrence = details.occurrence;
    occurrence.modelInBuiltInFormat.id;
  } else {
    details.reason satisfies 'creation';
    const draft: SchedulerEventOccurrencePlaceholder = details.occurrence;
    // @ts-expect-error the creation draft carries no persisted event model
    details.occurrence.modelInBuiltInFormat;
    draft.start;
  }
}
