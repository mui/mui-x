"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRangePosition = void 0;
var useControlled_1 = require("@mui/utils/useControlled");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useRangePosition = function (props) {
    var _a;
    var _b = (0, useControlled_1.default)({
        name: 'useRangePosition',
        state: 'rangePosition',
        controlled: props.rangePosition,
        default: (_a = props.defaultRangePosition) !== null && _a !== void 0 ? _a : 'start',
    }), rangePosition = _b[0], setRangePosition = _b[1];
    var handleRangePositionChange = (0, useEventCallback_1.default)(function (newRangePosition) {
        var _a;
        setRangePosition(newRangePosition);
        (_a = props.onRangePositionChange) === null || _a === void 0 ? void 0 : _a.call(props, newRangePosition);
    });
    return { rangePosition: rangePosition, setRangePosition: handleRangePositionChange };
};
exports.useRangePosition = useRangePosition;
