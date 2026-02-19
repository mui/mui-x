'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { SchedulerEventCreationConfig, SchedulerOccurrencePlaceholderCreation } from '../../models';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import { schedulerEventSelectors } from '../../scheduler-selectors';

interface GetCreationPlaceholderParams {
  event: React.MouseEvent<HTMLDivElement>;
  creationConfig: SchedulerEventCreationConfig;
}

type CreationPlaceholderFields = Omit<SchedulerOccurrencePlaceholderCreation, 'type'>;

export function useEventCreation(
  getCreationPlaceholder: (params: GetCreationPlaceholderParams) => CreationPlaceholderFields,
): Record<string, React.EventHandler<React.MouseEvent<HTMLDivElement>>> {
  const store = useSchedulerStoreContext();
  const creationConfig = useStore(store, schedulerEventSelectors.creationConfig);

  if (creationConfig === false) {
    return {};
  }

  const handler = (event: React.MouseEvent<HTMLDivElement>) => {
    store.setOccurrencePlaceholder({
      type: 'creation',
      ...getCreationPlaceholder({ event, creationConfig }),
    });
  };

  if (creationConfig.interaction === 'double-click') {
    return { onDoubleClick: handler };
  }

  return { onClick: handler };
}
