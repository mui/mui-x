import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import type { SchedulerEventId } from '@mui/x-scheduler-internals/models';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
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
  (state: State) => state.selection,
  (state: State) => state.dependencyModelLookup,
  (selection, dependencyModelLookup) =>
    selection?.type === 'dependency' && dependencyModelLookup.has(selection.id)
      ? selection.id
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
  // Keyed by occurrence (not event id): an event appearing on several resources must
  // only highlight the row appearance the gesture actually involves.
  isCreationSource: createSelector(
    creationSelector,
    (creation, occurrenceKey: string) => creation?.sourceOccurrenceKey === occurrenceKey,
  ),
  isCreationTarget: createSelector(
    creationSelector,
    (creation, occurrenceKey: string) =>
      creation !== null && creation.targetOccurrenceKey === occurrenceKey,
  ),
  /**
   * The id of the selected dependency, or `null`.
   * Ids that no longer exist in the collection resolve to `null`, so an external
   * removal clears the selection without any reconciliation.
   */
  selectedId: selectedIdSelector,
  /**
   * Whether the dependency cannot be deleted because one of its events is read-only.
   * Unknown ids resolve to `false`.
   */
  isModelReadOnly: createSelector((state: State, dependencyId: SchedulerDependencyId | null) => {
    const dependency =
      dependencyId === null ? undefined : state.dependencyModelLookup.get(dependencyId);
    if (!dependency) {
      return false;
    }
    return (
      schedulerEventSelectors.isReadOnly(state, dependency.source) ||
      schedulerEventSelectors.isReadOnly(state, dependency.target)
    );
  }),
};
