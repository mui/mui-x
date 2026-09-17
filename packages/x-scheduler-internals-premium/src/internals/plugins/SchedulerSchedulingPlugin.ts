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
import type { SchedulerEventId } from '@mui/x-scheduler-internals/models';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import type {
  SchedulerAddDependencyResult,
  SchedulerDependency,
  SchedulerDependencyCreationProperties,
  SchedulerDependencyId,
  SchedulerDependenciesParameters,
  SchedulerDependenciesState,
  SchedulerLazyLoadingParameters,
} from '../../models';
import {
  classifyDependencyEvent,
  groupRetainedDependenciesBySource,
  isDependencyReadOnly,
} from '../utils/dependency-utils';

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
  protected store: SchedulerStore<TEvent, any, State, Parameters>;

  protected readonly disposables = new DisposableStack();

  public constructor(store: SchedulerStore<TEvent, any, State, Parameters>) {
    this.store = store;

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
        warnOnce([
          'MUI X Scheduler: A dependency update was ignored because no `onDependenciesChange` handler is provided.',
          'The `dependencies` prop is fully controlled, so without it the changes are lost and the UI does not update.',
          'Pass an `onDependenciesChange` handler that updates the `dependencies` prop.',
        ]);
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
   * Removes the dependencies referencing deleted events, in the same update.
   *
   * With a `dataSource`, event deletions are persisted asynchronously after this hook has
   * already emitted `onDependenciesChange`. If that persistence fails, the event survives but
   * its dependencies were already removed — a known v1 limitation, there is no rollback.
   */
  public handleEventsUpdate = (parameters: UpdateEventsParameters) => {
    const { deleted } = parameters;
    if (!deleted || deleted.length === 0) {
      return;
    }

    const deletedSet = new Set(deleted);
    const current = this.store.state.dependencyModelList;
    const remaining = current.filter(
      (dependency) => !deletedSet.has(dependency.source) && !deletedSet.has(dependency.target),
    );
    this.updateDependenciesIfChanged(current, remaining);
  };

  /**
   * Adds a dependency between two events.
   * Rejects dependencies referencing an unknown, recurring or read-only event,
   * duplicating an existing dependency, or closing a cycle.
   * The guards read the controlled `dependencies` value, so two adds in the same
   * tick are not validated against each other.
   * Implementation of the store's `addDependency()` — call it through the store.
   */
  public addDependency = (
    properties: SchedulerDependencyCreationProperties,
  ): SchedulerAddDependencyResult => {
    const { processedEventLookup } = this.store.state;
    for (const eventId of [properties.source, properties.target]) {
      const status = classifyDependencyEvent(processedEventLookup, eventId);
      if (status !== 'ok') {
        return { status: 'rejected', reason: status, eventId };
      }
      if (schedulerEventSelectors.isReadOnly(this.store.state, eventId)) {
        return { status: 'rejected', reason: 'readOnlyEvent', eventId };
      }
    }

    // Grouped from the lookup, not the raw list: with duplicate ids only the last
    // entry per id exists for the feature, so a shadowed edge must not reject an add.
    const dependenciesBySource = groupRetainedDependenciesBySource(
      this.store.state.dependencyModelLookup,
    );

    // Duplicate before cycle: on data that already contains a cycle, re-adding an
    // existing pair must report the duplicate (and select its arrow), not the cycle.
    // Only `source`/`target` define identity while the type union has a single member;
    // TODO(#22853): include `type` in the identity when the type union widens.
    const duplicate = dependenciesBySource
      .get(properties.source)
      ?.find((dependency) => dependency.target === properties.target);
    if (duplicate) {
      return { status: 'rejected', reason: 'duplicateDependency', dependencyId: duplicate.id };
    }

    if (this.isCreatingCycle(dependenciesBySource, properties.source, properties.target)) {
      return { status: 'rejected', reason: 'cyclicDependency' };
    }

    const dependency: SchedulerDependency = { ...properties, id: generateId('dependency') };
    this.updateDependencies([...this.store.state.dependencyModelList, dependency]);
    return { status: 'added', id: dependency.id };
  };

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
   * unknown id and when either endpoint event is read-only, so the store stays safe
   * regardless of which affordance calls it and the callers pairing the deletion with
   * a side effect (clearing the selection) never act on a no-op.
   * Implementation of the store's `deleteDependency()` — call it through the store.
   */
  public deleteDependency = (dependencyId: SchedulerDependencyId): boolean => {
    const dependency = this.store.state.dependencyModelLookup.get(dependencyId);
    if (dependency === undefined || isDependencyReadOnly(this.store.state, dependency)) {
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
      for (const eventId of [dependency.source, dependency.target]) {
        const status = classifyDependencyEvent(processedEventLookup, eventId);
        if (status === 'unknownEvent') {
          if (!hasDataSource) {
            warnOnce([
              `MUI X Scheduler: The dependency "${String(dependency.id)}" references the unknown event "${String(eventId)}".`,
              'It is kept in the data but ignored by the timeline.',
            ]);
          }
        } else if (status === 'recurringEvent') {
          warnOnce([
            `MUI X Scheduler: The dependency "${String(dependency.id)}" references the recurring event "${String(eventId)}".`,
            'Dependencies on recurring events are not supported, so it is ignored by the timeline.',
          ]);
        }
      }
    }
  }
}
