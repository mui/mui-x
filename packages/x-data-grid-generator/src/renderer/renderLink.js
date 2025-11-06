"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoLink = void 0;
exports.renderLink = renderLink;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var Link = (0, styles_1.styled)('a')({
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    color: 'inherit',
});
exports.DemoLink = React.memo(function DemoLink(props) {
    var handleClick = function (event) {
        event.preventDefault();
        event.stopPropagation();
    };
    return ((0, jsx_runtime_1.jsx)(Link, { tabIndex: props.tabIndex, onClick: handleClick, href: props.href, children: props.children }));
});
function renderLink(params) {
    if (params.value == null) {
        return '';
    }
    return ((0, jsx_runtime_1.jsx)(exports.DemoLink, { href: params.value, tabIndex: params.tabIndex, children: params.value }));
}
