import { createSelector, createSelectorMemoized } from '@base-ui-components/utils/store';
import { EMPTY_ARRAY } from '@base-ui-components/utils/empty';
import { SchedulerState as State } from '../utils/SchedulerStore/SchedulerStore.types';
import { CalendarResource, CalendarResourceId } from '../models';

const processedResourceSelector = createSelector(
  (state: State) => state.processedResourceLookup,
  (processedResourceLookup, resourceId: string | null | undefined) =>
    resourceId == null ? null : processedResourceLookup.get(resourceId),
);

const processedResourceListSelector = createSelectorMemoized(
  (state: State) => state.resourceIdList,
  (state: State) => state.processedResourceLookup,
  (resourceIds, processedResourceLookup) =>
    resourceIds.map((id) => processedResourceLookup.get(id)!),
);

const resourceChildrenIdListSelector = createSelector(
  (state: State, resourceId: CalendarResourceId) =>
    state.resourceChildrenIdLookup.get(resourceId) ?? EMPTY_ARRAY,
);

const resourcesChildrenMapSelector = createSelectorMemoized(
  (state: State) => state.processedResourceLookup,
  (state: State) => state.resourceChildrenIdLookup,
  (processedResourceLookup, resourceChildrenIdLookup) => {
    const result: Map<CalendarResourceId, CalendarResource[]> = new Map();

    for (const [resourceId, childrenIds] of Array.from(resourceChildrenIdLookup.entries())) {
      const children = childrenIds.map((id) => processedResourceLookup.get(id)!);
      result.set(resourceId, children);
    }

    return result;
  },
);

const resourceParentIdsSelector = createSelectorMemoized(
  (state: State) => state.resourceChildrenIdLookup,
  (resourceChildrenIdLookup) => {
    const result: Map<CalendarResourceId, CalendarResourceId | null> = new Map();

    for (const [resourceId, childrenIds] of Array.from(resourceChildrenIdLookup.entries())) {
      for (const childId of childrenIds) {
        result.set(childId, resourceId);
      }
    }

    return result;
  },
);

const resourcesFlatListSelector = createSelectorMemoized(
  (state: State) => state.resourceIdList,
  (state: State) => state.processedResourceLookup,
  (state: State) => state.resourceChildrenIdLookup,
  (resourceIds, processedResourceLookup, resourceChildrenIdLookup) => {
    const flatList: CalendarResource[] = [];

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
);

export const schedulerResourceSelectors = {
  processedResource: processedResourceSelector,
  processedResourceList: processedResourceListSelector,
  processedResourceFlatList: resourcesFlatListSelector,
  processedResourceChildrenMap: resourcesChildrenMapSelector,
  childrenIdLookup: (state: State) => state.resourceChildrenIdLookup,
  childrenIdsList: resourceChildrenIdListSelector,
  resourceParentIds: resourceParentIdsSelector,
  idList: createSelector((state: State) => state.resourceIdList),
  visibleMap: createSelector((state: State) => state.visibleResources),
  visibleIdList: createSelectorMemoized(
    (state: State) => state.resourceIdList,
    (state: State) => state.visibleResources,
    (resources, visibleResources) =>
      resources
        .filter(
          (resourceId) =>
            !visibleResources.has(resourceId) || visibleResources.get(resourceId) === true,
        )
        .map((resourceId) => resourceId),
  ),
};
