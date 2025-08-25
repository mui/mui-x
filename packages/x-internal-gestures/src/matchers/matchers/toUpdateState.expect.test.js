"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var MockGoodGesture_1 = require("../mocks/MockGoodGesture");
(0, vitest_1.describe)('toUpdateState expect', function () {
    (0, vitest_1.it)('should pass when a gesture can be cloned', function () {
        (0, vitest_1.expect)(MockGoodGesture_1.MockGoodGesture).toUpdateState({ isDragging: true });
    });
    (0, vitest_1.it)('should fail when there is options to uses', { fails: true }, function () {
        // @ts-expect-error, this is a test case for invalid input handling
        (0, vitest_1.expect)(MockGoodGesture_1.MockGoodGesture).toUpdateState();
    });
});
