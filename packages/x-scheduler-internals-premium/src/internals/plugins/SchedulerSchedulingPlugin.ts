import { DisposableStack, disposeSymbol } from '@mui/x-internals/disposable';
import { generateId } from '@base-ui/utils/generateId';
import { warnOnce } from '@mui/x-internals/warning';
import type {
  SchedulerSchedulingPluginInterface,
  SchedulerState,
  SchedulerParameters,
  UpdateEventsParameters,
  SchedulerStore,
} from '@mui/x-scheduler-internals/internals';
import { createChangeEventDetails } from '@base-ui/react/internals/createBaseUIEventDetails';
import type {
  SchedulerEventId,
  SchedulerEventUpdatedProperties,
} from '@mui/x-scheduler-internals/models';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import type {
  SchedulerAddDependencyResult,
  SchedulerDependency,
  SchedulerDependencyCascadeBlockedRejection,
  SchedulerDependencyCreationProperties,
  SchedulerDependencyId,
  SchedulerDependenciesParameters,
  SchedulerDependenciesState,
  SchedulerDependencyUpdatedProperties,
  SchedulerLazyLoadingParameters,
  SchedulerUpdateDependencyResult,
} from '../../models';
import { eventTimelinePremiumDependencySelectors } from '../../event-timeline-premium-selectors/eventTimelinePremiumDependencySelectors';
import { computeAutoSchedulingCascade, getDependencyViolation } from '../utils/auto-scheduling';
import {
  buildDependenciesState,
  classifyDependencyEvent,
  findDuplicateDependency,
  getActiveDependencies,
  groupByEventId,
  groupRetainedDependenciesBySource,
  isDependencyActive,
  isDependencyReadOnly,
  getDependencyLagIssue,
  isDependencyType,
} from '../utils/dependency-utils';
import type { SchedulerDependencyLagIssue } from '../utils/dependency-utils';

const DEPENDENCY_LAG_WARNINGS: Record<
  SchedulerDependencyLagIssue,
  (dependency: SchedulerDependency) => string[]
> = {
  negative: (dependency) => [
    `MUI X Scheduler: The dependency "${String(dependency.id)}" has a negative lag (${String(dependency.lag)}).`,
    'Lead (negative lag) is not supported yet, so the lag is ignored.',
    'Use a positive whole number, or remove the lag.',
  ],
  notAWholeNumber: (dependency) => [
    `MUI X Scheduler: The dependency "${String(dependency.id)}" has a lag that is not a whole number (${String(dependency.lag)}).`,
    'A fractional lag cannot be expressed in its unit, so it is ignored.',
    'Round it, or express it in a smaller `lagUnit`.',
  ],
  unknownUnit: (dependency) => [
    `MUI X Scheduler: The dependency "${String(dependency.id)}" has the unknown lag unit "${String(dependency.lagUnit)}".`,
    'The lag cannot be applied, so it is ignored.',
    'Use one of "minute", "hour", "day" or "week".',
  ],
};

/**
 * Plugin that provides event-scheduling support (dependencies).
 * Composed by the timeline premium store and injected into `SchedulerStore` through
 * `SchedulerSchedulingPluginInterface`.
 */
export class SchedulerSchedulingPlugin<
  TEvent extends object,
  State extends SchedulerState & SchedulerDependenciesState,
  Parameters extends SchedulerParameters<TEvent, any> &
    SchedulerDependenciesParameters &
    SchedulerLazyLoadingParameters<TEvent>,
