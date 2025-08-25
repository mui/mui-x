"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRowSelectionManager = void 0;
var IncludeManager = /** @class */ (function () {
    function IncludeManager(model) {
        this.data = model.ids;
    }
    IncludeManager.prototype.has = function (id) {
        return this.data.has(id);
    };
    IncludeManager.prototype.select = function (id) {
        this.data.add(id);
    };
    IncludeManager.prototype.unselect = function (id) {
        this.data.delete(id);
    };
    return IncludeManager;
}());
var ExcludeManager = /** @class */ (function () {
    function ExcludeManager(model) {
        this.data = model.ids;
    }
    ExcludeManager.prototype.has = function (id) {
        return !this.data.has(id);
    };
    ExcludeManager.prototype.select = function (id) {
        this.data.delete(id);
    };
    ExcludeManager.prototype.unselect = function (id) {
        this.data.add(id);
    };
    return ExcludeManager;
}());
var createRowSelectionManager = function (model) {
    if (model.type === 'include') {
        return new IncludeManager(model);
    }
    return new ExcludeManager(model);
};
exports.createRowSelectionManager = createRowSelectionManager;
