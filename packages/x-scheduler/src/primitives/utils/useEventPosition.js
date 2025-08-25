"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEventPosition = useEventPosition;
var React = require("react");
var useAdapter_1 = require("./adapter/useAdapter");
function useEventPosition(parameters) {
    var start = parameters.start, end = parameters.end, collectionStart = parameters.collectionStart, collectionEnd = parameters.collectionEnd;
    var adapter = (0, useAdapter_1.useAdapter)();
    return React.useMemo(function () {
        // TODO: Avoid JS date conversion
        var getTimestamp = function (date) { return adapter.toJsDate(date).getTime(); };
        var collectionStartTimestamp = getTimestamp(collectionStart);
        var collectionEndTimestamp = getTimestamp(collectionEnd);
        var collectionDurationMs = collectionEndTimestamp - collectionStartTimestamp;
        var startTimestamp = Math.max(getTimestamp(start), collectionStartTimestamp);
        var endTimestamp = Math.min(getTimestamp(end), collectionEndTimestamp);
        return {
            position: (startTimestamp - collectionStartTimestamp) / collectionDurationMs,
            duration: (endTimestamp - startTimestamp) / collectionDurationMs,
        };
    }, [adapter, collectionStart, collectionEnd, start, end]);
}
