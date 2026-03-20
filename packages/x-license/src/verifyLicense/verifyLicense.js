"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLicenseTokens = parseLicenseTokens;
exports.decodeLicenseVersion2 = decodeLicenseVersion2;
exports.decodeLicenseVersion3 = decodeLicenseVersion3;
exports.decodeLicense = decodeLicense;
exports.verifyLicense = verifyLicense;
var base64_1 = require("../encoding/base64");
var md5_1 = require("../encoding/md5");
var licenseStatus_1 = require("../utils/licenseStatus");
var licensePlan_1 = require("../utils/licensePlan");
var licenseModel_1 = require("../utils/licenseModel");
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
var MAX_V8_PLAN_VERSION = 'Q3-2024';
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
        keyVersion: 1,
        licenseModel: 'perpetual',
        planScope: 'pro',
        planVersion: 'initial',
        expiryTimestamp: expiryTimestamp,
        expiryDate: expiryTimestamp ? new Date(expiryTimestamp) : null,
        orderId: orderId,
        appType: 'multi',
        quantity: null,
        isTestKey: license.includes('T=true'),
    };
}
/**
 * Parse a comma-separated key=value license string into a NullableLicenseDetails object.
 * Shared by v2 and v3 decoders.
 */
function parseLicenseTokens(license, licenseInfo) {
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
        if (key === 'Q') {
            var qty = parseInt(value, 10);
            if (qty && !Number.isNaN(qty)) {
                licenseInfo.quantity = qty;
            }
        }
        if (key === 'AT') {
            licenseInfo.appType = value;
        }
        if (key === 'T') {
            licenseInfo.isTestKey = value === 'true';
        }
    });
}
/**
 * Format: O=${orderNumber},E=${expiryTimestamp},S=${planScope},LM=${licenseModel},PV=${planVersion},KV=2
 */
function decodeLicenseVersion2(license) {
    var licenseInfo = {
        keyVersion: 2,
        licenseModel: null,
        planScope: null,
        planVersion: 'initial',
        expiryTimestamp: null,
        expiryDate: null,
        orderId: null,
        appType: 'multi',
        quantity: null,
        isTestKey: false,
    };
    parseLicenseTokens(license, licenseInfo);
    return licenseInfo;
}
/**
 * Format: O=${orderNumber},E=${expiryTimestamp},S=${planScope},LM=${licenseModel},PV=${planVersion},Q=${quantity},AT=${appType},KV=3
 */
function decodeLicenseVersion3(license) {
    var licenseInfo = {
        keyVersion: 3,
        licenseModel: null,
        planScope: null,
        planVersion: 'initial',
        expiryTimestamp: null,
        expiryDate: null,
        orderId: null,
        appType: null,
        quantity: null,
        isTestKey: false,
    };
    parseLicenseTokens(license, licenseInfo);
    return licenseInfo;
}
/**
 * Decode the license based on its key version and return a version-agnostic `NullableLicenseDetails` object.
 */
function decodeLicense(encodedLicense) {
    var license = (0, base64_1.base64Decode)(encodedLicense);
    if (license.includes('KEYVERSION=1')) {
        return decodeLicenseVersion1(license);
    }
    if (license.includes('KV=2')) {
        return decodeLicenseVersion2(license);
    }
    if (license.includes('KV=3')) {
        return decodeLicenseVersion3(license);
    }
    return null;
}
function verifyLicense(_a) {
    var packageInfo = _a.packageInfo, licenseKey = _a.licenseKey;
    var packageName = packageInfo.name, releaseDate = packageInfo.releaseDate, packageVersion = packageInfo.version;
    var packageMajorVersion = parseInt(packageVersion !== null && packageVersion !== void 0 ? packageVersion : '', 10);
    if (!releaseDate) {
        throw new Error('MUI X: The release information is missing and license validation cannot proceed. ' +
            'This is an internal error that should not occur in normal usage. ' +
            'Please report this issue if you encounter it.');
    }
    if (!licenseKey) {
        return { status: licenseStatus_1.LICENSE_STATUS.NotFound };
    }
    var hash = licenseKey.slice(0, 32);
    var encoded = licenseKey.slice(32);
    if (hash !== (0, md5_1.md5)(encoded)) {
        return { status: licenseStatus_1.LICENSE_STATUS.Invalid };
    }
    var license = decodeLicense(encoded);
    if (license == null) {
        console.error('MUI X: Error checking license. Key version not found!');
        return { status: licenseStatus_1.LICENSE_STATUS.Invalid };
    }
    // Reject test license keys outside of test environments.
    // Gets replaced with `false` during production builds, making it impossible
    // for users of published packages to use test licenses.
    // @ts-ignore
    if (license.isTestKey && !__ALLOW_TEST_LICENSES__) {
        console.error('MUI X: Error checking license. Test license key used in a non-test environment!');
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
        var pkgTimestamp = parseInt((0, base64_1.base64Decode)(releaseDate), 10);
        if (Number.isNaN(pkgTimestamp)) {
            throw new Error('MUI X: The release information is invalid and license validation cannot proceed. ' +
                'The package release timestamp could not be parsed. ' +
                'This may indicate a corrupted package. Try reinstalling the MUI X packages.');
        }
        if (license.expiryTimestamp < pkgTimestamp) {
            // Perpetual v8 (or older) licenses whose expiry predates this package release
            // are not valid for v9 packages.
            if (packageMajorVersion != null &&
                packageMajorVersion >= 9 &&
                license.licenseModel === 'perpetual' &&
                (0, licensePlan_1.isPlanVersionOlderOrEqual)(license.planVersion, MAX_V8_PLAN_VERSION)) {
                return { status: licenseStatus_1.LICENSE_STATUS.NotValidForPackage };
            }
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
    if (license.planScope == null || !licensePlan_1.PLAN_SCOPES.includes(license.planScope)) {
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
    // v8 licenses (Q1-2026 and older) are not valid for v9 packages.
    // Perpetual licenses are exempt as they are already gated by the expiry date check.
    if (packageMajorVersion != null &&
        packageMajorVersion >= 9 &&
        license.licenseModel !== 'perpetual' &&
        (0, licensePlan_1.isPlanVersionOlderOrEqual)(license.planVersion, MAX_V8_PLAN_VERSION)) {
        return { status: licenseStatus_1.LICENSE_STATUS.NotValidForPackage };
    }
    return { status: licenseStatus_1.LICENSE_STATUS.Valid };
}
