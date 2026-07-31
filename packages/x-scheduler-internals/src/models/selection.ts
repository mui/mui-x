/**
 * The selectable entity types, mapping the type name to its id type. Extended through
 * module augmentation by the packages introducing selectable entities: the timeline
 * premium registers `dependency`, and event selection will register its own. Not for
 * every active thing — the occurrence open in the event dialog is an editing session
 * (`editedOccurrenceKey`) that deliberately coexists with a selection.
 */
export interface SchedulerSelectionTypeLookup {}

/**
 * The selected entity of the scheduler. One slice for every selectable type keeps the
 * selection mutually exclusive across features: selecting an entity of one type
 * replaces the selection of any other, and a single owner reacts to Delete/Escape.
 */
export type SchedulerSelection = {
  [K in keyof SchedulerSelectionTypeLookup]: { type: K; id: SchedulerSelectionTypeLookup[K] };
}[keyof SchedulerSelectionTypeLookup];
