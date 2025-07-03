import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mouseGesture } from '../testing';
import { GestureManager } from './GestureManager';
import { PanGesture } from './gestures/PanGesture';

describe('Gesture Multiple Key Filter', () => {
  let container: HTMLElement;
  let target: HTMLElement;
  let gestureManager: GestureManager<
    'pan' | 'ctrlPan' | 'ctrlAltPan',
    PanGesture<'pan'> | PanGesture<'ctrlPan'> | PanGesture<'ctrlAltPan'>
  >;
  let events: string[];

  beforeEach(() => {
    events = [];

    // Set up DOM
    container = document.createElement('div');
    container.style.width = '200px';
    container.style.height = '200px';
    document.body.appendChild(container);

    // Set up gesture manager with three pan gestures:
    // 1. Regular pan with no key requirements
    // 2. Ctrl pan that requires the Control key to be pressed
    // 3. Ctrl+Alt pan that requires both Control and Alt keys to be pressed
    gestureManager = new GestureManager({
      gestures: [
        new PanGesture({
          name: 'pan',
          threshold: 0,
        }),
        new PanGesture({
          name: 'ctrlPan',
          threshold: 0,
          requiredKeys: ['Control'], // This gesture requires Control key to be pressed
        }),
        new PanGesture({
          name: 'ctrlAltPan',
          threshold: 0,
          requiredKeys: ['Control', 'Alt'], // This gesture requires both Control and Alt keys
        }),
      ],
    });

    // Set up target element
    target = document.createElement('div');
    target.style.width = '100px';
    target.style.height = '100px';
    container.appendChild(target);

    // Register all gestures on the same target
    const gestureTarget = gestureManager.registerElement(['pan', 'ctrlPan', 'ctrlAltPan'], target);

    // Add event listeners for all gestures
    gestureTarget.addEventListener('panStart', () => events.push('panStart'));
    gestureTarget.addEventListener('pan', () => events.push('pan'));
    gestureTarget.addEventListener('ctrlPanStart', () => events.push('ctrlPanStart'));
    gestureTarget.addEventListener('ctrlPan', () => events.push('ctrlPan'));
    gestureTarget.addEventListener('ctrlAltPanStart', () => events.push('ctrlAltPanStart'));
    gestureTarget.addEventListener('ctrlAltPan', () => events.push('ctrlAltPan'));
  });

  afterEach(() => {
    gestureManager.destroy();
    container.remove();
    events = [];
  });

  it('should trigger only regular pan with no keys pressed', async () => {
    // Perform a pan with no keys pressed
    await mouseGesture.pan({
      target,
      distance: 50,
      angle: 0, // horizontal movement
    });

    // Should trigger only the regular pan
    expect(events).toContain('panStart');
    expect(events).toContain('pan');
    expect(events).not.toContain('ctrlPanStart');
    expect(events).not.toContain('ctrlPan');
    expect(events).not.toContain('ctrlAltPanStart');
    expect(events).not.toContain('ctrlAltPan');
  });

  it('should trigger regular pan and ctrl-pan when Control key is pressed', async () => {
    // Simulate Control key press
    const keydownEvent = new KeyboardEvent('keydown', { key: 'Control' });
    window.dispatchEvent(keydownEvent);

    // Perform a pan with Control key pressed
    await mouseGesture.pan({
      target,
      distance: 50,
      angle: 0, // horizontal movement
    });

    // Should trigger regular pan and ctrl-pan
    expect(events).toContain('panStart');
    expect(events).toContain('pan');
    expect(events).toContain('ctrlPanStart');
    expect(events).toContain('ctrlPan');
    expect(events).not.toContain('ctrlAltPanStart');
    expect(events).not.toContain('ctrlAltPan');

    // Clean up key press
    const keyupEvent = new KeyboardEvent('keyup', { key: 'Control' });
    window.dispatchEvent(keyupEvent);
  });

  it('should trigger all pans when Control and Alt keys are pressed', async () => {
    // Simulate Control+Alt key presses
    const keydownCtrl = new KeyboardEvent('keydown', { key: 'Control' });
    const keydownAlt = new KeyboardEvent('keydown', { key: 'Alt' });
    window.dispatchEvent(keydownCtrl);
    window.dispatchEvent(keydownAlt);

    // Perform a pan with Control+Alt keys pressed
    await mouseGesture.pan({
      target,
      distance: 50,
      angle: 0, // horizontal movement
    });

    // Should trigger all pans
    expect(events).toContain('panStart');
    expect(events).toContain('pan');
    expect(events).toContain('ctrlPanStart');
    expect(events).toContain('ctrlPan');
    expect(events).toContain('ctrlAltPanStart');
    expect(events).toContain('ctrlAltPan');

    // Clean up key presses
    const keyupCtrl = new KeyboardEvent('keyup', { key: 'Control' });
    const keyupAlt = new KeyboardEvent('keyup', { key: 'Alt' });
    window.dispatchEvent(keyupCtrl);
    window.dispatchEvent(keyupAlt);
  });

  it('should not trigger ctrl-alt-pan if only one key of the combination is pressed', async () => {
    // Simulate only Alt key press
    const keydownAlt = new KeyboardEvent('keydown', { key: 'Alt' });
    window.dispatchEvent(keydownAlt);

    // Perform a pan with only Alt key pressed
    await mouseGesture.pan({
      target,
      distance: 50,
      angle: 0, // horizontal movement
    });

    // Should trigger only regular pan
    expect(events).toContain('panStart');
    expect(events).toContain('pan');
    expect(events).not.toContain('ctrlPanStart');
    expect(events).not.toContain('ctrlPan');
    expect(events).not.toContain('ctrlAltPanStart');
    expect(events).not.toContain('ctrlAltPan');

    // Clean up key press
    const keyupAlt = new KeyboardEvent('keyup', { key: 'Alt' });
    window.dispatchEvent(keyupAlt);
  });
});
