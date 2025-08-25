"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderEmail = renderEmail;
var React = require("react");
var renderLink_1 = require("./renderLink");
function renderEmail(params) {
    var _a;
    var email = (_a = params.value) !== null && _a !== void 0 ? _a : '';
    return (<renderLink_1.DemoLink href={"mailto:".concat(email)} tabIndex={params.tabIndex}>
      {email}
    </renderLink_1.DemoLink>);
}
