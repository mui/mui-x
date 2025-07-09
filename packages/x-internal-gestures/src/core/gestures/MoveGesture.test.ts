import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mouseGesture } from '../../testing';
import { GestureManager } from '../GestureManager';
import { MoveGesture } from './MoveGesture';

describe('Move Gesture', () => {
  let container: HTMLElement;
  let target: HTMLElement;
  let gestureManager: GestureManager<'move', MoveGesture<'move'>, MoveGesture<'move'>>;
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
        new MoveGesture({
          name: 'move',
          threshold: 0,
        }),
      ],
    });

    // Set up target element
    target = document.createElement('div');
    target.style.width = '50px';
    target.style.height = '50px';
    target.style.backgroundColor = 'red';
    target.style.position = 'absolute';
    target.style.top = '75px';
    target.style.left = '75px';
    container.appendChild(target);

    const gestureTarget = gestureManager.registerElement('move', target);

    // Add event listeners
    gestureTarget.addEventListener('moveStart', (event) => {
      const detail = event.detail;
      const srcEvent = detail.srcEvent;
      events.push(
        `moveStart: ${srcEvent.pointerId} | x: ${detail.centroid.x} | y: ${detail.centroid.y}`,
      );
    });
    gestureTarget.addEventListener('move', (event) => {
      const detail = event.detail;
      const srcEvent = detail.srcEvent;
      events.push(
        `move: ${srcEvent.pointerId} | x: ${detail.centroid.x} | y: ${detail.centroid.y}`,
      );
    });
    gestureTarget.addEventListener('moveEnd', (event) => {
      const detail = event.detail;
      const srcEvent = detail.srcEvent;
      events.push(
        `moveEnd: ${srcEvent.pointerId} | x: ${detail.centroid.x} | y: ${detail.centroid.y}`,
      );
    });
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(container);
    gestureManager.destroy();
    vi.restoreAllMocks();
  });

  it('should detect move gesture', async () => {
    await mouseGesture.move({
      target,
      steps: 2,
      distance: 100,
    });

    // Verify events
    expect(events).toStrictEqual([
      'moveStart: 1 | x: 150 | y: 100',
      'move: 1 | x: 150 | y: 100',
      'move: 1 | x: 200 | y: 100',
    ]);
  });

  it('should fire a moveEnd when leaving the target', async () => {
    const gesture = mouseGesture.setup();

    await gesture.move({
      target,
      steps: 2,
      distance: 100,
    });

    const target2 = document.createElement('div');
    target2.style.width = '200px';
    target2.style.height = '200px';
    target2.style.backgroundColor = 'blue';
    target2.id = 'target2';
    document.body.appendChild(target2);

    await gesture.move({
      target: target2,
      steps: 2,
      distance: 100,
    });

    // Verify events
    expect(events).toStrictEqual([
      'moveStart: 1 | x: 150 | y: 100',
      'move: 1 | x: 150 | y: 100',
      'move: 1 | x: 200 | y: 100',
      'moveEnd: 1 | x: 200 | y: 100',
    ]);
  });

  it('should fire a moveStart when entering a new target even if no move was made', async () => {
    const gesture = mouseGesture.setup();
    const target2 = document.createElement('div');
    target2.style.width = '200px';
    target2.style.height = '200px';
    target2.style.backgroundColor = 'blue';
    target2.id = 'target2';
    document.body.appendChild(target2);
    target2.addEventListener('pointerenter', () => {
      events.push('pointerenter on target2');
    });

    await gesture.move({
      target: target2,
      distance: 100,
      steps: 1,
    });

    expect(events).toStrictEqual(['pointerenter on target2']);

    events = []; // Clear events for next assertions

    await gesture.move({
      target,
      distance: 100,
      steps: 1,
    });

    expect(events).toStrictEqual([
      'moveStart: 1 | x: 300 | y: 500',
      'move: 1 | x: 300 | y: 500',
      'move: 1 | x: 300 | y: 500',
    ]);
  });

  it('should handle pointer events with non-mouse/pen pointer types', () => {
    const gestureInstance = new MoveGesture({ name: 'move' });
    // Set up the gesture instance
    gestureInstance.init(
      target,
      Reflect.get(gestureManager, 'pointerManager'),
      Reflect.get(gestureManager, 'activeGesturesRegistry'),
      Reflect.get(gestureManager, 'keyboardManager'),
    );

    // Create a pointer move event with touch type
    const moveEvent = new PointerEvent('pointermove', {
      pointerType: 'touch',
      clientX: 100,
      clientY: 100,
    });

    // Dispatch the event
    target.dispatchEvent(moveEvent);

    // Verify no events were triggered since we're using touch input
    expect(events.length).toBe(0);
  });

  it('should update options', () => {
    expect(MoveGesture).toUpdateOptions({
      preventDefault: true,
      stopPropagation: true,
      preventIf: ['pan'],
    });
  });

  it('should update state', { fails: true }, () => {
    // @ts-expect-error, type is never
    expect(MoveGesture).toUpdateState({});
  });

  it('should properly clone', () => {
    expect(MoveGesture).toBeClonable({
      name: 'move',
      preventDefault: true,
      stopPropagation: true,
      threshold: 10,
      minPointers: 1,
      maxPointers: 2,
      preventIf: ['pan', 'pinch'],
    });
  });
});
