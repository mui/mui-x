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
exports.rotate = void 0;
/**
 * Implementation of the rotate gesture for testing.
 *
 * @param options - The options for the rotate gesture.
 * @param advanceTimers - Optional function to advance timers in tests.
 * @returns A promise that resolves when the rotate gesture is completed.
 */
var rotate = function (pointerManager, options, advanceTimers) { return __awaiter(void 0, void 0, void 0, function () {
    var target, pointers, _a, duration, _b, steps, _c, rotationAngle, rotationCenter, _d, releasePointers, pointersArray, _i, pointersArray_1, pointer, center, sumX, sumY, stepDelayMs, stepRotation, pointerDetails, step, rotationInRadians, _e, pointerDetails_1, detail, newAngle, newX, newY, _f, pointerDetails_2, detail, finalRotationInRadians, newAngle, newX, newY, _g, pointerDetails_3, detail, finalRotationInRadians, newAngle, newX, newY;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                target = options.target, pointers = options.pointers, _a = options.duration, duration = _a === void 0 ? 500 : _a, _b = options.steps, steps = _b === void 0 ? 10 : _b, _c = options.rotationAngle, rotationAngle = _c === void 0 ? 90 : _c, rotationCenter = options.rotationCenter, _d = options.releasePointers, releasePointers = _d === void 0 ? true : _d;
                if (!target) {
                    throw new Error('Target element is required for rotate gesture');
                }
                pointersArray = pointerManager.parsePointers(pointers, target, {
                    amount: 2,
                    distance: 50,
                });
                if (pointersArray.length < 2) {
                    throw new Error('Rotate gesture requires at least 2 pointers');
                }
                // Start the rotate gesture by pressing down all pointers
                for (_i = 0, pointersArray_1 = pointersArray; _i < pointersArray_1.length; _i++) {
                    pointer = pointersArray_1[_i];
                    pointerManager.pointerDown(pointer);
                }
                if (rotationCenter) {
                    center = rotationCenter;
                }
                else {
                    sumX = pointersArray.reduce(function (sum, p) { return sum + p.x; }, 0);
                    sumY = pointersArray.reduce(function (sum, p) { return sum + p.y; }, 0);
                    center = {
                        x: sumX / pointersArray.length,
                        y: sumY / pointersArray.length,
                    };
                }
                stepDelayMs = duration / steps;
                stepRotation = rotationAngle / steps;
                pointerDetails = pointersArray.map(function (pointer) {
                    // Calculate the radius (distance from center)
                    var dx = pointer.x - center.x;
                    var dy = pointer.y - center.y;
                    var radius = Math.sqrt(dx * dx + dy * dy);
                    // Calculate the initial angle in radians
                    var initialAngle = Math.atan2(dy, dx);
                    return {
                        id: pointer.id,
                        target: pointer.target,
                        radius: radius,
                        initialAngle: initialAngle,
                    };
                });
                step = 1;
                _h.label = 1;
            case 1:
                if (!(step <= steps)) return [3 /*break*/, 6];
                rotationInRadians = (stepRotation * step * Math.PI) / 180;
                for (_e = 0, pointerDetails_1 = pointerDetails; _e < pointerDetails_1.length; _e++) {
                    detail = pointerDetails_1[_e];
                    newAngle = detail.initialAngle + rotationInRadians;
                    newX = center.x + detail.radius * Math.cos(newAngle);
                    newY = center.y + detail.radius * Math.sin(newAngle);
                    pointerManager.pointerMove({
                        id: detail.id,
                        target: detail.target,
                        x: newX,
                        y: newY,
                    });
                }
                if (!(step < steps)) return [3 /*break*/, 5];
                if (!advanceTimers) return [3 /*break*/, 3];
                // eslint-disable-next-line no-await-in-loop
                return [4 /*yield*/, advanceTimers(stepDelayMs)];
            case 2:
                // eslint-disable-next-line no-await-in-loop
                _h.sent();
                return [3 /*break*/, 5];
            case 3: 
            // eslint-disable-next-line no-await-in-loop
            return [4 /*yield*/, new Promise(function (resolve) {
                    setTimeout(resolve, stepDelayMs);
                })];
            case 4:
                // eslint-disable-next-line no-await-in-loop
                _h.sent();
                _h.label = 5;
            case 5:
                step += 1;
                return [3 /*break*/, 1];
            case 6:
                // Handle pointer release based on the releasePointers option
                if (releasePointers === true) {
                    // Release all pointers
                    for (_f = 0, pointerDetails_2 = pointerDetails; _f < pointerDetails_2.length; _f++) {
                        detail = pointerDetails_2[_f];
                        finalRotationInRadians = (rotationAngle * Math.PI) / 180;
                        newAngle = detail.initialAngle + finalRotationInRadians;
                        newX = center.x + detail.radius * Math.cos(newAngle);
                        newY = center.y + detail.radius * Math.sin(newAngle);
                        pointerManager.pointerUp({
                            id: detail.id,
                            target: detail.target,
                            x: newX,
                            y: newY,
                        });
                    }
                }
                else if (Array.isArray(releasePointers)) {
                    // Release only specific pointers
                    for (_g = 0, pointerDetails_3 = pointerDetails; _g < pointerDetails_3.length; _g++) {
                        detail = pointerDetails_3[_g];
                        if (releasePointers.includes(detail.id)) {
                            finalRotationInRadians = (rotationAngle * Math.PI) / 180;
                            newAngle = detail.initialAngle + finalRotationInRadians;
                            newX = center.x + detail.radius * Math.cos(newAngle);
                            newY = center.y + detail.radius * Math.sin(newAngle);
                            pointerManager.pointerUp({
                                id: detail.id,
                                target: detail.target,
                                x: newX,
                                y: newY,
                            });
                        }
                    }
                }
                return [2 /*return*/];
        }
    });
}); };
exports.rotate = rotate;
