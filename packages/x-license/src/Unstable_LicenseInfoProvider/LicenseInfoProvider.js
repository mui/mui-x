"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseInfoProvider = LicenseInfoProvider;
var React = require("react");
var MuiLicenseInfoContext_1 = require("./MuiLicenseInfoContext");
/**
 * @ignore - do not document.
 */
function LicenseInfoProvider(_a) {
    var info = _a.info, children = _a.children;
    return <MuiLicenseInfoContext_1.default.Provider value={info}>{children}</MuiLicenseInfoContext_1.default.Provider>;
}
