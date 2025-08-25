"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderEditProgress = renderEditProgress;
var React = require("react");
var clsx_1 = require("clsx");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var Slider_1 = require("@mui/material/Slider");
var Tooltip_1 = require("@mui/material/Tooltip");
var debounce_1 = require("@mui/utils/debounce");
var styles_1 = require("@mui/material/styles");
var StyledSlider = (0, styles_1.styled)(Slider_1.default)(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            borderRadius: 0
        },
        _b["& .".concat(Slider_1.sliderClasses.rail)] = {
            height: '100%',
            backgroundColor: 'transparent',
        },
        _b["& .".concat(Slider_1.sliderClasses.track)] = {
            height: '100%',
            transition: theme.transitions.create('background-color', {
                duration: theme.transitions.duration.shorter,
            }),
            '&.low': {
                backgroundColor: '#f44336',
            },
            '&.medium': {
                backgroundColor: '#efbb5aa3',
            },
            '&.high': {
                backgroundColor: '#088208a3',
            },
        },
        _b["& .".concat(Slider_1.sliderClasses.thumb)] = {
            height: '100%',
            width: 5,
            borderRadius: 0,
            marginTop: 0,
            backgroundColor: (0, styles_1.alpha)('#000000', 0.2),
        },
        _b);
});
function ValueLabelComponent(props) {
    var children = props.children, open = props.open, value = props.value;
    return (<Tooltip_1.default open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip_1.default>);
}
function EditProgress(props) {
    var id = props.id, value = props.value, field = props.field;
    var _a = React.useState(Number(value)), valueState = _a[0], setValueState = _a[1];
    var apiRef = (0, x_data_grid_premium_1.useGridApiContext)();
    var updateCellEditProps = React.useCallback(function (newValue) {
        apiRef.current.setEditCellValue({ id: id, field: field, value: newValue });
    }, [apiRef, field, id]);
    var debouncedUpdateCellEditProps = React.useMemo(function () { return (0, debounce_1.default)(updateCellEditProps, 60); }, [updateCellEditProps]);
    var handleChange = function (event, newValue) {
        setValueState(newValue);
        debouncedUpdateCellEditProps(newValue);
    };
    React.useEffect(function () {
        setValueState(Number(value));
    }, [value]);
    var handleRef = function (element) {
        if (element) {
            element.querySelector('[type="range"]').focus();
        }
    };
    return (<StyledSlider ref={handleRef} classes={{
            track: (0, clsx_1.default)({
                low: valueState < 0.3,
                medium: valueState >= 0.3 && valueState <= 0.7,
                high: valueState > 0.7,
            }),
        }} value={valueState} max={1} step={0.00001} onChange={handleChange} components={{ ValueLabel: ValueLabelComponent }} valueLabelDisplay="auto" valueLabelFormat={function (newValue) { return "".concat((newValue * 100).toLocaleString(), " %"); }}/>);
}
function renderEditProgress(params) {
    return <EditProgress {...params}/>;
}
