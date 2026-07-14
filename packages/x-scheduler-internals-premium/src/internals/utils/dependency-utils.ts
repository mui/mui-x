import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import { warnOnce } from '@mui/x-internals/warning';
import type { SchedulerEventId, SchedulerProcessedEvent } from '@mui/x-scheduler-internals/models';
import type {
  SchedulerDependency,
  SchedulerDependenciesState,
  SchedulerDependencyId,
} from '../../models';

// `updateStateFromParameters` runs on every render, so an unchanged `dependencies`
// parameter must map to the same state slice instance.
const dependenciesStateCache = new WeakMap<
  readonly SchedulerDependency[],
  SchedulerDependenciesState
>();

export function buildDependenciesState(
  dependencies: readonly SchedulerDependency[] = EMPTY_ARRAY,
): SchedulerDependenciesState {
  let state = dependenciesStateCache.get(dependencies);
  if (state == null) {
    const dependencyModelLookup = new Map(
      dependencies.map((dependency) => [dependency.id, dependency]),
    );

    if (process.env.NODE_ENV !== 'production') {
      if (dependencyModelLookup.size !== dependencies.length) {
        const seen = new Set<SchedulerDependencyId>();
        for (const dependency of dependencies) {
          if (seen.has(dependency.id)) {
            warnOnce([
              `MUI X Scheduler: Two or more dependencies share the same id "${String(dependency.id)}".`,
              'Dependency ids must be unique. Only the last dependency with a given id is used, the others are ignored.',
            ]);
          }
          seen.add(dependency.id);
        }
      }
    }

    state = { dependencyModelList: dependencies, dependencyModelLookup };
    dependenciesStateCache.set(dependencies, state);
  }
  return state;
}

/**
 * Classifies an event id for use as a dependency endpoint: known and non-recurring
 * (`'ok'`), missing from the lookup (`'unknownEvent'`), or recurring (`'recurringEvent'`).
 */
export function classifyDependencyEvent(
  processedEventLookup: Map<SchedulerEventId, SchedulerProcessedEvent>,
  eventId: SchedulerEventId,
): 'ok' | 'unknownEvent' | 'recurringEvent' {
  const processedEvent = processedEventLookup.get(eventId);
  if (processedEvent == null) {
    return 'unknownEvent';
  }
  if (processedEvent.dataTimezone.rrule != null) {
    return 'recurringEvent';
  }
  return 'ok';
}
