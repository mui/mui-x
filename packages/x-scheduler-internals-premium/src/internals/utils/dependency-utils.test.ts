import { describe, it, expect } from 'vitest';
import { adapter } from 'test/utils/scheduler';
import type { SchedulerDependency } from '../../models';
import {
  addDependencyLag,
  getDependencyEdges,
  getDependencyLag,
  getDependencyType,
} from './dependency-utils';

const dependency = (overrides: Partial<SchedulerDependency> = {}): SchedulerDependency => ({
  id: 'dep',
  source: 'a',
  target: 'b',
  type: 'FinishToStart',
  ...overrides,
});

describe('dependency-utils', () => {
  describe('getDependencyEdges', () => {
    it('should map each type to the event edges it connects', () => {
      expect(getDependencyEdges('FinishToStart')).to.deep.equal({ source: 'end', target: 'start' });
      expect(getDependencyEdges('StartToStart')).to.deep.equal({
        source: 'start',
        target: 'start',
      });
      expect(getDependencyEdges('FinishToFinish')).to.deep.equal({ source: 'end', target: 'end' });
      expect(getDependencyEdges('StartToFinish')).to.deep.equal({
        source: 'start',
        target: 'end',
      });
    });
  });

  describe('getDependencyType', () => {
    it('should resolve the type from the dragged and dropped edges', () => {
      expect(getDependencyType('end', 'start')).to.equal('FinishToStart');
      expect(getDependencyType('start', 'start')).to.equal('StartToStart');
      expect(getDependencyType('end', 'end')).to.equal('FinishToFinish');
      expect(getDependencyType('start', 'end')).to.equal('StartToFinish');
    });
  });

  describe('getDependencyLag', () => {
    it('should default to no lag in days', () => {
      expect(getDependencyLag(dependency())).to.deep.equal({ amount: 0, unit: 'day' });
    });

    it('should keep a positive lag with its unit', () => {
      expect(getDependencyLag(dependency({ lag: 2, lagUnit: 'hour' }))).to.deep.equal({
        amount: 2,
        unit: 'hour',
      });
    });

    it('should apply a lag without a unit in days', () => {
      expect(getDependencyLag(dependency({ lag: 3 }))).to.deep.equal({ amount: 3, unit: 'day' });
    });

    it('should treat a negative lag as no lag', () => {
      expect(getDependencyLag(dependency({ lag: -1 }))).to.deep.equal({ amount: 0, unit: 'day' });
    });

    it('should treat a non-finite lag as no lag', () => {
      expect(getDependencyLag(dependency({ lag: Number.NaN }))).to.deep.equal({
        amount: 0,
        unit: 'day',
      });
    });

    it('should ignore the lag of an unknown unit', () => {
      expect(getDependencyLag(dependency({ lag: 2, lagUnit: 'fortnight' as any }))).to.deep.equal({
        amount: 0,
        unit: 'day',
      });
    });
  });

  describe('addDependencyLag', () => {
    const date = adapter.date('2025-07-03T09:00:00', 'UTC');
    const expectShifted = (lag: ReturnType<typeof getDependencyLag>, expected: string) => {
      expect(adapter.getTime(addDependencyLag(adapter, date, lag))).to.equal(
        adapter.getTime(adapter.date(expected, 'UTC')),
      );
    };

    it('should return the same date for no lag', () => {
      expect(addDependencyLag(adapter, date, { amount: 0, unit: 'day' })).to.equal(date);
    });

    it('should add minutes', () => {
      expectShifted({ amount: 30, unit: 'minute' }, '2025-07-03T09:30:00');
    });

    it('should add hours', () => {
      expectShifted({ amount: 2, unit: 'hour' }, '2025-07-03T11:00:00');
    });

    it('should add days', () => {
      expectShifted({ amount: 1, unit: 'day' }, '2025-07-04T09:00:00');
    });

    it('should add weeks', () => {
      expectShifted({ amount: 1, unit: 'week' }, '2025-07-10T09:00:00');
    });
  });
});
