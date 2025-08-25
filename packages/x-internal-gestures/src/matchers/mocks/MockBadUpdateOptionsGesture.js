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
exports.MockBadUpdateOptionsGesture = void 0;
var core_1 = require("../../core");
var MockBadUpdateOptionsGesture = /** @class */ (function (_super) {
    __extends(MockBadUpdateOptionsGesture, _super);
    function MockBadUpdateOptionsGesture() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {};
        return _this;
    }
    // eslint-disable-next-line class-methods-use-this
    MockBadUpdateOptionsGesture.prototype.resetState = function () { };
    MockBadUpdateOptionsGesture.prototype.clone = function (overrides) {
        return new MockBadUpdateOptionsGesture(__assign({ name: this.name }, overrides));
    };
    // We remove the updateOptions implementation
    // eslint-disable-next-line class-methods-use-this
    MockBadUpdateOptionsGesture.prototype.updateOptions = function () { };
    return MockBadUpdateOptionsGesture;
}(core_1.Gesture));
exports.MockBadUpdateOptionsGesture = MockBadUpdateOptionsGesture;
