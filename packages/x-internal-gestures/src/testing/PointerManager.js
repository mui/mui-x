"use strict";
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
exports.PointerManager = void 0;
var PointerManager = /** @class */ (function () {
    function PointerManager(mode) {
        this.pointers = new Map();
        this.count = 0;
        this.mode = mode;
        this.clearPointers();
    }
    PointerManager.prototype.clearPointers = function () {
        this.pointers.clear();
        if (this.mode === 'mouse') {
            this.pointers.set(1, {
                id: 1,
                x: NaN,
                y: NaN,
                target: document.body,
            });
        }
    };
    PointerManager.prototype.addPointers = function (pointer) {
        var _this = this;
        if (this.mode === 'mouse') {
            // Mouse mode only allows one pointer
            return;
        }
        if (Array.isArray(pointer)) {
            pointer.forEach(function (p) { return _this.addPointers(p); });
            return;
        }
        if (this.pointers.has(pointer.id)) {
            return;
        }
        this.pointers.set(pointer.id, pointer);
    };
    PointerManager.prototype.removePointers = function (id) {
        var _this = this;
        if (this.mode === 'mouse') {
            // Mouse pointer cannot be removed
            return;
        }
        if (Array.isArray(id)) {
            id.forEach(function (pointerId) { return _this.pointers.delete(pointerId); });
            return;
        }
        this.pointers.delete(id);
    };
    PointerManager.prototype.updatePointers = function (pointer) {
        var _this = this;
        if (Array.isArray(pointer)) {
            return pointer.map(function (p) { return _this.updatePointers(p); });
        }
        var existingPointer = this.pointers.get(pointer.id);
        if (!existingPointer) {
            throw new Error("Pointer with id ".concat(pointer.id, " does not exist"));
        }
        var newPointer = __assign(__assign({}, existingPointer), pointer);
        this.pointers.set(pointer.id, newPointer);
        if (newPointer.target === existingPointer.target) {
            return { pointer: newPointer };
        }
        var oldTarget = existingPointer.target;
        return { oldTarget: oldTarget, pointer: newPointer };
    };
    PointerManager.prototype.nextId = function () {
        this.count += 1;
        return 500 + this.count;
    };
    PointerManager.prototype.parseMousePointer = function (pointer, target) {
        var _a, _b, _c, _d, _e;
        if (this.mode !== 'mouse') {
            throw new Error('Mouse pointer can only be used in mouse mode');
        }
        // Get the existing mouse pointer (always id: 1)
        var existingPointer = this.pointers.get(1);
        var existingX = Number.isNaN(existingPointer === null || existingPointer === void 0 ? void 0 : existingPointer.x) ? undefined : existingPointer === null || existingPointer === void 0 ? void 0 : existingPointer.x;
        var existingY = Number.isNaN(existingPointer === null || existingPointer === void 0 ? void 0 : existingPointer.y) ? undefined : existingPointer === null || existingPointer === void 0 ? void 0 : existingPointer.y;
        var finalTarget = (_a = pointer === null || pointer === void 0 ? void 0 : pointer.target) !== null && _a !== void 0 ? _a : target;
        var targetRect = finalTarget.getBoundingClientRect();
        // Use existing coordinates if available and not being overridden
        var x = (_c = (_b = pointer === null || pointer === void 0 ? void 0 : pointer.x) !== null && _b !== void 0 ? _b : existingX) !== null && _c !== void 0 ? _c : targetRect.left + targetRect.width / 2;
        var y = (_e = (_d = pointer === null || pointer === void 0 ? void 0 : pointer.y) !== null && _d !== void 0 ? _d : existingY) !== null && _e !== void 0 ? _e : targetRect.top + targetRect.height / 2;
        return {
            id: 1,
            x: x,
            y: y,
            target: finalTarget,
        };
    };
    PointerManager.prototype.parsePointers = function (pointers, target, defaultConfig) {
        var _this = this;
        var normalizedPointers = Array.isArray(pointers)
            ? pointers
            : __assign(__assign({}, defaultConfig), pointers);
        if (this.mode === 'mouse') {
            // If the mode is mouse, we only need one pointer
            if ((Array.isArray(normalizedPointers) && normalizedPointers.length > 1) ||
                (!Array.isArray(normalizedPointers) && normalizedPointers.amount !== 1)) {
                throw new Error('Mouse mode only supports one pointer');
            }
        }
        // Normalize pointers to be an array
        var pointersArray = [];
        if (!Array.isArray(normalizedPointers)) {
            var amount_1 = normalizedPointers.amount, pointerDistance_1 = normalizedPointers.distance, ids_1 = normalizedPointers.ids;
            // Get the target element's bounding rect
            var targetRect = target.getBoundingClientRect();
            var centerX_1 = targetRect.left + targetRect.width / 2;
            var centerY_1 = targetRect.top + targetRect.height / 2;
            // Create pointers in a circle around the center of the target
            pointersArray = Array.from({ length: amount_1 }).map(function (_, index) {
                var _a, _b, _c;
                var pointerId = (_a = ids_1 === null || ids_1 === void 0 ? void 0 : ids_1[index]) !== null && _a !== void 0 ? _a : _this.nextId();
                var existingPointer = (ids_1 === null || ids_1 === void 0 ? void 0 : ids_1[index]) ? _this.pointers.get(ids_1[index]) : undefined;
                // Only calculate new positions if no existing position is available
                var angle = (Math.PI * 2 * index) / amount_1;
                var x = (_b = existingPointer === null || existingPointer === void 0 ? void 0 : existingPointer.x) !== null && _b !== void 0 ? _b : centerX_1 + (Math.cos(angle) * pointerDistance_1) / 2;
                var y = (_c = existingPointer === null || existingPointer === void 0 ? void 0 : existingPointer.y) !== null && _c !== void 0 ? _c : centerY_1 + (Math.sin(angle) * pointerDistance_1) / 2;
                return {
                    id: pointerId,
                    x: x,
                    y: y,
                    target: target,
                };
            });
        }
        else {
            var allTargets = new Set(normalizedPointers.map(function (pointer) { var _a; return (_a = pointer.target) !== null && _a !== void 0 ? _a : target; }));
            var targetRectMap_1 = new Map(Array.from(allTargets).map(function (currentTarget) {
                var rect = currentTarget.getBoundingClientRect();
                return [
                    currentTarget,
                    { centerX: rect.left + rect.width / 2, centerY: rect.top + rect.height / 2 },
                ];
            }));
            pointersArray = normalizedPointers.map(function (pointer) {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                var pointerId = (_a = pointer.id) !== null && _a !== void 0 ? _a : _this.nextId();
                var existingPointer = pointer.id ? _this.pointers.get(pointer.id) : undefined;
                return {
                    id: pointerId,
                    target: (_b = pointer.target) !== null && _b !== void 0 ? _b : target,
                    // Use existing coordinates if available and not being overridden
                    x: (_d = (_c = pointer.x) !== null && _c !== void 0 ? _c : existingPointer === null || existingPointer === void 0 ? void 0 : existingPointer.x) !== null && _d !== void 0 ? _d : targetRectMap_1.get((_e = pointer.target) !== null && _e !== void 0 ? _e : target).centerX,
                    y: (_g = (_f = pointer.y) !== null && _f !== void 0 ? _f : existingPointer === null || existingPointer === void 0 ? void 0 : existingPointer.y) !== null && _g !== void 0 ? _g : targetRectMap_1.get((_h = pointer.target) !== null && _h !== void 0 ? _h : target).centerY,
                };
            });
        }
        this.addPointers(pointersArray);
        return pointersArray;
    };
    PointerManager.prototype.pointerEnter = function (pointer) {
        var over = new PointerEvent('pointerover', {
            bubbles: true,
            cancelable: true,
            composed: true,
            clientX: pointer.x,
            clientY: pointer.y,
            pointerId: pointer.id,
            pointerType: this.mode,
        });
        var enter = new PointerEvent('pointerenter', {
            bubbles: false,
            cancelable: false,
            composed: true,
            clientX: pointer.x,
            clientY: pointer.y,
            pointerId: pointer.id,
            pointerType: this.mode,
        });
        pointer.target.dispatchEvent(over);
        pointer.target.dispatchEvent(enter);
    };
    PointerManager.prototype.pointerLeave = function (pointer, oldTarget) {
        var out = new PointerEvent('pointerout', {
            bubbles: true,
            cancelable: true,
            composed: true,
            clientX: pointer.x,
            clientY: pointer.y,
            pointerId: pointer.id,
            pointerType: this.mode,
        });
        var leave = new PointerEvent('pointerleave', {
            bubbles: false,
            cancelable: false,
            composed: true,
            clientX: pointer.x,
            clientY: pointer.y,
            pointerId: pointer.id,
            pointerType: this.mode,
        });
        oldTarget.dispatchEvent(out);
        oldTarget.dispatchEvent(leave);
    };
    PointerManager.prototype.pointerDown = function (pointer) {
        var _a;
        if (((_a = this.pointers.get(pointer.id)) === null || _a === void 0 ? void 0 : _a.isDown) === true) {
            return;
        }
        var change = this.updatePointers(__assign(__assign({}, pointer), { isDown: true }));
        if (change === null || change === void 0 ? void 0 : change.oldTarget) {
            var oldTarget = change.oldTarget, currentPointer = change.pointer;
            this.pointerLeave(currentPointer, oldTarget);
            this.pointerEnter(currentPointer);
        }
        var event = new PointerEvent('pointerdown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            clientX: pointer.x,
            clientY: pointer.y,
            pointerId: pointer.id,
            pointerType: this.mode,
        });
        pointer.target.dispatchEvent(event);
    };
    PointerManager.prototype.pointerMove = function (pointer) {
        var change = this.updatePointers(pointer);
        if (change === null || change === void 0 ? void 0 : change.oldTarget) {
            var oldTarget = change.oldTarget, currentPointer = change.pointer;
            this.pointerLeave(currentPointer, oldTarget);
            this.pointerEnter(currentPointer);
        }
        var event = new PointerEvent('pointermove', {
            bubbles: true,
            cancelable: true,
            composed: true,
            clientX: pointer.x,
            clientY: pointer.y,
            pointerId: pointer.id,
            pointerType: this.mode,
        });
        pointer.target.dispatchEvent(event);
    };
    PointerManager.prototype.pointerUp = function (pointer) {
        // TODO: Only fire if all pointers are up
        var event = new PointerEvent('pointerup', {
            bubbles: true,
            cancelable: true,
            composed: true,
            clientX: pointer.x,
            clientY: pointer.y,
            pointerId: pointer.id,
            pointerType: this.mode,
        });
        if (this.mode === 'mouse') {
            this.updatePointers(__assign(__assign({}, pointer), { isDown: false }));
        }
        else {
            this.removePointers(pointer.id);
        }
        pointer.target.dispatchEvent(event);
    };
    return PointerManager;
}());
exports.PointerManager = PointerManager;
