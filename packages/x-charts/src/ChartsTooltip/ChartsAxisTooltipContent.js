"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsAxisTooltipContent = ChartsAxisTooltipContent;
var React = require("react");
var prop_types_1 = require("prop-types");
var Typography_1 = require("@mui/material/Typography");
var clsx_1 = require("clsx");
var chartsTooltipClasses_1 = require("./chartsTooltipClasses");
var ChartsTooltipTable_1 = require("./ChartsTooltipTable");
var useAxesTooltip_1 = require("./useAxesTooltip");
var ChartsLabelMark_1 = require("../ChartsLabel/ChartsLabelMark");
function ChartsAxisTooltipContent(props) {
    var classes = (0, chartsTooltipClasses_1.useUtilityClasses)(props.classes);
    var tooltipData = (0, useAxesTooltip_1.useAxesTooltip)();
    if (tooltipData === null) {
        return null;
    }
    return (<ChartsTooltipTable_1.ChartsTooltipPaper sx={props.sx} className={classes.paper}>
      {tooltipData.map(function (_a) {
            var axisId = _a.axisId, mainAxis = _a.mainAxis, axisValue = _a.axisValue, axisFormattedValue = _a.axisFormattedValue, seriesItems = _a.seriesItems;
            return (<ChartsTooltipTable_1.ChartsTooltipTable className={classes.table} key={axisId}>
            {axisValue != null && !mainAxis.hideTooltip && (<Typography_1.default component="caption">{axisFormattedValue}</Typography_1.default>)}

            <tbody>
              {seriesItems.map(function (_a) {
                    var seriesId = _a.seriesId, color = _a.color, formattedValue = _a.formattedValue, formattedLabel = _a.formattedLabel, markType = _a.markType;
                    if (formattedValue == null) {
                        return null;
                    }
                    return (<ChartsTooltipTable_1.ChartsTooltipRow key={seriesId} className={classes.row}>
                    <ChartsTooltipTable_1.ChartsTooltipCell className={(0, clsx_1.default)(classes.labelCell, classes.cell)} component="th">
                      <div className={classes.markContainer}>
                        <ChartsLabelMark_1.ChartsLabelMark type={markType} color={color} className={classes.mark}/>
                      </div>
                      {formattedLabel || null}
                    </ChartsTooltipTable_1.ChartsTooltipCell>
                    <ChartsTooltipTable_1.ChartsTooltipCell className={(0, clsx_1.default)(classes.valueCell, classes.cell)} component="td">
                      {formattedValue}
                    </ChartsTooltipTable_1.ChartsTooltipCell>
                  </ChartsTooltipTable_1.ChartsTooltipRow>);
                })}
            </tbody>
          </ChartsTooltipTable_1.ChartsTooltipTable>);
        })}
    </ChartsTooltipTable_1.ChartsTooltipPaper>);
}
ChartsAxisTooltipContent.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
