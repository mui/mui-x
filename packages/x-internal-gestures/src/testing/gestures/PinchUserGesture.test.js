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
var PinchUserGesture_1 = require("./PinchUserGesture");
(0, vitest_1.describe)('PinchUserGesture', function () {
    var pointerManager;
    var target;
    var pointerDown;
    var pointerMove;
    var pointerUp;
    (0, vitest_1.beforeEach)(function () {
        target = document.createElement('div');
        target.style.width = '100px';
        target.style.height = '100px';
        document.body.appendChild(target);
        pointerDown = vitest_1.vi.fn();
        pointerMove = vitest_1.vi.fn();
        pointerUp = vitest_1.vi.fn();
        target.addEventListener('pointerdown', pointerDown);
        target.addEventListener('pointermove', pointerMove);
        target.addEventListener('pointerup', pointerUp);
        pointerManager = new PointerManager_1.PointerManager('touch');
    });
    (0, vitest_1.afterEach)(function () {
        // Clean up the target element after each test
        if (target && target.parentNode) {
            target.parentNode.removeChild(target);
        }
    });
    (0, vitest_1.it)('should throw an error if no target is provided', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pinchGesture;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pinchGesture = function () { return (0, PinchUserGesture_1.pinch)(pointerManager, {}); };
                    return [4 /*yield*/, (0, vitest_1.expect)(pinchGesture).rejects.toThrow('Target element is required for pinch gesture')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should throw an error if less than 2 pointers are available', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, pinchGesture;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        distance: 100,
                        pointers: { amount: 1, distance: 0 },
                    };
                    pinchGesture = function () { return (0, PinchUserGesture_1.pinch)(pointerManager, options); };
                    return [4 /*yield*/, (0, vitest_1.expect)(pinchGesture).rejects.toThrow('Pinch gesture requires at least 2 pointers')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should not perform any movement when distance is 0', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        distance: 0,
                        pointers: { amount: 2, distance: 50 },
                    };
                    return [4 /*yield*/, (0, PinchUserGesture_1.pinch)(pointerManager, options)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pointerDown).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(pointerMove).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(pointerUp).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should perform a basic pinch out gesture with default options', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, firstDownCall, secondDownCall, lastMoveFirstPointer, lastMoveSecondPointer, initialDistance, finalDistance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        distance: 100,
                    };
                    return [4 /*yield*/, (0, PinchUserGesture_1.pinch)(pointerManager, options)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pointerDown).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(pointerMove).toHaveBeenCalledTimes(20); // 2 pointers * 10 steps
                    (0, vitest_1.expect)(pointerUp).toHaveBeenCalledTimes(2);
                    firstDownCall = pointerDown.mock.calls[0][0];
                    secondDownCall = pointerDown.mock.calls[1][0];
                    (0, vitest_1.expect)(firstDownCall.clientX).toBeGreaterThan(0);
                    (0, vitest_1.expect)(secondDownCall.clientX).toBeGreaterThan(0);
                    lastMoveFirstPointer = pointerMove.mock.calls
                        .filter(function (call) { return call[0].pointerId === firstDownCall.pointerId; })
                        .at(-1);
                    lastMoveSecondPointer = pointerMove.mock.calls
                        .filter(function (call) { return call[0].pointerId === secondDownCall.pointerId; })
                        .at(-1);
                    initialDistance = Math.sqrt(Math.pow((firstDownCall.clientX - secondDownCall.clientX), 2) +
                        Math.pow((firstDownCall.clientY - secondDownCall.clientY), 2));
                    finalDistance = Math.sqrt(Math.pow((lastMoveFirstPointer[0].clientX - lastMoveSecondPointer[0].clientX), 2) +
                        Math.pow((lastMoveFirstPointer[0].clientY - lastMoveSecondPointer[0].clientY), 2));
                    // Final distance should be greater than initial for pinch out
                    (0, vitest_1.expect)(finalDistance).toBeGreaterThan(initialDistance);
                    // The difference should be approximately the distance specified
                    (0, vitest_1.expect)(finalDistance - initialDistance).toBeCloseTo(100);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should perform a pinch in gesture with negative distance', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, firstDownCall, secondDownCall, lastMoveFirstPointer, lastMoveSecondPointer, initialDistance, finalDistance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        distance: -50,
                    };
                    return [4 /*yield*/, (0, PinchUserGesture_1.pinch)(pointerManager, options)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pointerDown).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(pointerMove).toHaveBeenCalledTimes(20); // 2 pointers * 10 steps
                    (0, vitest_1.expect)(pointerUp).toHaveBeenCalledTimes(2);
                    firstDownCall = pointerDown.mock.calls[0][0];
                    secondDownCall = pointerDown.mock.calls[1][0];
                    lastMoveFirstPointer = pointerMove.mock.calls
                        .filter(function (call) { return call[0].pointerId === firstDownCall.pointerId; })
                        .at(-1);
                    lastMoveSecondPointer = pointerMove.mock.calls
                        .filter(function (call) { return call[0].pointerId === secondDownCall.pointerId; })
                        .at(-1);
                    initialDistance = Math.sqrt(Math.pow((firstDownCall.clientX - secondDownCall.clientX), 2) +
                        Math.pow((firstDownCall.clientY - secondDownCall.clientY), 2));
                    finalDistance = Math.sqrt(Math.pow((lastMoveFirstPointer[0].clientX - lastMoveSecondPointer[0].clientX), 2) +
                        Math.pow((lastMoveFirstPointer[0].clientY - lastMoveSecondPointer[0].clientY), 2));
                    // Final distance should be less than initial for pinch in
                    (0, vitest_1.expect)(finalDistance).toBeLessThan(initialDistance);
                    // The difference should be approximately the absolute distance specified
                    (0, vitest_1.expect)(initialDistance - finalDistance).toBeCloseTo(50);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should work with custom steps option', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        distance: 100,
                        steps: 5,
                    };
                    return [4 /*yield*/, (0, PinchUserGesture_1.pinch)(pointerManager, options)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pointerDown).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(pointerMove).toHaveBeenCalledTimes(10); // 2 pointers * 5 steps
                    (0, vitest_1.expect)(pointerUp).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should perform a diagonal pinch with angle parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, firstDownCall, firstPointerMoves, firstPointerStart, firstPointerEnd, deltaX, deltaY, angle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        distance: 100,
                        angle: 45,
                    };
                    return [4 /*yield*/, (0, PinchUserGesture_1.pinch)(pointerManager, options)];
                case 1:
                    _a.sent();
                    firstDownCall = pointerDown.mock.calls[0][0];
                    firstPointerMoves = pointerMove.mock.calls.filter(function (call) { return call[0].pointerId === firstDownCall.pointerId; });
                    firstPointerStart = firstDownCall;
                    firstPointerEnd = firstPointerMoves[firstPointerMoves.length - 1][0];
                    deltaX = firstPointerEnd.clientX - firstPointerStart.clientX;
                    deltaY = firstPointerEnd.clientY - firstPointerStart.clientY;
                    angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                    // Should be close to 45 degrees (or the equivalent angle in the coordinate system)
                    (0, vitest_1.expect)(Math.abs(angle) % 180).toBeCloseTo(45, 0); // Allow some small precision error
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
                        distance: 100,
                        releasePointers: false,
                    };
                    return [4 /*yield*/, (0, PinchUserGesture_1.pinch)(pointerManager, options)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pointerDown).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(pointerMove).toHaveBeenCalledTimes(20); // 2 pointers * 10 steps
                    (0, vitest_1.expect)(pointerUp).not.toHaveBeenCalled(); // No pointers should be released
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should release only specific pointers when releasePointers is an array', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        distance: 100,
                        pointers: [
                            { id: 501, x: 30, y: 50 },
                            { id: 502, x: 70, y: 50 },
                        ],
                        releasePointers: [501], // Only release the first pointer
                    };
                    return [4 /*yield*/, (0, PinchUserGesture_1.pinch)(pointerManager, options)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pointerDown).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(pointerMove).toHaveBeenCalledTimes(20); // 2 pointers * 10 steps
                    (0, vitest_1.expect)(pointerUp).toHaveBeenCalledTimes(1); // Only one pointer should be released
                    // Ensure the released pointer has the expected ID
                    (0, vitest_1.expect)(pointerUp.mock.calls[0][0].pointerId).toBe(501);
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
                    return [4 /*yield*/, (0, PinchUserGesture_1.pinch)(pointerManager, options, advanceTimers)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pointerDown).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(pointerMove).toHaveBeenCalledTimes(8); // 2 pointers * 4 steps
                    (0, vitest_1.expect)(pointerUp).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(advanceTimers).toHaveBeenCalledTimes(3); // Called (steps - 1) times
                    (0, vitest_1.expect)(advanceTimers).toHaveBeenCalledWith(250); // 1000ms / 4 steps
                    return [2 /*return*/];
            }
        });
    }); });
});
