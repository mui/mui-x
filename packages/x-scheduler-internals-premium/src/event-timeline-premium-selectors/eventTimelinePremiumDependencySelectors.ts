import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import type { SchedulerEventId } from '@mui/x-scheduler-internals/models';
import type { SchedulerState } from '@mui/x-scheduler-internals/internals';
import type {
  SchedulerDependency,
  SchedulerDependencyId,
  SchedulerDependenciesState,
} from '../models';

type State = SchedulerState & SchedulerDependenciesState;

function groupByEventId(
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

const activeModelListSelector = createSelectorMemoized(
  (state: State) => state.dependencyModelList,
  (state: State) => state.processedEventLookup,
  (dependencies, processedEventLookup) =>
    dependencies.filter((dependency) =>
      [dependency.source, dependency.target].every((eventId) => {
        const processedEvent = processedEventLookup.get(eventId);
        return processedEvent != null && processedEvent.dataTimezone.rrule == null;
      }),
    ),
);

export const eventTimelinePremiumDependencySelectors = {
  modelList: createSelector((state: State) => state.dependencyModelList),
  modelLookup: createSelector((state: State) => state.dependencyModelLookup),
  model: createSelector(
    (state: State) => state.dependencyModelLookup,
    (dependencyModelLookup, dependencyId: SchedulerDependencyId) =>
      dependencyModelLookup.get(dependencyId) ?? null,
  ),
  /**
   * Dependencies whose two events exist and are not recurring.
   * Rendering and the scheduling engine must only consume these.
   */
  activeModelList: activeModelListSelector,
  activeModelListBySource: createSelectorMemoized(activeModelListSelector, (dependencies) =>
    groupByEventId(dependencies, 'source'),
  ),
  activeModelListByTarget: createSelectorMemoized(activeModelListSelector, (dependencies) =>
    groupByEventId(dependencies, 'target'),
  ),
};
