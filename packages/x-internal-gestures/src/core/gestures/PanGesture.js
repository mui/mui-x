"use strict";
/**
 * PanGesture - Detects panning (dragging) movements
 *
 * This gesture tracks pointer dragging movements across elements, firing events when:
 * - The drag movement begins and passes the threshold distance (start)
 * - The drag movement continues (ongoing)
 * - The drag movement ends (end)
 *
 * The gesture can be configured to recognize movement only in specific directions.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanGesture = void 0;
var PointerGesture_1 = require("../PointerGesture");
var utils_1 = require("../utils");
/**
 * PanGesture class for handling panning/dragging interactions
 *
 * This gesture detects when users drag across elements with one or more pointers,
 * and dispatches directional movement events with delta and velocity information.
 */
var PanGesture = /** @class */ (function (_super) {
    __extends(PanGesture, _super);
    function PanGesture(options) {
        var _this = _super.call(this, options) || this;
        _this.state = {
            startPointers: new Map(),
            startCentroid: null,
            lastCentroid: null,
            movementThresholdReached: false,
            totalDeltaX: 0,
            totalDeltaY: 0,
            activeDeltaX: 0,
            activeDeltaY: 0,
            lastDirection: {
                vertical: null,
                horizontal: null,
                mainAxis: null,
            },
            lastDeltas: null,
        };
        _this.direction = options.direction || ['up', 'down', 'left', 'right'];
        _this.threshold = options.threshold || 0;
        return _this;
    }
    PanGesture.prototype.clone = function (overrides) {
        return new PanGesture(__assign({ name: this.name, preventDefault: this.preventDefault, stopPropagation: this.stopPropagation, threshold: this.threshold, minPointers: this.minPointers, maxPointers: this.maxPointers, direction: __spreadArray([], this.direction, true), requiredKeys: __spreadArray([], this.requiredKeys, true), pointerMode: __spreadArray([], this.pointerMode, true), preventIf: __spreadArray([], this.preventIf, true) }, overrides));
    };
    PanGesture.prototype.destroy = function () {
        this.resetState();
        _super.prototype.destroy.call(this);
    };
    PanGesture.prototype.updateOptions = function (options) {
        _super.prototype.updateOptions.call(this, options);
        this.direction = options.direction || this.direction;
    };
    PanGesture.prototype.resetState = function () {
        this.isActive = false;
        this.state = __assign(__assign({}, this.state), { startPointers: new Map(), startCentroid: null, lastCentroid: null, lastDeltas: null, activeDeltaX: 0, activeDeltaY: 0, movementThresholdReached: false, lastDirection: {
                vertical: null,
                horizontal: null,
                mainAxis: null,
            } });
    };
    /**
     * Handle pointer events for the pan gesture
     */
    PanGesture.prototype.handlePointerEvent = function (pointers, event) {
        var _this = this;
        var _a;
        var pointersArray = Array.from(pointers.values());
        // Check for our forceCancel event to handle interrupted gestures (from contextmenu, blur)
        if (event.type === 'forceCancel') {
            // Reset all active pan gestures when we get a force reset event
            this.cancel(event.target, pointersArray, event);
            return;
        }
        // Find which element (if any) is being targeted
        var targetElement = this.getTargetElement(event);
        if (!targetElement) {
            return;
        }
        // Check if this gesture should be prevented by active gestures
        if (this.shouldPreventGesture(targetElement)) {
            // If the gesture was active but now should be prevented, cancel it gracefully
            this.cancel(targetElement, pointersArray, event);
            return;
        }
        // Filter pointers to only include those targeting our element or its children
        var relevantPointers = this.getRelevantPointers(pointersArray, targetElement);
        // Check if we have enough pointers and not too many
        if (relevantPointers.length < this.minPointers || relevantPointers.length > this.maxPointers) {
            // Cancel or end the gesture if it was active
            this.cancel(targetElement, relevantPointers, event);
            return;
        }
        switch (event.type) {
            case 'pointerdown':
                if (!this.isActive && !this.state.startCentroid) {
                    // Store initial pointers
                    relevantPointers.forEach(function (pointer) {
                        _this.state.startPointers.set(pointer.pointerId, pointer);
                    });
                    // Store the original target element
                    this.originalTarget = targetElement;
                    // Calculate and store the starting centroid
                    this.state.startCentroid = (0, utils_1.calculateCentroid)(relevantPointers);
                    this.state.lastCentroid = __assign({}, this.state.startCentroid);
                }
                break;
            case 'pointermove':
                if (this.state.startCentroid && relevantPointers.length >= this.minPointers) {
                    // Calculate current centroid
                    var currentCentroid = (0, utils_1.calculateCentroid)(relevantPointers);
                    // Calculate delta from start
                    var distanceDeltaX = currentCentroid.x - this.state.startCentroid.x;
                    var distanceDeltaY = currentCentroid.y - this.state.startCentroid.y;
                    // Calculate movement distance
                    var distance = Math.sqrt(distanceDeltaX * distanceDeltaX + distanceDeltaY * distanceDeltaY);
                    // Determine movement direction
                    var moveDirection = (0, utils_1.getDirection)((_a = this.state.lastCentroid) !== null && _a !== void 0 ? _a : this.state.startCentroid, currentCentroid);
                    // Calculate change in position since last move
                    var lastDeltaX = this.state.lastCentroid
                        ? currentCentroid.x - this.state.lastCentroid.x
                        : 0;
                    var lastDeltaY = this.state.lastCentroid
                        ? currentCentroid.y - this.state.lastCentroid.y
                        : 0;
                    // Check if movement passes the threshold and is in an allowed direction
                    if (!this.state.movementThresholdReached &&
                        distance >= this.threshold &&
                        (0, utils_1.isDirectionAllowed)(moveDirection, this.direction)) {
                        this.state.movementThresholdReached = true;
                        this.isActive = true;
                        // Update total accumulated delta
                        this.state.lastDeltas = { x: lastDeltaX, y: lastDeltaY };
                        this.state.totalDeltaX += lastDeltaX;
                        this.state.totalDeltaY += lastDeltaY;
                        this.state.activeDeltaX += lastDeltaX;
                        this.state.activeDeltaY += lastDeltaY;
                        // Emit start event
                        this.emitPanEvent(targetElement, 'start', relevantPointers, event, currentCentroid);
                        this.emitPanEvent(targetElement, 'ongoing', relevantPointers, event, currentCentroid);
                    }
                    // If we've already crossed the threshold, continue tracking
                    else if (this.state.movementThresholdReached && this.isActive) {
                        // Update total accumulated delta
                        this.state.lastDeltas = { x: lastDeltaX, y: lastDeltaY };
                        this.state.totalDeltaX += lastDeltaX;
                        this.state.totalDeltaY += lastDeltaY;
                        this.state.activeDeltaX += lastDeltaX;
                        this.state.activeDeltaY += lastDeltaY;
                        // Emit ongoing event
                        this.emitPanEvent(targetElement, 'ongoing', relevantPointers, event, currentCentroid);
                    }
                    // Update last centroid
                    this.state.lastCentroid = currentCentroid;
                    this.state.lastDirection = moveDirection;
                }
                break;
            case 'pointerup':
            case 'pointercancel':
            case 'forceCancel':
                // If the gesture was active (threshold was reached), emit end event
                if (this.isActive && this.state.movementThresholdReached) {
                    // If we have less than the minimum required pointers, end the gesture
                    if (relevantPointers.filter(function (p) { return p.type !== 'pointerup' && p.type !== 'pointercancel'; })
                        .length < this.minPointers) {
                        // End the gesture
                        var currentCentroid = this.state.lastCentroid || this.state.startCentroid;
                        if (event.type === 'pointercancel') {
                            this.emitPanEvent(targetElement, 'cancel', relevantPointers, event, currentCentroid);
                        }
                        this.emitPanEvent(targetElement, 'end', relevantPointers, event, currentCentroid);
                        this.resetState();
                    }
                }
                else {
                    this.resetState();
                }
                break;
            default:
                break;
        }
    };
    /**
     * Emit pan-specific events with additional data
     */
    PanGesture.prototype.emitPanEvent = function (element, phase, pointers, event, currentCentroid) {
        var _a, _b, _c, _d;
        if (!this.state.startCentroid) {
            return;
        }
        var deltaX = (_b = (_a = this.state.lastDeltas) === null || _a === void 0 ? void 0 : _a.x) !== null && _b !== void 0 ? _b : 0;
        var deltaY = (_d = (_c = this.state.lastDeltas) === null || _c === void 0 ? void 0 : _c.y) !== null && _d !== void 0 ? _d : 0;
        // Calculate velocity - time difference in seconds
        var firstPointer = this.state.startPointers.values().next().value;
        var timeElapsed = firstPointer ? (event.timeStamp - firstPointer.timeStamp) / 1000 : 0;
        var velocityX = timeElapsed > 0 ? deltaX / timeElapsed : 0;
        var velocityY = timeElapsed > 0 ? deltaY / timeElapsed : 0;
        var velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        // Get list of active gestures
        var activeGestures = this.gesturesRegistry.getActiveGestures(element);
        // Create custom event data
        var customEventData = {
            gestureName: this.name,
            initialCentroid: this.state.startCentroid,
            centroid: currentCentroid,
            target: event.target,
            srcEvent: event,
            phase: phase,
            pointers: pointers,
            timeStamp: event.timeStamp,
            deltaX: deltaX,
            deltaY: deltaY,
            direction: this.state.lastDirection,
            velocityX: velocityX,
            velocityY: velocityY,
            velocity: velocity,
            totalDeltaX: this.state.totalDeltaX,
            totalDeltaY: this.state.totalDeltaY,
            activeDeltaX: this.state.activeDeltaX,
            activeDeltaY: this.state.activeDeltaY,
            activeGestures: activeGestures,
            customData: this.customData,
        };
        // Event names to trigger
        var eventName = (0, utils_1.createEventName)(this.name, phase);
        // Dispatch custom events on the element
        var domEvent = new CustomEvent(eventName, {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: customEventData,
        });
        element.dispatchEvent(domEvent);
        // Apply preventDefault/stopPropagation if configured
        if (this.preventDefault) {
            event.preventDefault();
        }
        if (this.stopPropagation) {
            event.stopPropagation();
        }
    };
    /**
     * Cancel the current gesture
     */
    PanGesture.prototype.cancel = function (element, pointers, event) {
        if (this.isActive) {
            var el = element !== null && element !== void 0 ? element : this.element;
            this.emitPanEvent(el, 'cancel', pointers, event, this.state.lastCentroid);
            this.emitPanEvent(el, 'end', pointers, event, this.state.lastCentroid);
        }
        this.resetState();
    };
    return PanGesture;
}(PointerGesture_1.PointerGesture));
exports.PanGesture = PanGesture;
