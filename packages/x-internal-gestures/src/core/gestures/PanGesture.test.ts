import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { touchGesture } from '../../testing';
import { GestureManager } from '../GestureManager';
import { PanGesture } from './PanGesture';

describe('Pan Gesture', () => {
  let container: HTMLElement;
  let target: HTMLElement;
  let gestureManager: GestureManager<'pan', PanGesture<'pan'>, PanGesture<'pan'>>;
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
        new PanGesture({
          name: 'pan',
          threshold: 0,
        }),
      ],
    });

    // Set up target element
    target = document.createElement('div');
    target.style.width = '100px';
    target.style.height = '100px';
    container.appendChild(target);

    const gestureTarget = gestureManager.registerElement('pan', target);

    // Add event listeners
    gestureTarget.addEventListener('panStart', (event) => {
      const detail = event.detail;
      events.push(
        `panStart: deltaX: ${Math.floor(detail.totalDeltaX)} | deltaY: ${Math.floor(detail.totalDeltaY)} | direction: ${[detail.direction.horizontal, detail.direction.vertical].filter(Boolean).join(' ') || null} | mainAxis: ${detail.direction.mainAxis}`,
      );
    });
    gestureTarget.addEventListener('pan', (event) => {
      const detail = event.detail;
      events.push(
        `pan: deltaX: ${Math.floor(detail.totalDeltaX)} | deltaY: ${Math.floor(detail.totalDeltaY)} | direction: ${[detail.direction.horizontal, detail.direction.vertical].filter(Boolean).join(' ') || null} | mainAxis: ${detail.direction.mainAxis}`,
      );
    });
    gestureTarget.addEventListener('panEnd', (event) => {
      const detail = event.detail;
      events.push(
        `panEnd: deltaX: ${Math.floor(detail.totalDeltaX)} | deltaY: ${Math.floor(detail.totalDeltaY)} | direction: ${[detail.direction.horizontal, detail.direction.vertical].filter(Boolean).join(' ') || null} | mainAxis: ${detail.direction.mainAxis}`,
      );
    });
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(container);
    gestureManager.destroy();
    vi.restoreAllMocks();
  });

  it('should detect horizontal pan gesture', async () => {
    await touchGesture.pan({
      target,
      angle: 0, // Horizontal pan (right)
      distance: 50,
      steps: 2,
    });

    expect(events).toStrictEqual([
      `panStart: deltaX: 25 | deltaY: 0 | direction: null | mainAxis: null`,
      `pan: deltaX: 25 | deltaY: 0 | direction: null | mainAxis: null`,
      `pan: deltaX: 50 | deltaY: 0 | direction: right | mainAxis: horizontal`,
      `panEnd: deltaX: 50 | deltaY: 0 | direction: right | mainAxis: horizontal`,
    ]);
  });

  it('should detect vertical pan gesture', async () => {
    await touchGesture.pan({
      target,
      angle: 90, // Vertical pan (down)
      distance: 50,
      steps: 2,
    });

    expect(events).toStrictEqual([
      `panStart: deltaX: 0 | deltaY: 25 | direction: null | mainAxis: null`,
      `pan: deltaX: 0 | deltaY: 25 | direction: null | mainAxis: null`,
      `pan: deltaX: 0 | deltaY: 50 | direction: down | mainAxis: vertical`,
      `panEnd: deltaX: 0 | deltaY: 50 | direction: down | mainAxis: vertical`,
    ]);
  });

  it('should correctly handle diagonal pan gesture', async () => {
    await touchGesture.pan({
      target,
      angle: -135, // Diagonal pan (up-left)
      distance: 50,
      steps: 2,
    });

    // cos(-135°) = -0.70, sin(-135°) = -0.70
    // Expecting approximately -35 total for both deltaX and deltaY

    expect(events).toStrictEqual([
      `panStart: deltaX: -18 | deltaY: -18 | direction: null | mainAxis: null`,
      `pan: deltaX: -18 | deltaY: -18 | direction: null | mainAxis: null`,
      `pan: deltaX: -36 | deltaY: -36 | direction: left up | mainAxis: diagonal`,
      `panEnd: deltaX: -36 | deltaY: -36 | direction: left up | mainAxis: diagonal`,
    ]);
  });

  it('should properly change direction if the gesture changes', async () => {
    const gesture = touchGesture.setup();

    await gesture.pan({
      target,
      pointers: { ids: [50] },
      angle: 0, // Start with horizontal pan (right)
      distance: 50,
      steps: 2,
      releasePointers: false,
    });

    expect(events).toStrictEqual([
      `panStart: deltaX: 25 | deltaY: 0 | direction: null | mainAxis: null`,
      `pan: deltaX: 25 | deltaY: 0 | direction: null | mainAxis: null`,
      `pan: deltaX: 50 | deltaY: 0 | direction: right | mainAxis: horizontal`,
    ]);

    events = []; // Clear events for next test

    await gesture.pan({
      target,
      pointers: { ids: [50] },
      angle: 90, // Change to vertical pan (down)
      distance: 50,
      steps: 2,
      releasePointers: false,
    });

    expect(events).toStrictEqual([
      `pan: deltaX: 50 | deltaY: 25 | direction: right | mainAxis: horizontal`,
      `pan: deltaX: 50 | deltaY: 50 | direction: down | mainAxis: vertical`,
    ]);

    events = []; // Clear events for next test

    await gesture.pan({
      target,
      pointers: { ids: [50] },
      angle: -166, // Change to diagonal pan (up-left)
      distance: 50,
      steps: 2,
      releasePointers: true,
    });

    // cos(-166°) = -0.97, sin(-166°) = 0.24
    // Expecting approximately -48.5 total for deltaX and -12.94 for deltaY

    expect(events).toStrictEqual([
      `pan: deltaX: 25 | deltaY: 43 | direction: down | mainAxis: vertical`,
      `pan: deltaX: 1 | deltaY: 37 | direction: left up | mainAxis: horizontal`,
      `panEnd: deltaX: 1 | deltaY: 37 | direction: left up | mainAxis: horizontal`,
    ]);
  });

  it('should respect direction constraints', async () => {
    gestureManager.setGestureOptions('pan', target, {
      direction: ['left', 'right'], // Only allow horizontal panning
    });

    // Test vertical pan (should not trigger events due to direction constraint)
    await touchGesture.pan({
      target,
      angle: 90, // Vertical pan (down)
      distance: 50,
      steps: 3,
    });

    // Verify no events for vertical pan
    expect(events.length).toBe(0);

    // Test horizontal pan (should trigger events)
    await touchGesture.pan({
      target,
      angle: 0, // Horizontal pan (right)
      distance: 50,
      steps: 3,
    });

    // Verify events for horizontal pan
    expect(events.length).toBeGreaterThan(0);
  });

  it('should not jump when a new pointer is added during an active gesture', async () => {
    const gesture = touchGesture.setup();

    await gesture.pan({
      target,
      distance: 50,
      steps: 2,
      pointers: {
        amount: 1,
        ids: [1230],
      },
      releasePointers: false,
    });

    expect(events).toStrictEqual([
      `panStart: deltaX: 25 | deltaY: 0 | direction: null | mainAxis: null`,
      `pan: deltaX: 25 | deltaY: 0 | direction: null | mainAxis: null`,
      `pan: deltaX: 50 | deltaY: 0 | direction: right | mainAxis: horizontal`,
    ]);

    events = []; // Clear events for next test

    await gesture.pan({
      target,
      distance: 50,
      steps: 2,
      pointers: {
        amount: 2, // Add a new pointer
        ids: [1230, 4560],
      },
      releasePointers: true,
    });

    expect(events).toStrictEqual([
      `pan: deltaX: 62 | deltaY: 0 | direction: right | mainAxis: horizontal`,
      `pan: deltaX: 75 | deltaY: 0 | direction: right | mainAxis: horizontal`,
      `pan: deltaX: 87 | deltaY: 0 | direction: right | mainAxis: horizontal`,
      `pan: deltaX: 100 | deltaY: 0 | direction: right | mainAxis: horizontal`,
      `panEnd: deltaX: 100 | deltaY: 0 | direction: right | mainAxis: horizontal`,
    ]);
  });

  it('should not jump when a pointer is removed during an active gesture', async () => {
    const gesture = touchGesture.setup();

    await gesture.pan({
      target,
      distance: 50,
      steps: 2,
      pointers: {
        amount: 2,
        ids: [7890, 1011],
      },
      releasePointers: [7890],
    });

    expect(events).toStrictEqual([
      `panStart: deltaX: 12 | deltaY: 0 | direction: null | mainAxis: null`,
      `pan: deltaX: 12 | deltaY: 0 | direction: null | mainAxis: null`,
      `pan: deltaX: 25 | deltaY: 0 | direction: right | mainAxis: horizontal`,
      `pan: deltaX: 37 | deltaY: 0 | direction: right | mainAxis: horizontal`,
      `pan: deltaX: 50 | deltaY: 0 | direction: right | mainAxis: horizontal`,
    ]);

    events = []; // Clear events for next test

    await gesture.pan({
      target,
      distance: 50,
      steps: 2,
      pointers: {
        amount: 1, // Remove one pointer
        ids: [1011],
      },
      releasePointers: true,
    });

    expect(events).toStrictEqual([
      `pan: deltaX: 75 | deltaY: 0 | direction: right | mainAxis: horizontal`,
      `pan: deltaX: 100 | deltaY: 0 | direction: right | mainAxis: horizontal`,
      `panEnd: deltaX: 100 | deltaY: 0 | direction: right | mainAxis: horizontal`,
    ]);
  });

  it('should update options', () => {
    expect(PanGesture).toUpdateOptions({
      preventDefault: true,
      stopPropagation: true,
      preventIf: ['move'],
      direction: ['up', 'down'],
    });
  });

  it('should update state', { fails: true }, () => {
    expect(PanGesture).toUpdateState({});
  });

  it('should properly clone', () => {
    expect(PanGesture).toBeClonable({
      preventDefault: true,
      stopPropagation: true,
      threshold: 10,
      minPointers: 1,
      maxPointers: 2,
      preventIf: ['move', 'pinch'],
      direction: ['left', 'right'],
    });
  });
});
