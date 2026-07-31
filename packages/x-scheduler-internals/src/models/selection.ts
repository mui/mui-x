/**
 * The selectable entity types, mapping the type name to its id type. Extended through
 * module augmentation by the packages introducing selectable entities (the timeline
 * premium registers `dependency`).
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
