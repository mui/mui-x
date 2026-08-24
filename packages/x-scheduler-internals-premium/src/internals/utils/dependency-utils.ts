import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import { warnOnce } from '@mui/x-internals/warning';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import type { SchedulerEventId, SchedulerProcessedEvent } from '@mui/x-scheduler-internals/models';
import type {
  SchedulerDependency,
  SchedulerDependenciesState,
  SchedulerDependencyId,
  SchedulerDependencyEventRejectionReason,
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
 * Groups dependencies by the event id at one of their ends.
 */
export function groupByEventId(
  dependencies: readonly SchedulerDependency[],
  property: 'source' | 'target',
): Map<SchedulerEventId, SchedulerDependency[]> {
  const groups = new Map<SchedulerEventId, SchedulerDependency[]>();
  for (const dependency of dependencies) {
    const eventId = dependency[property];
    const group = groups.get(eventId);
    if (group) {
      group.push(dependency);
    } else {
      groups.set(eventId, [dependency]);
    }
  }
  return groups;
}

// Cached per lookup instance: `addDependency` needs the full retained set grouped by
// source on every attempt, and regrouping tens of thousands of dependencies on each
// drop would stall the interaction.
const bySourceCache = new WeakMap<
  Map<SchedulerDependencyId, SchedulerDependency>,
  Map<SchedulerEventId, SchedulerDependency[]>
>();

/**
 * Groups the retained (deduplicated) dependencies by their `source` event id.
 */
export function groupRetainedDependenciesBySource(
  dependencyModelLookup: Map<SchedulerDependencyId, SchedulerDependency>,
): Map<SchedulerEventId, SchedulerDependency[]> {
  let groups = bySourceCache.get(dependencyModelLookup);
  if (groups == null) {
    groups = groupByEventId(Array.from(dependencyModelLookup.values()), 'source');
    bySourceCache.set(dependencyModelLookup, groups);
  }
  return groups;
}

/**
 * Whether the dependency cannot be created or deleted because one of its endpoint
 * events is read-only. The single definition shared by the store guard and the
 * `isModelReadOnly` selector.
 */
export function isDependencyReadOnly(
  state: Parameters<typeof schedulerEventSelectors.isReadOnly>[0],
  dependency: { source: SchedulerEventId; target: SchedulerEventId },
): boolean {
  return (
    schedulerEventSelectors.isReadOnly(state, dependency.source) ||
    schedulerEventSelectors.isReadOnly(state, dependency.target)
  );
}

/**
 * Classifies an event id for use as a dependency endpoint: known and non-recurring
 * (`'ok'`), missing from the lookup (`'unknownEvent'`), or recurring (`'recurringEvent'`).
 */
export function classifyDependencyEvent(
  processedEventLookup: Map<SchedulerEventId, SchedulerProcessedEvent>,
  eventId: SchedulerEventId,
): SchedulerDependencyEventRejectionReason | 'ok' {
  const processedEvent = processedEventLookup.get(eventId);
  if (processedEvent == null) {
    return 'unknownEvent';
  }
  if (processedEvent.dataTimezone.rrule != null) {
    return 'recurringEvent';
  }
  return 'ok';
}
