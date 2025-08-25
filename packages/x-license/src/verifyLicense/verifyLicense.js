"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReleaseInfo = generateReleaseInfo;
exports.verifyLicense = verifyLicense;
var base64_1 = require("../encoding/base64");
var md5_1 = require("../encoding/md5");
var licenseStatus_1 = require("../utils/licenseStatus");
var plan_1 = require("../utils/plan");
var licenseModel_1 = require("../utils/licenseModel");
var getDefaultReleaseDate = function () {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};
function generateReleaseInfo(releaseDate) {
    if (releaseDate === void 0) { releaseDate = getDefaultReleaseDate(); }
    return (0, base64_1.base64Encode)(releaseDate.getTime().toString());
}
function isPlanScopeSufficient(packageName, planScope) {
    var acceptedScopes;
    if (packageName.includes('-pro')) {
        acceptedScopes = ['pro', 'premium'];
    }
    else if (packageName.includes('-premium')) {
        acceptedScopes = ['premium'];
    }
    else {
        acceptedScopes = [];
    }
    return acceptedScopes.includes(planScope);
}
var expiryReg = /^.*EXPIRY=([0-9]+),.*$/;
var orderReg = /^.*ORDER:([0-9]+),.*$/;
var PRO_PACKAGES_AVAILABLE_IN_INITIAL_PRO_PLAN = [
    'x-data-grid-pro',
    'x-date-pickers-pro',
];
/**
 * Format: ORDER:${orderNumber},EXPIRY=${expiryTimestamp},KEYVERSION=1
 */
function decodeLicenseVersion1(license) {
    var expiryTimestamp;
    var orderId;
    try {
        expiryTimestamp = parseInt(license.match(expiryReg)[1], 10);
        if (!expiryTimestamp || Number.isNaN(expiryTimestamp)) {
            expiryTimestamp = null;
        }
        orderId = parseInt(license.match(orderReg)[1], 10);
        if (!orderId || Number.isNaN(orderId)) {
            orderId = null;
        }
    }
    catch (err) {
        expiryTimestamp = null;
        orderId = null;
    }
    return {
        version: 1,
        licenseModel: 'perpetual',
        planScope: 'pro',
        planVersion: 'initial',
        expiryTimestamp: expiryTimestamp,
        expiryDate: expiryTimestamp ? new Date(expiryTimestamp) : null,
        orderId: orderId,
    };
}
/**
 * Format: O=${orderNumber},E=${expiryTimestamp},S=${planScope},LM=${licenseModel},PV=${planVersion},KV=2`;
 */
function decodeLicenseVersion2(license) {
    var licenseInfo = {
        version: 2,
        licenseModel: null,
        planScope: null,
        planVersion: 'initial',
        expiryTimestamp: null,
        expiryDate: null,
        orderId: null,
    };
    license
        .split(',')
        .map(function (token) { return token.split('='); })
        .filter(function (el) { return el.length === 2; })
        .forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (key === 'S') {
            licenseInfo.planScope = value;
        }
        if (key === 'LM') {
            licenseInfo.licenseModel = value;
        }
        if (key === 'E') {
            var expiryTimestamp = parseInt(value, 10);
            if (expiryTimestamp && !Number.isNaN(expiryTimestamp)) {
                licenseInfo.expiryTimestamp = expiryTimestamp;
                licenseInfo.expiryDate = new Date(expiryTimestamp);
            }
        }
        if (key === 'PV') {
            licenseInfo.planVersion = value;
        }
        if (key === 'O') {
            var orderNum = parseInt(value, 10);
            if (orderNum && !Number.isNaN(orderNum)) {
                licenseInfo.orderId = orderNum;
            }
        }
    });
    return licenseInfo;
}
/**
 * Decode the license based on its key version and return a version-agnostic `MuiLicense` object.
 */
