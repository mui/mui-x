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
(0, vitest_1.describe)('Gesture Keyboard Filter Dynamic Updates', function () {
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
        // Set up gesture manager with a tap gesture that has no initial key requirements
        gestureManager = new GestureManager_1.GestureManager({
            gestures: [
                new TapGesture_1.TapGesture({
                    name: 'dynamicTap',
                    // No keys requirement initially
                }),
            ],
        });
        // Set up target element
        target = document.createElement('div');
        target.style.width = '100px';
        target.style.height = '100px';
        container.appendChild(target);
        // Register the gesture on the target
        var gestureTarget = gestureManager.registerElement('dynamicTap', target);
        // Add event listener
        gestureTarget.addEventListener('dynamicTap', function () {
            events.push('dynamicTap');
        });
    });
    (0, vitest_1.afterEach)(function () {
        gestureManager.destroy();
        container.remove();
        events = [];
    });
    (0, vitest_1.it)('should initially trigger the gesture without any keys pressed', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Perform a tap with no keys pressed
                return [4 /*yield*/, testing_1.mouseGesture.tap({ target: target })];
                case 1:
                    // Perform a tap with no keys pressed
                    _a.sent();
                    // Should trigger the gesture
                    (0, vitest_1.expect)(events).toEqual(['dynamicTap']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should respect dynamically updated key requirements', function () { return __awaiter(void 0, void 0, void 0, function () {
        var keydownEvent, keyupEvent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Update the gesture to require Shift key
                    gestureManager.setGestureOptions('dynamicTap', target, {
                        requiredKeys: ['Shift'],
                    });
                    // Perform a tap with no keys pressed
                    return [4 /*yield*/, testing_1.mouseGesture.tap({ target: target })];
                case 1:
                    // Perform a tap with no keys pressed
                    _a.sent();
                    // Should not trigger the gesture
                    (0, vitest_1.expect)(events).toEqual([]);
                    keydownEvent = new KeyboardEvent('keydown', { key: 'Shift' });
                    window.dispatchEvent(keydownEvent);
                    // Perform a tap with Shift key pressed
                    return [4 /*yield*/, testing_1.mouseGesture.tap({ target: target })];
                case 2:
                    // Perform a tap with Shift key pressed
                    _a.sent();
                    // Should trigger the gesture
                    (0, vitest_1.expect)(events).toEqual(['dynamicTap']);
                    keyupEvent = new KeyboardEvent('keyup', { key: 'Shift' });
                    window.dispatchEvent(keyupEvent);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should support removing key requirements dynamically', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // First add a key requirement
                    gestureManager.setGestureOptions('dynamicTap', target, {
                        requiredKeys: ['Control'],
                    });
                    // Perform a tap with no keys pressed
                    return [4 /*yield*/, testing_1.mouseGesture.tap({ target: target })];
                case 1:
                    // Perform a tap with no keys pressed
                    _a.sent();
                    // Should not trigger the gesture
                    (0, vitest_1.expect)(events).toEqual([]);
                    // Now remove the key requirement
                    gestureManager.setGestureOptions('dynamicTap', target, {
                        requiredKeys: [], // Empty array removes the requirement
                    });
                    // Perform a tap with no keys pressed
                    return [4 /*yield*/, testing_1.mouseGesture.tap({ target: target })];
                case 2:
                    // Perform a tap with no keys pressed
                    _a.sent();
                    // Should trigger the gesture
                    (0, vitest_1.expect)(events).toEqual(['dynamicTap']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should support changing key requirements dynamically', function () { return __awaiter(void 0, void 0, void 0, function () {
        var keydownCtrl, keydownShift, keyupCtrl, keyupShift;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // First require Control key
                    gestureManager.setGestureOptions('dynamicTap', target, {
                        requiredKeys: ['Control'],
                    });
                    keydownCtrl = new KeyboardEvent('keydown', { key: 'Control' });
                    window.dispatchEvent(keydownCtrl);
                    // Perform a tap with Control key pressed
                    return [4 /*yield*/, testing_1.mouseGesture.tap({ target: target })];
                case 1:
                    // Perform a tap with Control key pressed
                    _a.sent();
                    // Should trigger the gesture
                    (0, vitest_1.expect)(events).toEqual(['dynamicTap']);
                    events = []; // Clear events
                    // Change to require Shift key instead
                    gestureManager.setGestureOptions('dynamicTap', target, {
                        requiredKeys: ['Shift'],
                    });
                    // Perform a tap with Control key still pressed (but now Shift is required)
                    return [4 /*yield*/, testing_1.mouseGesture.tap({ target: target })];
                case 2:
                    // Perform a tap with Control key still pressed (but now Shift is required)
                    _a.sent();
                    // Should not trigger the gesture
                    (0, vitest_1.expect)(events).toEqual([]);
                    keydownShift = new KeyboardEvent('keydown', { key: 'Shift' });
                    window.dispatchEvent(keydownShift);
                    // Perform a tap with both Control and Shift keys pressed
                    return [4 /*yield*/, testing_1.mouseGesture.tap({ target: target })];
                case 3:
                    // Perform a tap with both Control and Shift keys pressed
                    _a.sent();
                    // Should trigger the gesture
                    (0, vitest_1.expect)(events).toEqual(['dynamicTap']);
                    keyupCtrl = new KeyboardEvent('keyup', { key: 'Control' });
                    keyupShift = new KeyboardEvent('keyup', { key: 'Shift' });
                    window.dispatchEvent(keyupCtrl);
                    window.dispatchEvent(keyupShift);
                    return [2 /*return*/];
            }
        });
    }); });
});
