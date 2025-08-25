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
var testing_1 = require("../testing");
var GestureManager_1 = require("./GestureManager");
var TapGesture_1 = require("./gestures/TapGesture");
(0, vitest_1.describe)('Pointer Mode Filter', function () {
    var container;
    var target;
    var events;
    var gestureManager;
    (0, vitest_1.beforeEach)(function () {
        events = [];
        // Set up DOM
        container = document.createElement('div');
        container.style.width = '200px';
        container.style.height = '200px';
        document.body.appendChild(container);
        // Set up target element
        target = document.createElement('div');
        target.style.width = '100px';
        target.style.height = '100px';
        container.appendChild(target);
    });
    (0, vitest_1.afterEach)(function () {
        // Clean up
        gestureManager.destroy();
        container.remove();
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)('should only trigger gestures for specified pointer types', function () { return __awaiter(void 0, void 0, void 0, function () {
        var gestureTarget;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Set up gesture manager with three tap gestures:
                    // 1. mouseTap: only triggered by mouse events
                    // 2. touchTap: only triggered by touch events
                    // 3. anyTap: triggered by any pointer type
                    gestureManager = new GestureManager_1.GestureManager({
                        gestures: [
                            new TapGesture_1.TapGesture({
                                name: 'mouseTap',
                                pointerMode: ['mouse'],
                            }),
                            new TapGesture_1.TapGesture({
                                name: 'touchTap',
                                pointerMode: ['touch'],
                            }),
                            new TapGesture_1.TapGesture({
                                name: 'anyTap',
                                pointerMode: [],
                                // No pointerMode specified, accepts all pointer types
                            }),
                        ],
                    });
                    gestureTarget = gestureManager.registerElement(['mouseTap', 'touchTap', 'anyTap'], target);
                    // Add event listeners for all gesture types
                    gestureTarget.addEventListener('mouseTap', function () { return events.push('mouseTap'); });
                    gestureTarget.addEventListener('touchTap', function () { return events.push('touchTap'); });
                    gestureTarget.addEventListener('anyTap', function () { return events.push('anyTap'); });
                    // Test 1: Mouse gesture (move) should trigger mouseTap and anyTap gestures but not touchTap
                    return [4 /*yield*/, testing_1.mouseGesture.tap({ target: target })];
                case 1:
                    // Test 1: Mouse gesture (move) should trigger mouseTap and anyTap gestures but not touchTap
                    _a.sent();
                    (0, vitest_1.expect)(events).toContain('mouseTap');
                    (0, vitest_1.expect)(events).not.toContain('touchTap');
                    (0, vitest_1.expect)(events).toContain('anyTap');
                    // Reset events arrays
                    events = [];
                    // Test 2: Touch gesture (tap) should trigger touchTap and anyTap gestures but not mouseTap
                    return [4 /*yield*/, testing_1.touchGesture.tap({ target: target })];
                case 2:
                    // Test 2: Touch gesture (tap) should trigger touchTap and anyTap gestures but not mouseTap
                    _a.sent();
                    (0, vitest_1.expect)(events).not.toContain('mouseTap');
                    (0, vitest_1.expect)(events).toContain('touchTap');
                    (0, vitest_1.expect)(events).toContain('anyTap');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should update pointerMode at runtime via setGestureOptions', function () { return __awaiter(void 0, void 0, void 0, function () {
        var gestureTarget;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Set up gesture manager with a single tap gesture that initially accepts all pointer types
                    gestureManager = new GestureManager_1.GestureManager({
                        gestures: [
                            new TapGesture_1.TapGesture({
                                name: 'dynamicTap',
                                // No pointerMode initially, accepts all pointer types
                            }),
                        ],
                    });
                    gestureTarget = gestureManager.registerElement('dynamicTap', target);
                    // Add event listeners
                    gestureTarget.addEventListener('dynamicTap', function () { return events.push('dynamicTap'); });
                    // Test 1: Initially, both touch and mouse gestures should trigger events
                    return [4 /*yield*/, testing_1.touchGesture.tap({ target: target })];
                case 1:
                    // Test 1: Initially, both touch and mouse gestures should trigger events
                    _a.sent();
                    (0, vitest_1.expect)(events).toContain('dynamicTap');
                    // Reset events
                    events = [];
                    return [4 /*yield*/, testing_1.mouseGesture.tap({ target: target })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(events).toContain('dynamicTap');
                    // Reset events
                    events = [];
                    // Test 2: Update to only allow touch gestures
                    gestureManager.setGestureOptions('dynamicTap', target, {
                        pointerMode: ['touch'],
                    });
                    // Touch gesture should still work
                    return [4 /*yield*/, testing_1.touchGesture.tap({ target: target })];
                case 3:
                    // Touch gesture should still work
                    _a.sent();
                    (0, vitest_1.expect)(events).toContain('dynamicTap');
                    // Reset events
                    events = [];
                    // Mouse gesture should no longer work
                    return [4 /*yield*/, testing_1.mouseGesture.tap({ target: target })];
                case 4:
                    // Mouse gesture should no longer work
                    _a.sent();
                    (0, vitest_1.expect)(events).toStrictEqual([]); // No events should be triggered for mouse
                    // Test 3: Update to only allow mouse gestures
                    gestureManager.setGestureOptions('dynamicTap', target, {
                        pointerMode: ['mouse'],
                    });
                    // Reset events
                    events = [];
                    // Touch gesture should no longer work
                    return [4 /*yield*/, testing_1.touchGesture.tap({ target: target })];
                case 5:
                    // Touch gesture should no longer work
                    _a.sent();
                    (0, vitest_1.expect)(events).toStrictEqual([]); // No events should be triggered for touch
                    // Mouse gesture should work again
                    return [4 /*yield*/, testing_1.mouseGesture.tap({ target: target })];
                case 6:
                    // Mouse gesture should work again
                    _a.sent();
                    (0, vitest_1.expect)(events).toContain('dynamicTap');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should support multiple pointer types in pointerMode array', function () { return __awaiter(void 0, void 0, void 0, function () {
        var gestureTarget;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Set up gesture manager with a tap gesture that accepts both mouse and touch
                    gestureManager = new GestureManager_1.GestureManager({
                        gestures: [
                            new TapGesture_1.TapGesture({
                                name: 'multiTap',
                                pointerMode: ['mouse', 'touch'], // Accept both mouse and touch
                            }),
                        ],
                    });
                    gestureTarget = gestureManager.registerElement('multiTap', target);
                    // Add event listeners
                    gestureTarget.addEventListener('multiTap', function () { return events.push('multiTap'); });
                    // Test 1: Mouse gesture should work
                    return [4 /*yield*/, testing_1.mouseGesture.tap({ target: target })];
                case 1:
                    // Test 1: Mouse gesture should work
                    _a.sent();
                    (0, vitest_1.expect)(events).toContain('multiTap');
                    // Reset events
                    events = [];
                    // Test 2: Touch gesture should also work
                    return [4 /*yield*/, testing_1.touchGesture.tap({ target: target })];
                case 2:
                    // Test 2: Touch gesture should also work
                    _a.sent();
                    (0, vitest_1.expect)(events).toContain('multiTap');
                    return [2 /*return*/];
            }
        });
    }); });
});
