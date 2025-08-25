"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockedDataTransfer = void 0;
var MockedDataTransfer = /** @class */ (function () {
    function MockedDataTransfer() {
        this.data = {};
        this.dropEffect = 'none';
        this.effectAllowed = 'all';
        this.files = [];
        this.items = [];
        this.types = [];
        this.xOffset = 0;
        this.yOffset = 0;
    }
    MockedDataTransfer.prototype.clearData = function () {
        this.data = {};
    };
    MockedDataTransfer.prototype.getData = function (format) {
        return this.data[format];
    };
    MockedDataTransfer.prototype.setData = function (format, data) {
        this.data[format] = data;
    };
    MockedDataTransfer.prototype.setDragImage = function (img, xOffset, yOffset) {
        this.img = img;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
    };
    return MockedDataTransfer;
}());
exports.MockedDataTransfer = MockedDataTransfer;
