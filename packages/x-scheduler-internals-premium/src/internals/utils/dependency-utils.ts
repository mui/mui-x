import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import { warnOnce } from '@mui/x-internals/warning';
import type { TemporalSupportedObject } from '@base-ui/react/internals/temporal';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import type {
  SchedulerEventId,
  SchedulerEventSide,
  SchedulerProcessedEvent,
} from '@mui/x-scheduler-internals/models';
import type {
  SchedulerDependency,
  SchedulerDependenciesState,
  SchedulerDependencyId,
  SchedulerDependencyEventRejectionReason,
  SchedulerDependencyLagUnit,
  SchedulerDependencyType,
} from '../../models';

export interface SchedulerDependencyEdges {
  /**
   * The edge of the predecessor the dependency starts from.
   */
  source: SchedulerEventSide;
  /**
   * The edge of the successor the dependency ends on.
   */
  target: SchedulerEventSide;
}

const DEPENDENCY_EDGES: Record<SchedulerDependencyType, SchedulerDependencyEdges> = {
  FinishToStart: { source: 'end', target: 'start' },
  StartToStart: { source: 'start', target: 'start' },
  FinishToFinish: { source: 'end', target: 'end' },
  StartToFinish: { source: 'start', target: 'end' },
};

/**
 * The event edges a dependency type connects.
 */
export function getDependencyEdges(type: SchedulerDependencyType): SchedulerDependencyEdges {
  return DEPENDENCY_EDGES[type];
}

/**
 * Whether the value is one of the supported dependency types.
 */
export function isDependencyType(type: unknown): type is SchedulerDependencyType {
  return typeof type === 'string' && Object.hasOwn(DEPENDENCY_EDGES, type);
}

const DEPENDENCY_LAG_ADDERS: Record<
  SchedulerDependencyLagUnit,
  (adapter: Adapter, date: TemporalSupportedObject, amount: number) => TemporalSupportedObject
> = {
  minute: (adapter, date, amount) => adapter.addMinutes(date, amount),
  hour: (adapter, date, amount) => adapter.addHours(date, amount),
  day: (adapter, date, amount) => adapter.addDays(date, amount),
  week: (adapter, date, amount) => adapter.addWeeks(date, amount),
};

/**
 * Whether the value is one of the supported lag units.
 */
export function isDependencyLagUnit(unit: unknown): unit is SchedulerDependencyLagUnit {
  return typeof unit === 'string' && Object.hasOwn(DEPENDENCY_LAG_ADDERS, unit);
}

export interface SchedulerDependencyLag {
  amount: number;
  unit: SchedulerDependencyLagUnit;
}

/**
 * The lag of a dependency as the engine applies it: days by default, and no lag at all
 * for a negative or non-finite amount or an unknown unit.
 */
export function getDependencyLag(
  dependency: Pick<SchedulerDependency, 'lag' | 'lagUnit'>,
): SchedulerDependencyLag {
  const unit = dependency.lagUnit ?? 'day';
  const amount = dependency.lag ?? 0;
  if (!isDependencyLagUnit(unit) || !Number.isFinite(amount) || amount <= 0) {
    return { amount: 0, unit: 'day' };
  }
  return { amount, unit };
}

/**
 * Adds a dependency lag to a date, in the timezone of the date.
 */
export function addDependencyLag(
  adapter: Adapter,
  date: TemporalSupportedObject,
  lag: SchedulerDependencyLag,
): TemporalSupportedObject {
  if (lag.amount === 0) {
    return date;
  }
  return DEPENDENCY_LAG_ADDERS[lag.unit](adapter, date, lag.amount);
}

/**
 * The dependency type created by dragging from `sourceSide` of the predecessor and
 * dropping on `targetSide` of the successor.
 */
export function getDependencyType(
  sourceSide: SchedulerEventSide,
  targetSide: SchedulerEventSide,
): SchedulerDependencyType {
  if (sourceSide === 'end') {
    return targetSide === 'start' ? 'FinishToStart' : 'FinishToFinish';
  }
  return targetSide === 'start' ? 'StartToStart' : 'StartToFinish';
}

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

// Cached per lookup instance so `addDependency` does not regroup everything on each attempt.
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

/**
 * Whether the timeline renders the dependency: a supported type and two endpoint
 * events that are known and non-recurring. Shared by the active-list selector and
 * the selection cleanup, so a dependency the arrows drop can never stay selected.
 */
export function isDependencyActive(
  processedEventLookup: Map<SchedulerEventId, SchedulerProcessedEvent>,
  dependency: SchedulerDependency,
): boolean {
  return (
    isDependencyType(dependency.type) &&
    classifyDependencyEvent(processedEventLookup, dependency.source) === 'ok' &&
    classifyDependencyEvent(processedEventLookup, dependency.target) === 'ok'
  );
}
