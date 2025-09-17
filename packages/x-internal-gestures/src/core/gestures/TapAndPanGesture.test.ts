import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mouseGesture, touchGesture } from '../../testing';
import { GestureManager } from '../GestureManager';
import { TapAndPanGesture } from './TapAndPanGesture';

describe('TapAndPan Gesture', () => {
  let container: HTMLElement;
  let target: HTMLElement;
  let gestureManager: GestureManager<
    'tapAndPan',
    TapAndPanGesture<'tapAndPan'>,
    TapAndPanGesture<'tapAndPan'>
  >;
  let events: string[];

  beforeEach(() => {
    events = [];

    // Set up DOM
    container = document.createElement('div');
    container.style.width = '200px';
    container.style.height = '200px';
    document.body.appendChild(container);

    // Set up gesture manager
    gestureManager = new GestureManager({
      gestures: [
        new TapAndPanGesture({
          name: 'tapAndPan',
          tapMaxDistance: 10,
          panTimeout: 1000,
          panThreshold: 0,
        }),
      ],
    });

    // Set up target element
    target = document.createElement('div');
    target.style.width = '100px';
    target.style.height = '100px';
    container.appendChild(target);

    const gestureTarget = gestureManager.registerElement('tapAndPan', target);

    // Add event listeners for tap and drag events
    gestureTarget.addEventListener('tapAndPanTap', (event) => {
      const detail = (event as CustomEvent).detail;
      events.push(
        `tap: x: ${Math.floor(detail.tapX)} | y: ${Math.floor(detail.tapY)}`,
      );
    });
    
    gestureTarget.addEventListener('tapAndPanPanStart', (event) => {
      const detail = (event as CustomEvent).detail;
      events.push(
        `dragStart: deltaX: ${Math.floor(detail.totalDeltaX)} | deltaY: ${Math.floor(detail.totalDeltaY)} | direction: ${[detail.panDirection.horizontal, detail.panDirection.vertical].filter(Boolean).join(' ') || null} | mainAxis: ${detail.panDirection.mainAxis}`,
      );
    });
    
    gestureTarget.addEventListener('tapAndPanPan', (event) => {
      const detail = (event as CustomEvent).detail;
      events.push(
        `drag: deltaX: ${Math.floor(detail.totalDeltaX)} | deltaY: ${Math.floor(detail.totalDeltaY)} | direction: ${[detail.panDirection.horizontal, detail.panDirection.vertical].filter(Boolean).join(' ') || null} | mainAxis: ${detail.panDirection.mainAxis}`,
      );
    });
    
    gestureTarget.addEventListener('tapAndPanPanEnd', (event) => {
      const detail = (event as CustomEvent).detail;
      events.push(
        `dragEnd: deltaX: ${Math.floor(detail.totalDeltaX)} | deltaY: ${Math.floor(detail.totalDeltaY)} | direction: ${[detail.panDirection.horizontal, detail.panDirection.vertical].filter(Boolean).join(' ') || null} | mainAxis: ${detail.panDirection.mainAxis}`,
      );
    });
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(container);
    gestureManager.destroy();
    vi.restoreAllMocks();
  });

  it('should detect tap followed by horizontal drag with mouse', async () => {
    // First perform a tap
    await mouseGesture.tap({
      target,
    });

    // Verify tap was detected
    expect(events).toStrictEqual([`tap: x: 50 | y: 50`]);
    
    events = []; // Clear events for drag test

    // Then perform a drag
    await mouseGesture.pan({
      target,
      angle: 0, // Horizontal drag (right)
      distance: 50,
      steps: 2,
    });

    expect(events).toStrictEqual([
      `dragStart: deltaX: 25 | deltaY: 0 | direction: null | mainAxis: null`,
      `drag: deltaX: 25 | deltaY: 0 | direction: null | mainAxis: null`,
      `drag: deltaX: 50 | deltaY: 0 | direction: right | mainAxis: horizontal`,
      `dragEnd: deltaX: 50 | deltaY: 0 | direction: right | mainAxis: horizontal`,
    ]);
  });

  it('should detect tap followed by vertical drag with touch', async () => {
    // First perform a tap
    await touchGesture.tap({
      target,
    });

    // Verify tap was detected
    expect(events).toStrictEqual([`tap: x: 50 | y: 50`]);
    
    events = []; // Clear events for drag test

    // Then perform a drag
    await touchGesture.pan({
      target,
      angle: 90, // Vertical drag (down)
      distance: 50,
      steps: 2,
    });

    expect(events).toStrictEqual([
      `dragStart: deltaX: 0 | deltaY: 25 | direction: null | mainAxis: null`,
      `drag: deltaX: 0 | deltaY: 25 | direction: null | mainAxis: null`,
      `drag: deltaX: 0 | deltaY: 50 | direction: down | mainAxis: vertical`,
      `dragEnd: deltaX: 0 | deltaY: 50 | direction: down | mainAxis: vertical`,
    ]);
  });

  it('should detect tap followed by diagonal drag', async () => {
    // First perform a tap
    await touchGesture.tap({
      target,
    });

    // Verify tap was detected
    expect(events).toStrictEqual([`tap: x: 50 | y: 50`]);
    
    events = []; // Clear events for drag test

    // Then perform a diagonal drag
    await touchGesture.pan({
      target,
      angle: 45, // Diagonal drag (down-right)
      distance: 50,
      steps: 2,
    });

    // cos(45°) = 0.707, sin(45°) = 0.707
    // Expecting approximately 35 for both deltaX and deltaY
    expect(events).toStrictEqual([
      `dragStart: deltaX: 18 | deltaY: 18 | direction: null | mainAxis: null`,
      `drag: deltaX: 18 | deltaY: 18 | direction: null | mainAxis: null`,
      `drag: deltaX: 36 | deltaY: 36 | direction: right down | mainAxis: diagonal`,
      `dragEnd: deltaX: 36 | deltaY: 36 | direction: right down | mainAxis: diagonal`,
    ]);
  });

  it('should reset if drag timeout is exceeded', async () => {
    // Use short timeout for testing
    gestureManager.setGestureOptions('tapAndPan', target, {
      panTimeout: 100,
    });

    // First perform a tap
    await touchGesture.tap({
      target,
    });

    // Verify tap was detected
    expect(events).toStrictEqual([`tap: x: 50 | y: 50`]);
    
    events = []; // Clear events

    // Wait longer than the timeout
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 150);
    });

    // Then try to perform a drag - should not work since timeout exceeded
    await touchGesture.pan({
      target,
      angle: 0,
      distance: 50,
      steps: 2,
    });

    // Should have no drag events because timeout exceeded
    expect(events.length).toBe(0);
  });

  it('should respect drag direction constraints', async () => {
    gestureManager.setGestureOptions('tapAndPan', target, {
      panDirection: ['left', 'right'], // Only allow horizontal dragging
    });

    // First perform a tap
    await touchGesture.tap({
      target,
    });

    // Verify tap was detected
    expect(events).toStrictEqual([`tap: x: 50 | y: 50`]);
    
    events = []; // Clear events

    // Test vertical drag (should not trigger events due to direction constraint)
    await touchGesture.pan({
      target,
      angle: 90, // Vertical drag (down)
      distance: 50,
      steps: 3,
    });

    // Verify no drag events for vertical drag
    expect(events.length).toBe(0);

    // Now reset and test horizontal drag
    await touchGesture.tap({
      target,
    });

    events = []; // Clear tap event

    // Test horizontal drag (should trigger events)
    await touchGesture.pan({
      target,
      angle: 0, // Horizontal drag (right)
      distance: 50,
      steps: 2,
    });

    // Verify events for horizontal drag
    expect(events.length).toBeGreaterThan(0);
  });

  it('should cancel if tap movement exceeds maxDistance', async () => {
    gestureManager.setGestureOptions('tapAndPan', target, {
      tapMaxDistance: 5, // Very small threshold
    });

    // Perform a "tap" that moves too far to be considered a valid tap
    await touchGesture.pan({
      target,
      angle: 0,
      distance: 10, // Exceeds tapMaxDistance of 5
      steps: 1,
    });

    // Should not have any tap event because movement was too large
    expect(events.length).toBe(0);
  });

  it('should handle drag threshold properly', async () => {
    gestureManager.setGestureOptions('tapAndPan', target, {
      panThreshold: 20, // Require 20px movement before drag activates
    });

    // First perform a tap
    await touchGesture.tap({
      target,
    });

    // Verify tap was detected
    expect(events).toStrictEqual([`tap: x: 50 | y: 50`]);
    
    events = []; // Clear events

    // Perform a small drag that doesn't reach threshold
    await touchGesture.pan({
      target,
      angle: 0,
      distance: 15, // Less than threshold of 20
      steps: 2,
    });

    // Should have no drag events because threshold not reached
    expect(events.length).toBe(0);

    // Now perform a drag that exceeds threshold
    await touchGesture.pan({
      target,
      angle: 0,
      distance: 30, // Exceeds threshold of 20
      steps: 2,
    });

    // Should have drag events now
    expect(events.length).toBeGreaterThan(0);
  });

  it('should update options', () => {
    expect(TapAndPanGesture).toUpdateOptions({
      preventDefault: true,
      stopPropagation: true,
      preventIf: ['move'],
      tapMaxDistance: 15,
      panTimeout: 500,
      panThreshold: 10,
      panDirection: ['up', 'down'],
    });
  });

  it('should update state', { fails: true }, () => {
    expect(TapAndPanGesture).toUpdateState({});
  });

  it('should properly clone', () => {
    expect(TapAndPanGesture).toBeClonable({
      preventDefault: true,
      stopPropagation: true,
      minPointers: 1,
      maxPointers: 1,
      preventIf: ['press'],
      tapMaxDistance: 15,
      panTimeout: 500,
      panThreshold: 10,
      panDirection: ['left', 'right'],
    });
  });
});