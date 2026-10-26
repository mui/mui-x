'use client';
import type * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type {
  SchedulerEventCreationConfig,
  SchedulerOccurrencePlaceholderCreation,
} from '../../models';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import { schedulerEventSelectors } from '../../scheduler-selectors';
import { EVENT_CREATION_PRECISION_MINUTE } from '../../constants';
import { toPlainDateTime } from './plain-date-utils/timeZone';

interface GetCreationPlaceholderParams {
  event: React.MouseEvent<HTMLDivElement>;
  creationConfig: SchedulerEventCreationConfig;
}

export type CreationPlaceholderFields = Omit<SchedulerOccurrencePlaceholderCreation, 'type'>;

/**
 * Moves the timestamp under the pointer back to the creation precision, on the minutes of the wall
 * clock of `timezone`. A surface without a size gives a non-finite timestamp, returned unchanged.
 */
export function snapToCreationPrecision(timestamp: number, timezone: TemporalTimezone): number {
  if (!Number.isFinite(timestamp)) {
    return timestamp;
  }
  const minutesInHour = Math.floor(
    (toPlainDateTime(timestamp, timezone).msInDay % 3_600_000) / 60_000,
  );
  return timestamp - (minutesInHour % EVENT_CREATION_PRECISION_MINUTE) * 60_000;
}

export function useEventCreation(
  getCreationPlaceholder: (params: GetCreationPlaceholderParams) => CreationPlaceholderFields,
): Record<string, React.EventHandler<React.MouseEvent<HTMLDivElement>>> {
  const store = useSchedulerStoreContext();
  const creationConfig = useStore(store, schedulerEventSelectors.creationConfig);

  if (creationConfig === false) {
    return {};
  }

  const handler = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    // Don't create events when clicking on existing events
    if (target !== event.currentTarget && target.closest('button, [role="button"]')) {
      return;
    }
    store.setOccurrencePlaceholder(
      {
        type: 'creation',
        ...getCreationPlaceholder({ event, creationConfig }),
      },
      event.nativeEvent,
    );
  };

  if (creationConfig.interaction === 'double-click') {
    return { onDoubleClick: handler };
  }

  return { onClick: handler };
}
