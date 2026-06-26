import type * as React from 'react';
import { vi } from 'vitest';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import { DEFAULT_TESTING_VISIBLE_DATE, EventBuilder } from 'test/utils/scheduler';
import { DEBOUNCE_MS } from '../utils/queue';

export const noopPersistEvents = async () => ({ success: true });

export const noopUIEvent = {} as React.UIEvent;

export const buildEvents = (): SchedulerEvent[] => [
  EventBuilder.new()
    .id('1')
    .title('Event 1')
    .span('2025-07-01T00:00:00.000Z', '2025-07-01T11:00:00.000Z')
    .build(),
];

export const flushEffect = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

export const flushDebounce = () => vi.advanceTimersByTimeAsync(DEBOUNCE_MS);

export const DEFAULT_PARAMS = {
  events: [] as SchedulerEvent[],
  defaultVisibleDate: DEFAULT_TESTING_VISIBLE_DATE,
  shouldEventRequireResource: false,
};
