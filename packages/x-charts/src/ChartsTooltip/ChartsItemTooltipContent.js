"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsItemTooltipContent = ChartsItemTooltipContent;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var Typography_1 = require("@mui/material/Typography");
var chartsTooltipClasses_1 = require("./chartsTooltipClasses");
var useItemTooltip_1 = require("./useItemTooltip");
var ChartsTooltipTable_1 = require("./ChartsTooltipTable");
var ChartsLabelMark_1 = require("../ChartsLabel/ChartsLabelMark");
function ChartsItemTooltipContent(props) {
    var propClasses = props.classes, sx = props.sx;
    var tooltipData = (0, useItemTooltip_1.useInternalItemTooltip)();
    var classes = (0, chartsTooltipClasses_1.useUtilityClasses)(propClasses);
    if (!tooltipData) {
        return null;
    }
    if ('values' in tooltipData) {
        var seriesLabel = tooltipData.label, color_1 = tooltipData.color, markType_1 = tooltipData.markType;
        return (<ChartsTooltipTable_1.ChartsTooltipPaper sx={sx} className={classes.paper}>
        <ChartsTooltipTable_1.ChartsTooltipTable className={classes.table}>
          <Typography_1.default component="caption">
            <div className={classes.markContainer}>
              <ChartsLabelMark_1.ChartsLabelMark type={markType_1} color={color_1} className={classes.mark}/>
            </div>
            {seriesLabel}
          </Typography_1.default>
          <tbody>
            {tooltipData.values.map(function (_a) {
                var formattedValue = _a.formattedValue, label = _a.label;
                return (<ChartsTooltipTable_1.ChartsTooltipRow key={label} className={classes.row}>
                <ChartsTooltipTable_1.ChartsTooltipCell className={(0, clsx_1.default)(classes.labelCell, classes.cell)} component="th">
                  {label}
                </ChartsTooltipTable_1.ChartsTooltipCell>
                <ChartsTooltipTable_1.ChartsTooltipCell className={(0, clsx_1.default)(classes.valueCell, classes.cell)} component="td">
                  {formattedValue}
                </ChartsTooltipTable_1.ChartsTooltipCell>
              </ChartsTooltipTable_1.ChartsTooltipRow>);
            })}
          </tbody>
        </ChartsTooltipTable_1.ChartsTooltipTable>
      </ChartsTooltipTable_1.ChartsTooltipPaper>);
    }
    var color = tooltipData.color, label = tooltipData.label, formattedValue = tooltipData.formattedValue, markType = tooltipData.markType;
    return (<ChartsTooltipTable_1.ChartsTooltipPaper sx={sx} className={classes.paper}>
      <ChartsTooltipTable_1.ChartsTooltipTable className={classes.table}>
        <tbody>
          <ChartsTooltipTable_1.ChartsTooltipRow className={classes.row}>
            <ChartsTooltipTable_1.ChartsTooltipCell className={(0, clsx_1.default)(classes.labelCell, classes.cell)} component="th">
              <div className={classes.markContainer}>
                <ChartsLabelMark_1.ChartsLabelMark type={markType} color={color} className={classes.mark}/>
              </div>
              {label}
            </ChartsTooltipTable_1.ChartsTooltipCell>
            <ChartsTooltipTable_1.ChartsTooltipCell className={(0, clsx_1.default)(classes.valueCell, classes.cell)} component="td">
              {formattedValue}
            </ChartsTooltipTable_1.ChartsTooltipCell>
          </ChartsTooltipTable_1.ChartsTooltipRow>
        </tbody>
      </ChartsTooltipTable_1.ChartsTooltipTable>
    </ChartsTooltipTable_1.ChartsTooltipPaper>);
}
ChartsItemTooltipContent.propTypes = {
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
