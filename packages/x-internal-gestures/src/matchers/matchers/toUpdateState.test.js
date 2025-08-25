"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var equals_1 = require("../equals");
require("../index");
var MockBadUpdateStateGesture_1 = require("../mocks/MockBadUpdateStateGesture");
var MockGoodGesture_1 = require("../mocks/MockGoodGesture");
var toUpdateState_1 = require("./toUpdateState");
var matcher = toUpdateState_1.toUpdateState.bind((0, equals_1.getFakeState)());
(0, vitest_1.describe)('toUpdateState matcher', function () {
    (0, vitest_1.it)('should pass when a gesture state can be updated through events', function () {
        var result = matcher(MockGoodGesture_1.MockGoodGesture, {
            isDragging: true,
            startPosition: { x: 100, y: 200 },
        });
        (0, vitest_1.expect)(result.pass).toBe(true);
    });
    (0, vitest_1.it)('should provide the correct "not" message when passing', function () {
        var result = matcher(MockGoodGesture_1.MockGoodGesture, { isDragging: true });
        (0, vitest_1.expect)(result.pass).toBe(true);
        (0, vitest_1.expect)(result.message()).toBe('Expected state not to be updatable to the specified values, but it was.');
    });
    (0, vitest_1.it)('should not pass when options are same as default', function () {
        var result = matcher(MockGoodGesture_1.MockGoodGesture, { isDragging: false });
        (0, vitest_1.expect)(result.pass).toBe(false);
        (0, vitest_1.expect)(result.message()).toBe('Expected state to be updated, but it remained the same as the original.');
    });
    (0, vitest_1.it)('should not pass when state is not updated', function () {
        var result = matcher(MockBadUpdateStateGesture_1.MockBadUpdateStateGesture, {
            isDragging: true,
            startPosition: { x: 100, y: 200 },
        });
        (0, vitest_1.expect)(result.pass).toBe(false);
        (0, vitest_1.expect)(result.message()).toBe('Expected state to be updated to the specified values, but it was not.');
    });
    (0, vitest_1.it)('should not pass when handling invalid inputs', function () {
        var result = matcher(MockGoodGesture_1.MockGoodGesture, {});
        (0, vitest_1.expect)(result.pass).toBe(false);
        (0, vitest_1.expect)(result.message()).toBe('Expected a non-empty state object, but received invalid or empty state.');
    });
    (0, vitest_1.it)('should not pass when handling invalid gesture instances', function () {
        var result = matcher(null, { preventDefault: true });
        (0, vitest_1.expect)(result.pass).toBe(false);
        (0, vitest_1.expect)(result.message()).toBe('Expected a valid gesture class, but received invalid input or an instantiated class instead.');
    });
});