function decodeLicense(encodedLicense) {
    var license = (0, base64_1.base64Decode)(encodedLicense);
    if (license.includes('KEYVERSION=1')) {
        return decodeLicenseVersion1(license);
    }
    if (license.includes('KV=2')) {
        return decodeLicenseVersion2(license);
    }
    return null;
}
function verifyLicense(_a) {
    var releaseInfo = _a.releaseInfo, licenseKey = _a.licenseKey, packageName = _a.packageName;
    // Gets replaced at build time
    // @ts-ignore
    if (LICENSE_DISABLE_CHECK) {
        return { status: licenseStatus_1.LICENSE_STATUS.Valid };
    }
    if (!releaseInfo) {
        throw new Error('MUI X: The release information is missing. Not able to validate license.');
    }
    if (!licenseKey) {
        return { status: licenseStatus_1.LICENSE_STATUS.NotFound };
    }
    var hash = licenseKey.substr(0, 32);
    var encoded = licenseKey.substr(32);
    if (hash !== (0, md5_1.md5)(encoded)) {
        return { status: licenseStatus_1.LICENSE_STATUS.Invalid };
    }
    var license = decodeLicense(encoded);
    if (license == null) {
        console.error('MUI X: Error checking license. Key version not found!');
        return { status: licenseStatus_1.LICENSE_STATUS.Invalid };
    }
    if (license.licenseModel == null || !licenseModel_1.LICENSE_MODELS.includes(license.licenseModel)) {
        console.error('MUI X: Error checking license. License model not found or invalid!');
        return { status: licenseStatus_1.LICENSE_STATUS.Invalid };
    }
    if (license.expiryTimestamp == null) {
        console.error('MUI X: Error checking license. Expiry timestamp not found or invalid!');
        return { status: licenseStatus_1.LICENSE_STATUS.Invalid };
    }
    if (license.licenseModel === 'perpetual' || process.env.NODE_ENV === 'production') {
        var pkgTimestamp = parseInt((0, base64_1.base64Decode)(releaseInfo), 10);
        if (Number.isNaN(pkgTimestamp)) {
            throw new Error('MUI X: The release information is invalid. Not able to validate license.');
        }
        if (license.expiryTimestamp < pkgTimestamp) {
            return { status: licenseStatus_1.LICENSE_STATUS.ExpiredVersion };
        }
    }
    else if (license.licenseModel === 'subscription' || license.licenseModel === 'annual') {
        if (new Date().getTime() > license.expiryTimestamp) {
            if (
            // 30 days grace
            new Date().getTime() < license.expiryTimestamp + 1000 * 3600 * 24 * 30 ||
                process.env.NODE_ENV !== 'development') {
                return {
                    status: licenseStatus_1.LICENSE_STATUS.ExpiredAnnualGrace,
                    meta: { expiryTimestamp: license.expiryTimestamp, licenseKey: licenseKey },
                };
            }
            return {
                status: licenseStatus_1.LICENSE_STATUS.ExpiredAnnual,
                meta: { expiryTimestamp: license.expiryTimestamp, licenseKey: licenseKey },
            };
        }
    }
    if (license.planScope == null || !plan_1.PLAN_SCOPES.includes(license.planScope)) {
        console.error('MUI X: Error checking license. planScope not found or invalid!');
        return { status: licenseStatus_1.LICENSE_STATUS.Invalid };
    }
    if (!isPlanScopeSufficient(packageName, license.planScope)) {
        return { status: licenseStatus_1.LICENSE_STATUS.OutOfScope };
    }
    // 'charts-pro' or 'tree-view-pro' can only be used with a newer Pro license
    if (license.planVersion === 'initial' &&
        license.planScope === 'pro' &&
        !PRO_PACKAGES_AVAILABLE_IN_INITIAL_PRO_PLAN.includes(packageName)) {
        return { status: licenseStatus_1.LICENSE_STATUS.NotAvailableInInitialProPlan };
    }
    return { status: licenseStatus_1.LICENSE_STATUS.Valid };
}
