import { spy, assert as sinonAssert } from 'sinon';
import { EventManager } from './EventManager';

describe('EventManager', () => {
  it('should run regular-priority event in the registration order', () => {
    const manager = new EventManager();
    const listener1 = spy();
    const listener2 = spy();
    manager.on('testEvent', listener1);
    manager.on('testEvent', listener2);
    manager.emit('testEvent');
    sinonAssert.callOrder(listener1, listener2);
  });

  it('should run high-priority event in the registration reversed order', () => {
    const manager = new EventManager();
    const listener1 = spy();
    const listener2 = spy();
    manager.on('testEvent', listener1, { isFirst: true });
    manager.on('testEvent', listener2, { isFirst: true });
    manager.emit('testEvent');
    sinonAssert.callOrder(listener2, listener1);
  });

  it('should run high-priority event before regular priority event', () => {
    const manager = new EventManager();
    const listener1 = spy();
    const listener2 = spy();
    manager.on('testEvent', listener1);
    manager.on('testEvent', listener2, { isFirst: true });
    manager.emit('testEvent');
    sinonAssert.callOrder(listener2, listener1);
  });

  it('should apply event un-registration even when asked after the emission', () => {
    const manager = new EventManager();
    const listener2 = spy();
    const listener1 = spy(() => {
      manager.removeListener('testEvent', listener2);
    });
    manager.on('testEvent', listener1);
    manager.on('testEvent', listener2);
    manager.emit('testEvent');
    sinonAssert.callCount(listener1, 1);
    sinonAssert.callCount(listener2, 0);
  });
});
