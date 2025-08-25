"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_DRAG_PRECISION_MS = exports.EVENT_DRAG_PRECISION_MINUTE = void 0;
exports.getCursorPositionRelativeToElement = getCursorPositionRelativeToElement;
exports.isDraggingTimeGridEvent = isDraggingTimeGridEvent;
exports.isDraggingTimeGridEventResizeHandler = isDraggingTimeGridEventResizeHandler;
exports.createDateFromPositionInCollection = createDateFromPositionInCollection;
exports.EVENT_DRAG_PRECISION_MINUTE = 15;
exports.EVENT_DRAG_PRECISION_MS = exports.EVENT_DRAG_PRECISION_MINUTE * 60 * 1000;
function getCursorPositionRelativeToElement(_a) {
    var ref = _a.ref, input = _a.input;
    if (!ref.current) {
        return { y: 0 };
    }
    var clientY = input.clientY;
    var pos = ref.current.getBoundingClientRect();
    var y = clientY - pos.y;
    return { y: y };
}
function isDraggingTimeGridEvent(data) {
    return data.source === 'TimeGridEvent';
}
function isDraggingTimeGridEventResizeHandler(data) {
    return data.source === 'TimeGridEventResizeHandler';
}
function createDateFromPositionInCollection(parameters) {
    var adapter = parameters.adapter, collectionStart = parameters.collectionStart, collectionEnd = parameters.collectionEnd, position = parameters.position;
    // TODO: Avoid JS date conversion
    var getTimestamp = function (date) { return adapter.toJsDate(date).getTime(); };
    var collectionStartTimestamp = getTimestamp(collectionStart);
    var collectionEndTimestamp = getTimestamp(collectionEnd);
    var collectionDurationMs = collectionEndTimestamp - collectionStartTimestamp;
    var positionInCollectionMs = collectionDurationMs * position;
    var roundedPositionInCollectionMs = Math.round(positionInCollectionMs / exports.EVENT_DRAG_PRECISION_MS) * exports.EVENT_DRAG_PRECISION_MS;
    // TODO: Use "addMilliseconds" instead of "addSeconds" when available in the adapter
    return adapter.addSeconds(collectionStart, roundedPositionInCollectionMs / 1000);
}
