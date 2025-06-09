import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mouseGesture, touchGesture } from '../../testing';
import { GestureManager } from '../GestureManager';
import { PressGesture } from './PressGesture';

describe('Press Gesture', () => {
  let container: HTMLElement;
  let target: HTMLElement;
  let gestureManager: GestureManager<'press', PressGesture<'press'>, PressGesture<'press'>>;
  let events: string[];

  beforeEach(() => {
    events = [];

    // Set up DOM
    container = document.createElement('div');
    container.style.width = '200px';
    container.style.height = '200px';
    document.body.appendChild(container);

    // Set up gesture manager with shorter duration for tests
    gestureManager = new GestureManager({
      gestures: [
        new PressGesture({
          name: 'press',
          duration: 200, // shorter duration for tests
          maxDistance: 10,
        }),
      ],
    });

    // Set up target element
    target = document.createElement('div');
    target.style.width = '100px';
    target.style.height = '100px';
    container.appendChild(target);

    const gestureTarget = gestureManager.registerElement('press', target);

    // Add event listeners
    gestureTarget.addEventListener('pressStart', (event) => {
      const detail = event.detail;
      events.push(
        `pressStart: x: ${Math.round(detail.x)} | y: ${Math.round(detail.y)} | duration: ${Math.round(detail.duration)}`,
      );
    });
    gestureTarget.addEventListener('press', (event) => {
      const detail = event.detail;
      events.push(
        `press: x: ${Math.round(detail.x)} | y: ${Math.round(detail.y)} | duration: ${Math.round(detail.duration)}`,
      );
    });
    gestureTarget.addEventListener('pressEnd', (event) => {
      const detail = event.detail;
      events.push(
        `pressEnd: x: ${Math.round(detail.x)} | y: ${Math.round(detail.y)} | duration: ${Math.round(detail.duration)}`,
      );
    });
    gestureTarget.addEventListener('pressCancel', (event) => {
      const detail = event.detail;
      events.push(
        `pressCancel: x: ${Math.round(detail.x)} | y: ${Math.round(detail.y)} | duration: ${Math.round(detail.duration)}`,
      );
    });
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(container);
    gestureManager.destroy();
    vi.restoreAllMocks();
  });

  it('should detect press gesture with mouse', async () => {
    // Use a long press that exceeds the duration
    await mouseGesture.press({
      target,
      duration: 300, // longer than our configured 200ms
    });

    expect(events.at(0)).toBe(`pressStart: x: 50 | y: 50 | duration: 0`);
    expect(events.at(1)).toContain(`press: x: 50 | y: 50 | duration: 0`);
    // Micro second precision may vary
    expect(events.at(2)).toContain(`pressEnd: x: 50 | y: 50 | duration: 30`);
  });

  it('should detect press gesture with touch', async () => {
    // Use a long press that exceeds the duration
    await touchGesture.press({
      target,
      duration: 300, // longer than our configured 200ms
    });

    expect(events.at(0)).toBe(`pressStart: x: 50 | y: 50 | duration: 0`);
    expect(events.at(1)).toContain(`press: x: 50 | y: 50 | duration: 0`);
    // Micro second precision may vary
    expect(events.at(2)).toContain(`pressEnd: x: 50 | y: 50 | duration: 30`);
  });

  it('should not trigger press if released before duration', async () => {
    const pointerDown = vi.fn();
    const pointerUp = vi.fn();

    target.addEventListener('pointerdown', pointerDown);
    target.addEventListener('pointerup', pointerUp);

    // Perform a quick press (shorter than the configured duration)
    await mouseGesture.press({
      target,
      duration: 100, // Less than the configured 200ms
    });

    // Verify no press events
    expect(events.length).toBe(0);
    expect(pointerDown).toHaveBeenCalled();
    expect(pointerUp).toHaveBeenCalled();
  });

  // TODO: Wait for individual pointer events to be supported
  it.todo('should reject press if moved beyond maxDistance', async () => {});

  it('should update options', () => {
    expect(PressGesture).toUpdateOptions({
      preventDefault: true,
      stopPropagation: true,
      preventIf: ['tap'],
      duration: 300,
      maxDistance: 15,
    });
  });

  it('should update state', { fails: true }, () => {
    expect(PressGesture).toUpdateState({});
  });

  it('should properly clone', () => {
    expect(PressGesture).toBeClonable({
      name: 'press',
      preventDefault: true,
      stopPropagation: true,
      threshold: 0,
      minPointers: 1,
      maxPointers: 1,
      preventIf: ['tap'],
      duration: 300,
      maxDistance: 15,
    });
  });
});
