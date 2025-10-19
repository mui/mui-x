import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mouseGesture, touchGesture } from '../../testing';
import { GestureManager } from '../GestureManager';
import { TapAndDragGesture, type TapAndDragEvent } from './TapAndDragGesture';

const formatTapAndDragEvent = (event: TapAndDragEvent) => {
  const detail = event.detail;
  const dx = Math.floor(detail.totalDeltaX);
  const dy = Math.floor(detail.totalDeltaY);
  const direction =
    [detail.direction.horizontal, detail.direction.vertical].filter(Boolean).join(' ') || null;
  const mainAxis = detail.direction.mainAxis || null;
  return `${event.type}: deltaX: ${dx} | deltaY: ${Math.floor(dy)} | direction: ${direction} | mainAxis: ${mainAxis}`;
};

describe('TapAndDrag Gesture', () => {
  let container: HTMLElement;
  let target: HTMLElement;
  let gestureManager: GestureManager<
    'tapAndDrag',
    TapAndDragGesture<'tapAndDrag'>,
    TapAndDragGesture<'tapAndDrag'>
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
        new TapAndDragGesture({
          name: 'tapAndDrag',
          tapMaxDistance: 10,
          dragTimeout: 1000,
          dragThreshold: 0,
        }),
      ],
    });

    // Set up target element
    target = document.createElement('div');
    target.style.width = '100px';
    target.style.height = '100px';
    container.appendChild(target);

    const gestureTarget = gestureManager.registerElement('tapAndDrag', target);

    // Add event listeners
    gestureTarget.addEventListener('tapAndDragStart', (event) =>
      events.push(formatTapAndDragEvent(event)),
    );
    gestureTarget.addEventListener('tapAndDrag', (event) =>
      events.push(formatTapAndDragEvent(event)),
    );
    gestureTarget.addEventListener('tapAndDragEnd', (event) =>
      events.push(formatTapAndDragEvent(event)),
    );
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

    expect(events).toStrictEqual([]);

    // Then perform a drag
    await mouseGesture.pan({
      target,
      angle: 0, // Horizontal drag (right)
      distance: 50,
      steps: 2,
    });

    expect(events).toStrictEqual([
      `tapAndDragStart: deltaX: 25 | deltaY: 0 | direction: null | mainAxis: null`,
      `tapAndDrag: deltaX: 25 | deltaY: 0 | direction: null | mainAxis: null`,
      `tapAndDrag: deltaX: 50 | deltaY: 0 | direction: right | mainAxis: horizontal`,
      `tapAndDragEnd: deltaX: 50 | deltaY: 0 | direction: right | mainAxis: horizontal`,
    ]);
  });

  it('should detect tap followed by vertical drag with touch', async () => {
    // First perform a tap
    await touchGesture.tap({
      target,
    });

    expect(events).toStrictEqual([]);

    // Then perform a drag
    await touchGesture.pan({
      target,
      angle: 90, // Vertical drag (down)
      distance: 50,
      steps: 2,
    });

    expect(events).toStrictEqual([
      `tapAndDragStart: deltaX: 0 | deltaY: 25 | direction: null | mainAxis: null`,
      `tapAndDrag: deltaX: 0 | deltaY: 25 | direction: null | mainAxis: null`,
      `tapAndDrag: deltaX: 0 | deltaY: 50 | direction: down | mainAxis: vertical`,
      `tapAndDragEnd: deltaX: 0 | deltaY: 50 | direction: down | mainAxis: vertical`,
    ]);
  });

  it('should detect tap followed by diagonal drag', async () => {
    // First perform a tap
    await touchGesture.tap({
      target,
    });

    expect(events).toStrictEqual([]);

    await touchGesture.pan({
      target,
      angle: 45, // Diagonal drag (down-right)
      distance: 50,
      steps: 2,
    });

    // cos(45°) = 0.707, sin(45°) = 0.707
    // Expecting approximately 35 for both deltaX and deltaY
    expect(events).toStrictEqual([
      `tapAndDragStart: deltaX: 17 | deltaY: 17 | direction: null | mainAxis: null`,
      `tapAndDrag: deltaX: 17 | deltaY: 17 | direction: null | mainAxis: null`,
      `tapAndDrag: deltaX: 35 | deltaY: 35 | direction: right down | mainAxis: diagonal`,
      `tapAndDragEnd: deltaX: 35 | deltaY: 35 | direction: right down | mainAxis: diagonal`,
    ]);
  });

  it('should reset if drag timeout is exceeded', async () => {
    // Use short timeout for testing
    gestureManager.setGestureOptions('tapAndDrag', target, {
      dragTimeout: 10,
    });

    // First perform a tap
    await touchGesture.tap({
      target,
    });

    expect(events).toStrictEqual([]);

    // Wait longer than the timeout
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 15);
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
    gestureManager.setGestureOptions('tapAndDrag', target, {
      dragDirection: ['left', 'right'], // Only allow horizontal dragging
    });

    // First perform a tap
    await touchGesture.tap({
      target,
    });

    expect(events).toStrictEqual([]);

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

    expect(events).toStrictEqual([]);

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
    gestureManager.setGestureOptions('tapAndDrag', target, {
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

  it('should handle rapid tap and drag interaction', async () => {
    // Clear events
    events = [];

    // Simulate very rapid tap-and-drag (like user doing it quickly)
    // Tap first
    await mouseGesture.tap({
      target,
    });

    expect(events).toStrictEqual([]);

    // Immediately start dragging without delay (simulating fast user interaction)
    await mouseGesture.pan({
      target,
      angle: 0, // Horizontal drag (right)
      distance: 50,
      steps: 2,
    });

    // Should have drag events
    expect(events.length).toBeGreaterThan(0);
    expect(events[0]).toContain('tapAndDragStart');
  });

  it('should handle drag threshold properly', async () => {
    gestureManager.setGestureOptions('tapAndDrag', target, {
      dragThreshold: 20, // Require 20px movement before drag activates
    });

    // First perform a tap
    await touchGesture.tap({
      target,
    });

    expect(events).toStrictEqual([]);

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
    expect(TapAndDragGesture).toUpdateOptions({
      preventDefault: true,
      stopPropagation: true,
      preventIf: ['move'],
      tapMaxDistance: 15,
      dragTimeout: 500,
      dragThreshold: 10,
      dragDirection: ['up', 'down'],
    });
  });

  it('should update state', { fails: true }, () => {
    expect(TapAndDragGesture).toUpdateState({});
  });

  it('should properly clone', () => {
    expect(TapAndDragGesture).toBeClonable({
      preventDefault: true,
      stopPropagation: true,
      minPointers: 2,
      maxPointers: 2,
      preventIf: ['press'],
      tapMaxDistance: 15,
      dragTimeout: 500,
      dragThreshold: 10,
      dragDirection: ['left', 'right'],
    });
  });
});
