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
var TurnWheelUserGesture_1 = require("./TurnWheelUserGesture");
(0, vitest_1.describe)('TurnWheelUserGesture', function () {
    var pointerManager;
    var target;
    var wheel;
    (0, vitest_1.beforeEach)(function () {
        target = document.createElement('div');
        target.style.width = '100px';
        target.style.height = '100px';
        document.body.appendChild(target);
        wheel = vitest_1.vi.fn();
        target.addEventListener('wheel', wheel);
        pointerManager = new PointerManager_1.PointerManager('mouse');
    });
    (0, vitest_1.afterEach)(function () {
        // Clean up the target element after each test
        if (target && target.parentNode) {
            target.parentNode.removeChild(target);
        }
    });
    (0, vitest_1.it)('should throw an error if no target is provided', function () { return __awaiter(void 0, void 0, void 0, function () {
        var turnWheelGesture;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    turnWheelGesture = function () { return (0, TurnWheelUserGesture_1.turnWheel)(pointerManager, {}); };
                    return [4 /*yield*/, (0, vitest_1.expect)(turnWheelGesture).rejects.toThrow('Target element is required for turnWheel gesture')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should perform a basic wheel gesture with default options', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, wheelEvent;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = {
                        target: target,
                    };
                    return [4 /*yield*/, (0, TurnWheelUserGesture_1.turnWheel)(pointerManager, options)];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(wheel).toHaveBeenCalledTimes(1);
                    wheelEvent = (_a = wheel.mock.lastCall) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(wheelEvent).toBeInstanceOf(WheelEvent);
                    (0, vitest_1.expect)(wheelEvent === null || wheelEvent === void 0 ? void 0 : wheelEvent.deltaX).toBe(0);
                    (0, vitest_1.expect)(wheelEvent === null || wheelEvent === void 0 ? void 0 : wheelEvent.deltaY).toBe(100);
                    (0, vitest_1.expect)(wheelEvent === null || wheelEvent === void 0 ? void 0 : wheelEvent.deltaZ).toBe(0);
                    (0, vitest_1.expect)(wheelEvent === null || wheelEvent === void 0 ? void 0 : wheelEvent.deltaMode).toBe(0);
                    (0, vitest_1.expect)(wheelEvent === null || wheelEvent === void 0 ? void 0 : wheelEvent.clientX).toBe(50);
                    (0, vitest_1.expect)(wheelEvent === null || wheelEvent === void 0 ? void 0 : wheelEvent.clientY).toBe(50);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should perform a wheel gesture with custom delta values', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, wheelEvent;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = {
                        target: target,
                        deltaX: 50,
                        deltaY: -100,
                        deltaZ: 25,
                        deltaMode: 1,
                    };
                    return [4 /*yield*/, (0, TurnWheelUserGesture_1.turnWheel)(pointerManager, options)];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(wheel).toHaveBeenCalledTimes(1);
                    wheelEvent = (_a = wheel.mock.lastCall) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(wheelEvent === null || wheelEvent === void 0 ? void 0 : wheelEvent.deltaX).toBe(50);
                    (0, vitest_1.expect)(wheelEvent === null || wheelEvent === void 0 ? void 0 : wheelEvent.deltaY).toBe(-100);
                    (0, vitest_1.expect)(wheelEvent === null || wheelEvent === void 0 ? void 0 : wheelEvent.deltaZ).toBe(25);
                    (0, vitest_1.expect)(wheelEvent === null || wheelEvent === void 0 ? void 0 : wheelEvent.deltaMode).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should perform multiple wheel turns with default delay', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, startTime, endTime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        turns: 3,
                    };
                    startTime = Date.now();
                    return [4 /*yield*/, (0, TurnWheelUserGesture_1.turnWheel)(pointerManager, options)];
                case 1:
                    _a.sent();
                    endTime = Date.now();
                    (0, vitest_1.expect)(wheel).toHaveBeenCalledTimes(3);
                    // Should take approximately 100ms (2 delays of 50ms each between 3 turns)
                    (0, vitest_1.expect)(endTime - startTime).toBeGreaterThanOrEqual(95);
                    (0, vitest_1.expect)(endTime - startTime).toBeLessThan(200);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should perform multiple wheel turns with custom delay', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, startTime, endTime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        turns: 2,
                        delay: 100,
                    };
                    startTime = Date.now();
                    return [4 /*yield*/, (0, TurnWheelUserGesture_1.turnWheel)(pointerManager, options)];
                case 1:
                    _a.sent();
                    endTime = Date.now();
                    (0, vitest_1.expect)(wheel).toHaveBeenCalledTimes(2);
                    // Should take approximately 100ms (1 delay of 100ms between 2 turns)
                    (0, vitest_1.expect)(endTime - startTime).toBeGreaterThanOrEqual(95);
                    (0, vitest_1.expect)(endTime - startTime).toBeLessThan(200);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should use custom pointer position', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, wheelEvent;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = {
                        target: target,
                        pointer: { x: 75, y: 25 },
                    };
                    return [4 /*yield*/, (0, TurnWheelUserGesture_1.turnWheel)(pointerManager, options)];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(wheel).toHaveBeenCalledTimes(1);
                    wheelEvent = (_a = wheel.mock.lastCall) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(wheelEvent === null || wheelEvent === void 0 ? void 0 : wheelEvent.clientX).toBe(75);
                    (0, vitest_1.expect)(wheelEvent === null || wheelEvent === void 0 ? void 0 : wheelEvent.clientY).toBe(25);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should use advanceTimers function if provided', function () { return __awaiter(void 0, void 0, void 0, function () {
        var advanceTimers, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    advanceTimers = vitest_1.vi.fn(function (ms) {
                        return new Promise(function (resolve) {
                            setTimeout(resolve, ms);
                        });
                    });
                    options = {
                        target: target,
                        turns: 3,
                        delay: 75,
                    };
                    return [4 /*yield*/, (0, TurnWheelUserGesture_1.turnWheel)(pointerManager, options, advanceTimers)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(wheel).toHaveBeenCalledTimes(3);
                    (0, vitest_1.expect)(advanceTimers).toHaveBeenCalledTimes(2); // n-1 delays for n turns
                    (0, vitest_1.expect)(advanceTimers).toHaveBeenCalledWith(75);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should handle single turn without delay', function () { return __awaiter(void 0, void 0, void 0, function () {
        var advanceTimers, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    advanceTimers = vitest_1.vi.fn();
                    options = {
                        target: target,
                        turns: 1,
                    };
                    return [4 /*yield*/, (0, TurnWheelUserGesture_1.turnWheel)(pointerManager, options, advanceTimers)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(wheel).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(advanceTimers).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
