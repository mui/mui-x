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

/**
 * Plugin that provides event-scheduling support (dependencies).
 * Composed by the premium stores and injected into `SchedulerStore` through
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
   * Removes the dependencies referencing deleted events, in the same update.
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
    if (remaining.length !== current.length) {
      this.updateDependencies(remaining);
    }
  };

  /**
   * Adds a dependency between two events.
   * Rejects dependencies referencing an unknown or recurring event.
   */
  public addDependency = (
    properties: SchedulerDependencyCreationProperties,
  ): SchedulerAddDependencyResult => {
    const { processedEventLookup } = this.store.state;
    for (const eventId of [properties.source, properties.target]) {
      const processedEvent = processedEventLookup.get(eventId);
      if (processedEvent == null) {
        return { status: 'rejected', reason: 'unknownEvent', eventId };
      }
      if (processedEvent.dataTimezone.rrule != null) {
        return { status: 'rejected', reason: 'recurringEvent', eventId };
      }
    }

    const dependency: SchedulerDependency = { id: generateId('dependency'), ...properties };
    this.updateDependencies([...this.store.state.dependencyModelList, dependency]);
    return { status: 'added', id: dependency.id };
  };

  /**
   * Deletes a dependency.
   */
  public deleteDependency = (dependencyId: SchedulerDependencyId) => {
    const current = this.store.state.dependencyModelList;
    const remaining = current.filter((dependency) => dependency.id !== dependencyId);
    if (remaining.length !== current.length) {
      this.updateDependencies(remaining);
    }
  };

  private warnOnInvalidDependencies() {
    const { dependencyModelList, processedEventLookup } = this.store.state;
    // With lazy loading a missing event is expected (it may not be fetched yet).
    const hasDataSource = this.store.parameters.dataSource != null;

    for (const dependency of dependencyModelList) {
      for (const eventId of [dependency.source, dependency.target]) {
        const processedEvent = processedEventLookup.get(eventId);
        if (processedEvent == null) {
          if (!hasDataSource) {
            warnOnce([
              `MUI X Scheduler: The dependency "${String(dependency.id)}" references the unknown event "${String(eventId)}".`,
              'It is kept in the data but ignored by the timeline.',
            ]);
          }
        } else if (processedEvent.dataTimezone.rrule != null) {
          warnOnce([
            `MUI X Scheduler: The dependency "${String(dependency.id)}" references the recurring event "${String(eventId)}".`,
            'Dependencies on recurring events are not supported, so it is ignored by the timeline.',
          ]);
        }
      }
    }
  }
}
