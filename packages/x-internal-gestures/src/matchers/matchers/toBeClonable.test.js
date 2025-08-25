"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var equals_1 = require("../equals");
var MockBadCloneGesture_1 = require("../mocks/MockBadCloneGesture");
var MockBadInstanceGesture_1 = require("../mocks/MockBadInstanceGesture");
var MockBadOverrideGesture_1 = require("../mocks/MockBadOverrideGesture");
var MockBadOverrideIgnoreGesture_1 = require("../mocks/MockBadOverrideIgnoreGesture");
var MockGoodGesture_1 = require("../mocks/MockGoodGesture");
var toBeClonable_1 = require("./toBeClonable");
var matcher = toBeClonable_1.toBeClonable.bind((0, equals_1.getFakeState)());
(0, vitest_1.describe)('toBeClonable matcher', function () {
    (0, vitest_1.it)('should pass when a gesture can be cloned', function () {
        var result = matcher(MockGoodGesture_1.MockGoodGesture);
        (0, vitest_1.expect)(result.pass).toBe(true);
    });
    (0, vitest_1.it)('should provide the correct "not" message when passing', function () {
        var result = matcher(MockGoodGesture_1.MockGoodGesture);
        (0, vitest_1.expect)(result.pass).toBe(true);
        (0, vitest_1.expect)(result.message()).toBe('Expected gesture not to be clonable, but it was.');
    });
    (0, vitest_1.it)('should pass when a gesture can be cloned with overrides', function () {
        var result = matcher(MockGoodGesture_1.MockGoodGesture, {
            preventDefault: true,
            stopPropagation: true,
            preventIf: ['pan', 'pinch'],
        });
        (0, vitest_1.expect)(result.pass).toBe(true);
    });
    (0, vitest_1.it)('should pass for different inputs', function () {
        // Should pass when overriding with the same values
        var resultSameOptions = matcher(MockGoodGesture_1.MockGoodGesture, {
            preventDefault: false,
            stopPropagation: false,
        });
        (0, vitest_1.expect)(resultSameOptions.pass).toBe(true);
        // Should pass when overriding some options
        var resultSomeOptions = matcher(MockGoodGesture_1.MockGoodGesture, {
            preventDefault: true,
        });
        (0, vitest_1.expect)(resultSomeOptions.pass).toBe(true);
    });
    (0, vitest_1.it)('should not pass when the clone is the same instance as the original', function () {
        var result = matcher(MockBadCloneGesture_1.MockBadCloneGesture);
        (0, vitest_1.expect)(result.pass).toBe(false);
        (0, vitest_1.expect)(result.message()).toBe('Expected clone to be a different instance than the original, but they are the same.');
    });
    (0, vitest_1.it)('should not pass when the clone is not an instance of Gesture', function () {
        var result = matcher(MockBadInstanceGesture_1.MockBadInstanceGesture);
        (0, vitest_1.expect)(result.pass).toBe(false);
        (0, vitest_1.expect)(result.message()).toBe('Expected clone to be an instance of Gesture, but it is not.');
    });
    (0, vitest_1.it)('should not pass when the clone does not have overridden properties applied', function () {
        var result = matcher(MockBadOverrideGesture_1.MockBadOverrideGesture, { preventDefault: true });
        (0, vitest_1.expect)(result.pass).toBe(false);
        (0, vitest_1.expect)(result.message()).toBe('Expected clone to have overridden properties applied, but it does not.');
    });
    (0, vitest_1.it)('should not pass when non-overridden properties do not match the original', function () {
        var result = matcher(MockBadOverrideIgnoreGesture_1.MockBadOverrideIgnoreGesture);
        (0, vitest_1.expect)(result.pass).toBe(false);
        (0, vitest_1.expect)(result.message()).toBe('Expected non-overridden properties to match the original, but they do not.');
    });
    (0, vitest_1.it)('should handle invalid inputs gracefully', function () {
        var result = matcher(MockGoodGesture_1.MockGoodGesture, false);
        (0, vitest_1.expect)(result.pass).toBe(false);
        (0, vitest_1.expect)(result.message()).toBe('Expected valid options, but received an invalid value.');
    });
    (0, vitest_1.it)('should handle invalid gesture instances gracefully', function () {
        var result = matcher(null);
        (0, vitest_1.expect)(result.pass).toBe(false);
        (0, vitest_1.expect)(result.message()).toBe('Expected a valid gesture class, but received invalid input or an instantiated class instead.');
    });
});
