import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import { SchedulerState as State } from '../utils/SchedulerStore/SchedulerStore.types';
import { SchedulerResource, SchedulerResourceId } from '../models';

export const schedulerResourceSelectors = {
  processedResource: createSelector(
    (state: State) => state.processedResourceLookup,
    (processedResourceLookup, resourceId: string | null | undefined) =>
      resourceId == null ? null : (processedResourceLookup.get(resourceId) ?? null),
  ),
  processedResourceList: createSelectorMemoized(
    (state: State) => state.resourceIdList,
    (state: State) => state.processedResourceLookup,
    (resourceIds, processedResourceLookup) =>
      resourceIds.map((id) => processedResourceLookup.get(id)!),
  ),
  processedResourceFlatList: createSelectorMemoized(
    (state: State) => state.resourceIdList,
    (state: State) => state.processedResourceLookup,
    (state: State) => state.resourceChildrenIdLookup,
    (resourceIds, processedResourceLookup, resourceChildrenIdLookup) => {
      const flatList: SchedulerResource[] = [];

      const addResourceAndChildren = (resourceId: string) => {
        const resource = processedResourceLookup.get(resourceId);
        if (!resource) {
          return;
        }

        flatList.push(resource);

        const childrenIds = resourceChildrenIdLookup.get(resourceId);
        if (childrenIds?.length) {
          for (const childId of childrenIds) {
            addResourceAndChildren(childId);
          }
        }
      };

      for (const resourceId of resourceIds) {
        addResourceAndChildren(resourceId);
      }
      return flatList;
    },
  ),
  processedResourceChildrenLookup: createSelectorMemoized(
    (state: State) => state.processedResourceLookup,
    (state: State) => state.resourceChildrenIdLookup,
    (processedResourceLookup, resourceChildrenIdLookup) => {
      const result: Map<SchedulerResourceId, SchedulerResource[]> = new Map();

      for (const [resourceId, childrenIds] of Array.from(resourceChildrenIdLookup.entries())) {
        const children = childrenIds.map((id) => processedResourceLookup.get(id)!);
        result.set(resourceId, children);
      }

      return result;
    },
  ),
  childrenIdLookup: (state: State) => state.resourceChildrenIdLookup,
  resourceChildrenIds: createSelector(
    (state: State, resourceId: SchedulerResourceId) =>
      state.resourceChildrenIdLookup.get(resourceId) ?? EMPTY_ARRAY,
  ),
  resourceParentIdLookup: createSelectorMemoized(
    (state: State) => state.resourceChildrenIdLookup,
    (resourceChildrenIdLookup) => {
      const result: Map<SchedulerResourceId, SchedulerResourceId | null> = new Map();

      for (const [resourceId, childrenIds] of Array.from(resourceChildrenIdLookup.entries())) {
        for (const childId of childrenIds) {
          result.set(childId, resourceId);
        }
      }

      return result;
    },
  ),
  idList: createSelector((state: State) => state.resourceIdList),
  visibleMap: createSelector((state: State) => state.visibleResources),
  visibleIdList: createSelectorMemoized(
    (state: State) => state.resourceIdList,
    (state: State) => state.visibleResources,
    (resources, visibleResources) =>
      resources
        .filter((resourceId) => visibleResources[resourceId] !== false)
        .map((resourceId) => resourceId),
  ),
  /**
   * Gets the default event color used when no color is specified on the event.
   */
  defaultEventColor: createSelector(
    (state: State, resourceId: SchedulerResourceId | null | undefined) => {
      if (resourceId == null) {
        return state.eventColor;
      }

      return state.processedResourceLookup.get(resourceId)?.eventColor ?? state.eventColor;
    },
  ),
  resourcesCount: createSelector((state: State) => state.resourceIdList.length),
};
