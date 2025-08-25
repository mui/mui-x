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
var RotateGesture_1 = require("./RotateGesture");
(0, vitest_1.describe)('Rotate Gesture', function () {
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
                new RotateGesture_1.RotateGesture({
                    name: 'rotate',
                    minPointers: 2,
                }),
            ],
        });
        // Set up target element
        target = document.createElement('div');
        target.style.width = '100px';
        target.style.height = '100px';
        container.appendChild(target);
        var gestureTarget = gestureManager.registerElement('rotate', target);
        // Add event listeners
        gestureTarget.addEventListener('rotateStart', function (event) {
            var detail = event.detail;
            events.push("rotateStart: rotation: ".concat(Math.floor(detail.rotation), "\u00B0 | delta: ").concat(Math.floor(detail.delta), "\u00B0 | totalRotation: ").concat(Math.floor(detail.totalRotation), "\u00B0"));
        });
        gestureTarget.addEventListener('rotate', function (event) {
            var detail = event.detail;
            events.push("rotate: rotation: ".concat(Math.floor(detail.rotation), "\u00B0 | delta: ").concat(Math.floor(detail.delta), "\u00B0 | totalRotation: ").concat(Math.floor(detail.totalRotation), "\u00B0"));
        });
        gestureTarget.addEventListener('rotateEnd', function (event) {
            var detail = event.detail;
            events.push("rotateEnd: rotation: ".concat(Math.floor(detail.rotation), "\u00B0 | delta: ").concat(Math.floor(detail.delta), "\u00B0 | totalRotation: ").concat(Math.floor(detail.totalRotation), "\u00B0"));
        });
    });
    (0, vitest_1.afterEach)(function () {
        // Clean up
        document.body.removeChild(container);
        gestureManager.destroy();
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)('should detect clockwise rotation', function () { return __awaiter(void 0, void 0, void 0, function () {
        var isWebkit;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_1.touchGesture.rotate({
                        target: target,
                        rotationAngle: 90, // 90 degrees clockwise
                        steps: 2,
                    })];
                case 1:
                    _a.sent();
                    isWebkit = context_1.server.browser === 'webkit';
                    (0, vitest_1.expect)(events).toStrictEqual(isWebkit
                        ? [
                            'rotateStart: rotation: 22° | delta: 22° | totalRotation: 22°',
                            'rotate: rotation: 22° | delta: 22° | totalRotation: 22°',
                            'rotate: rotation: 45° | delta: 22° | totalRotation: 45°',
                            'rotate: rotation: 67° | delta: 22° | totalRotation: 67°',
                            'rotate: rotation: 88° | delta: 21° | totalRotation: 88°',
                            'rotateEnd: rotation: 88° | delta: 21° | totalRotation: 88°',
                        ]
                        : [
                            'rotateStart: rotation: 22° | delta: 22° | totalRotation: 22°',
                            'rotate: rotation: 22° | delta: 22° | totalRotation: 22°',
                            'rotate: rotation: 45° | delta: 22° | totalRotation: 45°',
                            'rotate: rotation: 67° | delta: 22° | totalRotation: 67°',
                            'rotate: rotation: 90° | delta: 22° | totalRotation: 90°',
                            'rotateEnd: rotation: 90° | delta: 22° | totalRotation: 90°',
                        ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should detect counter-clockwise rotation', function () { return __awaiter(void 0, void 0, void 0, function () {
        var isWebkit;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_1.touchGesture.rotate({
                        target: target,
                        rotationAngle: -90, // 90 degrees counter-clockwise
                        steps: 2,
                    })];
                case 1:
                    _a.sent();
                    isWebkit = context_1.server.browser === 'webkit';
                    (0, vitest_1.expect)(events).toStrictEqual(isWebkit
                        ? [
                            'rotateStart: rotation: -24° | delta: -24° | totalRotation: -24°',
                            'rotate: rotation: -24° | delta: -24° | totalRotation: -24°',
                            'rotate: rotation: -45° | delta: -22° | totalRotation: -45°',
                            'rotate: rotation: -67° | delta: -22° | totalRotation: -67°',
                            'rotate: rotation: -90° | delta: -24° | totalRotation: -90°',
                            'rotateEnd: rotation: -90° | delta: -24° | totalRotation: -90°',
                        ]
                        : [
                            'rotateStart: rotation: -23° | delta: -23° | totalRotation: -23°',
                            'rotate: rotation: -23° | delta: -23° | totalRotation: -23°',
                            'rotate: rotation: -45° | delta: -23° | totalRotation: -45°',
                            'rotate: rotation: -68° | delta: -23° | totalRotation: -68°',
                            'rotate: rotation: -90° | delta: -23° | totalRotation: -90°',
                            'rotateEnd: rotation: -90° | delta: -23° | totalRotation: -90°',
                        ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should track total rotation across multiple gestures', function () { return __awaiter(void 0, void 0, void 0, function () {
        var isWebkit;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // First rotation
                return [4 /*yield*/, testing_1.touchGesture.rotate({
                        target: target,
                        rotationAngle: 45,
                        steps: 1,
                    })];
                case 1:
                    // First rotation
                    _a.sent();
                    // Second rotation
                    return [4 /*yield*/, testing_1.touchGesture.rotate({
                            target: target,
                            rotationAngle: 45,
                            steps: 1,
                        })];
                case 2:
                    // Second rotation
                    _a.sent();
                    isWebkit = context_1.server.browser === 'webkit';
                    (0, vitest_1.expect)(events).toStrictEqual(isWebkit
                        ? [
                            'rotateStart: rotation: 22° | delta: 22° | totalRotation: 22°',
                            'rotate: rotation: 22° | delta: 22° | totalRotation: 22°',
                            'rotate: rotation: 45° | delta: 22° | totalRotation: 45°',
                            'rotateEnd: rotation: 45° | delta: 22° | totalRotation: 45°',
                            'rotateStart: rotation: 67° | delta: 22° | totalRotation: 67°',
                            'rotate: rotation: 67° | delta: 22° | totalRotation: 67°',
                            'rotate: rotation: 90° | delta: 22° | totalRotation: 90°',
                            'rotateEnd: rotation: 90° | delta: 22° | totalRotation: 90°',
                        ]
                        : [
                            'rotateStart: rotation: 22° | delta: 22° | totalRotation: 22°',
                            'rotate: rotation: 22° | delta: 22° | totalRotation: 22°',
                            'rotate: rotation: 45° | delta: 22° | totalRotation: 45°',
                            'rotateEnd: rotation: 45° | delta: 22° | totalRotation: 45°',
                            'rotateStart: rotation: 67° | delta: 22° | totalRotation: 67°',
                            'rotate: rotation: 67° | delta: 22° | totalRotation: 67°',
                            'rotate: rotation: 90° | delta: 22° | totalRotation: 90°',
                            'rotateEnd: rotation: 90° | delta: 22° | totalRotation: 90°',
                        ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should update options', function () {
        (0, vitest_1.expect)(RotateGesture_1.RotateGesture).toUpdateOptions({
            preventDefault: true,
            stopPropagation: true,
            preventIf: ['pinch'],
            minPointers: 2,
            maxPointers: 3,
        });
    });
    (0, vitest_1.it)('should update state', { fails: true }, function () {
        (0, vitest_1.expect)(RotateGesture_1.RotateGesture).toUpdateState({});
    });
    (0, vitest_1.it)('should properly clone', function () {
        (0, vitest_1.expect)(RotateGesture_1.RotateGesture).toBeClonable({
            name: 'rotate',
            preventDefault: true,
            stopPropagation: true,
            minPointers: 2,
            maxPointers: 3,
            preventIf: ['pinch', 'pan'],
        });
    });
});
