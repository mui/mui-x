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
var testing_1 = require("../../testing");
var GestureManager_1 = require("../GestureManager");
var PanGesture_1 = require("./PanGesture");
(0, vitest_1.describe)('Pan Gesture', function () {
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
                new PanGesture_1.PanGesture({
                    name: 'pan',
                    threshold: 0,
                }),
            ],
        });
        // Set up target element
        target = document.createElement('div');
        target.style.width = '100px';
        target.style.height = '100px';
        container.appendChild(target);
        var gestureTarget = gestureManager.registerElement('pan', target);
        // Add event listeners
        gestureTarget.addEventListener('panStart', function (event) {
            var detail = event.detail;
            events.push("panStart: deltaX: ".concat(Math.floor(detail.totalDeltaX), " | deltaY: ").concat(Math.floor(detail.totalDeltaY), " | direction: ").concat([detail.direction.horizontal, detail.direction.vertical].filter(Boolean).join(' ') || null, " | mainAxis: ").concat(detail.direction.mainAxis));
        });
        gestureTarget.addEventListener('pan', function (event) {
            var detail = event.detail;
            events.push("pan: deltaX: ".concat(Math.floor(detail.totalDeltaX), " | deltaY: ").concat(Math.floor(detail.totalDeltaY), " | direction: ").concat([detail.direction.horizontal, detail.direction.vertical].filter(Boolean).join(' ') || null, " | mainAxis: ").concat(detail.direction.mainAxis));
        });
        gestureTarget.addEventListener('panEnd', function (event) {
            var detail = event.detail;
            events.push("panEnd: deltaX: ".concat(Math.floor(detail.totalDeltaX), " | deltaY: ").concat(Math.floor(detail.totalDeltaY), " | direction: ").concat([detail.direction.horizontal, detail.direction.vertical].filter(Boolean).join(' ') || null, " | mainAxis: ").concat(detail.direction.mainAxis));
        });
    });
    (0, vitest_1.afterEach)(function () {
        // Clean up
        document.body.removeChild(container);
        gestureManager.destroy();
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)('should detect horizontal pan gesture', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_1.touchGesture.pan({
                        target: target,
                        angle: 0, // Horizontal pan (right)
                        distance: 50,
                        steps: 2,
                    })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(events).toStrictEqual([
                        "panStart: deltaX: 25 | deltaY: 0 | direction: null | mainAxis: null",
                        "pan: deltaX: 25 | deltaY: 0 | direction: null | mainAxis: null",
                        "pan: deltaX: 50 | deltaY: 0 | direction: right | mainAxis: horizontal",
                        "panEnd: deltaX: 50 | deltaY: 0 | direction: right | mainAxis: horizontal",
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should detect vertical pan gesture', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_1.touchGesture.pan({
                        target: target,
                        angle: 90, // Vertical pan (down)
                        distance: 50,
                        steps: 2,
                    })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(events).toStrictEqual([
                        "panStart: deltaX: 0 | deltaY: 25 | direction: null | mainAxis: null",
                        "pan: deltaX: 0 | deltaY: 25 | direction: null | mainAxis: null",
                        "pan: deltaX: 0 | deltaY: 50 | direction: down | mainAxis: vertical",
                        "panEnd: deltaX: 0 | deltaY: 50 | direction: down | mainAxis: vertical",
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should correctly handle diagonal pan gesture', function () { return __awaiter(void 0, void 0, void 0, function () {
        var isWebkit;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_1.touchGesture.pan({
                        target: target,
                        angle: -135, // Diagonal pan (up-left)
                        distance: 50,
                        steps: 2,
                    })];
                case 1:
                    _a.sent();
                    isWebkit = context_1.server.browser === 'webkit';
                    (0, vitest_1.expect)(events).toStrictEqual(isWebkit
                        ? [
                            "panStart: deltaX: -18 | deltaY: -18 | direction: null | mainAxis: null",
                            "pan: deltaX: -18 | deltaY: -18 | direction: null | mainAxis: null",
                            "pan: deltaX: -36 | deltaY: -36 | direction: left up | mainAxis: diagonal",
                            "panEnd: deltaX: -36 | deltaY: -36 | direction: left up | mainAxis: diagonal",
                        ]
                        : [
                            "panStart: deltaX: -18 | deltaY: -18 | direction: null | mainAxis: null",
                            "pan: deltaX: -18 | deltaY: -18 | direction: null | mainAxis: null",
                            "pan: deltaX: -36 | deltaY: -36 | direction: left up | mainAxis: diagonal",
                            "panEnd: deltaX: -36 | deltaY: -36 | direction: left up | mainAxis: diagonal",
                        ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should properly change direction if the gesture changes', function () { return __awaiter(void 0, void 0, void 0, function () {
        var gesture, isWebkit;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gesture = testing_1.touchGesture.setup();
                    return [4 /*yield*/, gesture.pan({
                            target: target,
                            pointers: { ids: [50] },
                            angle: 0, // Start with horizontal pan (right)
                            distance: 50,
                            steps: 2,
                            releasePointers: false,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(events).toStrictEqual([
                        "panStart: deltaX: 25 | deltaY: 0 | direction: null | mainAxis: null",
                        "pan: deltaX: 25 | deltaY: 0 | direction: null | mainAxis: null",
                        "pan: deltaX: 50 | deltaY: 0 | direction: right | mainAxis: horizontal",
                    ]);
                    events = []; // Clear events for next test
                    return [4 /*yield*/, gesture.pan({
                            target: target,
                            pointers: { ids: [50] },
                            angle: 90, // Change to vertical pan (down)
                            distance: 50,
                            steps: 2,
                            releasePointers: false,
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(events).toStrictEqual([
                        "pan: deltaX: 50 | deltaY: 25 | direction: right | mainAxis: horizontal",
                        "pan: deltaX: 50 | deltaY: 50 | direction: down | mainAxis: vertical",
                    ]);
                    events = []; // Clear events for next test
                    return [4 /*yield*/, gesture.pan({
                            target: target,
                            pointers: { ids: [50] },
                            angle: -166, // Change to diagonal pan (up-left)
                            distance: 50,
                            steps: 2,
                            releasePointers: true,
                        })];
                case 3:
                    _a.sent();
                    isWebkit = context_1.server.browser === 'webkit';
                    (0, vitest_1.expect)(events).toStrictEqual(isWebkit
                        ? [
                            "pan: deltaX: 25 | deltaY: 43 | direction: down | mainAxis: vertical",
                            "pan: deltaX: 1 | deltaY: 37 | direction: left up | mainAxis: horizontal",
                            "panEnd: deltaX: 1 | deltaY: 37 | direction: left up | mainAxis: horizontal",
                        ]
                        : [
                            "pan: deltaX: 25 | deltaY: 43 | direction: down | mainAxis: vertical",
                            "pan: deltaX: 1 | deltaY: 37 | direction: left up | mainAxis: horizontal",
                            "panEnd: deltaX: 1 | deltaY: 37 | direction: left up | mainAxis: horizontal",
                        ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should respect direction constraints', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gestureManager.setGestureOptions('pan', target, {
                        direction: ['left', 'right'], // Only allow horizontal panning
                    });
                    // Test vertical pan (should not trigger events due to direction constraint)
                    return [4 /*yield*/, testing_1.touchGesture.pan({
                            target: target,
                            angle: 90, // Vertical pan (down)
                            distance: 50,
                            steps: 3,
                        })];
                case 1:
                    // Test vertical pan (should not trigger events due to direction constraint)
                    _a.sent();
                    // Verify no events for vertical pan
                    (0, vitest_1.expect)(events.length).toBe(0);
                    // Test horizontal pan (should trigger events)
                    return [4 /*yield*/, testing_1.touchGesture.pan({
                            target: target,
                            angle: 0, // Horizontal pan (right)
                            distance: 50,
                            steps: 3,
                        })];
                case 2:
                    // Test horizontal pan (should trigger events)
                    _a.sent();
                    // Verify events for horizontal pan
                    (0, vitest_1.expect)(events.length).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should update options', function () {
        (0, vitest_1.expect)(PanGesture_1.PanGesture).toUpdateOptions({
            preventDefault: true,
            stopPropagation: true,
            preventIf: ['move'],
            direction: ['up', 'down'],
        });
    });
    (0, vitest_1.it)('should update state', { fails: true }, function () {
        (0, vitest_1.expect)(PanGesture_1.PanGesture).toUpdateState({});
    });
    (0, vitest_1.it)('should properly clone', function () {
        (0, vitest_1.expect)(PanGesture_1.PanGesture).toBeClonable({
            preventDefault: true,
            stopPropagation: true,
            threshold: 10,
            minPointers: 1,
            maxPointers: 2,
            preventIf: ['move', 'pinch'],
            direction: ['left', 'right'],
        });
    });
});
