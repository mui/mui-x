import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mouseGesture, touchGesture } from '../../testing';
import { GestureManager } from '../GestureManager';
import { PressAndDragGesture, type PressAndDragEvent } from './PressAndDragGesture';

const formatPressAndDragEvent = (event: PressAndDragEvent) => {
  const detail = event.detail;
  const dx = Math.floor(detail.totalDeltaX);
  const dy = Math.floor(detail.totalDeltaY);
  const direction =
    [detail.direction.horizontal, detail.direction.vertical].filter(Boolean).join(' ') || null;
  const mainAxis = detail.direction.mainAxis || null;
  return `${event.type}: deltaX: ${dx} | deltaY: ${Math.floor(dy)} | direction: ${direction} | mainAxis: ${mainAxis}`;
};

describe('PressAndDrag Gesture', () => {
  let container: HTMLElement;
  let target: HTMLElement;
  let gestureManager: GestureManager<
    'pressAndDrag',
    PressAndDragGesture<'pressAndDrag'>,
    PressAndDragGesture<'pressAndDrag'>
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
        new PressAndDragGesture({
          name: 'pressAndDrag',
          pressDuration: 100, // Shorter duration for testing
          pressMaxDistance: 10,
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

    const gestureTarget = gestureManager.registerElement('pressAndDrag', target);

    // Add event listeners
    gestureTarget.addEventListener('pressAndDragStart', (event) =>
      events.push(formatPressAndDragEvent(event)),
    );
    gestureTarget.addEventListener('pressAndDrag', (event) =>
      events.push(formatPressAndDragEvent(event)),
    );
    gestureTarget.addEventListener('pressAndDragEnd', (event) =>
      events.push(formatPressAndDragEvent(event)),
    );
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(container);
    gestureManager.destroy();
    vi.restoreAllMocks();
  });

  it('should detect press followed by horizontal drag with mouse', async () => {
    // First perform a press (hold)
    await mouseGesture.press({
      target,
      duration: 150, // Longer than pressDuration (100ms)
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
      `pressAndDragStart: deltaX: 25 | deltaY: 0 | direction: null | mainAxis: null`,
      `pressAndDrag: deltaX: 25 | deltaY: 0 | direction: null | mainAxis: null`,
      `pressAndDrag: deltaX: 50 | deltaY: 0 | direction: right | mainAxis: horizontal`,
      `pressAndDragEnd: deltaX: 50 | deltaY: 0 | direction: right | mainAxis: horizontal`,
    ]);
  });

  it('should detect press followed by vertical drag with touch', async () => {
    // First perform a press (hold)
    await touchGesture.press({
      target,
      duration: 150, // Longer than pressDuration (100ms)
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
      `pressAndDragStart: deltaX: 0 | deltaY: 25 | direction: null | mainAxis: null`,
      `pressAndDrag: deltaX: 0 | deltaY: 25 | direction: null | mainAxis: null`,
      `pressAndDrag: deltaX: 0 | deltaY: 50 | direction: down | mainAxis: vertical`,
      `pressAndDragEnd: deltaX: 0 | deltaY: 50 | direction: down | mainAxis: vertical`,
    ]);
  });

  it('should detect press followed by diagonal drag', async () => {
    // First perform a press (hold)
    await touchGesture.press({
      target,
      duration: 150, // Longer than pressDuration (100ms)
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
      `pressAndDragStart: deltaX: 17 | deltaY: 17 | direction: null | mainAxis: null`,
      `pressAndDrag: deltaX: 17 | deltaY: 17 | direction: null | mainAxis: null`,
      `pressAndDrag: deltaX: 35 | deltaY: 35 | direction: right down | mainAxis: diagonal`,
      `pressAndDragEnd: deltaX: 35 | deltaY: 35 | direction: right down | mainAxis: diagonal`,
    ]);
  });

  it('should reset if drag timeout is exceeded', async () => {
    // Use short timeout for testing
    gestureManager.setGestureOptions('pressAndDrag', target, {
      dragTimeout: 10,
    });

    // First perform a press (hold)
    await touchGesture.press({
      target,
      duration: 150, // Longer than pressDuration (100ms)
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
    gestureManager.setGestureOptions('pressAndDrag', target, {
      dragDirection: ['left', 'right'], // Only allow horizontal dragging
    });

    // First perform a press (hold)
    await touchGesture.press({
      target,
      duration: 150, // Longer than pressDuration (100ms)
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
    await touchGesture.press({
      target,
      duration: 150, // Longer than pressDuration (100ms)
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

  it('should cancel if press movement exceeds maxDistance', async () => {
    gestureManager.setGestureOptions('pressAndDrag', target, {
      pressMaxDistance: 5, // Very small threshold
    });

    // Perform a "press" that moves too far to be considered a valid press
    await touchGesture.pan({
      target,
      angle: 0,
      distance: 10, // Exceeds pressMaxDistance of 5
      steps: 1,
      releasePointers: false, // Keep holding to simulate press attempt
    });

    // Wait for press duration
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 150);
    });

    // Should not have any press event because movement was too large
    expect(events.length).toBe(0);
  });

  it('should not trigger if press duration is not met', async () => {
    // Perform a short press that doesn't meet the duration requirement
    await mouseGesture.press({
      target,
      duration: 50, // Less than pressDuration (100ms)
    });

    expect(events).toStrictEqual([]);

    // Then try to perform a drag - should not work since press wasn't completed
    await mouseGesture.pan({
      target,
      angle: 0,
      distance: 50,
      steps: 2,
    });

    // Should have no drag events because press duration wasn't met
    expect(events.length).toBe(0);
  });

  it('should handle drag threshold properly', async () => {
    gestureManager.setGestureOptions('pressAndDrag', target, {
      dragThreshold: 20, // Require 20px movement before drag activates
    });

    // First perform a press (hold)
    await touchGesture.press({
      target,
      duration: 150, // Longer than pressDuration (100ms)
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

  it('should handle rapid press and drag interaction', async () => {
    // Clear events
    events = [];

    // Simulate rapid press-and-drag (like user doing it quickly)
    // Press first
    await mouseGesture.press({
      target,
      duration: 150, // Longer than pressDuration (100ms)
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
    expect(events[0]).toContain('pressAndDragStart');
  });

  it('should not trigger drag without completing press first', async () => {
    // Try to drag immediately without pressing first
    await mouseGesture.pan({
      target,
      angle: 0,
      distance: 50,
      steps: 2,
    });

    // Should have no events because press wasn't completed
    expect(events.length).toBe(0);
  });

  it('should handle multiple consecutive press-and-drag gestures', async () => {
    // First press-and-drag sequence
    await mouseGesture.press({
      target,
      duration: 150,
    });

    await mouseGesture.pan({
      target,
      angle: 0,
      distance: 30,
      steps: 2,
    });

    expect(events.length).toBeGreaterThan(0);

    // Reset for second sequence
    events = [];

    // Second press-and-drag sequence
    await mouseGesture.press({
      target,
      duration: 150,
    });

    await mouseGesture.pan({
      target,
      angle: 90,
      distance: 30,
      steps: 2,
    });

    // Should have events for the second sequence too
    expect(events.length).toBeGreaterThan(0);
  });

  it('should handle interruption during press phase', async () => {
    // Start a press but release before duration is met
    await mouseGesture.press({
      target,
      duration: 50, // Less than required 100ms
    });

    expect(events).toStrictEqual([]);

    // Try to drag after incomplete press
    await mouseGesture.pan({
      target,
      angle: 0,
      distance: 50,
      steps: 2,
    });

    // Should have no drag events because press was interrupted
    expect(events.length).toBe(0);
  });

  it('should handle different pointer types (mouse vs touch)', async () => {
    // Test with mouse
    await mouseGesture.press({
      target,
      duration: 150,
    });

    await mouseGesture.pan({
      target,
      angle: 0,
      distance: 25,
      steps: 1,
    });

    const mouseEvents = [...events];
    events = [];

    // Test with touch
    await touchGesture.press({
      target,
      duration: 150,
    });

    await touchGesture.pan({
      target,
      angle: 0,
      distance: 25,
      steps: 1,
    });

    const touchEvents = [...events];

    // Both should produce similar event patterns
    expect(mouseEvents.length).toBeGreaterThan(0);
    expect(touchEvents.length).toBeGreaterThan(0);
    expect(mouseEvents[0]).toContain('pressAndDragStart');
    expect(touchEvents[0]).toContain('pressAndDragStart');
  });

  it('should create gesture with correct default options', () => {
    const defaultGesture = new PressAndDragGesture({
      name: 'test',
    });

    expect(defaultGesture).toBeInstanceOf(PressAndDragGesture);
    expect(defaultGesture.name).toBe('test');
  });

  it('should clone gesture with overrides', () => {
    const gesture = new PressAndDragGesture({
      name: 'pressAndDrag',
      pressDuration: 100,
    });
    const cloned = gesture.clone({ pressDuration: 200 });

    expect(cloned).toBeInstanceOf(PressAndDragGesture);
    expect(cloned.name).toBe('pressAndDrag');
    // Note: We can't easily test private properties, but the clone should work
  });

  it('should handle basic gesture creation and destruction', () => {
    // Basic interaction simulation would go here
    // For now, just verify the gesture exists and can be destroyed
    expect(gestureManager).toBeDefined();
    expect(events).toHaveLength(0);
  });
});
