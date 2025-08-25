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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockGoodGesture = void 0;
var core_1 = require("../../core");
var MockGoodGesture = /** @class */ (function (_super) {
    __extends(MockGoodGesture, _super);
    function MockGoodGesture() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // Define state for the gesture
        _this.state = {
            isDragging: false,
            startPosition: { x: 0, y: 0 },
            currentDistance: 0,
            customValue: '',
        };
        // Extra property for coverage
        // eslint-disable-next-line class-methods-use-this
        _this.extra = function () { };
        return _this;
    }
    MockGoodGesture.prototype.resetState = function () {
        this.state = {
            isDragging: false,
            startPosition: { x: 0, y: 0 },
            currentDistance: 0,
            customValue: '',
        };
    };
    MockGoodGesture.prototype.clone = function (overrides) {
        return new MockGoodGesture(__assign({ name: this.name, preventDefault: this.preventDefault, stopPropagation: this.stopPropagation, preventIf: this.preventIf }, overrides));
    };
    // Override the updateOptions method to handle our custom properties
    MockGoodGesture.prototype.updateOptions = function (options) {
        var _a, _b;
        _super.prototype.updateOptions.call(this, options);
        this.complexOption = (_a = options.complexOption) !== null && _a !== void 0 ? _a : this.complexOption;
        this.arrayOption = (_b = options.arrayOption) !== null && _b !== void 0 ? _b : this.arrayOption;
    };
    return MockGoodGesture;
}(core_1.Gesture));
exports.MockGoodGesture = MockGoodGesture;
