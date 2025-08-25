"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharedLicenseStatuses = void 0;
exports.clearLicenseStatusCache = clearLicenseStatusCache;
exports.useLicenseVerifier = useLicenseVerifier;
var React = require("react");
var x_telemetry_1 = require("@mui/x-telemetry");
var verifyLicense_1 = require("../verifyLicense/verifyLicense");
var licenseInfo_1 = require("../utils/licenseInfo");
var licenseErrorMessageUtils_1 = require("../utils/licenseErrorMessageUtils");
var licenseStatus_1 = require("../utils/licenseStatus");
var MuiLicenseInfoContext_1 = require("../Unstable_LicenseInfoProvider/MuiLicenseInfoContext");
exports.sharedLicenseStatuses = {};
/**
 * Clears the license status cache for all packages.
 * This should not be used in production code, but can be useful for testing purposes.
 */
function clearLicenseStatusCache() {
    for (var packageName in exports.sharedLicenseStatuses) {
        if (Object.prototype.hasOwnProperty.call(exports.sharedLicenseStatuses, packageName)) {
            delete exports.sharedLicenseStatuses[packageName];
        }
    }
}
function useLicenseVerifier(packageName, releaseInfo) {
    var contextKey = React.useContext(MuiLicenseInfoContext_1.default).key;
    return React.useMemo(function () {
        var licenseKey = contextKey !== null && contextKey !== void 0 ? contextKey : licenseInfo_1.LicenseInfo.getLicenseKey();
        // Cache the response to not trigger the error twice.
        if (exports.sharedLicenseStatuses[packageName] &&
            exports.sharedLicenseStatuses[packageName].key === licenseKey) {
            return exports.sharedLicenseStatuses[packageName].licenseVerifier;
        }
        var plan = packageName.includes('premium') ? 'Premium' : 'Pro';
        var licenseStatus = (0, verifyLicense_1.verifyLicense)({
            releaseInfo: releaseInfo,
            licenseKey: licenseKey,
            packageName: packageName,
        });
        var fullPackageName = "@mui/".concat(packageName);
        (0, x_telemetry_1.sendMuiXTelemetryEvent)(x_telemetry_1.muiXTelemetryEvents.licenseVerification({ licenseKey: licenseKey }, {
            packageName: packageName,
            packageReleaseInfo: releaseInfo,
            licenseStatus: licenseStatus === null || licenseStatus === void 0 ? void 0 : licenseStatus.status,
        }));
        if (licenseStatus.status === licenseStatus_1.LICENSE_STATUS.Valid) {
            // Skip
        }
        else if (licenseStatus.status === licenseStatus_1.LICENSE_STATUS.Invalid) {
            (0, licenseErrorMessageUtils_1.showInvalidLicenseKeyError)();
        }
        else if (licenseStatus.status === licenseStatus_1.LICENSE_STATUS.NotAvailableInInitialProPlan) {
            (0, licenseErrorMessageUtils_1.showNotAvailableInInitialProPlanError)();
        }
        else if (licenseStatus.status === licenseStatus_1.LICENSE_STATUS.OutOfScope) {
            (0, licenseErrorMessageUtils_1.showLicenseKeyPlanMismatchError)();
        }
        else if (licenseStatus.status === licenseStatus_1.LICENSE_STATUS.NotFound) {
            (0, licenseErrorMessageUtils_1.showMissingLicenseKeyError)({ plan: plan, packageName: fullPackageName });
        }
        else if (licenseStatus.status === licenseStatus_1.LICENSE_STATUS.ExpiredAnnualGrace) {
            (0, licenseErrorMessageUtils_1.showExpiredAnnualGraceLicenseKeyError)(__assign({ plan: plan }, licenseStatus.meta));
        }
        else if (licenseStatus.status === licenseStatus_1.LICENSE_STATUS.ExpiredAnnual) {
            (0, licenseErrorMessageUtils_1.showExpiredAnnualLicenseKeyError)(__assign({ plan: plan }, licenseStatus.meta));
        }
        else if (licenseStatus.status === licenseStatus_1.LICENSE_STATUS.ExpiredVersion) {
            (0, licenseErrorMessageUtils_1.showExpiredPackageVersionError)({ packageName: fullPackageName });
        }
        else if (process.env.NODE_ENV !== 'production') {
            throw new Error('missing status handler');
        }
        exports.sharedLicenseStatuses[packageName] = { key: licenseKey, licenseVerifier: licenseStatus };
        return licenseStatus;
    }, [packageName, releaseInfo, contextKey]);
}
