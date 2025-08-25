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
exports.tap = void 0;
/**
 * Implementation of the tap gesture for testing.
 *
 * @param options - The options for the tap gesture.
 * @param advanceTimers - Optional function to advance timers in tests.
 * @returns A promise that resolves when the tap gesture is completed.
 */
var tap = function (pointerManager, options, advanceTimers) { return __awaiter(void 0, void 0, void 0, function () {
    var target, _a, taps, _b, delay, pointersArray, mousePointer, tapCount, touchPointers, _i, pointersArray_1, pointer, _c, pointersArray_2, pointer;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                target = options.target, _a = options.taps, taps = _a === void 0 ? 1 : _a, _b = options.delay, delay = _b === void 0 ? 50 : _b;
                if (!target) {
                    throw new Error('Target element is required for tap gesture');
                }
                if (pointerManager.mode === 'mouse') {
                    mousePointer = 'pointer' in options ? options.pointer : undefined;
                    pointersArray = [pointerManager.parseMousePointer(mousePointer, target)];
                }
                tapCount = 0;
                _d.label = 1;
            case 1:
                if (!(tapCount < taps)) return [3 /*break*/, 7];
                if (pointerManager.mode === 'touch') {
                    touchPointers = 'pointers' in options ? options.pointers : undefined;
                    pointersArray = pointerManager.parsePointers(touchPointers, target, {
                        amount: 1,
                        distance: 0,
                    });
                }
                if (!pointersArray || pointersArray.length === 0) {
                    return [2 /*return*/];
                }
                // For each tap, press and release all pointers
                for (_i = 0, pointersArray_1 = pointersArray; _i < pointersArray_1.length; _i++) {
                    pointer = pointersArray_1[_i];
                    pointerManager.pointerDown(pointer);
                }
                // Short delay (10ms) between down and up within a single tap
                // eslint-disable-next-line no-await-in-loop
                return [4 /*yield*/, (advanceTimers
                        ? advanceTimers(10)
                        : new Promise(function (resolve) {
                            setTimeout(resolve, 10);
                        }))];
            case 2:
                // Short delay (10ms) between down and up within a single tap
                // eslint-disable-next-line no-await-in-loop
                _d.sent();
                for (_c = 0, pointersArray_2 = pointersArray; _c < pointersArray_2.length; _c++) {
                    pointer = pointersArray_2[_c];
                    pointerManager.pointerUp(pointer);
                }
                if (!(tapCount < taps - 1)) return [3 /*break*/, 6];
                if (!advanceTimers) return [3 /*break*/, 4];
                // eslint-disable-next-line no-await-in-loop
                return [4 /*yield*/, advanceTimers(delay)];
            case 3:
                // eslint-disable-next-line no-await-in-loop
                _d.sent();
                return [3 /*break*/, 6];
            case 4: 
            // eslint-disable-next-line no-await-in-loop
            return [4 /*yield*/, new Promise(function (resolve) {
                    setTimeout(resolve, delay);
                })];
            case 5:
                // eslint-disable-next-line no-await-in-loop
                _d.sent();
                _d.label = 6;
            case 6:
                tapCount += 1;
                return [3 /*break*/, 1];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.tap = tap;
