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
import { createChangeEventDetails } from '@mui/x-scheduler-internals/base-ui-copy';
import type {
  SchedulerAddDependencyResult,
  SchedulerDependency,
  SchedulerDependencyCreationProperties,
  SchedulerDependencyId,
  SchedulerDependenciesParameters,
  SchedulerDependenciesState,
} from '../../models';
import { classifyDependencyEvent } from '../utils/dependency-utils';

/**
 * Plugin that provides event-scheduling support (dependencies).
 * Composed by the timeline premium store and injected into `SchedulerStore` through
 * `SchedulerSchedulingPluginInterface`.
 */
export class SchedulerSchedulingPlugin<
  TEvent extends object,
  State extends SchedulerState & SchedulerDependenciesState,
  Parameters extends SchedulerParameters<TEvent, any> & SchedulerDependenciesParameters,
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
   * Rejects dependencies referencing an unknown or recurring event, or duplicating an
   * existing dependency.
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
    }

    // Only `source`/`target` define identity while the type union has a single member;
    // TODO(#22853): include `type` in the identity when the type union widens.
    const duplicate = this.store.state.dependencyModelList.find(
      (dependency) =>
        dependency.source === properties.source && dependency.target === properties.target,
    );
    if (duplicate) {
      return { status: 'rejected', reason: 'duplicateDependency', dependencyId: duplicate.id };
    }

    const dependency: SchedulerDependency = { ...properties, id: generateId('dependency') };
    this.updateDependencies([...this.store.state.dependencyModelList, dependency]);
    return { status: 'added', id: dependency.id };
  };

  /**
   * Deletes a dependency.
   * Implementation of the store's `deleteDependency()` — call it through the store.
   */
  public deleteDependency = (dependencyId: SchedulerDependencyId) => {
    const current = this.store.state.dependencyModelList;
    const remaining = current.filter((dependency) => dependency.id !== dependencyId);
    this.updateDependenciesIfChanged(current, remaining);
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