> implements SchedulerSchedulingPluginInterface {
  declare protected store: SchedulerStore<TEvent, any, State, Parameters>;

  protected readonly disposables = new DisposableStack();

  private readonly applyCascade: (updated: SchedulerEventUpdatedProperties[]) => void;

  // The batch `applyCascade` is applying: those moves are already the engine's output.
  // Matched by reference, so an update triggered from `onEventsChange` still cascades.
  private appliedCascade: SchedulerEventUpdatedProperties[] | null = null;

  /**
   * @param applyCascade Applies event updates through the store's `updateEvents`.
   */
  public constructor(
    store: SchedulerStore<TEvent, any, State, Parameters>,
    applyCascade: (updated: SchedulerEventUpdatedProperties[]) => void,
  ) {
    this.store = store;
    this.applyCascade = applyCascade;

    if (process.env.NODE_ENV !== 'production') {
      this.warnOnInvalidDependencies();
      this.disposables.defer(
        store.registerStoreEffect(
          (state) => state.dependencyModelList,
          () => this.warnOnInvalidDependencies(),
        ),
      );
      this.disposables.defer(
        store.registerStoreEffect(
          (state) => state.processedEventLookup,
          () => this.warnOnInvalidDependencies(),
        ),
      );
    }
  }

  [disposeSymbol]() {
    this.disposables.dispose();
  }

  private updateDependencies(newDependencies: SchedulerDependency[]) {
    if (process.env.NODE_ENV !== 'production') {
      if (!this.store.parameters.onDependenciesChange) {
        warnOnce(
          [
            'MUI X Scheduler: A dependency update was ignored because no `onDependenciesChange` handler is provided.',
            'The `dependencies` prop is fully controlled, so without it the changes are lost and the UI does not update.',
            'Pass an `onDependenciesChange` handler that updates the `dependencies` prop.',
          ].join('\n'),
        );
      }
    }

    const eventDetails = createChangeEventDetails('none');
    this.store.parameters.onDependenciesChange?.(newDependencies, eventDetails);
  }

  /**
   * Emits `onDependenciesChange` with `remaining` only if it actually dropped entries from
   * `current`, so unaffected updates don't trigger a no-op emission.
   */
  private updateDependenciesIfChanged(
    current: readonly SchedulerDependency[],
    remaining: SchedulerDependency[],
  ) {
    if (remaining.length !== current.length) {
      this.updateDependencies(remaining);
    }
  }

  /**
   * Removes the dependencies referencing deleted events and computes the
   * auto-scheduling cascade for the updated ones, all in the same update. A batch
   * whose cascade would need to move a read-only event is vetoed instead: nothing is
   * applied, and the rejection is returned for the caller to surface.
   *
   * With a `dataSource`, event deletions are persisted asynchronously after this hook has
   * already emitted `onDependenciesChange`. If that persistence fails, the event survives but
   * its dependencies were already removed — a known v1 limitation, there is no rollback.
   */
  public handleEventsUpdate = (parameters: UpdateEventsParameters) => {
    if (parameters.updated !== undefined && parameters.updated === this.appliedCascade) {
      return undefined;
    }
    const { deleted, updated } = parameters;
    const deletedSet = new Set(deleted);

    // Cascade first: a vetoed batch must not have emitted the dependency cleanup.
    let cascaded: SchedulerEventUpdatedProperties[] = [];
    if (updated && updated.length > 0 && this.store.state.dependencyModelList.length > 0) {
      const result = computeAutoSchedulingCascade({
        adapter: this.store.state.adapter,
        processedEventLookup: this.store.state.processedEventLookup,
        activeDependenciesBySource: eventTimelinePremiumDependencySelectors.activeModelListBySource(
          this.store.state,
        ),
        activeDependenciesByTarget: eventTimelinePremiumDependencySelectors.activeModelListByTarget(
          this.store.state,
        ),
        isEventReadOnly: (eventId) => schedulerEventSelectors.isReadOnly(this.store.state, eventId),
        updated,
        deleted: deletedSet,
      });
      if (result.blocked.length > 0) {
        const blockedEvent = this.store.state.processedEventLookup.get(result.blocked[0])!;
        return {
          rejected: true as const,
          error: /* minify-error-disabled */ new Error(
            `This change would move the read-only event "${blockedEvent.title}", so it was not applied.`,
          ),
        };
      }
      cascaded = result.updated;
    }

    if (deletedSet.size > 0) {
      const current = this.store.state.dependencyModelList;
      const remaining = current.filter(
        (dependency) => !deletedSet.has(dependency.source) && !deletedSet.has(dependency.target),
      );
      this.updateDependenciesIfChanged(current, remaining);
    }

    return cascaded.length > 0 ? { updated: cascaded } : undefined;
  };

  /**
   * Adds a dependency between two events.
   * Rejects every dependency while the scheduler is read-only, and dependencies
   * referencing an unknown or recurring event, duplicating an existing dependency, closing
   * a cycle, or needing a read-only event to move.
   * The guards read the controlled `dependencies` value, so two adds in the same
   * tick are not validated against each other.
   * Implementation of the store's `addDependency()` — call it through the store.
   */
  public addDependency = (
    properties: SchedulerDependencyCreationProperties,
  ): SchedulerAddDependencyResult => {
    if (isDependencyReadOnly(this.store.state)) {
      return { status: 'rejected', reason: 'readOnly' };
    }
    const { processedEventLookup } = this.store.state;
    for (const eventId of [properties.source, properties.target]) {
      const status = classifyDependencyEvent(processedEventLookup, eventId);
      if (status !== 'ok') {
        return { status: 'rejected', reason: status, eventId };
      }
    }

    // Duplicate before cycle: on data that already contains a cycle, re-adding an
    // existing pair must report the duplicate (and select its arrow), not the cycle.
    const duplicate = findDuplicateDependency(this.store.state.dependencyModelLookup, properties);
    if (duplicate) {
      return { status: 'rejected', reason: 'duplicateDependency', dependencyId: duplicate.id };
    }

    // Grouped from the lookup, not the raw list: with duplicate ids only the last
    // entry per id exists for the feature, so a shadowed edge must not close a cycle.
    const dependenciesBySource = groupRetainedDependenciesBySource(
      this.store.state.dependencyModelLookup,
    );
    if (this.isCreatingCycle(dependenciesBySource, properties.source, properties.target)) {
      return { status: 'rejected', reason: 'cyclicDependency' };
    }

    const dependency: SchedulerDependency = { ...properties, id: generateId('dependency') };
    const rejection = this.commitDependencyChange(
      [...this.store.state.dependencyModelList, dependency],
      dependency,
    );
    return rejection ?? { status: 'added', id: dependency.id };
  };

  /**
   * Changes the properties of an existing dependency.
   * Rejects every change while the scheduler is read-only, an unknown id, a type change
   * duplicating another dependency between the same events, and a change needing a
   * read-only event to move. An update keeps the source and target, so it cannot close a
   * cycle. Events only move when the change makes the dependency stricter: its target
   * has to move further than before.
   * Implementation of the store's `updateDependency()` — call it through the store.
   */
  public updateDependency = (
    dependencyId: SchedulerDependencyId,
    changes: SchedulerDependencyUpdatedProperties,
  ): SchedulerUpdateDependencyResult => {
    const { dependencyModelLookup, dependencyModelList } = this.store.state;
    const dependency = dependencyModelLookup.get(dependencyId);
    if (dependency === undefined) {
      return { status: 'rejected', reason: 'unknownDependency' };
    }
    if (isDependencyReadOnly(this.store.state)) {
      return { status: 'rejected', reason: 'readOnly' };
    }

    const updated: SchedulerDependency = { ...dependency, ...changes };
    for (const key of ['lag', 'lagUnit'] as const) {
      if (key in changes && changes[key] === undefined) {
        delete updated[key];
      }
    }
    if (
      updated.type === dependency.type &&
      updated.lag === dependency.lag &&
      updated.lagUnit === dependency.lagUnit
    ) {
      return { status: 'updated' };
    }

    if (updated.type !== dependency.type) {
      const duplicate = findDuplicateDependency(dependencyModelLookup, updated, dependencyId);
      if (duplicate) {
        return { status: 'rejected', reason: 'duplicateDependency', dependencyId: duplicate.id };
      }
    }

    // Only a stricter dependency moves events: relaxing one that the dates already break
    // (a shorter lag) leaves them as they are, so the cascade veto never rejects it.
    const { adapter, processedEventLookup } = this.store.state;
    const isStricter =
      getDependencyViolation(adapter, processedEventLookup, updated) >
      getDependencyViolation(adapter, processedEventLookup, dependency);
    const rejection = this.commitDependencyChange(
      dependencyModelList.map((entry) => (entry.id === dependencyId ? updated : entry)),
      isStricter ? updated : null,
    );
    return rejection ?? { status: 'updated' };
  };

  /**
   * Emits `nextList` and moves the events needed to satisfy `enforced` in full (and the
   * cascade behind it), with a single run of the engine: applying the moves through
   * `updateEvents` would cascade them again and clamp the target against all its
   * predecessors, not only `enforced`. With `enforced` `null`, no event moves.
   * Nothing is emitted when the move would need a read-only event to move. Otherwise
   * `onDependenciesChange` is emitted before `onEventsChange`, as two separate changes:
   * if the parent drops the dependency, the events have moved anyway. Until the parent
   * passes the new list back, an update made from `onEventsChange` is cascaded with the
   * previous dependencies.
   */
  private commitDependencyChange(
    nextList: SchedulerDependency[],
    enforced: SchedulerDependency | null,
  ): SchedulerDependencyCascadeBlockedRejection | null {
    const { adapter, processedEventLookup } = this.store.state;
    const activeDependencies = getActiveDependencies(
      buildDependenciesState(nextList).dependencyModelLookup,
      processedEventLookup,
    );
    const result = computeAutoSchedulingCascade({
      adapter,
      processedEventLookup,
      activeDependenciesBySource: groupByEventId(activeDependencies, 'source'),
      activeDependenciesByTarget: groupByEventId(activeDependencies, 'target'),
      isEventReadOnly: (eventId) => schedulerEventSelectors.isReadOnly(this.store.state, eventId),
      updated: [],
      deleted: new Set(),
      enforcedDependencies:
        enforced !== null && isDependencyActive(processedEventLookup, enforced) ? [enforced] : [],
    });
    if (result.blocked.length > 0) {
      return { status: 'rejected', reason: 'cascadeBlocked', eventId: result.blocked[0] };
    }

    this.updateDependencies(nextList);
    if (result.updated.length > 0) {
      this.appliedCascade = result.updated;
      try {
        this.applyCascade(result.updated);
      } finally {
        this.appliedCascade = null;
      }
    }
    return null;
  }

  /**
   * Whether adding `source → target` would close a cycle: `target` already reaches
   * `source` (a self-loop is the zero-length path). Walks every dependency, not only
   * the active ones — a dormant cycle becomes live when its endpoint reactivates.
   */
  private isCreatingCycle(
    dependenciesBySource: Map<SchedulerEventId, SchedulerDependency[]>,
    source: SchedulerEventId,
    target: SchedulerEventId,
  ): boolean {
    const stack: SchedulerEventId[] = [target];
    const visited = new Set<SchedulerEventId>();
    while (stack.length > 0) {
      const eventId = stack.pop()!;
      if (eventId === source) {
        return true;
      }
      if (visited.has(eventId)) {
        continue;
      }
      visited.add(eventId);
      for (const dependency of dependenciesBySource.get(eventId) ?? []) {
        stack.push(dependency.target);
      }
    }
    return false;
  }

  /**
   * Deletes a dependency, returning whether it was deleted. Refused (`false`) for an
   * unknown id and while the scheduler is read-only, so the store stays safe
   * regardless of which affordance calls it and the callers pairing the deletion with
   * a side effect (clearing the selection) never act on a no-op.
   * Implementation of the store's `deleteDependency()` — call it through the store.
   */
  public deleteDependency = (dependencyId: SchedulerDependencyId): boolean => {
    const dependency = this.store.state.dependencyModelLookup.get(dependencyId);
    if (dependency === undefined || isDependencyReadOnly(this.store.state)) {
      return false;
    }
    const current = this.store.state.dependencyModelList;
    const remaining = current.filter((entry) => entry.id !== dependencyId);
    this.updateDependenciesIfChanged(current, remaining);
    return true;
  };

  private warnOnInvalidDependencies() {
    const { dependencyModelList, processedEventLookup } = this.store.state;
    // With lazy loading a missing event is expected (it may not be fetched yet).
    const hasDataSource = this.store.parameters.dataSource != null;

    for (const dependency of dependencyModelList) {
      if (!isDependencyType(dependency.type)) {
        warnOnce(
          [
            `MUI X Scheduler: The dependency "${String(dependency.id)}" has the unknown type "${String(dependency.type)}".`,
            'It is kept in the data but ignored by the timeline.',
          ].join('\n'),
        );
      }
      const lagIssue = getDependencyLagIssue(dependency);
      if (lagIssue !== null) {
        warnOnce(DEPENDENCY_LAG_WARNINGS[lagIssue](dependency).join('\n'));
      }
      for (const eventId of [dependency.source, dependency.target]) {
        const status = classifyDependencyEvent(processedEventLookup, eventId);
        if (status === 'unknownEvent') {
          if (!hasDataSource) {
            warnOnce(
              [
                `MUI X Scheduler: The dependency "${String(dependency.id)}" references the unknown event "${String(eventId)}".`,
                'It is kept in the data but ignored by the timeline.',
              ].join('\n'),
            );
          }
        } else if (status === 'recurringEvent') {
          warnOnce(
            [
              `MUI X Scheduler: The dependency "${String(dependency.id)}" references the recurring event "${String(eventId)}".`,
              'Dependencies on recurring events are not supported, so it is ignored by the timeline.',
            ].join('\n'),
          );
        }
      }
    }
  }
}
