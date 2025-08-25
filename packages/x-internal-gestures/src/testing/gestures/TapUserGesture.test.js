"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var PointerManager_1 = require("../PointerManager");
var TapUserGesture_1 = require("./TapUserGesture");
(0, vitest_1.describe)('TapUserGesture', function () {
    var pointerManager;
    var touchPointerManager;
    var target;
    var pointerDown;
    var pointerUp;
    (0, vitest_1.beforeEach)(function () {
        target = document.createElement('div');
        target.style.width = '100px';
        target.style.height = '100px';
        document.body.appendChild(target);
        pointerDown = vitest_1.vi.fn();
        pointerUp = vitest_1.vi.fn();
        target.addEventListener('pointerdown', pointerDown);
        target.addEventListener('pointerup', pointerUp);
        pointerManager = new PointerManager_1.PointerManager('mouse');
        touchPointerManager = new PointerManager_1.PointerManager('touch');
    });
    (0, vitest_1.afterEach)(function () {
        // Clean up the target element after each test
        if (target && target.parentNode) {
            target.parentNode.removeChild(target);
        }
    });
    (0, vitest_1.it)('should throw an error if no target is provided', function () { return __awaiter(void 0, void 0, void 0, function () {
        var tapGesture;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tapGesture = function () { return (0, TapUserGesture_1.tap)(pointerManager, {}); };
                    return [4 /*yield*/, (0, vitest_1.expect)(tapGesture).rejects.toThrow('Target element is required for tap gesture')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should perform a basic mouse tap gesture with default options', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, downEvent, upEvent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                    };
                    return [4 /*yield*/, (0, TapUserGesture_1.tap)(pointerManager, options)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pointerDown).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(pointerUp).toHaveBeenCalledTimes(1);
                    downEvent = pointerDown.mock.calls[0][0];
                    upEvent = pointerUp.mock.calls[0][0];
                    (0, vitest_1.expect)(downEvent).toBeInstanceOf(PointerEvent);
                    (0, vitest_1.expect)(upEvent).toBeInstanceOf(PointerEvent);
                    (0, vitest_1.expect)(downEvent.clientX).toBe(50); // Center X
                    (0, vitest_1.expect)(downEvent.clientY).toBe(50); // Center Y
                    (0, vitest_1.expect)(downEvent.pointerId).toBe(1); // Mouse pointer always has id 1
                    (0, vitest_1.expect)(upEvent.pointerId).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should perform a basic touch tap gesture with default options', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, downEvent, upEvent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                    };
                    return [4 /*yield*/, (0, TapUserGesture_1.tap)(touchPointerManager, options)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pointerDown).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(pointerUp).toHaveBeenCalledTimes(1);
                    downEvent = pointerDown.mock.calls[0][0];
                    upEvent = pointerUp.mock.calls[0][0];
                    (0, vitest_1.expect)(downEvent).toBeInstanceOf(PointerEvent);
                    (0, vitest_1.expect)(upEvent).toBeInstanceOf(PointerEvent);
                    (0, vitest_1.expect)(downEvent.clientX).toBe(50); // Center X
                    (0, vitest_1.expect)(downEvent.clientY).toBe(50); // Center Y
                    (0, vitest_1.expect)(downEvent.pointerId).not.toBe(1); // Touch pointers have different IDs
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should perform multiple taps with custom tap count', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        taps: 3,
                    };
                    return [4 /*yield*/, (0, TapUserGesture_1.tap)(pointerManager, options)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pointerDown).toHaveBeenCalledTimes(3);
                    (0, vitest_1.expect)(pointerUp).toHaveBeenCalledTimes(3);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should use custom pointer configuration for mouse', function () { return __awaiter(void 0, void 0, void 0, function () {
        var customPointer, options, downEvent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    customPointer = {
                        x: 25,
                        y: 30,
                    };
                    options = {
                        target: target,
                        pointer: customPointer,
                    };
                    return [4 /*yield*/, (0, TapUserGesture_1.tap)(pointerManager, options)];
                case 1:
                    _a.sent();
                    downEvent = pointerDown.mock.calls[0][0];
                    (0, vitest_1.expect)(downEvent.clientX).toBe(25);
                    (0, vitest_1.expect)(downEvent.clientY).toBe(30);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should use custom pointers configuration for touch', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, downEvents, uniquePositions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        pointers: { amount: 3, distance: 20 },
                    };
                    return [4 /*yield*/, (0, TapUserGesture_1.tap)(touchPointerManager, options)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pointerDown).toHaveBeenCalledTimes(3);
                    (0, vitest_1.expect)(pointerUp).toHaveBeenCalledTimes(3);
                    downEvents = pointerDown.mock.calls.map(function (call) { return call[0]; });
                    uniquePositions = new Set(downEvents.map(function (event) { return "".concat(Math.round(event.clientX), ",").concat(Math.round(event.clientY)); }));
                    (0, vitest_1.expect)(uniquePositions.size).toBeGreaterThan(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should respect custom delay between taps', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, advanceTimers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        taps: 2,
                        delay: 100,
                    };
                    advanceTimers = vitest_1.vi.fn().mockResolvedValue(undefined);
                    return [4 /*yield*/, (0, TapUserGesture_1.tap)(pointerManager, options, advanceTimers)];
                case 1:
                    _a.sent();
                    // Should have 3 calls to advanceTimers:
                    // 1. Short delay between down and up in first tap
                    // 2. Custom delay between first and second tap
                    // 3. Short delay between down and up in second tap
                    (0, vitest_1.expect)(advanceTimers).toHaveBeenCalledTimes(3);
                    (0, vitest_1.expect)(advanceTimers).toHaveBeenNthCalledWith(2, 100);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should work with advanceTimers for test environments', function () { return __awaiter(void 0, void 0, void 0, function () {
        var advanceTimers, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    advanceTimers = vitest_1.vi.fn().mockResolvedValue(undefined);
                    options = {
                        target: target,
                        taps: 1,
                    };
                    return [4 /*yield*/, (0, TapUserGesture_1.tap)(pointerManager, options, advanceTimers)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pointerDown).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(pointerUp).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(advanceTimers).toHaveBeenCalledTimes(1); // Just the down-up interval
                    (0, vitest_1.expect)(advanceTimers).toHaveBeenCalledWith(10); // Default short delay
                    return [2 /*return*/];
            }
        });
    }); });
});
