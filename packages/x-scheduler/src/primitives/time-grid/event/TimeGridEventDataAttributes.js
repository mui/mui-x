"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeGridEventDataAttributes = void 0;
var TimeGridEventDataAttributes;
(function (TimeGridEventDataAttributes) {
    /**
     * Present when the event start date is in the past.
     */
    TimeGridEventDataAttributes["started"] = "data-started";
    /**
     * Present when the event end date is in the past.
     */
    TimeGridEventDataAttributes["ended"] = "data-ended";
    /**
     * Present when the event is being dragged.
     */
    TimeGridEventDataAttributes["dragging"] = "data-dragging";
    /**
     * Present when the event is being resized.
     */
    TimeGridEventDataAttributes["resizing"] = "data-resizing";
})(TimeGridEventDataAttributes || (exports.TimeGridEventDataAttributes = TimeGridEventDataAttributes = {}));
