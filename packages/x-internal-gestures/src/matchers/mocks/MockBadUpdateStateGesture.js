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
exports.MockBadUpdateStateGesture = void 0;
var core_1 = require("../../core");
var MockBadUpdateStateGesture = /** @class */ (function (_super) {
    __extends(MockBadUpdateStateGesture, _super);
    function MockBadUpdateStateGesture() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isDragging: false,
            startPosition: { x: 0, y: 0 },
        };
        return _this;
    }
    MockBadUpdateStateGesture.prototype.resetState = function () {
        this.state = {
            isDragging: false,
            startPosition: { x: 0, y: 0 },
        };
    };
    MockBadUpdateStateGesture.prototype.clone = function (overrides) {
        return new MockBadUpdateStateGesture(__assign({ name: this.name }, overrides));
    };
    // Override updateState to prevent updates
    // This simulates a broken implementation
    MockBadUpdateStateGesture.prototype.updateState = function (_) {
        // Deliberately do nothing
    };
    return MockBadUpdateStateGesture;
}(core_1.Gesture));
exports.MockBadUpdateStateGesture = MockBadUpdateStateGesture;
