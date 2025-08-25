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
var RotateUserGesture_1 = require("./RotateUserGesture");
(0, vitest_1.describe)('RotateUserGesture', function () {
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
        var rotateGesture;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rotateGesture = function () { return (0, RotateUserGesture_1.rotate)(pointerManager, {}); };
                    return [4 /*yield*/, (0, vitest_1.expect)(rotateGesture).rejects.toThrow('Target element is required for rotate gesture')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should throw an error if less than 2 pointers are available', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, rotateGesture;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        pointers: { amount: 1, distance: 0 },
                    };
                    rotateGesture = function () { return (0, RotateUserGesture_1.rotate)(pointerManager, options); };
                    return [4 /*yield*/, (0, vitest_1.expect)(rotateGesture).rejects.toThrow('Rotate gesture requires at least 2 pointers')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should perform a basic rotation with default options', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, firstDownCall, secondDownCall, lastMoveFirstPointer, lastMoveSecondPointer, initialDistance, finalDistance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                    };
                    return [4 /*yield*/, (0, RotateUserGesture_1.rotate)(pointerManager, options)];
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
                        .at(-1)[0];
                    lastMoveSecondPointer = pointerMove.mock.calls
                        .filter(function (call) { return call[0].pointerId === secondDownCall.pointerId; })
                        .at(-1)[0];
                    initialDistance = Math.sqrt(Math.pow((firstDownCall.clientX - secondDownCall.clientX), 2) +
                        Math.pow((firstDownCall.clientY - secondDownCall.clientY), 2));
                    finalDistance = Math.sqrt(Math.pow((lastMoveFirstPointer.clientX - lastMoveSecondPointer.clientX), 2) +
                        Math.pow((lastMoveFirstPointer.clientY - lastMoveSecondPointer.clientY), 2));
                    // Distance should be roughly maintained during rotation
                    (0, vitest_1.expect)(finalDistance).toBeCloseTo(initialDistance, 1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should respect custom rotation angle', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, firstDownCall, lastMoveFirstPointer, displacement;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        rotationAngle: 180,
                    };
                    return [4 /*yield*/, (0, RotateUserGesture_1.rotate)(pointerManager, options)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pointerMove).toHaveBeenCalledTimes(20); // 2 pointers * 10 steps
                    firstDownCall = pointerDown.mock.calls[0][0];
                    lastMoveFirstPointer = pointerMove.mock.calls
                        .filter(function (call) { return call[0].pointerId === firstDownCall.pointerId; })
                        .at(-1)[0];
                    displacement = Math.sqrt(Math.pow((lastMoveFirstPointer.clientX - firstDownCall.clientX), 2) +
                        Math.pow((lastMoveFirstPointer.clientY - firstDownCall.clientY), 2));
                    (0, vitest_1.expect)(displacement).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should perform rotation with custom pointers configuration', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, uniquePositions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        pointers: { amount: 3, distance: 80 },
                        rotationAngle: 45,
                    };
                    return [4 /*yield*/, (0, RotateUserGesture_1.rotate)(pointerManager, options)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pointerDown).toHaveBeenCalledTimes(3);
                    (0, vitest_1.expect)(pointerUp).toHaveBeenCalledTimes(3);
                    uniquePositions = new Set(pointerDown.mock.calls.map(function (call) { return "".concat(Math.round(call[0].clientX), ",").concat(Math.round(call[0].clientY)); }));
                    (0, vitest_1.expect)(uniquePositions.size).toBe(3);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should use custom rotation center', function () { return __awaiter(void 0, void 0, void 0, function () {
        var center, options, finalPositions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    center = {
                        x: 75,
                        y: 75,
                    };
                    options = {
                        target: target,
                        rotationCenter: center,
                    };
                    return [4 /*yield*/, (0, RotateUserGesture_1.rotate)(pointerManager, options)];
                case 1:
                    _a.sent();
                    finalPositions = pointerUp.mock.calls.map(function (call) { return ({
                        x: call[0].clientX,
                        y: call[0].clientY,
                    }); });
                    finalPositions.forEach(function (position) {
                        var distanceToCenter = Math.sqrt(Math.pow((position.x - center.x), 2) + Math.pow((position.y - center.y), 2));
                        // The distance should be greater than 0 (not the center itself)
                        (0, vitest_1.expect)(distanceToCenter).toBeGreaterThan(0);
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should respect custom steps and duration', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, advanceTimers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        target: target,
                        steps: 5,
                        duration: 1000,
                    };
                    advanceTimers = vitest_1.vi.fn().mockResolvedValue(undefined);
                    return [4 /*yield*/, (0, RotateUserGesture_1.rotate)(pointerManager, options, advanceTimers)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pointerMove).toHaveBeenCalledTimes(10); // 2 pointers * 5 steps
                    (0, vitest_1.expect)(advanceTimers).toHaveBeenCalledTimes(4); // steps - 1
                    (0, vitest_1.expect)(advanceTimers).toHaveBeenCalledWith(200); // 1000ms / 5 steps
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should support selective pointer release', function () { return __awaiter(void 0, void 0, void 0, function () {
        var idP1, idP2, idP3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    idP1 = 501;
                    idP2 = 502;
                    return [4 /*yield*/, (0, RotateUserGesture_1.rotate)(pointerManager, {
                            target: target,
                            pointers: { ids: [idP1, idP2] },
                            releasePointers: [idP1],
                        })];
                case 1:
                    _a.sent();
                    // Only one pointer should be released
                    (0, vitest_1.expect)(pointerUp).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(pointerUp.mock.calls[0][0].pointerId).toBe(idP1);
                    idP3 = 503;
                    return [4 /*yield*/, (0, RotateUserGesture_1.rotate)(pointerManager, {
                            target: target,
                            pointers: { ids: [idP2, idP3] },
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(pointerUp).toHaveBeenCalledTimes(3);
                    (0, vitest_1.expect)(pointerUp.mock.calls[0][0].pointerId).toBe(idP1);
                    (0, vitest_1.expect)(pointerUp.mock.calls[1][0].pointerId).toBe(idP2);
                    (0, vitest_1.expect)(pointerUp.mock.calls[2][0].pointerId).toBe(idP3);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should support no pointer release', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, RotateUserGesture_1.rotate)(pointerManager, {
                        target: target,
                        releasePointers: false,
                    })];
                case 1:
                    _a.sent();
                    // No pointers should be released
                    (0, vitest_1.expect)(pointerUp).not.toHaveBeenCalled();
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
                        duration: 500,
                        steps: 5,
                    };
                    return [4 /*yield*/, (0, RotateUserGesture_1.rotate)(pointerManager, options, advanceTimers)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pointerDown).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(pointerMove).toHaveBeenCalledTimes(10); // 2 pointers * 5 steps
                    (0, vitest_1.expect)(pointerUp).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(advanceTimers).toHaveBeenCalledTimes(4); // steps - 1
                    (0, vitest_1.expect)(advanceTimers).toHaveBeenCalledWith(100); // 500ms / 5 steps
                    return [2 /*return*/];
            }
        });
    }); });
});
