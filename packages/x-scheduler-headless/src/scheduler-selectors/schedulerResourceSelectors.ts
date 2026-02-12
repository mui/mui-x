import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';
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
  visibleMap: createSelectorMemoized(
    (state: State) => state.visibleResources,
    (state: State) => state.resourceChildrenIdLookup,
    (state: State) => state.processedResourceLookup,
    (visibleResources, resourceChildrenIdLookup, processedResourceLookup) => {
      // Fast path: no parent-child relationships means no ancestor visibility to check
      if (resourceChildrenIdLookup.size === 0) {
        return visibleResources;
      }

      // Build parent lookup from children lookup
      const parentLookup = new Map<string, string>();
      for (const [parentId, childrenIds] of resourceChildrenIdLookup) {
        for (const childId of childrenIds) {
          parentLookup.set(childId, parentId);
        }
      }

      const cache = new Map<string, boolean>();

      const checkVisibility = (resourceId: string): boolean => {
        const cached = cache.get(resourceId);
        if (cached !== undefined) {
          return cached;
        }

        const isDirectlyVisible = visibleResources[resourceId] !== false;
        let result: boolean;

        if (!isDirectlyVisible) {
          result = false;
        } else {
          const parentId = parentLookup.get(resourceId);
          result = parentId ? checkVisibility(parentId) : true;
        }

        cache.set(resourceId, result);
        return result;
      };

      const curatedMap: Record<string, boolean> = {};
      for (const resourceId of processedResourceLookup.keys()) {
        if (!checkVisibility(resourceId)) {
          curatedMap[resourceId] = false;
        }
      }

      return curatedMap;
    },
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
