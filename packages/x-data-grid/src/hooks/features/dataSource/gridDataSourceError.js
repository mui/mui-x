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
exports.GridUpdateRowError = exports.GridGetRowsError = void 0;
var GridGetRowsError = /** @class */ (function (_super) {
    __extends(GridGetRowsError, _super);
    function GridGetRowsError(options) {
        var _this = _super.call(this, options.message) || this;
        _this.name = 'GridGetRowsError';
        _this.params = options.params;
        _this.cause = options.cause;
        return _this;
    }
    return GridGetRowsError;
}(Error));
exports.GridGetRowsError = GridGetRowsError;
var GridUpdateRowError = /** @class */ (function (_super) {
    __extends(GridUpdateRowError, _super);
    function GridUpdateRowError(options) {
        var _this = _super.call(this, options.message) || this;
        _this.name = 'GridUpdateRowError';
        _this.params = options.params;
        _this.cause = options.cause;
        return _this;
    }
    return GridUpdateRowError;
}(Error));
exports.GridUpdateRowError = GridUpdateRowError;
