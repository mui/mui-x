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
exports.turnWheel = void 0;
/**
 * Implementation of the turnWheel gesture for testing.
 *
 * @param options - The options for the turnWheel gesture.
 * @param advanceTimers - Optional function to advance timers in tests.
 * @returns A promise that resolves when the turnWheel gesture is completed.
 */
var turnWheel = function (pointerManager, options, advanceTimers) { return __awaiter(void 0, void 0, void 0, function () {
    var target, pointer, _a, delay, _b, deltaX, _c, deltaY, _d, deltaZ, _e, deltaMode, _f, turns, parsedPointer, createWheelEvent, i, wheelEvent;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                target = options.target, pointer = options.pointer, _a = options.delay, delay = _a === void 0 ? 50 : _a, _b = options.deltaX, deltaX = _b === void 0 ? 0 : _b, _c = options.deltaY, deltaY = _c === void 0 ? 100 : _c, _d = options.deltaZ, deltaZ = _d === void 0 ? 0 : _d, _e = options.deltaMode, deltaMode = _e === void 0 ? 0 : _e, _f = options.turns, turns = _f === void 0 ? 1 : _f;
                if (!target) {
                    throw new Error('Target element is required for turnWheel gesture');
                }
                parsedPointer = pointerManager.parseMousePointer(pointer, target);
                createWheelEvent = function () {
                    return new WheelEvent('wheel', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: parsedPointer.x,
                        clientY: parsedPointer.y,
                        deltaX: deltaX,
                        deltaY: deltaY,
                        deltaZ: deltaZ,
                        deltaMode: deltaMode,
                    });
                };
                i = 0;
                _g.label = 1;
            case 1:
                if (!(i < turns)) return [3 /*break*/, 6];
                wheelEvent = createWheelEvent();
                parsedPointer.target.dispatchEvent(wheelEvent);
                if (!(i < turns - 1)) return [3 /*break*/, 5];
                if (!advanceTimers) return [3 /*break*/, 3];
                // eslint-disable-next-line no-await-in-loop
                return [4 /*yield*/, advanceTimers(delay)];
            case 2:
                // eslint-disable-next-line no-await-in-loop
                _g.sent();
                return [3 /*break*/, 5];
            case 3: 
            // eslint-disable-next-line no-await-in-loop
            return [4 /*yield*/, new Promise(function (resolve) {
                    setTimeout(resolve, delay);
                })];
            case 4:
                // eslint-disable-next-line no-await-in-loop
                _g.sent();
                _g.label = 5;
            case 5:
                i += 1;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.turnWheel = turnWheel;
