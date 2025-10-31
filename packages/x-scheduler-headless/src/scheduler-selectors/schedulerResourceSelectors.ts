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
    state.resourceChildrenIdMap.get(resourceId) ?? EMPTY_ARRAY,
);

const resourcesChildrenMapSelector = createSelectorMemoized(
  (state: State) => state.processedResourceLookup,
  (state: State) => state.resourceChildrenIdMap,
  (processedResourceLookup, resourceChildrenIdMap) => {
    const result: Map<CalendarResourceId, CalendarResource[]> = new Map();

    for (const [resourceId, childrenIds] of resourceChildrenIdMap) {
      const children = childrenIds.map((id) => processedResourceLookup.get(id)!);
      result.set(resourceId, children);
    }

    return result;
  },
);

const resourcesFlatListSelector = createSelectorMemoized(
  (state: State) => state.resourceIdList,
  (state: State) => state.processedResourceLookup,
  (state: State) => state.resourceChildrenIdMap,
  (resourceIds, processedResourceLookup, resourceChildrenIdMap) => {
    const flatList: CalendarResource[] = [];

    const addResourceAndChildren = (resourceId: string) => {
      const resource = processedResourceLookup.get(resourceId);
      if (!resource) {
        return;
      }

      flatList.push(resource);

      const childrenIds = resourceChildrenIdMap.get(resourceId);
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
  childrenIdMap: (state: State) => state.resourceChildrenIdMap,
  childrenIdsList: resourceChildrenIdListSelector,
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
