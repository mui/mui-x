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
var testing_1 = require("../../testing");
var GestureManager_1 = require("../GestureManager");
var TurnWheelGesture_1 = require("./TurnWheelGesture");
(0, vitest_1.describe)('TurnWheel Gesture', function () {
    var container;
    var target;
    var gestureManager;
    var events;
    (0, vitest_1.beforeEach)(function () {
        events = [];
        // Set up DOM
        container = document.createElement('div');
        container.style.width = '200px';
        container.style.height = '200px';
        document.body.appendChild(container);
        // Set up gesture manager
        gestureManager = new GestureManager_1.GestureManager({
            gestures: [
                new TurnWheelGesture_1.TurnWheelGesture({
                    name: 'turnWheel',
                    sensitivity: 1,
                }),
            ],
        });
        // Set up target element
        target = document.createElement('div');
        target.style.width = '100px';
        target.style.height = '100px';
        container.appendChild(target);
        var gestureTarget = gestureManager.registerElement('turnWheel', target);
        // Add event listeners
        gestureTarget.addEventListener('turnWheel', function (event) {
            var detail = event.detail;
            events.push("wheel: deltaX: ".concat(Math.floor(detail.deltaX), " | deltaY: ").concat(Math.floor(detail.deltaY), " | totalDeltaX: ").concat(Math.floor(detail.totalDeltaX), " | totalDeltaY: ").concat(Math.floor(detail.totalDeltaY)));
        });
    });
    (0, vitest_1.afterEach)(function () {
        // Clean up
        document.body.removeChild(container);
        gestureManager.destroy();
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)('should detect vertical wheel events', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_1.mouseGesture.turnWheel({
                        target: target,
                        deltaY: 100,
                        turns: 1,
                    })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(events).toStrictEqual([
                        "wheel: deltaX: 0 | deltaY: 100 | totalDeltaX: 0 | totalDeltaY: 100",
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should detect horizontal wheel events', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_1.mouseGesture.turnWheel({
                        target: target,
                        deltaX: 100,
                        deltaY: 0,
                    })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(events).toStrictEqual([
                        "wheel: deltaX: 100 | deltaY: 0 | totalDeltaX: 100 | totalDeltaY: 0",
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should accumulate total delta across multiple wheel events', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Trigger multiple wheel events
                return [4 /*yield*/, testing_1.mouseGesture.turnWheel({
                        target: target,
                        deltaY: 50,
                    })];
                case 1:
                    // Trigger multiple wheel events
                    _a.sent();
                    return [4 /*yield*/, testing_1.mouseGesture.turnWheel({
                            target: target,
                            deltaY: 50,
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(events).toStrictEqual([
                        "wheel: deltaX: 0 | deltaY: 50 | totalDeltaX: 0 | totalDeltaY: 50",
                        "wheel: deltaX: 0 | deltaY: 50 | totalDeltaX: 0 | totalDeltaY: 100",
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should apply sensitivity to wheel deltas', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gestureManager.setGestureOptions('turnWheel', target, {
                        sensitivity: 2, // Double the sensitivity
                    });
                    // Trigger a wheel event
                    return [4 /*yield*/, testing_1.mouseGesture.turnWheel({
                            target: target,
                            deltaY: 50,
                        })];
                case 1:
                    // Trigger a wheel event
                    _a.sent();
                    (0, vitest_1.expect)(events).toStrictEqual([
                        "wheel: deltaX: 0 | deltaY: 100 | totalDeltaX: 0 | totalDeltaY: 100",
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should respect min and max limits for total deltas', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gestureManager.setGestureOptions('turnWheel', target, {
                        min: -100,
                        max: 100,
                    });
                    // Trigger wheel events
                    return [4 /*yield*/, testing_1.mouseGesture.turnWheel({
                            target: target,
                            deltaY: 50,
                        })];
                case 1:
                    // Trigger wheel events
                    _a.sent();
                    return [4 /*yield*/, testing_1.mouseGesture.turnWheel({
                            target: target,
                            deltaY: 1000, // This should hit the max limit
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(events).toStrictEqual([
                        "wheel: deltaX: 0 | deltaY: 50 | totalDeltaX: 0 | totalDeltaY: 50",
                        "wheel: deltaX: 0 | deltaY: 1000 | totalDeltaX: 0 | totalDeltaY: 100",
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should update options', function () {
        (0, vitest_1.expect)(TurnWheelGesture_1.TurnWheelGesture).toUpdateOptions({
            preventDefault: true,
            stopPropagation: true,
            preventIf: [],
            sensitivity: 2,
            max: 1000,
            min: -1000,
            initialDelta: 50,
            invert: true,
        });
    });
    (0, vitest_1.it)('should update state', function () {
        (0, vitest_1.expect)(TurnWheelGesture_1.TurnWheelGesture).toUpdateState({
            totalDeltaX: 10,
        });
    });
    (0, vitest_1.it)('should properly clone', function () {
        (0, vitest_1.expect)(TurnWheelGesture_1.TurnWheelGesture).toBeClonable({
            max: 1000,
            min: -1000,
        });
    });
});
