import { vi, expect } from 'vitest';
import { EventManager } from './EventManager';

describe('EventManager', () => {
  it('should run regular-priority event in the registration order', () => {
    const manager = new EventManager();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    manager.on('testEvent', listener1);
    manager.on('testEvent', listener2);
    manager.emit('testEvent');
    expect(listener1.mock.invocationCallOrder[0]).toBeLessThan(
      listener2.mock.invocationCallOrder[0],
    );
  });

  it('should run high-priority event in the registration reversed order', () => {
    const manager = new EventManager();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    manager.on('testEvent', listener1, { isFirst: true });
    manager.on('testEvent', listener2, { isFirst: true });
    manager.emit('testEvent');
    expect(listener2.mock.invocationCallOrder[0]).toBeLessThan(
      listener1.mock.invocationCallOrder[0],
    );
  });

  it('should run high-priority event before regular priority event', () => {
    const manager = new EventManager();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    manager.on('testEvent', listener1);
    manager.on('testEvent', listener2, { isFirst: true });
    manager.emit('testEvent');
    expect(listener2.mock.invocationCallOrder[0]).toBeLessThan(
      listener1.mock.invocationCallOrder[0],
    );
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
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(0);
  });
});
