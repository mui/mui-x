"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLicense = generateLicense;
var md5_1 = require("../encoding/md5");
var base64_1 = require("../encoding/base64");
var plan_1 = require("../utils/plan");
var licenseModel_1 = require("../utils/licenseModel");
var licenseVersion = '2';
function getClearLicenseString(details) {
    if (details.planScope && !plan_1.PLAN_SCOPES.includes(details.planScope)) {
        throw new Error('MUI X: Invalid scope');
    }
    if (details.licenseModel && !licenseModel_1.LICENSE_MODELS.includes(details.licenseModel)) {
        throw new Error('MUI X: Invalid licensing model');
    }
    var keyParts = [
        "O=".concat(details.orderNumber),
        "E=".concat(details.expiryDate.getTime()),
        "S=".concat(details.planScope),
        "LM=".concat(details.licenseModel),
        "PV=".concat(details.planVersion),
        "KV=".concat(licenseVersion),
    ];
    return keyParts.join(',');
}
function generateLicense(details) {
    var licenseStr = getClearLicenseString(details);
    return "".concat((0, md5_1.md5)((0, base64_1.base64Encode)(licenseStr))).concat((0, base64_1.base64Encode)(licenseStr));
}
