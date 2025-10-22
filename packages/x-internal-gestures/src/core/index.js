"use strict";
/**
 * Gesture Events Library
 *
 * A centralized pointer event-based gesture recognition library
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnWheelGesture = exports.TapGesture = exports.TapAndDragGesture = exports.RotateGesture = exports.PressGesture = exports.PressAndDragGesture = exports.PinchGesture = exports.PanGesture = exports.MoveGesture = exports.PointerManager = exports.PointerGesture = exports.KeyboardManager = exports.GestureManager = exports.Gesture = void 0;
// Export core classes
var Gesture_1 = require("./Gesture");
Object.defineProperty(exports, "Gesture", { enumerable: true, get: function () { return Gesture_1.Gesture; } });
var GestureManager_1 = require("./GestureManager");
Object.defineProperty(exports, "GestureManager", { enumerable: true, get: function () { return GestureManager_1.GestureManager; } });
var KeyboardManager_1 = require("./KeyboardManager");
Object.defineProperty(exports, "KeyboardManager", { enumerable: true, get: function () { return KeyboardManager_1.KeyboardManager; } });
var PointerGesture_1 = require("./PointerGesture");
Object.defineProperty(exports, "PointerGesture", { enumerable: true, get: function () { return PointerGesture_1.PointerGesture; } });
var PointerManager_1 = require("./PointerManager");
Object.defineProperty(exports, "PointerManager", { enumerable: true, get: function () { return PointerManager_1.PointerManager; } });
// Export gesture implementations
var MoveGesture_1 = require("./gestures/MoveGesture");
Object.defineProperty(exports, "MoveGesture", { enumerable: true, get: function () { return MoveGesture_1.MoveGesture; } });
var PanGesture_1 = require("./gestures/PanGesture");
Object.defineProperty(exports, "PanGesture", { enumerable: true, get: function () { return PanGesture_1.PanGesture; } });
var PinchGesture_1 = require("./gestures/PinchGesture");
Object.defineProperty(exports, "PinchGesture", { enumerable: true, get: function () { return PinchGesture_1.PinchGesture; } });
var PressAndDragGesture_1 = require("./gestures/PressAndDragGesture");
Object.defineProperty(exports, "PressAndDragGesture", { enumerable: true, get: function () { return PressAndDragGesture_1.PressAndDragGesture; } });
var PressGesture_1 = require("./gestures/PressGesture");
Object.defineProperty(exports, "PressGesture", { enumerable: true, get: function () { return PressGesture_1.PressGesture; } });
var RotateGesture_1 = require("./gestures/RotateGesture");
Object.defineProperty(exports, "RotateGesture", { enumerable: true, get: function () { return RotateGesture_1.RotateGesture; } });
var TapAndDragGesture_1 = require("./gestures/TapAndDragGesture");
Object.defineProperty(exports, "TapAndDragGesture", { enumerable: true, get: function () { return TapAndDragGesture_1.TapAndDragGesture; } });
var TapGesture_1 = require("./gestures/TapGesture");
Object.defineProperty(exports, "TapGesture", { enumerable: true, get: function () { return TapGesture_1.TapGesture; } });
var TurnWheelGesture_1 = require("./gestures/TurnWheelGesture");
Object.defineProperty(exports, "TurnWheelGesture", { enumerable: true, get: function () { return TurnWheelGesture_1.TurnWheelGesture; } });
