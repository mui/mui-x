"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.polarSeriesTypes = exports.cartesianSeriesTypes = void 0;
var cartesianInstance;
var polarInstance;
var CartesianSeriesTypes = /** @class */ (function () {
    function CartesianSeriesTypes() {
        this.types = new Set();
        if (cartesianInstance) {
            throw new Error('MUI X Charts: Only one CartesianSeriesTypes instance can be created. ' +
                'This is a singleton class used internally for series type registration. ' +
                'Use the existing instance instead of creating a new one.');
        }
        cartesianInstance = this.types;
    }
    CartesianSeriesTypes.prototype.addType = function (value) {
        this.types.add(value);
    };
    CartesianSeriesTypes.prototype.getTypes = function () {
        return this.types;
    };
    return CartesianSeriesTypes;
}());
var PolarSeriesTypes = /** @class */ (function () {
    function PolarSeriesTypes() {
        this.types = new Set();
        if (polarInstance) {
            throw new Error('MUI X Charts: Only one PolarSeriesTypes instance can be created. ' +
                'This is a singleton class used internally for series type registration. ' +
                'Use the existing instance instead of creating a new one.');
        }
        polarInstance = this.types;
    }
    PolarSeriesTypes.prototype.addType = function (value) {
        this.types.add(value);
    };
    PolarSeriesTypes.prototype.getTypes = function () {
        return this.types;
    };
    return PolarSeriesTypes;
}());
exports.cartesianSeriesTypes = new CartesianSeriesTypes();
exports.cartesianSeriesTypes.addType('bar');
exports.cartesianSeriesTypes.addType('line');
exports.cartesianSeriesTypes.addType('scatter');
exports.polarSeriesTypes = new PolarSeriesTypes();
exports.polarSeriesTypes.addType('radar');
