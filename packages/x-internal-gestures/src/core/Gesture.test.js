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
exports.MockGesture = void 0;
var vitest_1 = require("vitest");
var _1 = require(".");
var MockGesture = /** @class */ (function (_super) {
    __extends(MockGesture, _super);
    function MockGesture() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {};
        // Extra property for coverage
        // eslint-disable-next-line class-methods-use-this
        _this.extra = function () { };
        return _this;
    }
    // eslint-disable-next-line class-methods-use-this
    MockGesture.prototype.resetState = function () { };
    MockGesture.prototype.clone = function () {
        return this;
    };
    return MockGesture;
}(_1.Gesture));
exports.MockGesture = MockGesture;
(0, vitest_1.describe)('Gesture', function () {
    (0, vitest_1.it)('should throw an error when creating a gesture without options', function () {
        // @ts-expect-error, we are testing invalid usage
        (0, vitest_1.expect)(function () { return new MockGesture(); }).toThrowError('Gesture must be initialized with a valid name.');
    });
    (0, vitest_1.it)('should throw an error when creating a gesture with an invalid name', function () {
        (0, vitest_1.expect)(function () { return new MockGesture({ name: '' }); }).toThrowError('Gesture must be initialized with a valid name.');
    });
    (0, vitest_1.it)('should throw an error when creating a gesture with the same name as a native event', function () {
        (0, vitest_1.expect)(function () { return new MockGesture({ name: 'wheel' }); }).toThrowError("Gesture can't be created with a native event name. Tried to use \"wheel\". Please use a custom name instead.");
    });
});
