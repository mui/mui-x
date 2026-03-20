"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseInfoProvider = LicenseInfoProvider;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var MuiLicenseInfoContext_1 = require("./MuiLicenseInfoContext");
/**
 * @ignore - do not document.
 */
function LicenseInfoProvider(_a) {
    var info = _a.info, children = _a.children;
    return (0, jsx_runtime_1.jsx)(MuiLicenseInfoContext_1.default.Provider, { value: info, children: children });
}
