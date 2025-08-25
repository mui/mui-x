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
var PressGesture_1 = require("./PressGesture");
(0, vitest_1.describe)('Press Gesture', function () {
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
        // Set up gesture manager with shorter duration for tests
        gestureManager = new GestureManager_1.GestureManager({
            gestures: [
                new PressGesture_1.PressGesture({
                    name: 'press',
                    duration: 200, // shorter duration for tests
                    maxDistance: 10,
                }),
            ],
        });
        // Set up target element
        target = document.createElement('div');
        target.style.width = '100px';
        target.style.height = '100px';
        container.appendChild(target);
        var gestureTarget = gestureManager.registerElement('press', target);
        // Add event listeners
        gestureTarget.addEventListener('pressStart', function (event) {
            var detail = event.detail;
            events.push("pressStart: x: ".concat(Math.floor(detail.x), " | y: ").concat(Math.floor(detail.y), " | duration: ").concat(Math.floor(detail.duration)));
        });
        gestureTarget.addEventListener('press', function (event) {
            var detail = event.detail;
            events.push("press: x: ".concat(Math.floor(detail.x), " | y: ").concat(Math.floor(detail.y), " | duration: ").concat(Math.floor(detail.duration)));
        });
        gestureTarget.addEventListener('pressEnd', function (event) {
            var detail = event.detail;
            events.push("pressEnd: x: ".concat(Math.floor(detail.x), " | y: ").concat(Math.floor(detail.y), " | duration: ").concat(Math.floor(detail.duration)));
        });
        gestureTarget.addEventListener('pressCancel', function (event) {
            var detail = event.detail;
            events.push("pressCancel: x: ".concat(Math.floor(detail.x), " | y: ").concat(Math.floor(detail.y), " | duration: ").concat(Math.floor(detail.duration)));
        });
    });
    (0, vitest_1.afterEach)(function () {
        // Clean up
        document.body.removeChild(container);
        gestureManager.destroy();
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)('should detect press gesture with mouse', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Use a long press that exceeds the duration
                return [4 /*yield*/, testing_1.mouseGesture.press({
                        target: target,
                        duration: 300, // longer than our configured 200ms
                    })];
                case 1:
                    // Use a long press that exceeds the duration
                    _a.sent();
                    (0, vitest_1.expect)(events.at(0)).toBe("pressStart: x: 50 | y: 50 | duration: 0");
                    (0, vitest_1.expect)(events.at(1)).toContain("press: x: 50 | y: 50 | duration: 0");
                    // Micro second precision may vary
                    (0, vitest_1.expect)(events.at(2)).toContain("pressEnd: x: 50 | y: 50 | duration: 30");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should detect press gesture with touch', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Use a long press that exceeds the duration
                return [4 /*yield*/, testing_1.touchGesture.press({
                        target: target,
                        duration: 300, // longer than our configured 200ms
                    })];
                case 1:
                    // Use a long press that exceeds the duration
                    _a.sent();
                    (0, vitest_1.expect)(events.at(0)).toBe("pressStart: x: 50 | y: 50 | duration: 0");
                    (0, vitest_1.expect)(events.at(1)).toContain("press: x: 50 | y: 50 | duration: 0");
                    // Micro second precision may vary
                    (0, vitest_1.expect)(events.at(2)).toContain("pressEnd: x: 50 | y: 50 | duration: 30");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should not trigger press if released before duration', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pointerDown, pointerUp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pointerDown = vitest_1.vi.fn();
                    pointerUp = vitest_1.vi.fn();
                    target.addEventListener('pointerdown', pointerDown);
                    target.addEventListener('pointerup', pointerUp);
                    // Perform a quick press (shorter than the configured duration)
                    return [4 /*yield*/, testing_1.mouseGesture.press({
                            target: target,
                            duration: 100, // Less than the configured 200ms
                        })];
                case 1:
                    // Perform a quick press (shorter than the configured duration)
                    _a.sent();
                    // Verify no press events
                    (0, vitest_1.expect)(events.length).toBe(0);
                    (0, vitest_1.expect)(pointerDown).toHaveBeenCalled();
                    (0, vitest_1.expect)(pointerUp).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    // TODO: Wait for individual pointer events to be supported
    vitest_1.it.todo('should reject press if moved beyond maxDistance', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); });
    (0, vitest_1.it)('should update options', function () {
        (0, vitest_1.expect)(PressGesture_1.PressGesture).toUpdateOptions({
            preventDefault: true,
            stopPropagation: true,
            preventIf: ['tap'],
            duration: 300,
            maxDistance: 15,
        });
    });
    (0, vitest_1.it)('should update state', { fails: true }, function () {
        (0, vitest_1.expect)(PressGesture_1.PressGesture).toUpdateState({});
    });
    (0, vitest_1.it)('should properly clone', function () {
        (0, vitest_1.expect)(PressGesture_1.PressGesture).toBeClonable({
            name: 'press',
            preventDefault: true,
            stopPropagation: true,
            minPointers: 1,
            maxPointers: 1,
            preventIf: ['tap'],
            duration: 300,
            maxDistance: 15,
        });
    });
});
