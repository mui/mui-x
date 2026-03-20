"use strict";
/**
 * Utility functions for gesture calculations
 * Re-exporting all utility functions from their individual files
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.preventDefault = exports.getPinchDirection = exports.isDirectionAllowed = exports.getVelocity = exports.getDistance = exports.getDirection = exports.getAngle = exports.createEventName = exports.calculateRotationAngle = exports.calculateCentroid = exports.calculateAverageDistance = void 0;
var calculateAverageDistance_1 = require("./calculateAverageDistance");
Object.defineProperty(exports, "calculateAverageDistance", { enumerable: true, get: function () { return calculateAverageDistance_1.calculateAverageDistance; } });
var calculateCentroid_1 = require("./calculateCentroid");
Object.defineProperty(exports, "calculateCentroid", { enumerable: true, get: function () { return calculateCentroid_1.calculateCentroid; } });
var calculateRotationAngle_1 = require("./calculateRotationAngle");
Object.defineProperty(exports, "calculateRotationAngle", { enumerable: true, get: function () { return calculateRotationAngle_1.calculateRotationAngle; } });
var createEventName_1 = require("./createEventName");
Object.defineProperty(exports, "createEventName", { enumerable: true, get: function () { return createEventName_1.createEventName; } });
var getAngle_1 = require("./getAngle");
Object.defineProperty(exports, "getAngle", { enumerable: true, get: function () { return getAngle_1.getAngle; } });
var getDirection_1 = require("./getDirection");
Object.defineProperty(exports, "getDirection", { enumerable: true, get: function () { return getDirection_1.getDirection; } });
var getDistance_1 = require("./getDistance");
Object.defineProperty(exports, "getDistance", { enumerable: true, get: function () { return getDistance_1.getDistance; } });
var getVelocity_1 = require("./getVelocity");
Object.defineProperty(exports, "getVelocity", { enumerable: true, get: function () { return getVelocity_1.getVelocity; } });
var isDirectionAllowed_1 = require("./isDirectionAllowed");
Object.defineProperty(exports, "isDirectionAllowed", { enumerable: true, get: function () { return isDirectionAllowed_1.isDirectionAllowed; } });
var getPinchDirection_1 = require("./getPinchDirection");
Object.defineProperty(exports, "getPinchDirection", { enumerable: true, get: function () { return getPinchDirection_1.getPinchDirection; } });
var preventDefault_1 = require("./preventDefault");
Object.defineProperty(exports, "preventDefault", { enumerable: true, get: function () { return preventDefault_1.preventDefault; } });
