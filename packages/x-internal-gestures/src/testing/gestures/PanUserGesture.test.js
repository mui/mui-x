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
var context_1 = require("@vitest/browser/context");
var vitest_1 = require("vitest");
var PointerManager_1 = require("../PointerManager");
var PanUserGesture_1 = require("./PanUserGesture");
(0, vitest_1.describe)('PanUserGesture', function () {
    var pointerManager;
    var target;
    var down;
    var move;
    var up;
    (0, vitest_1.beforeEach)(function () {
        target = document.createElement('div');
        target.style.width = '100px';
        target.style.height = '100px';
        document.body.appendChild(target);
        down = vitest_1.vi.fn();
        move = vitest_1.vi.fn();
        up = vitest_1.vi.fn();
        target.addEventListener('pointerdown', down);
        target.addEventListener('pointermove', move);
        target.addEventListener('pointerup', up);
        pointerManager = new PointerManager_1.PointerManager('touch');
    });
    (0, vitest_1.afterEach)(function () {
        // Clean up the target element after each test
        if (target && target.parentNode) {
            target.parentNode.removeChild(target);
        }
    });
    (0, vitest_1.it)('should throw an error if no target is provided', function () { return __awaiter(void 0, void 0, void 0, function () {
        var panGesture;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    panGesture = function () { return (0, PanUserGesture_1.pan)(pointerManager, { distance: 50 }); };
                    return [4 /*yield*/, (0, vitest_1.expect)(panGesture).rejects.toThrow('Target element is required for pan gesture')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should perform a pan gesture', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    options = {
                        target: target,
                        distance: 50,
                        duration: 500,
                        steps: 10,
                        angle: 0,
                    };
                    return [4 /*yield*/, (0, PanUserGesture_1.pan)(pointerManager, options)];
                case 1:
                    _g.sent();
                    (0, vitest_1.expect)(down).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(move).toHaveBeenCalledTimes(10);
                    (0, vitest_1.expect)(up).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)((_a = down.mock.lastCall) === null || _a === void 0 ? void 0 : _a[0].x).toBeCloseTo(50);
                    (0, vitest_1.expect)((_b = down.mock.lastCall) === null || _b === void 0 ? void 0 : _b[0].y).toBeCloseTo(50);
                    (0, vitest_1.expect)((_c = move.mock.lastCall) === null || _c === void 0 ? void 0 : _c[0].x).toBeCloseTo(100);
                    (0, vitest_1.expect)((_d = move.mock.lastCall) === null || _d === void 0 ? void 0 : _d[0].y).toBeCloseTo(50);
                    (0, vitest_1.expect)((_e = up.mock.lastCall) === null || _e === void 0 ? void 0 : _e[0].x).toBeCloseTo(100);
                    (0, vitest_1.expect)((_f = up.mock.lastCall) === null || _f === void 0 ? void 0 : _f[0].y).toBeCloseTo(50);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should perform a pan gesture with multiple pointers', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, count;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        pointers: { amount: 2, distance: 50 },
                        distance: 50,
                        duration: 500,
                        steps: 10,
                        angle: 0,
                    };
                    return [4 /*yield*/, (0, PanUserGesture_1.pan)(pointerManager, options)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(down).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(move).toHaveBeenCalledTimes(20);
                    (0, vitest_1.expect)(up).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(down.mock.calls[0][0].x).toBeCloseTo(75);
                    (0, vitest_1.expect)(down.mock.calls[0][0].y).toBeCloseTo(50);
                    (0, vitest_1.expect)(down.mock.calls[1][0].x).toBeCloseTo(25);
                    (0, vitest_1.expect)(down.mock.calls[1][0].y).toBeCloseTo(50);
                    count = move.mock.calls.length;
                    (0, vitest_1.expect)(move.mock.calls[count - 2][0].x).toBeCloseTo(125);
                    (0, vitest_1.expect)(move.mock.calls[count - 2][0].y).toBeCloseTo(50);
                    (0, vitest_1.expect)(move.mock.calls[count - 1][0].x).toBeCloseTo(75);
                    (0, vitest_1.expect)(move.mock.calls[count - 1][0].y).toBeCloseTo(50);
                    (0, vitest_1.expect)(up.mock.calls[0][0].x).toBeCloseTo(125);
                    (0, vitest_1.expect)(up.mock.calls[0][0].y).toBeCloseTo(50);
                    (0, vitest_1.expect)(up.mock.calls[1][0].x).toBeCloseTo(75);
                    (0, vitest_1.expect)(up.mock.calls[1][0].y).toBeCloseTo(50);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should perform a pan gesture with a custom angle', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, isWebkit;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    options = {
                        target: target,
                        distance: 50,
                        duration: 500,
                        steps: 10,
                        angle: 45,
                    };
                    return [4 /*yield*/, (0, PanUserGesture_1.pan)(pointerManager, options)];
                case 1:
                    _g.sent();
                    (0, vitest_1.expect)(down).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(move).toHaveBeenCalledTimes(10);
                    (0, vitest_1.expect)(up).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)((_a = down.mock.lastCall) === null || _a === void 0 ? void 0 : _a[0].x).toBeCloseTo(50);
                    (0, vitest_1.expect)((_b = down.mock.lastCall) === null || _b === void 0 ? void 0 : _b[0].y).toBeCloseTo(50);
                    isWebkit = context_1.server.browser === 'webkit';
                    (0, vitest_1.expect)((_c = move.mock.lastCall) === null || _c === void 0 ? void 0 : _c[0].x).toBeCloseTo(isWebkit ? 85 : 85.36);
                    (0, vitest_1.expect)((_d = move.mock.lastCall) === null || _d === void 0 ? void 0 : _d[0].y).toBeCloseTo(isWebkit ? 85 : 85.36);
                    (0, vitest_1.expect)((_e = up.mock.lastCall) === null || _e === void 0 ? void 0 : _e[0].x).toBeCloseTo(isWebkit ? 85 : 85.36);
                    (0, vitest_1.expect)((_f = up.mock.lastCall) === null || _f === void 0 ? void 0 : _f[0].y).toBeCloseTo(isWebkit ? 85 : 85.36);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should perform a pan gesture using a custom starting point', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    options = {
                        target: target,
                        pointers: [{ id: 2, x: 200, y: 200 }],
                        distance: 50,
                        duration: 500,
                        steps: 10,
                        angle: 0,
                    };
                    return [4 /*yield*/, (0, PanUserGesture_1.pan)(pointerManager, options)];
                case 1:
                    _g.sent();
                    (0, vitest_1.expect)(down).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(move).toHaveBeenCalledTimes(10);
                    (0, vitest_1.expect)(up).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)((_a = down.mock.lastCall) === null || _a === void 0 ? void 0 : _a[0].x).toBeCloseTo(200);
                    (0, vitest_1.expect)((_b = down.mock.lastCall) === null || _b === void 0 ? void 0 : _b[0].y).toBeCloseTo(200);
                    (0, vitest_1.expect)((_c = move.mock.lastCall) === null || _c === void 0 ? void 0 : _c[0].x).toBeCloseTo(250);
                    (0, vitest_1.expect)((_d = move.mock.lastCall) === null || _d === void 0 ? void 0 : _d[0].y).toBeCloseTo(200);
                    (0, vitest_1.expect)((_e = up.mock.lastCall) === null || _e === void 0 ? void 0 : _e[0].x).toBeCloseTo(250);
                    (0, vitest_1.expect)((_f = up.mock.lastCall) === null || _f === void 0 ? void 0 : _f[0].y).toBeCloseTo(200);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should not release pointers if releasePointers is false', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        distance: 50,
                        duration: 500,
                        steps: 10,
                        angle: 0,
                        releasePointers: false,
                    };
                    return [4 /*yield*/, (0, PanUserGesture_1.pan)(pointerManager, options)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(down).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(move).toHaveBeenCalledTimes(10);
                    (0, vitest_1.expect)(up).toHaveBeenCalledTimes(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should not fire a down event if the pointer is already down', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        pointers: {
                            ids: [20],
                        },
                        distance: 50,
                        duration: 500,
                        steps: 10,
                        angle: 0,
                    };
                    return [4 /*yield*/, (0, PanUserGesture_1.pan)(pointerManager, __assign(__assign({}, options), { releasePointers: false }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, PanUserGesture_1.pan)(pointerManager, options)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(down).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(move).toHaveBeenCalledTimes(20);
                    (0, vitest_1.expect)(up).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should only release specific pointers when releasePointers is an array of IDs', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        pointers: [
                            { id: 10, x: 50, y: 50 },
                            { id: 20, x: 150, y: 50 },
                            { id: 30, x: 250, y: 50 },
                        ],
                        distance: 50,
                        duration: 500,
                        steps: 10,
                        angle: 0,
                        releasePointers: [10, 30], // Only release pointers with IDs 10 and 30
                    };
                    return [4 /*yield*/, (0, PanUserGesture_1.pan)(pointerManager, options)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(down).toHaveBeenCalledTimes(3); // 3 pointers down
                    (0, vitest_1.expect)(move).toHaveBeenCalledTimes(30); // 3 pointers * 10 steps
                    (0, vitest_1.expect)(up).toHaveBeenCalledTimes(2); // Only 2 pointers released (IDs 10 and 30)
                    // Verify that pointer ID 20 is still down by performing another pan without a down event
                    return [4 /*yield*/, (0, PanUserGesture_1.pan)(pointerManager, {
                            target: target,
                            pointers: [{ id: 20, x: 200, y: 50 }], // Continue from the final position of pointer 20
                            distance: 30,
                            duration: 300,
                            steps: 5,
                            angle: 0,
                        })];
                case 2:
                    // Verify that pointer ID 20 is still down by performing another pan without a down event
                    _a.sent();
                    (0, vitest_1.expect)(down).toHaveBeenCalledTimes(3); // No new down events
                    (0, vitest_1.expect)(move).toHaveBeenCalledTimes(35); // 30 previous + 5 new moves
                    (0, vitest_1.expect)(up).toHaveBeenCalledTimes(3); // The remaining pointer is now released
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
                        distance: 50,
                        duration: 500,
                        steps: 10,
                        angle: 0,
                    };
                    return [4 /*yield*/, (0, PanUserGesture_1.pan)(pointerManager, options, advanceTimers)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(advanceTimers).toHaveBeenCalledTimes(9);
                    (0, vitest_1.expect)(advanceTimers).toHaveBeenCalledWith(50);
                    return [2 /*return*/];
            }
        });
    }); });
});
