import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { touchGesture } from '../testing';
import { GestureManager } from './GestureManager';
import { PanGesture } from './gestures/PanGesture';
import { TapGesture } from './gestures/TapGesture';

describe('GestureManager dynamic gestures', () => {
  let container: HTMLElement;
  let target: HTMLElement;
  let gestureManager: GestureManager<'pan' | 'tap', PanGesture<'pan'> | TapGesture<'tap'>>;
  let events: string[];

  beforeEach(() => {
    events = [];

    // Set up DOM
    container = document.createElement('div');
    container.style.width = '200px';
    container.style.height = '200px';
    document.body.appendChild(container);

    gestureManager = new GestureManager({ gestures: [] });

    target = document.createElement('div');
    target.style.width = '100px';
    target.style.height = '100px';
    container.appendChild(target);
  });

  afterEach(() => {
    document.body.removeChild(container);
    gestureManager.destroy();
    vi.restoreAllMocks();
  });

  it('should register a gesture added with addGestures', async () => {
    gestureManager.addGestures([new PanGesture({ name: 'pan', threshold: 0 })]);
    const gestureTarget = gestureManager.registerElement('pan', target);
    gestureTarget.addEventListener('panStart', () => events.push('panStart'));

    await touchGesture.pan({ target, angle: 0, distance: 50, steps: 2 });

    expect(events).toStrictEqual(['panStart']);
  });

  it('should register multiple gestures added with addGestures', async () => {
    gestureManager.addGestures([
      new PanGesture({ name: 'pan', threshold: 0 }),
      new TapGesture({ name: 'tap' }),
    ]);
    const gestureTarget = gestureManager.registerElement(['pan', 'tap'], target);
    gestureTarget.addEventListener('panStart', () => events.push('panStart'));
    gestureTarget.addEventListener('tap', () => events.push('tap'));

    await touchGesture.tap({ target });
    await touchGesture.pan({ target, angle: 0, distance: 50, steps: 2 });

    expect(events).toStrictEqual(['tap', 'panStart']);
  });

  it('should apply setGestureOptions to a gesture added with addGestures', async () => {
    gestureManager.addGestures([new PanGesture({ name: 'pan', threshold: 0 })]);
    const gestureTarget = gestureManager.registerElement('pan', target);
    gestureTarget.addEventListener('panStart', () => events.push('panStart'));

    // With a high threshold the small pan does not fire
    gestureManager.setGestureOptions('pan', target, { threshold: 1000 });
    await touchGesture.pan({ target, angle: 0, distance: 50, steps: 2 });
    expect(events).toStrictEqual([]);

    // Lowering the threshold makes it fire again
    gestureManager.setGestureOptions('pan', target, { threshold: 0 });
    await touchGesture.pan({ target, angle: 0, distance: 50, steps: 2 });
    expect(events).toStrictEqual(['panStart']);
  });

  it('should unregister a gesture removed with removeGestures from its element', async () => {
    gestureManager.addGestures([new PanGesture({ name: 'pan', threshold: 0 })]);
    const gestureTarget = gestureManager.registerElement('pan', target);
    gestureTarget.addEventListener('panStart', () => events.push('panStart'));

    gestureManager.removeGestures(['pan']);

    await touchGesture.pan({ target, angle: 0, distance: 50, steps: 2 });
    expect(events).toStrictEqual([]);
  });

  it('should only remove the named gesture and leave the others working', async () => {
    gestureManager.addGestures([
      new PanGesture({ name: 'pan', threshold: 0 }),
      new TapGesture({ name: 'tap' }),
    ]);
    const gestureTarget = gestureManager.registerElement(['pan', 'tap'], target);
    gestureTarget.addEventListener('panStart', () => events.push('panStart'));
    gestureTarget.addEventListener('tap', () => events.push('tap'));

    gestureManager.removeGestures(['tap']);

    await touchGesture.tap({ target });
    await touchGesture.pan({ target, angle: 0, distance: 50, steps: 2 });

    expect(events).toStrictEqual(['panStart']);
  });

  it('should support an add, remove, add cycle without warning', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Mirrors a React effect with a teardown running twice (StrictMode)
    gestureManager.addGestures([new PanGesture({ name: 'pan', threshold: 0 })]);
    gestureManager.registerElement('pan', target);
    gestureManager.removeGestures(['pan']);
    gestureManager.addGestures([new PanGesture({ name: 'pan', threshold: 0 })]);
    const gestureTarget = gestureManager.registerElement('pan', target);
    gestureTarget.addEventListener('panStart', () => events.push('panStart'));

    // Re-adding the template does not warn about a duplicate
    expect(warnSpy).not.toHaveBeenCalled();

    // The re-added gesture is functional
    await touchGesture.pan({ target, angle: 0, distance: 50, steps: 2 });
    expect(events).toStrictEqual(['panStart']);
  });
});
