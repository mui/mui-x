"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderRating = renderRating;
var React = require("react");
var Box_1 = require("@mui/material/Box");
var Rating_1 = require("@mui/material/Rating");
var RatingValue = React.memo(function RatingValue(props) {
    var value = props.value;
    return (<Box_1.default sx={{
            display: 'flex',
            alignItems: 'center',
            lineHeight: '24px',
            color: 'text.secondary',
        }}>
      <Rating_1.default value={value} sx={{ mr: 1 }} readOnly/> {Math.round(Number(value) * 10) / 10}
    </Box_1.default>);
});
function renderRating(params) {
    if (params.value == null) {
        return '';
    }
    // If the aggregated value does not have the same unit as the other cell
    // Then we fall back to the default rendering based on `valueGetter` instead of rendering the total price UI.
    if (params.aggregation && !params.aggregation.hasCellUnit) {
        return null;
    }
    return <RatingValue value={params.value}/>;
}
