"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Outline;
var React = require("react");
var styles_1 = require("@mui/material/styles");
var createStyled_1 = require("@mui/system/createStyled");
var usePickerTextFieldOwnerState_1 = require("../usePickerTextFieldOwnerState");
var OutlineRoot = (0, styles_1.styled)('fieldset', {
    name: 'MuiPickersOutlinedInput',
    slot: 'NotchedOutline',
})(function (_a) {
    var theme = _a.theme;
    var borderColor = theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';
    return {
        textAlign: 'left',
        position: 'absolute',
        bottom: 0,
        right: 0,
        top: -5,
        left: 0,
        margin: 0,
        padding: '0 8px',
        pointerEvents: 'none',
        borderRadius: 'inherit',
        borderStyle: 'solid',
        borderWidth: 1,
        overflow: 'hidden',
        minWidth: '0%',
        borderColor: theme.vars
            ? "rgba(".concat(theme.vars.palette.common.onBackgroundChannel, " / 0.23)")
            : borderColor,
    };
});
var OutlineLabel = (0, styles_1.styled)('span')(function (_a) {
    var theme = _a.theme;
    return ({
        fontFamily: theme.typography.fontFamily,
        fontSize: 'inherit',
    });
});
var OutlineLegend = (0, styles_1.styled)('legend', {
    shouldForwardProp: function (prop) { return (0, createStyled_1.shouldForwardProp)(prop) && prop !== 'notched'; },
})(function (_a) {
    var theme = _a.theme;
    return ({
        float: 'unset', // Fix conflict with bootstrap
        width: 'auto', // Fix conflict with bootstrap
        overflow: 'hidden', // Fix Horizontal scroll when label too long
        variants: [
            {
                props: { inputHasLabel: false },
                style: {
                    padding: 0,
                    lineHeight: '11px', // sync with `height` in `legend` styles
                    transition: theme.transitions.create('width', {
                        duration: 150,
                        easing: theme.transitions.easing.easeOut,
                    }),
                },
            },
            {
                props: { inputHasLabel: true },
                style: {
                    display: 'block', // Fix conflict with normalize.css and sanitize.css
                    padding: 0,
                    height: 11, // sync with `lineHeight` in `legend` styles
                    fontSize: '0.75em',
                    visibility: 'hidden',
                    maxWidth: 0.01,
                    transition: theme.transitions.create('max-width', {
                        duration: 50,
                        easing: theme.transitions.easing.easeOut,
                    }),
                    whiteSpace: 'nowrap',
                    '& > span': {
                        paddingLeft: 5,
                        paddingRight: 5,
                        display: 'inline-block',
                        opacity: 0,
                        visibility: 'visible',
                    },
                },
            },
            {
                props: { inputHasLabel: true, notched: true },
                style: {
                    maxWidth: '100%',
                    transition: theme.transitions.create('max-width', {
                        duration: 100,
                        easing: theme.transitions.easing.easeOut,
                        delay: 50,
                    }),
                },
            },
        ],
    });
});
/**
 * @ignore - internal component.
 */
function Outline(props) {
    var children = props.children, className = props.className, label = props.label, notched = props.notched, shrink = props.shrink, other = __rest(props, ["children", "className", "label", "notched", "shrink"]);
    var ownerState = (0, usePickerTextFieldOwnerState_1.usePickerTextFieldOwnerState)();
    return (<OutlineRoot aria-hidden className={className} {...other} ownerState={ownerState}>
      <OutlineLegend ownerState={ownerState} notched={notched}>
        {/* Use the nominal use case of the legend, avoid rendering artefacts. */}
        {label ? (<OutlineLabel>{label}</OutlineLabel>) : (
        // notranslate needed while Google Translate will not fix zero-width space issue
        <OutlineLabel className="notranslate">&#8203;</OutlineLabel>)}
      </OutlineLegend>
    </OutlineRoot>);
}
