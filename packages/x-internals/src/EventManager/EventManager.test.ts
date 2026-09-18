import { vi, describe, it, expect } from 'vitest';
import type { Mock } from 'vitest';
import { EventManager } from './EventManager';

/** Vitest's invocation counter is global across mocks, so it orders calls between them. */
function expectCallOrder(...listeners: Mock[]) {
  // A listener that never ran would otherwise contribute `undefined` and pass vacuously.
  listeners.forEach((listener) => expect(listener.mock.calls.length).to.be.greaterThan(0));
  const order = listeners.map((listener) => listener.mock.invocationCallOrder[0]);
  expect(order).to.deep.equal([...order].sort((a, b) => a - b));
}

describe('EventManager', () => {
  it('should run regular-priority event in the registration order', () => {
    const manager = new EventManager();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    manager.on('testEvent', listener1);
    manager.on('testEvent', listener2);
    manager.emit('testEvent');
    expectCallOrder(listener1, listener2);
  });

  it('should run high-priority event in the registration reversed order', () => {
    const manager = new EventManager();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    manager.on('testEvent', listener1, { isFirst: true });
    manager.on('testEvent', listener2, { isFirst: true });
    manager.emit('testEvent');
    expectCallOrder(listener2, listener1);
  });

  it('should run high-priority event before regular priority event', () => {
    const manager = new EventManager();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    manager.on('testEvent', listener1);
    manager.on('testEvent', listener2, { isFirst: true });
    manager.emit('testEvent');
    expectCallOrder(listener2, listener1);
  });

  it('should apply event un-registration even when asked after the emission', () => {
    const manager = new EventManager();
    const listener2 = vi.fn();
    const listener1 = vi.fn(() => {
      manager.removeListener('testEvent', listener2);
    });
    manager.on('testEvent', listener1);
    manager.on('testEvent', listener2);
    manager.emit('testEvent');
    expect(listener1.mock.calls.length).to.equal(1);
    expect(listener2.mock.calls.length).to.equal(0);
  });
});
