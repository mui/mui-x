"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.GridShadowScrollArea = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var system_1 = require("@mui/system");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var reveal = (0, system_1.keyframes)({ from: { opacity: 0 }, to: { opacity: 1 } });
var detectScroll = (0, system_1.keyframes)({ 'from, to': { '--scrollable': '" "' } });
// This `styled()` function invokes keyframes. `styled-components` only supports keyframes
// in string templates. Do not convert these styles in JS object as it will break.
var ShadowScrollArea = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ShadowScrollArea',
})(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  animation: ", ";\n  animation-timeline: --scroll-timeline;\n  animation-fill-mode: none;\n  box-sizing: border-box;\n  overflow: auto;\n  scrollbar-width: thin;\n  scroll-timeline: --scroll-timeline block;\n\n  &::before,\n  &::after {\n    content: '';\n    flex-shrink: 0;\n    display: block;\n    position: sticky;\n    left: 0;\n    width: 100%;\n    height: 4px;\n    animation: ", " linear both;\n    animation-timeline: --scroll-timeline;\n\n    // Custom property toggle trick:\n    // - Detects if the element is scrollable\n    // - https://css-tricks.com/the-css-custom-property-toggle-trick/\n    --visibility-scrollable: var(--scrollable) visible;\n    --visibility-not-scrollable: hidden;\n    visibility: var(--visibility-scrollable, var(--visibility-not-scrollable));\n  }\n\n  &::before {\n    top: 0;\n    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 0, transparent 100%);\n    animation-range: 0 4px;\n  }\n\n  &::after {\n    bottom: 0;\n    background: linear-gradient(to top, rgba(0, 0, 0, 0.05) 0, transparent 100%);\n    animation-direction: reverse;\n    animation-range: calc(100% - 4px) 100%;\n  }\n"], ["\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  animation: ", ";\n  animation-timeline: --scroll-timeline;\n  animation-fill-mode: none;\n  box-sizing: border-box;\n  overflow: auto;\n  scrollbar-width: thin;\n  scroll-timeline: --scroll-timeline block;\n\n  &::before,\n  &::after {\n    content: '';\n    flex-shrink: 0;\n    display: block;\n    position: sticky;\n    left: 0;\n    width: 100%;\n    height: 4px;\n    animation: ", " linear both;\n    animation-timeline: --scroll-timeline;\n\n    // Custom property toggle trick:\n    // - Detects if the element is scrollable\n    // - https://css-tricks.com/the-css-custom-property-toggle-trick/\n    --visibility-scrollable: var(--scrollable) visible;\n    --visibility-not-scrollable: hidden;\n    visibility: var(--visibility-scrollable, var(--visibility-not-scrollable));\n  }\n\n  &::before {\n    top: 0;\n    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 0, transparent 100%);\n    animation-range: 0 4px;\n  }\n\n  &::after {\n    bottom: 0;\n    background: linear-gradient(to top, rgba(0, 0, 0, 0.05) 0, transparent 100%);\n    animation-direction: reverse;\n    animation-range: calc(100% - 4px) 100%;\n  }\n"])), detectScroll, reveal);
/**
 * Adds scroll shadows above and below content in a scrollable container.
 */
var GridShadowScrollArea = (0, forwardRef_1.forwardRef)(function GridShadowScrollArea(props, ref) {
    var children = props.children, rest = __rest(props, ["children"]);
    return (<ShadowScrollArea {...rest} ref={ref}>
        {children}
      </ShadowScrollArea>);
});
exports.GridShadowScrollArea = GridShadowScrollArea;
GridShadowScrollArea.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    children: prop_types_1.default.node,
};
var templateObject_1;
