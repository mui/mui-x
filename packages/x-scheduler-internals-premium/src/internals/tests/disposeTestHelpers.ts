import { vi } from 'vitest';
import { DEFAULT_TESTING_VISIBLE_DATE } from 'test/utils/scheduler';
import { DEBOUNCE_MS } from '../utils/queue';

export interface TestEvent {
  id: string;
  start: string;
  end: string;
  title: string;
}

export const noopPersistEvents = async () => ({ success: true });

export const noopUIEvent: any = {};

export const buildEvents = (): TestEvent[] => [
  {
    id: '1',
    start: '2025-07-01T00:00:00.000Z',
    end: '2025-07-01T11:00:00.000Z',
    title: 'Event 1',
  },
];

export const flushEffect = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

export const flushDebounce = () => vi.advanceTimersByTimeAsync(DEBOUNCE_MS);

export const DEFAULT_PARAMS = {
  events: [] as TestEvent[],
  defaultVisibleDate: DEFAULT_TESTING_VISIBLE_DATE,
};
