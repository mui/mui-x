import { calculateZoomEnd, calculateZoomStart, calculateZoomFromPointImpl } from './zoom-utils';
import { type ZoomData } from '../../models';

describe('Zoom Utils', () => {
  describe('calculateZoomStart', () => {
    it('should return minStart when newStart is too small', () => {
      const newStart = 5;
      const currentZoom: ZoomData = { axisId: 'x-axis', start: 10, end: 100 };
      const options = { minStart: 20, minSpan: 10, maxSpan: 100 };

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

  describe('calculateZoomFromPointImpl', () => {
    const defaultDrawingArea = {
      left: 100,
      top: 100,
      right: 300,
      bottom: 200,
      width: 200,
      height: 100,
    };

    it('should calculate correct zoom value for x-axis (bottom position)', () => {
      const result = calculateZoomFromPointImpl(
        defaultDrawingArea,
        { position: 'bottom', reverse: false },
        { minStart: 0, maxEnd: 100 },
        { x: 200, y: 0 },
      );

      expect(result).to.eq(50);
    });

    it('should calculate correct zoom value for y-axis (left position)', () => {
      const result = calculateZoomFromPointImpl(
        defaultDrawingArea,
        { position: 'left', reverse: false },
        { minStart: 0, maxEnd: 100 },
        { x: 0, y: 100 },
      );

      expect(result).to.eq(100);
    });

    it('should handle reversed x-axis', () => {
      const result = calculateZoomFromPointImpl(
        defaultDrawingArea,
        { position: 'bottom', reverse: true },
        { minStart: 0, maxEnd: 100 },
        { x: 300, y: 0 },
      );

      expect(result).to.eq(0); // Should be at the start due to reverse
    });

    it('should handle reversed y-axis', () => {
      const result = calculateZoomFromPointImpl(
        defaultDrawingArea,
        { position: 'left', reverse: true },
        { minStart: 0, maxEnd: 100 },
        { x: 0, y: 180 },
      );

      expect(result).to.eq(80);
    });

    it('should handle custom min/max range', () => {
      const result = calculateZoomFromPointImpl(
        defaultDrawingArea,
        { position: 'bottom', reverse: false },
        { minStart: 20, maxEnd: 80 },
        { x: 150, y: 0 },
      );

      expect(result).to.eq(35);
    });
  });
});
