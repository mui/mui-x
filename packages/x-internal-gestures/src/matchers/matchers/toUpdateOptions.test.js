"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var equals_1 = require("../equals");
var MockBadUpdateOptionsGesture_1 = require("../mocks/MockBadUpdateOptionsGesture");
var MockGoodGesture_1 = require("../mocks/MockGoodGesture");
var toUpdateOptions_1 = require("./toUpdateOptions");
var matcher = toUpdateOptions_1.toUpdateOptions.bind((0, equals_1.getFakeState)());
(0, vitest_1.describe)('toUpdateOptions matcher', function () {
    (0, vitest_1.it)('should pass when a gesture can be updated through events', function () {
        var result = matcher(MockGoodGesture_1.MockGoodGesture, { preventDefault: true });
        (0, vitest_1.expect)(result.pass).toBe(true);
    });
    (0, vitest_1.it)('should provide the correct "not" message when passing', function () {
        var result = matcher(MockGoodGesture_1.MockGoodGesture, { preventDefault: true });
        (0, vitest_1.expect)(result.pass).toBe(true);
        (0, vitest_1.expect)(result.message()).toBe('Expected options not to be updatable to the specified values, but they were.');
    });
    (0, vitest_1.it)('should not pass when options are same as default', function () {
        var result = matcher(MockGoodGesture_1.MockGoodGesture, { preventDefault: false });
        (0, vitest_1.expect)(result.pass).toBe(false);
        (0, vitest_1.expect)(result.message()).toBe('Expected options to be updated, but they remained the same as the original.');
    });
    (0, vitest_1.it)('should not pass when options are not updated', function () {
        var result = matcher(MockBadUpdateOptionsGesture_1.MockBadUpdateOptionsGesture, { preventDefault: 'fake' });
        (0, vitest_1.expect)(result.pass).toBe(false);
        (0, vitest_1.expect)(result.message()).toBe('Expected options to be updated to the specified values, but they were not.');
    });
    (0, vitest_1.it)('should not pass when handling invalid inputs', function () {
        var result = matcher(MockGoodGesture_1.MockGoodGesture, {});
        (0, vitest_1.expect)(result.pass).toBe(false);
        (0, vitest_1.expect)(result.message()).toBe('Expected a non-empty options object, but received invalid or empty options.');
    });
    (0, vitest_1.it)('should not pass when handling invalid gesture instances', function () {
        var result = matcher(null, { preventDefault: true });
        (0, vitest_1.expect)(result.pass).toBe(false);
        (0, vitest_1.expect)(result.message()).toBe('Expected a valid gesture class, but received invalid input or an instantiated class instead.');
    });
});
