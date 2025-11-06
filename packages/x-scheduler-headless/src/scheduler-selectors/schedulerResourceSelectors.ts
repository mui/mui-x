import { createSelector, createSelectorMemoized } from '@base-ui-components/utils/store';
import { SchedulerState as State } from '../utils/SchedulerStore/SchedulerStore.types';

const processedResourceSelector = createSelector(
  (state: State) => state.processedResourceLookup,
  (processedResourceLookup, resourceId: string | null | undefined) =>
    resourceId == null ? null : processedResourceLookup.get(resourceId),
);

export const schedulerResourceSelectors = {
  processedResource: processedResourceSelector,
  processedResourceList: createSelectorMemoized(
    (state: State) => state.resourceIdList,
    (state: State) => state.processedResourceLookup,
    (resourceIds, processedResourceLookup) =>
      resourceIds.map((id) => processedResourceLookup.get(id)!),
  ),
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
