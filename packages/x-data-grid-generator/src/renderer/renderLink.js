"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoLink = void 0;
exports.renderLink = renderLink;
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
    return (<Link tabIndex={props.tabIndex} onClick={handleClick} href={props.href}>
      {props.children}
    </Link>);
});
function renderLink(params) {
    if (params.value == null) {
        return '';
    }
    return (<exports.DemoLink href={params.value} tabIndex={params.tabIndex}>
      {params.value}
    </exports.DemoLink>);
}
