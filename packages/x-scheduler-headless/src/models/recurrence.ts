export type RecurrencePresetKey = 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * The scope of a recurring event update.
 *
 * - `only-this`: Updates only the selected occurrence of the recurring event.
 * - `this-and-following`: Updates the selected occurrence and all following occurrences,
 *   but leaves the previous ones untouched.
 * - `all`: Updates all occurrences in the recurring series, past, present, and future.
 */
export type RecurringUpdateEventScope = 'this-and-following' | 'all' | 'only-this';
