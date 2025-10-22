"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsGridVertical = ChartsGridVertical;
var React = require("react");
var useTicks_1 = require("../hooks/useTicks");
var styledComponents_1 = require("./styledComponents");
/**
 * @ignore - internal component.
 */
function ChartsGridVertical(props) {
    var axis = props.axis, start = props.start, end = props.end, classes = props.classes;
    var scale = axis.scale, tickNumber = axis.tickNumber, tickInterval = axis.tickInterval;
    var xTicks = (0, useTicks_1.useTicks)({ scale: scale, tickNumber: tickNumber, tickInterval: tickInterval, direction: 'x' });
    return (<React.Fragment>
      {xTicks.map(function (_a) {
            var _b, _c;
            var value = _a.value, offset = _a.offset;
            return (<styledComponents_1.GridLine key={"vertical-".concat((_c = (_b = value === null || value === void 0 ? void 0 : value.getTime) === null || _b === void 0 ? void 0 : _b.call(value)) !== null && _c !== void 0 ? _c : value)} y1={start} y2={end} x1={offset} x2={offset} className={classes.verticalLine}/>);
        })}
    </React.Fragment>);
}
