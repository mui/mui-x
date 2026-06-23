import { adapter } from 'test/utils/scheduler';
import {
  SchedulerOccurrencePlaceholder,
  SchedulerOccurrencePlaceholderCreation,
} from '../../../models';
import { shouldUpdateOccurrencePlaceholder } from './SchedulerStore.utils';

describe('shouldUpdateOccurrencePlaceholder', () => {
  const createPlaceholder = (
    overrides: Partial<Omit<SchedulerOccurrencePlaceholderCreation, 'type'>> = {},
  ): SchedulerOccurrencePlaceholder => ({
    type: 'creation',
    surfaceType: 'time-grid',
    start: adapter.date('2025-07-03T09:00:00Z', 'UTC'),
    end: adapter.date('2025-07-03T10:00:00Z', 'UTC'),
    resourceId: null,
    ...overrides,
  });

  it('should return false when both placeholders are null', () => {
    expect(shouldUpdateOccurrencePlaceholder(adapter, null, null)).to.equal(false);
  });

  it('should return true when switching between null and a placeholder', () => {
    expect(shouldUpdateOccurrencePlaceholder(adapter, null, createPlaceholder())).to.equal(true);
    expect(shouldUpdateOccurrencePlaceholder(adapter, createPlaceholder(), null)).to.equal(true);
  });

  it('should return false for two equal placeholders with distinct date instances', () => {
    expect(
      shouldUpdateOccurrencePlaceholder(adapter, createPlaceholder(), createPlaceholder()),
    ).to.equal(false);
  });

  it('should return true when the start changes', () => {
    const previous = createPlaceholder();
    const next = createPlaceholder({ start: adapter.date('2025-07-03T11:00:00Z', 'UTC') });
    expect(shouldUpdateOccurrencePlaceholder(adapter, previous, next)).to.equal(true);
  });

  it('should return true when a non-date field changes', () => {
    const previous = createPlaceholder();
    const next = createPlaceholder({ resourceId: 'resource-1' });
    expect(shouldUpdateOccurrencePlaceholder(adapter, previous, next)).to.equal(true);
  });

  it('should return true when isHidden is removed in next (drag re-enters the surface)', () => {
    const previous = createPlaceholder({ isHidden: true });
    const next = createPlaceholder();
    expect(shouldUpdateOccurrencePlaceholder(adapter, previous, next)).to.equal(true);
  });

  it('should return true when isHidden is added in next (drag leaves the surface)', () => {
    const previous = createPlaceholder();
    const next = createPlaceholder({ isHidden: true });
    expect(shouldUpdateOccurrencePlaceholder(adapter, previous, next)).to.equal(true);
  });
});
