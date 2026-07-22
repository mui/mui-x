import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import type { SchedulerEventId } from '@mui/x-scheduler-internals/models';
import type { SchedulerDependency, SchedulerDependencyId } from '../models';
import type { EventTimelinePremiumState as State } from '../use-event-timeline-premium';
import { classifyDependencyEvent } from '../internals/utils/dependency-utils';

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
  (state: State) => state.dependencyModelLookup,
  (state: State) => state.processedEventLookup,
  (dependencyModelLookup, processedEventLookup) =>
    // `dependencyModelLookup` already deduped duplicate ids (last wins) while
    // preserving insertion order, so no separate dedup pass is needed here.
    Array.from(dependencyModelLookup.values()).filter((dependency) =>
      [dependency.source, dependency.target].every(
        (eventId) => classifyDependencyEvent(processedEventLookup, eventId) === 'ok',
      ),
    ),
);

const activeSourceTitlesByTargetSelector = createSelectorMemoized(
  activeModelListSelector,
  (state: State) => state.processedEventLookup,
  (dependencies, processedEventLookup) => {
    const titlesByTarget = new Map<SchedulerEventId, string[]>();
    for (const dependency of dependencies) {
      // Active dependencies always resolve: their events exist in the lookup.
      const title = processedEventLookup.get(dependency.source)!.title;
      const titles = titlesByTarget.get(dependency.target);
      if (titles) {
        titles.push(title);
      } else {
        titlesByTarget.set(dependency.target, [title]);
      }
    }
    return titlesByTarget;
  },
);

const selectedIdSelector = createSelector(
  (state: State) => state.selectedDependencyId,
  (state: State) => state.dependencyModelLookup,
  (selectedDependencyId, dependencyModelLookup) =>
    selectedDependencyId !== null && dependencyModelLookup.has(selectedDependencyId)
      ? selectedDependencyId
      : null,
);

const creationSelector = createSelector((state: State) => state.dependencyCreation);

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
  /**
   * Titles of the source events of the active dependencies, grouped by target event id.
   * Used to describe an event with the events it depends on.
   */
  activeSourceTitlesByTarget: activeSourceTitlesByTargetSelector,
  activeSourceTitlesForTarget: createSelector(
    activeSourceTitlesByTargetSelector,
    (titlesByTarget, eventId: SchedulerEventId): readonly string[] =>
      titlesByTarget.get(eventId) ?? EMPTY_ARRAY,
  ),
  /**
   * Whether the dependencies feature is enabled (internal parameters provided).
   */
  enabled: createSelector((state: State) => state.areDependenciesEnabled),
  /**
   * The pending create-dependency drag gesture, or `null`.
   */
  creation: creationSelector,
  isCreationSource: createSelector(
    creationSelector,
    (creation, eventId: SchedulerEventId) => creation?.sourceEventId === eventId,
  ),
  isCreationTarget: createSelector(
    creationSelector,
    (creation, eventId: SchedulerEventId) =>
      creation !== null && creation.targetEventId === eventId,
  ),
  /**
   * The id of the selected dependency, or `null`.
   * Ids that no longer exist in the collection resolve to `null`, so an external
   * removal clears the selection without any reconciliation.
   */
  selectedId: selectedIdSelector,
  isSelected: createSelector(
    selectedIdSelector,
    (selectedId, dependencyId: SchedulerDependencyId) => selectedId === dependencyId,
  ),
};
