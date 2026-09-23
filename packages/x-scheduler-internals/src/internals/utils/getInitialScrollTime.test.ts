import { clearWarningsCache } from '@mui/x-internals/warning';
import { describe, it, expect, beforeEach } from 'vitest';
import { getInitialScrollTime } from './getInitialScrollTime';

const SOURCE = 'viewConfig.week';
const WARNING = 'MUI X Scheduler: `viewConfig.week` received an invalid `initialScrollTime`';
const fullDay = { startTime: 0, endTime: 24 };
const workDay = { startTime: 8, endTime: 20 };

describe('getInitialScrollTime', () => {
  beforeEach(() => {
    clearWarningsCache();
  });

  describe('default', () => {
    it('should default to 7 AM on the full day', () => {
      expect(getInitialScrollTime(undefined, fullDay, SOURCE)).to.equal(7);
    });

    it('should clamp the default to startTime when the range starts later', () => {
      expect(getInitialScrollTime(undefined, workDay, SOURCE)).to.equal(8);
    });

    it('should clamp the default to the top when the range ends before 7 AM', () => {
      expect(getInitialScrollTime(undefined, { startTime: 0, endTime: 6 }, SOURCE)).to.equal(0);
    });

    it('should clamp the default to the top when the range ends at 7 AM', () => {
      expect(getInitialScrollTime(undefined, { startTime: 0, endTime: 7 }, SOURCE)).to.equal(0);
    });
  });

  describe('explicit value', () => {
    it('should return the provided value when it is inside the range', () => {
      expect(getInitialScrollTime(10, workDay, SOURCE)).to.equal(10);
    });

    it('should accept midnight', () => {
      expect(getInitialScrollTime(0, fullDay, SOURCE)).to.equal(0);
    });

    it('should accept startTime', () => {
      expect(getInitialScrollTime(8, workDay, SOURCE)).to.equal(8);
    });

    it('should accept the last displayed hour', () => {
      expect(getInitialScrollTime(19, workDay, SOURCE)).to.equal(19);
    });
  });

  describe('invalid value', () => {
    it('should fall back to the default and warn when the value is before the range', () => {
      let result;
      expect(() => {
        result = getInitialScrollTime(6, workDay, SOURCE);
      }).toWarnDev([WARNING]);
      expect(result).to.equal(8);
    });

    it('should fall back to the default and warn when the value is the exclusive endTime', () => {
      let result;
      expect(() => {
        result = getInitialScrollTime(20, workDay, SOURCE);
      }).toWarnDev([WARNING]);
      expect(result).to.equal(8);
    });

    it('should fall back to the default and warn when the value is after the range', () => {
      let result;
      expect(() => {
        result = getInitialScrollTime(30, fullDay, SOURCE);
      }).toWarnDev([WARNING]);
      expect(result).to.equal(7);
    });

    it('should fall back to the default and warn for non-integer values', () => {
      let result;
      expect(() => {
        result = getInitialScrollTime(7.5, fullDay, SOURCE);
      }).toWarnDev([WARNING]);
      expect(result).to.equal(7);
    });

    it('should fall back to the default and warn for non-finite values', () => {
      let result;
      expect(() => {
        result = getInitialScrollTime(Number.NaN, fullDay, SOURCE);
      }).toWarnDev([WARNING]);
      expect(result).to.equal(7);
    });

    it('should warn once per source and value so one surface cannot mask another', () => {
      expect(() => {
        getInitialScrollTime(30, fullDay, 'viewConfig.week');
        getInitialScrollTime(30, fullDay, 'viewConfig.day');
        // The repeated source and value must not warn a second time.
        getInitialScrollTime(30, fullDay, 'viewConfig.week');
      }).toWarnDev([
        'MUI X Scheduler: `viewConfig.week` received an invalid `initialScrollTime`',
        'MUI X Scheduler: `viewConfig.day` received an invalid `initialScrollTime`',
      ]);
    });
  });
});
