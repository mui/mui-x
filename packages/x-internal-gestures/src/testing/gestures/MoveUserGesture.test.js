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
var context_1 = require("@vitest/browser/context");
var vitest_1 = require("vitest");
var PointerManager_1 = require("../PointerManager");
var MoveUserGesture_1 = require("./MoveUserGesture");
(0, vitest_1.describe)('MoveUserGesture', function () {
    var pointerManager;
    var target;
    var pointerMove;
    (0, vitest_1.beforeEach)(function () {
        target = document.createElement('div');
        target.style.width = '100px';
        target.style.height = '100px';
        document.body.appendChild(target);
        pointerMove = vitest_1.vi.fn();
        target.addEventListener('pointermove', pointerMove);
        pointerManager = new PointerManager_1.PointerManager('mouse');
    });
    (0, vitest_1.afterEach)(function () {
        // Clean up the target element after each test
        if (target && target.parentNode) {
            target.parentNode.removeChild(target);
        }
    });
    (0, vitest_1.it)('should throw an error if no target is provided', function () { return __awaiter(void 0, void 0, void 0, function () {
        var moveGesture;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    moveGesture = function () { return (0, MoveUserGesture_1.move)(pointerManager, {}); };
                    return [4 /*yield*/, (0, vitest_1.expect)(moveGesture).rejects.toThrow('Target element is required for move gesture')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should perform a basic move gesture with default options', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, lastMoveEvent;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = {
                        target: target,
                        distance: 100,
                    };
                    return [4 /*yield*/, (0, MoveUserGesture_1.move)(pointerManager, options)];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(pointerMove).toHaveBeenCalledTimes(10); // Default steps
                    lastMoveEvent = (_a = pointerMove.mock.lastCall) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(lastMoveEvent).toBeInstanceOf(PointerEvent);
                    (0, vitest_1.expect)(lastMoveEvent === null || lastMoveEvent === void 0 ? void 0 : lastMoveEvent.clientX).toBe(150); // 50 (center) + 100 (distance)
                    (0, vitest_1.expect)(lastMoveEvent === null || lastMoveEvent === void 0 ? void 0 : lastMoveEvent.clientY).toBe(50); // center Y unchanged for 0 degree angle
                    (0, vitest_1.expect)(lastMoveEvent === null || lastMoveEvent === void 0 ? void 0 : lastMoveEvent.pointerId).toBe(1); // Mouse pointer always has id 1
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should perform a move gesture with custom steps', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        distance: 100,
                        steps: 5,
                    };
                    return [4 /*yield*/, (0, MoveUserGesture_1.move)(pointerManager, options)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pointerMove).toHaveBeenCalledTimes(5);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should perform a vertical move with 90 degree angle', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, lastMoveEvent;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = {
                        target: target,
                        distance: 100,
                        angle: 90,
                    };
                    return [4 /*yield*/, (0, MoveUserGesture_1.move)(pointerManager, options)];
                case 1:
                    _b.sent();
                    lastMoveEvent = (_a = pointerMove.mock.lastCall) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(lastMoveEvent === null || lastMoveEvent === void 0 ? void 0 : lastMoveEvent.clientX).toBeCloseTo(50); // X unchanged for 90 degree angle
                    (0, vitest_1.expect)(lastMoveEvent === null || lastMoveEvent === void 0 ? void 0 : lastMoveEvent.clientY).toBeCloseTo(150); // 50 (center) + 100 (distance)
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should perform a diagonal move with 45 degree angle', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, lastMoveEvent, isWebkit, expectedDelta;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = {
                        target: target,
                        distance: 100,
                        angle: 45,
                    };
                    return [4 /*yield*/, (0, MoveUserGesture_1.move)(pointerManager, options)];
                case 1:
                    _b.sent();
                    lastMoveEvent = (_a = pointerMove.mock.lastCall) === null || _a === void 0 ? void 0 : _a[0];
                    isWebkit = context_1.server.browser === 'webkit';
                    expectedDelta = 100 / Math.sqrt(2);
                    (0, vitest_1.expect)(lastMoveEvent === null || lastMoveEvent === void 0 ? void 0 : lastMoveEvent.clientX).toBeCloseTo(50 + (isWebkit ? Math.floor(expectedDelta) : expectedDelta));
                    (0, vitest_1.expect)(lastMoveEvent === null || lastMoveEvent === void 0 ? void 0 : lastMoveEvent.clientY).toBeCloseTo(50 + (isWebkit ? Math.floor(expectedDelta) : expectedDelta));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should use custom pointer configuration', function () { return __awaiter(void 0, void 0, void 0, function () {
        var customPointer, options, lastMoveEvent;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    customPointer = {
                        x: 25,
                        y: 25,
                    };
                    options = {
                        target: target,
                        pointer: customPointer,
                        distance: 50,
                    };
                    return [4 /*yield*/, (0, MoveUserGesture_1.move)(pointerManager, options)];
                case 1:
                    _b.sent();
                    lastMoveEvent = (_a = pointerMove.mock.lastCall) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(lastMoveEvent === null || lastMoveEvent === void 0 ? void 0 : lastMoveEvent.clientX).toBe(75); // 25 + 50
                    (0, vitest_1.expect)(lastMoveEvent === null || lastMoveEvent === void 0 ? void 0 : lastMoveEvent.clientY).toBe(25); // Y unchanged for 0 degree angle
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should not move when distance is 0', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        distance: 0,
                    };
                    return [4 /*yield*/, (0, MoveUserGesture_1.move)(pointerManager, options)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pointerMove).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should not move when distance is negative', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        distance: -50,
                    };
                    return [4 /*yield*/, (0, MoveUserGesture_1.move)(pointerManager, options)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pointerMove).not.toHaveBeenCalled();
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
                        distance: 100,
                        duration: 1000,
                        steps: 4,
                    };
                    return [4 /*yield*/, (0, MoveUserGesture_1.move)(pointerManager, options, advanceTimers)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pointerMove).toHaveBeenCalledTimes(4);
                    (0, vitest_1.expect)(advanceTimers).toHaveBeenCalledTimes(3); // steps - 1
                    (0, vitest_1.expect)(advanceTimers).toHaveBeenCalledWith(250); // 1000ms / 4 steps
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should handle different angle values correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
        var testCases, _i, testCases_1, testCase, options, lastMoveEvent, isWebkitIssueAngle;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    testCases = [
                        { angle: 0, expectedX: 150, expectedY: 50 }, // Right
                        { angle: 180, expectedX: -50, expectedY: 50 }, // Left
                        { angle: 270, expectedX: 50, expectedY: -50 }, // Up
                    ];
                    _i = 0, testCases_1 = testCases;
                    _b.label = 1;
                case 1:
                    if (!(_i < testCases_1.length)) return [3 /*break*/, 4];
                    testCase = testCases_1[_i];
                    options = {
                        target: target,
                        distance: 100,
                        angle: testCase.angle,
                    };
                    pointerMove.mockClear();
                    // eslint-disable-next-line no-await-in-loop
                    return [4 /*yield*/, (0, MoveUserGesture_1.move)(new PointerManager_1.PointerManager('mouse'), options)];
                case 2:
                    // eslint-disable-next-line no-await-in-loop
                    _b.sent();
                    lastMoveEvent = (_a = pointerMove.mock.lastCall) === null || _a === void 0 ? void 0 : _a[0];
                    isWebkitIssueAngle = context_1.server.browser === 'webkit' && testCase.angle === 270;
                    (0, vitest_1.expect)(lastMoveEvent === null || lastMoveEvent === void 0 ? void 0 : lastMoveEvent.clientX, "for angle ".concat(testCase.angle)).toBeCloseTo(testCase.expectedX - (isWebkitIssueAngle ? 1 : 0));
                    (0, vitest_1.expect)(lastMoveEvent === null || lastMoveEvent === void 0 ? void 0 : lastMoveEvent.clientY, "for angle ".concat(testCase.angle)).toBeCloseTo(testCase.expectedY);
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }); });
});
