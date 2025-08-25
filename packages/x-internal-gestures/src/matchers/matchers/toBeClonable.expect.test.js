"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var MockGoodGesture_1 = require("../mocks/MockGoodGesture");
(0, vitest_1.describe)('toBeClonable expect', function () {
    (0, vitest_1.it)('should pass when a gesture can be cloned', function () {
        (0, vitest_1.expect)(MockGoodGesture_1.MockGoodGesture).toBeClonable();
    });
    (0, vitest_1.it)('should pass when a gesture can be cloned with overrides', function () {
        (0, vitest_1.expect)(MockGoodGesture_1.MockGoodGesture).toBeClonable({
            preventDefault: true,
            stopPropagation: true,
            preventIf: ['pan', 'pinch'],
        });
    });
    (0, vitest_1.it)('should handle invalid gesture instances gracefully', { fails: true }, function () {
        (0, vitest_1.expect)(null).toBeClonable();
    });
});
