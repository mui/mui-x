"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var core_1 = require("../../core");
var toBeClonable_1 = require("./toBeClonable");
var toUpdateOptions_1 = require("./toUpdateOptions");
var toUpdateState_1 = require("./toUpdateState");
// Create a basic gesture class for testing
var TestGesture = /** @class */ (function (_super) {
    __extends(TestGesture, _super);
    function TestGesture() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {};
        return _this;
    }
    // eslint-disable-next-line class-methods-use-this
    TestGesture.prototype.resetState = function () { };
    TestGesture.prototype.clone = function () {
        return new TestGesture({
            name: this.name,
        });
    };
    return TestGesture;
}(core_1.Gesture));
// Create a test state with isNot = true to simulate .not usage
var fakeState = {
    isNot: true,
    equals: function (a, b) { return a === b; },
};
(0, vitest_1.describe)('Matchers with isNot property', function () {
    (0, vitest_1.it)('toUpdateOptions should throw an error when used with .not', function () {
        (0, vitest_1.expect)(function () {
            toUpdateOptions_1.toUpdateOptions.call(fakeState, TestGesture, { preventDefault: true });
        }).toThrow('toUpdateOptions matcher does not support negation');
    });
    (0, vitest_1.it)('toBeClonable should throw an error when used with .not', function () {
        (0, vitest_1.expect)(function () {
            toBeClonable_1.toBeClonable.call(fakeState, TestGesture, {});
        }).toThrow('toBeClonable matcher does not support negation');
    });
    (0, vitest_1.it)('toUpdateState should throw an error when used with .not', function () {
        (0, vitest_1.expect)(function () {
            toUpdateState_1.toUpdateState.call(fakeState, TestGesture, { testState: true });
        }).toThrow('toUpdateState matcher does not support negation');
    });
});
