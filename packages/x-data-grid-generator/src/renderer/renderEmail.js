"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderEmail = renderEmail;
var jsx_runtime_1 = require("react/jsx-runtime");
var renderLink_1 = require("./renderLink");
function renderEmail(params) {
    var _a;
    var email = (_a = params.value) !== null && _a !== void 0 ? _a : '';
    return ((0, jsx_runtime_1.jsx)(renderLink_1.DemoLink, { href: "mailto:".concat(email), tabIndex: params.tabIndex, children: email }));
}
