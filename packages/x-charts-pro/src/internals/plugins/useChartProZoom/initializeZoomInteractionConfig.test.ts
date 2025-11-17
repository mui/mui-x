import { describe, it, expect } from 'vitest';
import { initializeZoomInteractionConfig } from './initializeZoomInteractionConfig';

describe('initializeZoomInteractionConfig', () => {
  it('should enable pan on wheel when x-axis has zoom enabled', () => {
    const result = initializeZoomInteractionConfig(undefined, {
      x: { axisId: 'x', axisDirection: 'x' } as any,
    });

    expect(result.pan.wheel).toBeDefined();
    expect(result.pan.wheel?.allowedDirection).toBe('x');
    expect(result.pan.drag).toBeDefined();
  });

  it('should disable pan on wheel when both x and y axes have zoom enabled', () => {
    const result = initializeZoomInteractionConfig(undefined, {
      x: { axisId: 'x', axisDirection: 'x' } as any,
      y: { axisId: 'y', axisDirection: 'y' } as any,
    });

    expect(result.pan.wheel).toBeUndefined();
    expect(result.pan.drag).toBeDefined();
  });

  it('should disable pan on wheel when only y-axis has zoom enabled', () => {
    const result = initializeZoomInteractionConfig(undefined, {
      y: { axisId: 'y', axisDirection: 'y' } as any,
    });

    expect(result.pan.wheel).toBeUndefined();
    expect(result.pan.drag).toBeDefined();
  });

  it('should disable pan on wheel when optionsLookup is undefined', () => {
    const result = initializeZoomInteractionConfig(undefined, undefined);

    expect(result.pan.wheel).toBeUndefined();
    expect(result.pan.drag).toBeDefined();
  });

  it('should disable pan on wheel when optionsLookup is empty', () => {
    const result = initializeZoomInteractionConfig(undefined, {});

    expect(result.pan.wheel).toBeUndefined();
    expect(result.pan.drag).toBeDefined();
  });

  it('should respect explicit config even without x-axis zoom', () => {
    const result = initializeZoomInteractionConfig(
      {
        zoom: [],
        pan: ['wheel'],
      },
      {
        y: { axisId: 'y', axisDirection: 'y' } as any,
      },
    );

    expect(result.pan.wheel).toBeDefined();
    expect(result.pan.wheel?.allowedDirection).toBe('x');
  });

  it('should disable pan on wheel when explicitly configured even with x-axis zoom', () => {
    const result = initializeZoomInteractionConfig(
      {
        zoom: [],
        pan: ['drag'],
      },
      { x: { axisId: 'x', axisDirection: 'x' } as any },
    );

    expect(result.pan.wheel).toBeUndefined();
    expect(result.pan.drag).toBeDefined();
  });
});
