import { adapter } from 'test/utils/scheduler';
import { describe, expect, it } from 'vitest';
import { addDaysOnWallClock } from './drag-utils';

describe('drag-utils', () => {
  describe('addDaysOnWallClock', () => {
    it('should move a date past the last supported day, which the month grid shows', () => {
      const date = adapter.date('9999-12-31T10:00:00Z', 'default');
      expect(adapter.toJsDate(addDaysOnWallClock(adapter, date, 1)).toISOString()).to.equal(
        '+010000-01-01T10:00:00.000Z',
      );
    });
  });
});
