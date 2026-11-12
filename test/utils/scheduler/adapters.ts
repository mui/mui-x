import { TemporalAdapterDateFns } from '@base-ui/react/internals/temporal-adapter-date-fns';

// The Scheduler no longer takes an adapter: this one only remains for the unused parameter of
// `EventBuilder.new()`.
export const adapter = new TemporalAdapterDateFns();
