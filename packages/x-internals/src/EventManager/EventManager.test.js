"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sinon_1 = require("sinon");
var EventManager_1 = require("./EventManager");
describe('EventManager', function () {
    it('should run regular-priority event in the registration order', function () {
        var manager = new EventManager_1.EventManager();
        var listener1 = (0, sinon_1.spy)();
        var listener2 = (0, sinon_1.spy)();
        manager.on('testEvent', listener1);
        manager.on('testEvent', listener2);
        manager.emit('testEvent');
        sinon_1.assert.callOrder(listener1, listener2);
    });
    it('should run high-priority event in the registration reversed order', function () {
        var manager = new EventManager_1.EventManager();
        var listener1 = (0, sinon_1.spy)();
        var listener2 = (0, sinon_1.spy)();
        manager.on('testEvent', listener1, { isFirst: true });
        manager.on('testEvent', listener2, { isFirst: true });
        manager.emit('testEvent');
        sinon_1.assert.callOrder(listener2, listener1);
    });
    it('should run high-priority event before regular priority event', function () {
        var manager = new EventManager_1.EventManager();
        var listener1 = (0, sinon_1.spy)();
        var listener2 = (0, sinon_1.spy)();
        manager.on('testEvent', listener1);
        manager.on('testEvent', listener2, { isFirst: true });
        manager.emit('testEvent');
        sinon_1.assert.callOrder(listener2, listener1);
    });
    it('should apply event un-registration even when asked after the emission', function () {
        var manager = new EventManager_1.EventManager();
        var listener2 = (0, sinon_1.spy)();
        var listener1 = (0, sinon_1.spy)(function () {
            manager.removeListener('testEvent', listener2);
        });
        manager.on('testEvent', listener1);
        manager.on('testEvent', listener2);
        manager.emit('testEvent');
        sinon_1.assert.callCount(listener1, 1);
        sinon_1.assert.callCount(listener2, 0);
    });
});
