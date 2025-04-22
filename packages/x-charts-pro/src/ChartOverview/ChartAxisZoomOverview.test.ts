import { expect } from 'chai';
import { calculateZoomEnd, calculateZoomStart } from './ChartAxisZoomOverview';
import { ZoomData } from '../models';

describe('ChartAxisZoomOverview', () => {
  describe('calculateZoomStart', () => {
    it('should return minStart when newStart is too small', () => {
      const newStart = 5;
      const currentZoom: ZoomData = { axisId: 'x-axis', start: 10, end: 100 };
      const options = { minStart: 20, minSpan: 10, maxSpan: 50 };

      const result = calculateZoomStart(newStart, currentZoom, options);

      expect(result).to.eq(20);
    });

    it('should adjust based on minSpan if newStart is outside valid range', () => {
      const newStart = 95;
      const currentZoom: ZoomData = { axisId: 'x-axis', start: 10, end: 100 };
      const options = { minStart: 20, minSpan: 10, maxSpan: 80 };

      const result = calculateZoomStart(newStart, currentZoom, options);

      expect(result).to.eq(90);
    });

    it('should adjust based on maxSpan if newStart is too small', () => {
      const newStart = 40;
      const currentZoom: ZoomData = { axisId: 'x-axis', start: 10, end: 100 };
      const options = { minStart: 20, minSpan: 10, maxSpan: 50 };

      const result = calculateZoomStart(newStart, currentZoom, options);

      expect(result).to.eq(50);
    });

    it('should return newStart if it is within the valid range', () => {
      const newStart = 70;
      const currentZoom: ZoomData = { axisId: 'x-axis', start: 10, end: 100 };
      const options = { minStart: 20, minSpan: 10, maxSpan: 90 };

      const result = calculateZoomStart(newStart, currentZoom, options);

      expect(result).to.eq(70);
    });
  });

  describe('calculateZoomEnd', () => {
    it('should return newEnd if it satisfies the constraints', () => {
      const currentZoom: ZoomData = { axisId: 'x', start: 10, end: 30 };
      const options = { maxEnd: 100, minSpan: 5, maxSpan: 50 };

      const result = calculateZoomEnd(25, currentZoom, options);

      expect(result).to.eq(25);
    });

    it('should return maxEnd if newEnd exceeds maxEnd', () => {
      const currentZoom: ZoomData = { axisId: 'x', start: 10, end: 30 };
      const options = { maxEnd: 50, minSpan: 5, maxSpan: 50 };

      const result = calculateZoomEnd(60, currentZoom, options);

      expect(result).to.eq(50);
    });

    it('should return start + maxSpan if newEnd exceeds start + maxSpan', () => {
      const currentZoom: ZoomData = { axisId: 'x', start: 10, end: 30 };
      const options = { maxEnd: 100, minSpan: 5, maxSpan: 20 };

      const result = calculateZoomEnd(35, currentZoom, options);

      expect(result).to.eq(30);
    });

    it('should return start + minSpan if newEnd is less than start + minSpan', () => {
      const currentZoom: ZoomData = { axisId: 'x', start: 10, end: 30 };
      const options = { maxEnd: 100, minSpan: 5, maxSpan: 50 };

      const result = calculateZoomEnd(12, currentZoom, options);

      expect(result).to.eq(15);
    });
  });
});
