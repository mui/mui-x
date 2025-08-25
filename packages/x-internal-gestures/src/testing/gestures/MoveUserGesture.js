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
exports.move = void 0;
/**
 * Implementation of the move gesture for testing.
 *
 * @param options - The options for the move gesture.
 * @param advanceTimers - Optional function to advance timers in tests.
 * @returns A promise that resolves when the move gesture is completed.
 */
var move = function (pointerManager, options, advanceTimers) { return __awaiter(void 0, void 0, void 0, function () {
    var target, pointer, distance, _a, duration, _b, steps, _c, angle, rad, deltaX, deltaY, parsedPointer, stepDelayMs, step, progress, startX, startY, currentX, currentY;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                target = options.target, pointer = options.pointer, distance = options.distance, _a = options.duration, duration = _a === void 0 ? 500 : _a, _b = options.steps, steps = _b === void 0 ? 10 : _b, _c = options.angle, angle = _c === void 0 ? 0 : _c;
                if (!target) {
                    throw new Error('Target element is required for move gesture');
                }
                if (distance <= 0) {
                    // No movement required
                    return [2 /*return*/];
                }
                rad = (angle * Math.PI) / 180;
                deltaX = Math.cos(rad) * distance;
                deltaY = Math.sin(rad) * distance;
                parsedPointer = pointerManager.parseMousePointer(pointer, target);
                stepDelayMs = duration / steps;
                step = 1;
                _d.label = 1;
            case 1:
                if (!(step <= steps)) return [3 /*break*/, 6];
                progress = step / steps;
                startX = parsedPointer.x;
                startY = parsedPointer.y;
                currentX = startX + deltaX * progress;
                currentY = startY + deltaY * progress;
                pointerManager.pointerMove({
                    id: parsedPointer.id,
                    target: parsedPointer.target,
                    x: currentX,
                    y: currentY,
                });
                if (!(step < steps)) return [3 /*break*/, 5];
                if (!advanceTimers) return [3 /*break*/, 3];
                // eslint-disable-next-line no-await-in-loop
                return [4 /*yield*/, advanceTimers(stepDelayMs)];
            case 2:
                // eslint-disable-next-line no-await-in-loop
                _d.sent();
                return [3 /*break*/, 5];
            case 3: 
            // eslint-disable-next-line no-await-in-loop
            return [4 /*yield*/, new Promise(function (resolve) {
                    setTimeout(resolve, stepDelayMs);
                })];
            case 4:
                // eslint-disable-next-line no-await-in-loop
                _d.sent();
                _d.label = 5;
            case 5:
                step += 1;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.move = move;
