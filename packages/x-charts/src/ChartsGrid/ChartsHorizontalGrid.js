"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsGridHorizontal = ChartsGridHorizontal;
var React = require("react");
var useTicks_1 = require("../hooks/useTicks");
var styledComponents_1 = require("./styledComponents");
/**
 * @ignore - internal component.
 */
function ChartsGridHorizontal(props) {
    var axis = props.axis, start = props.start, end = props.end, classes = props.classes;
    var scale = axis.scale, tickNumber = axis.tickNumber, tickInterval = axis.tickInterval;
    var yTicks = (0, useTicks_1.useTicks)({ scale: scale, tickNumber: tickNumber, tickInterval: tickInterval, direction: 'y' });
    return (<React.Fragment>
      {yTicks.map(function (_a) {
            var _b, _c;
            var value = _a.value, offset = _a.offset;
            return (<styledComponents_1.GridLine key={"horizontal-".concat((_c = (_b = value === null || value === void 0 ? void 0 : value.getTime) === null || _b === void 0 ? void 0 : _b.call(value)) !== null && _c !== void 0 ? _c : value)} y1={offset} y2={offset} x1={start} x2={end} className={classes.horizontalLine}/>);
        })}
    </React.Fragment>);
}
