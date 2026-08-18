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

  it('should not add the keyboard interaction to the defaults', () => {
    const result = initializeZoomInteractionConfig(undefined, {
      x: { axisId: 'x', axisDirection: 'x' } as any,
    });

    expect(result.zoom.keyboard).toBeUndefined();
    expect(result.pan.keyboard).toBeUndefined();
  });

  it('should add the keyboard interaction to the defaults when opted in', () => {
    const result = initializeZoomInteractionConfig(
      undefined,
      { x: { axisId: 'x', axisDirection: 'x' } as any },
      true,
    );

    expect(result.zoom.keyboard).toBeDefined();
    expect(result.pan.keyboard).toBeDefined();
    expect(result.zoom.wheel).toBeDefined();
    expect(result.pan.drag).toBeDefined();
  });

  it('should let an explicit config opt out of the keyboard interaction', () => {
    const result = initializeZoomInteractionConfig(
      { zoom: ['wheel'], pan: ['drag'] },
      { x: { axisId: 'x', axisDirection: 'x' } as any },
      true,
    );

    expect(result.zoom.keyboard).toBeUndefined();
    expect(result.pan.keyboard).toBeUndefined();
  });

  it('should allow the keyboard interaction in an explicit config', () => {
    const result = initializeZoomInteractionConfig({ zoom: ['keyboard'], pan: ['keyboard'] }, {});

    expect(result.zoom.keyboard).toBeDefined();
    expect(result.pan.keyboard).toBeDefined();
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
