import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mouseGesture } from '../testing';
import { GestureManager } from './GestureManager';
import { TapGesture } from './gestures/TapGesture';

describe('ShadowRoot', () => {
  let container: HTMLElement;
  let shadowTarget: HTMLElement;
  let gestureManager: GestureManager<'tap', TapGesture<'tap'>, TapGesture<'tap'>>;
  let events: string[];

  beforeEach(() => {
    events = [];

    // Set up DOM
    container = document.createElement('div');
    container.style.width = '200px';
    container.style.height = '200px';
    document.body.appendChild(container);
    const shadowRoot = container.attachShadow({ mode: 'open' });

    // Set up gesture manager
    gestureManager = new GestureManager({
      gestures: [
        new TapGesture({
          name: 'tap',
          maxDistance: 10,
          taps: 1,
        }),
      ],
    });

    // Set up target element
    shadowTarget = document.createElement('div');
    shadowTarget.style.width = '50px';
    shadowTarget.style.height = '50px';
    shadowRoot.appendChild(shadowTarget);

    const gestureTarget = gestureManager.registerElement('tap', shadowTarget);

    // Add event listeners
    gestureTarget.addEventListener('tap', (event) => {
      const detail = event.detail;
      events.push(
        `shadow tap: x: ${Math.floor(detail.x)} | y: ${Math.floor(detail.y)} | tapCount: ${detail.tapCount}`,
      );
    });
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(container);
    gestureManager.destroy();
    vi.restoreAllMocks();
  });

  it('should trigger tap event on shadow DOM elements', async () => {
    await mouseGesture.tap({
      target: shadowTarget,
    });
    expect(events).toStrictEqual([`shadow tap: x: 25 | y: 25 | tapCount: 1`]);
  });
});
