import { createSelectorMemoized } from '@base-ui/utils/store';
import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import type { SchedulerEventId, SchedulerResourceId } from '@mui/x-scheduler-internals/models';
import type { SchedulerDependencyId, SchedulerDependencyType } from '../models';
import type { EventTimelinePremiumState as State } from '../use-event-timeline-premium';
import {
  classifyDependencyEvent,
  groupByEventId,
  isDependencyReadOnly,
  isDependencyType,
} from '../internals/utils/dependency-utils';

const activeModelListSelector = createSelectorMemoized(
  (state: State) => state.dependencyModelLookup,
  (state: State) => state.processedEventLookup,
  (dependencyModelLookup, processedEventLookup) =>
    // `dependencyModelLookup` already deduped duplicate ids (last wins) while
    // preserving insertion order, so no separate dedup pass is needed here.
    Array.from(dependencyModelLookup.values()).filter(
      (dependency) =>
        isDependencyType(dependency.type) &&
        [dependency.source, dependency.target].every(
          (eventId) => classifyDependencyEvent(processedEventLookup, eventId) === 'ok',
        ),
    ),
);

export interface SchedulerDependencySourceDescription {
  title: string;
  type: SchedulerDependencyType;
}

const activeSourcesByTargetSelector = createSelectorMemoized(
  activeModelListSelector,
  (state: State) => state.processedEventLookup,
  (dependencies, processedEventLookup) => {
    const sourcesByTarget = new Map<SchedulerEventId, SchedulerDependencySourceDescription[]>();
    for (const dependency of dependencies) {
      // Active dependencies always resolve: their events exist in the lookup.
      const source = {
        title: processedEventLookup.get(dependency.source)!.title,
        type: dependency.type,
      };
      const sources = sourcesByTarget.get(dependency.target);
      if (sources) {
        sources.push(source);
      } else {
        sourcesByTarget.set(dependency.target, [source]);
      }
    }
    return sourcesByTarget;
  },
);

const selectedIdSelector = (state: State) => {
  const selection = state.selection;
  return selection?.type === 'dependency' && state.dependencyModelLookup.has(selection.id)
    ? selection.id
    : null;
};

const creationSelector = (state: State) => state.dependencyCreation;

export const eventTimelinePremiumDependencySelectors = {
  modelList: (state: State) => state.dependencyModelList,
  modelLookup: (state: State) => state.dependencyModelLookup,
  model: (state: State, dependencyId: SchedulerDependencyId) =>
    state.dependencyModelLookup.get(dependencyId) ?? null,
  /**
   * Dependencies with a supported type whose two events exist and are not recurring.
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
   * The source event title and type of the active dependencies, grouped by target
   * event id. Used to describe an event with the events it depends on.
   */
  activeSourcesByTarget: activeSourcesByTargetSelector,
  activeSourcesForTarget: (
    state: State,
    eventId: SchedulerEventId,
  ): readonly SchedulerDependencySourceDescription[] =>
    activeSourcesByTargetSelector(state).get(eventId) ?? EMPTY_ARRAY,
  /**
   * Whether the dependencies feature is enabled (internal parameters provided).
   */
  enabled: (state: State) => state.areDependenciesEnabled,
  /**
   * The pending create-dependency drag gesture, or `null`.
   */
  creation: creationSelector,
  // Keyed by occurrence *and* resource: an event appearing on several resources
  // repeats the same occurrence key on each row, and only the row appearance the
  // gesture actually involves must highlight.
  isCreationTarget: (state: State, occurrenceKey: string, resourceId: SchedulerResourceId) => {
    const creation = creationSelector(state);
    return (
      creation !== null &&
      creation.targetOccurrenceKey === occurrenceKey &&
      creation.targetResourceId === resourceId
    );
  },
  /**
   * The id of the selected dependency, or `null`.
   * The masking is membership-only: an id absent from the dependency lookup resolves
   * to `null` for the same render (the store effect then clears the raw value), but a
   * dependency deactivated by a recurring or unknown endpoint is still in the lookup
   * and resolves normally.
   */
  selectedId: selectedIdSelector,
  /**
   * The selected dependency, or `null`.
   */
  selectedModel: (state: State) => {
    const selectedId = selectedIdSelector(state);
    return selectedId === null ? null : (state.dependencyModelLookup.get(selectedId) ?? null);
  },
  /**
   * Whether the dependency cannot be deleted because one of its events is read-only.
   * Unknown ids resolve to `false`.
   */
  isModelReadOnly: (state: State, dependencyId: SchedulerDependencyId | null) => {
    const dependency =
      dependencyId === null ? undefined : state.dependencyModelLookup.get(dependencyId);
    if (!dependency) {
      return false;
    }
    return isDependencyReadOnly(state, dependency);
  },
};
