import { describe, it, expect } from 'vitest';
import { adapter } from 'test/utils/scheduler';
import type { SchedulerDependency } from '../../models';
import {
  addDependencyLag,
  getDependencyEdges,
  getDependencyLag,
  getDependencyLagIssue,
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

  describe('getDependencyLagIssue', () => {
    it('should accept a missing lag', () => {
      expect(getDependencyLagIssue(dependency())).to.equal(null);
    });

    it('should accept a positive whole lag with a supported unit', () => {
      expect(getDependencyLagIssue(dependency({ lag: 2, lagUnit: 'hour' }))).to.equal(null);
    });

    it('should flag a negative lag', () => {
      expect(getDependencyLagIssue(dependency({ lag: -1 }))).to.equal('negative');
    });

    it('should flag a fractional lag', () => {
      expect(getDependencyLagIssue(dependency({ lag: 0.5 }))).to.equal('notAWholeNumber');
    });

    it('should flag a non-finite lag', () => {
      expect(getDependencyLagIssue(dependency({ lag: Number.NaN }))).to.equal('notAWholeNumber');
      expect(getDependencyLagIssue(dependency({ lag: Number.POSITIVE_INFINITY }))).to.equal(
        'notAWholeNumber',
      );
    });

    it('should flag a lag that is not a number', () => {
      expect(getDependencyLagIssue(dependency({ lag: '2' as any }))).to.equal('notAWholeNumber');
    });

    it('should flag an unknown unit', () => {
      expect(getDependencyLagIssue(dependency({ lag: 2, lagUnit: 'fortnight' as any }))).to.equal(
        'unknownUnit',
      );
    });
  });

  describe('getDependencyLag', () => {
    it('should return no lag by default', () => {
      expect(getDependencyLag(dependency())).to.equal(null);
    });

    it('should return no lag for a zero amount', () => {
      expect(getDependencyLag(dependency({ lag: 0, lagUnit: 'hour' }))).to.equal(null);
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

    it('should return no lag for a negative amount', () => {
      expect(getDependencyLag(dependency({ lag: -1 }))).to.equal(null);
    });

    it('should return no lag for a fractional amount', () => {
      expect(getDependencyLag(dependency({ lag: 1.5, lagUnit: 'hour' }))).to.equal(null);
    });

    it('should return no lag for an unknown unit', () => {
      expect(getDependencyLag(dependency({ lag: 2, lagUnit: 'fortnight' as any }))).to.equal(null);
    });
  });

  describe('addDependencyLag', () => {
    const date = adapter.date('2025-07-03T09:00:00', 'UTC');
    const expectShifted = (lag: Parameters<typeof addDependencyLag>[2], expected: string) => {
      expect(adapter.getTime(addDependencyLag(adapter, date, lag))).to.equal(
        adapter.getTime(adapter.date(expected, 'UTC')),
      );
    };

    it('should return the same date for no lag', () => {
      expect(addDependencyLag(adapter, date, null)).to.equal(date);
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
