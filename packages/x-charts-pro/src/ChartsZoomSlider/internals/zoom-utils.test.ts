import { describe, it, expect } from 'vitest';
import {
  calculateZoomEnd,
  calculateZoomStart,
  calculateZoomFromPointImpl,
  getZoomSliderKeyboardStep,
  getZoomSliderKeyMovement,
} from './zoom-utils';
import type { ZoomData } from '../../models';

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
        { position: 'bottom' },
        { minStart: 0, maxEnd: 100, reverse: false },
        { x: 200, y: 0 },
      );

      expect(result).to.eq(50);
    });

    it('should calculate correct zoom value for y-axis (left position)', () => {
      const result = calculateZoomFromPointImpl(
        defaultDrawingArea,
        { position: 'left' },
        { minStart: 0, maxEnd: 100, reverse: false },
        { x: 0, y: 100 },
      );

      expect(result).to.eq(100);
    });

    it('should handle reversed x-axis', () => {
      const result = calculateZoomFromPointImpl(
        defaultDrawingArea,
        { position: 'bottom' },
        { minStart: 0, maxEnd: 100, reverse: true },
        { x: 300, y: 0 },
      );

      expect(result).to.eq(0); // Should be at the start due to reverse
    });

    it('should handle reversed y-axis', () => {
      const result = calculateZoomFromPointImpl(
        defaultDrawingArea,
        { position: 'left' },
        { minStart: 0, maxEnd: 100, reverse: true },
        { x: 0, y: 180 },
      );

      expect(result).to.eq(80);
    });

    it('should handle custom min/max range', () => {
      const result = calculateZoomFromPointImpl(
        defaultDrawingArea,
        { position: 'bottom' },
        { minStart: 20, maxEnd: 80, reverse: false },
        { x: 150, y: 0 },
      );

      expect(result).to.eq(35);
    });
  });

  describe('getZoomSliderKeyMovement', () => {
    const press = (
      key: string,
      modifiers: Partial<Record<'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey', boolean>> = {},
    ) => ({
      key,
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      ...modifiers,
    });

    it('should move by one step with the arrow keys', () => {
      expect(getZoomSliderKeyMovement(press('ArrowRight'), false)).to.eq(1);
      expect(getZoomSliderKeyMovement(press('ArrowUp'), false)).to.eq(1);
      expect(getZoomSliderKeyMovement(press('ArrowLeft'), false)).to.eq(-1);
      expect(getZoomSliderKeyMovement(press('ArrowDown'), false)).to.eq(-1);
    });

    it('should move by a large step with the page keys', () => {
      expect(getZoomSliderKeyMovement(press('PageUp'), false)).to.eq(10);
      expect(getZoomSliderKeyMovement(press('PageDown'), false)).to.eq(-10);
    });

    it('should follow the slider on screen when it is reversed', () => {
      expect(getZoomSliderKeyMovement(press('ArrowRight'), true)).to.eq(-1);
      expect(getZoomSliderKeyMovement(press('ArrowDown'), true)).to.eq(1);
      expect(getZoomSliderKeyMovement(press('PageUp'), true)).to.eq(-10);
    });

    it('should go to the bounds with Home and End, even when reversed', () => {
      expect(getZoomSliderKeyMovement(press('Home'), false)).to.eq(-Infinity);
      expect(getZoomSliderKeyMovement(press('End'), false)).to.eq(Infinity);
      expect(getZoomSliderKeyMovement(press('Home'), true)).to.eq(-Infinity);
      expect(getZoomSliderKeyMovement(press('End'), true)).to.eq(Infinity);
    });

    it('should move by the given step with the arrow keys', () => {
      expect(getZoomSliderKeyMovement(press('ArrowRight'), false, 25)).to.eq(25);
      expect(getZoomSliderKeyMovement(press('ArrowLeft'), false, 25)).to.eq(-25);
      expect(getZoomSliderKeyMovement(press('ArrowRight'), true, 25)).to.eq(-25);
    });

    it('should not move by less than a step with the page keys', () => {
      expect(getZoomSliderKeyMovement(press('PageUp'), false, 25)).to.eq(25);
      expect(getZoomSliderKeyMovement(press('PageDown'), false, 25)).to.eq(-25);
    });

    it('should ignore the keys that are not bound', () => {
      expect(getZoomSliderKeyMovement(press('Enter'), false)).to.eq(null);
      expect(getZoomSliderKeyMovement(press('+'), false)).to.eq(null);
    });

    it('should ignore the modified keys', () => {
      expect(getZoomSliderKeyMovement(press('ArrowRight', { shiftKey: true }), false)).to.eq(null);
      expect(getZoomSliderKeyMovement(press('ArrowRight', { altKey: true }), false)).to.eq(null);
      expect(getZoomSliderKeyMovement(press('Home', { ctrlKey: true }), false)).to.eq(null);
      expect(getZoomSliderKeyMovement(press('End', { metaKey: true }), false)).to.eq(null);
    });
  });

  describe('getZoomSliderKeyboardStep', () => {
    it('should be one category on a band axis', () => {
      expect(getZoomSliderKeyboardStep({ scaleType: 'band', data: ['A', 'B', 'C', 'D'] })).to.eq(
        25,
      );
    });

    it('should be the distance between two points on a point axis', () => {
      expect(getZoomSliderKeyboardStep({ scaleType: 'point', data: ['A', 'B', 'C'] })).to.eq(50);
    });

    it('should not be below 1% when the axis has many categories', () => {
      const data = Array.from({ length: 1000 }, (_, index) => index);

      expect(getZoomSliderKeyboardStep({ scaleType: 'band', data })).to.eq(1);
    });

    it('should be 1% on the other axes', () => {
      expect(getZoomSliderKeyboardStep({ scaleType: 'linear' })).to.eq(1);
      expect(getZoomSliderKeyboardStep({ scaleType: 'band', data: [] })).to.eq(1);
      expect(getZoomSliderKeyboardStep({ scaleType: 'point', data: ['A'] })).to.eq(1);
      expect(getZoomSliderKeyboardStep(undefined)).to.eq(1);
    });
  });
});
