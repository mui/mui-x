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
var PinchGesture_1 = require("./PinchGesture");
(0, vitest_1.describe)('Pinch Gesture', function () {
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
                new PinchGesture_1.PinchGesture({
                    name: 'pinch',
                    threshold: 0,
                    minPointers: 2,
                }),
            ],
        });
        // Set up target element
        target = document.createElement('div');
        target.style.width = '100px';
        target.style.height = '100px';
        container.appendChild(target);
        var gestureTarget = gestureManager.registerElement('pinch', target);
        // Add event listeners
        gestureTarget.addEventListener('pinchStart', function (event) {
            var detail = event.detail;
            events.push("pinchStart: scale: ".concat(detail.scale.toFixed(2), " | distance: ").concat(Math.floor(detail.distance), " | direction: ").concat(detail.direction));
        });
        gestureTarget.addEventListener('pinch', function (event) {
            var detail = event.detail;
            events.push("pinch: scale: ".concat(detail.scale.toFixed(2), " | distance: ").concat(Math.floor(detail.distance), " | direction: ").concat(detail.direction));
        });
        gestureTarget.addEventListener('pinchEnd', function (event) {
            var detail = event.detail;
            events.push("pinchEnd: scale: ".concat(detail.scale.toFixed(2), " | distance: ").concat(Math.floor(detail.distance), " | direction: ").concat(detail.direction));
        });
    });
    (0, vitest_1.afterEach)(function () {
        // Clean up
        document.body.removeChild(container);
        gestureManager.destroy();
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)('should detect pinch "in" gesture', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_1.touchGesture.pinch({
                        target: target,
                        distance: -20, // Negative
                        steps: 2,
                    })];
                case 1:
                    _a.sent();
                    // An event is fired for pointer(2) * steps(2) = 4 events
                    (0, vitest_1.expect)(events).toStrictEqual([
                        'pinchStart: scale: 0.90 | distance: 45 | direction: -1',
                        'pinch: scale: 0.90 | distance: 45 | direction: -1',
                        'pinch: scale: 0.80 | distance: 40 | direction: -1',
                        'pinch: scale: 0.70 | distance: 35 | direction: -1',
                        'pinch: scale: 0.60 | distance: 30 | direction: -1',
                        'pinchEnd: scale: 0.60 | distance: 30 | direction: -1',
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should detect pinch "out" gesture', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_1.touchGesture.pinch({
                        target: target,
                        distance: 20, // Positive
                        steps: 2,
                    })];
                case 1:
                    _a.sent();
                    // An event is fired for pointer(2) * steps(2) = 4 events
                    (0, vitest_1.expect)(events).toStrictEqual([
                        'pinchStart: scale: 1.10 | distance: 55 | direction: 1',
                        'pinch: scale: 1.10 | distance: 55 | direction: 1',
                        'pinch: scale: 1.20 | distance: 60 | direction: 1',
                        'pinch: scale: 1.30 | distance: 65 | direction: 1',
                        'pinch: scale: 1.40 | distance: 70 | direction: 1',
                        'pinchEnd: scale: 1.40 | distance: 70 | direction: 1',
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    // TODO: Fix after allowing single pointer control
    vitest_1.it.todo('should stop pinch when there are less than 2 pointers', function () { return __awaiter(void 0, void 0, void 0, function () {
        var gesture;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gesture = testing_1.touchGesture.setup();
                    // Start pinch with 2 pointers
                    return [4 /*yield*/, gesture.pinch({
                            target: target,
                            distance: 20,
                            steps: 2,
                            pointers: { ids: [20, 30] },
                            releasePointers: false,
                        })];
                case 1:
                    // Start pinch with 2 pointers
                    _a.sent();
                    (0, vitest_1.expect)(events).toStrictEqual([
                        'pinchStart: scale: 1.10 | distance: 55 | direction: 1',
                        'pinch: scale: 1.10 | distance: 55 | direction: 1',
                        'pinch: scale: 1.20 | distance: 60 | direction: 1',
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should update options', function () {
        (0, vitest_1.expect)(PinchGesture_1.PinchGesture).toUpdateOptions({
            preventDefault: true,
            stopPropagation: true,
            preventIf: ['rotate'],
            minPointers: 2,
            maxPointers: 3,
        });
    });
    (0, vitest_1.it)('should update state', { fails: true }, function () {
        (0, vitest_1.expect)(PinchGesture_1.PinchGesture).toUpdateState({});
    });
    (0, vitest_1.it)('should properly clone', function () {
        (0, vitest_1.expect)(PinchGesture_1.PinchGesture).toBeClonable({
            name: 'pinch',
            preventDefault: true,
            stopPropagation: true,
            threshold: 0,
            minPointers: 2,
            maxPointers: 3,
            preventIf: ['rotate', 'pan'],
        });
    });
});
