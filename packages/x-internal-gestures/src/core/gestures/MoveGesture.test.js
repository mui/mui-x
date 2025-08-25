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
var MoveGesture_1 = require("./MoveGesture");
(0, vitest_1.describe)('Move Gesture', function () {
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
                new MoveGesture_1.MoveGesture({
                    name: 'move',
                    threshold: 0,
                }),
            ],
        });
        // Set up target element
        target = document.createElement('div');
        target.style.width = '50px';
        target.style.height = '50px';
        target.style.backgroundColor = 'red';
        target.style.position = 'absolute';
        target.style.top = '75px';
        target.style.left = '75px';
        container.appendChild(target);
        var gestureTarget = gestureManager.registerElement('move', target);
        // Add event listeners
        gestureTarget.addEventListener('moveStart', function (event) {
            var detail = event.detail;
            var srcEvent = detail.srcEvent;
            events.push("moveStart: ".concat(srcEvent.pointerId, " | x: ").concat(detail.centroid.x, " | y: ").concat(detail.centroid.y));
        });
        gestureTarget.addEventListener('move', function (event) {
            var detail = event.detail;
            var srcEvent = detail.srcEvent;
            events.push("move: ".concat(srcEvent.pointerId, " | x: ").concat(detail.centroid.x, " | y: ").concat(detail.centroid.y));
        });
        gestureTarget.addEventListener('moveEnd', function (event) {
            var detail = event.detail;
            var srcEvent = detail.srcEvent;
            events.push("moveEnd: ".concat(srcEvent.pointerId, " | x: ").concat(detail.centroid.x, " | y: ").concat(detail.centroid.y));
        });
    });
    (0, vitest_1.afterEach)(function () {
        // Clean up
        document.body.removeChild(container);
        gestureManager.destroy();
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)('should detect move gesture', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_1.mouseGesture.move({
                        target: target,
                        steps: 2,
                        distance: 100,
                    })];
                case 1:
                    _a.sent();
                    // Verify events
                    (0, vitest_1.expect)(events).toStrictEqual([
                        'moveStart: 1 | x: 150 | y: 100',
                        'move: 1 | x: 150 | y: 100',
                        'move: 1 | x: 200 | y: 100',
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should fire a moveEnd when leaving the target', function () { return __awaiter(void 0, void 0, void 0, function () {
        var gesture, target2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gesture = testing_1.mouseGesture.setup();
                    return [4 /*yield*/, gesture.move({
                            target: target,
                            steps: 2,
                            distance: 100,
                        })];
                case 1:
                    _a.sent();
                    target2 = document.createElement('div');
                    target2.style.width = '200px';
                    target2.style.height = '200px';
                    target2.style.backgroundColor = 'blue';
                    target2.id = 'target2';
                    document.body.appendChild(target2);
                    return [4 /*yield*/, gesture.move({
                            target: target2,
                            steps: 2,
                            distance: 100,
                        })];
                case 2:
                    _a.sent();
                    // Verify events
                    (0, vitest_1.expect)(events).toStrictEqual([
                        'moveStart: 1 | x: 150 | y: 100',
                        'move: 1 | x: 150 | y: 100',
                        'move: 1 | x: 200 | y: 100',
                        'moveEnd: 1 | x: 200 | y: 100',
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should fire a moveStart when entering a new target even if no move was made', function () { return __awaiter(void 0, void 0, void 0, function () {
        var gesture, target2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gesture = testing_1.mouseGesture.setup();
                    target2 = document.createElement('div');
                    target2.style.width = '200px';
                    target2.style.height = '200px';
                    target2.style.backgroundColor = 'blue';
                    target2.id = 'target2';
                    document.body.appendChild(target2);
                    target2.addEventListener('pointerenter', function () {
                        events.push('pointerenter on target2');
                    });
                    return [4 /*yield*/, gesture.move({
                            target: target2,
                            distance: 100,
                            steps: 1,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(events).toStrictEqual(['pointerenter on target2']);
                    events = []; // Clear events for next assertions
                    return [4 /*yield*/, gesture.move({
                            target: target,
                            distance: 100,
                            steps: 1,
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(events).toStrictEqual([
                        'moveStart: 1 | x: 300 | y: 500',
                        'move: 1 | x: 300 | y: 500',
                        'move: 1 | x: 300 | y: 500',
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should handle pointer events with non-mouse/pen pointer types', function () {
        var gestureInstance = new MoveGesture_1.MoveGesture({ name: 'move' });
        // Set up the gesture instance
        gestureInstance.init(target, Reflect.get(gestureManager, 'pointerManager'), Reflect.get(gestureManager, 'activeGesturesRegistry'), Reflect.get(gestureManager, 'keyboardManager'));
        // Create a pointer move event with touch type
        var moveEvent = new PointerEvent('pointermove', {
            pointerType: 'touch',
            clientX: 100,
            clientY: 100,
        });
        // Dispatch the event
        target.dispatchEvent(moveEvent);
        // Verify no events were triggered since we're using touch input
        (0, vitest_1.expect)(events.length).toBe(0);
    });
    (0, vitest_1.it)('should update options', function () {
        (0, vitest_1.expect)(MoveGesture_1.MoveGesture).toUpdateOptions({
            preventDefault: true,
            stopPropagation: true,
            preventIf: ['pan'],
        });
    });
    (0, vitest_1.it)('should update state', { fails: true }, function () {
        // @ts-expect-error, type is never
        (0, vitest_1.expect)(MoveGesture_1.MoveGesture).toUpdateState({});
    });
    (0, vitest_1.it)('should properly clone', function () {
        (0, vitest_1.expect)(MoveGesture_1.MoveGesture).toBeClonable({
            name: 'move',
            preventDefault: true,
            stopPropagation: true,
            threshold: 10,
            minPointers: 1,
            maxPointers: 2,
            preventIf: ['pan', 'pinch'],
        });
    });
});
