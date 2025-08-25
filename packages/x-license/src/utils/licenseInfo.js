"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseInfo = void 0;
// Store the license information in a global, so it can be shared
// when module duplication occurs. The duplication of the modules can happen
// if using multiple version of MUI X at the same time of the bundler
// decide to duplicate to improve the size of the chunks.
// eslint-disable-next-line no-underscore-dangle
globalThis.__MUI_LICENSE_INFO__ = globalThis.__MUI_LICENSE_INFO__ || {
    key: undefined,
};
var LicenseInfo = /** @class */ (function () {
    function LicenseInfo() {
    }
    LicenseInfo.getLicenseInfo = function () {
        // eslint-disable-next-line no-underscore-dangle
        return globalThis.__MUI_LICENSE_INFO__;
    };
    LicenseInfo.getLicenseKey = function () {
        return LicenseInfo.getLicenseInfo().key;
    };
    LicenseInfo.setLicenseKey = function (key) {
        var licenseInfo = LicenseInfo.getLicenseInfo();
        licenseInfo.key = key;
    };
    return LicenseInfo;
}());
exports.LicenseInfo = LicenseInfo;
