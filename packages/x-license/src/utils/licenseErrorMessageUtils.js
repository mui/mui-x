"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showInvalidLicenseKeyError = showInvalidLicenseKeyError;
exports.showLicenseKeyPlanMismatchError = showLicenseKeyPlanMismatchError;
exports.showNotAvailableInInitialProPlanError = showNotAvailableInInitialProPlanError;
exports.showMissingLicenseKeyError = showMissingLicenseKeyError;
exports.showExpiredPackageVersionError = showExpiredPackageVersionError;
exports.showExpiredAnnualGraceLicenseKeyError = showExpiredAnnualGraceLicenseKeyError;
exports.showExpiredAnnualLicenseKeyError = showExpiredAnnualLicenseKeyError;
/**
 * Workaround for the codesadbox preview error.
 *
 * Once these issues are resolved
 * https://github.com/mui/mui-x/issues/15765
 * https://github.com/codesandbox/codesandbox-client/issues/8673
 *
 * `showError` can simply use `console.error` again.
 */
var isCodeSandbox = typeof window !== 'undefined' && window.location.hostname.endsWith('.csb.app');
function showError(message) {
    // eslint-disable-next-line no-console
    var logger = isCodeSandbox ? console.log : console.error;
    logger(__spreadArray(__spreadArray([
        '*************************************************************',
        ''
    ], message, true), [
        '',
        '*************************************************************',
    ], false).join('\n'));
}
function showInvalidLicenseKeyError() {
    showError([
        'MUI X: Invalid license key.',
        '',
        "Your MUI X license key format isn't valid. It could be because the license key is missing a character or has a typo.",
        '',
        'To solve the issue, you need to double check that `setLicenseKey()` is called with the right argument',
        'Please check the license key installation https://mui.com/r/x-license-key-installation.',
    ]);
}
function showLicenseKeyPlanMismatchError() {
    showError([
        'MUI X: License key plan mismatch.',
        '',
        'Your use of MUI X is not compatible with the plan of your license key. The feature you are trying to use is not included in the plan of your license key. This happens if you try to use Data Grid Premium with a license key for the Pro plan.',
        '',
        'To solve the issue, you can upgrade your plan from Pro to Premium at https://mui.com/r/x-get-license?scope=premium.',
        "Of if you didn't intend to use Premium features, you can replace the import of `@mui/x-data-grid-premium` with `@mui/x-data-grid-pro`.",
    ]);
}
function showNotAvailableInInitialProPlanError() {
    showError([
        'MUI X: Component not included in your license.',
        '',
        'The component you are trying to use is not included in the Pro Plan you purchased.',
        '',
        'Your license is from an old version of the Pro Plan that is only compatible with the `@mui/x-data-grid-pro` and `@mui/x-date-pickers-pro` commercial packages.',
        '',
        'To start using another Pro package, please consider reaching to our sales team to upgrade your license or visit https://mui.com/r/x-get-license to get a new license key.',
    ]);
}
function showMissingLicenseKeyError(_a) {
    var plan = _a.plan, packageName = _a.packageName;
    showError([
        'MUI X: Missing license key.',
        '',
        "The license key is missing. You might not be allowed to use `".concat(packageName, "` which is part of MUI X ").concat(plan, "."),
        '',
        'To solve the issue, you can check the free trial conditions: https://mui.com/r/x-license-trial.',
        'If you are eligible no actions are required. If you are not eligible to the free trial, you need to purchase a license https://mui.com/r/x-get-license or stop using the software immediately.',
    ]);
}
function showExpiredPackageVersionError(_a) {
    var packageName = _a.packageName;
    showError([
        'MUI X: Expired package version.',
        '',
        "You have installed a version of `".concat(packageName, "` that is outside of the maintenance plan of your license key. By default, commercial licenses provide access to new versions released during the first year after the purchase."),
        '',
        'To solve the issue, you can renew your license https://mui.com/r/x-get-license or install an older version of the npm package that is compatible with your license key.',
    ]);
}
function showExpiredAnnualGraceLicenseKeyError(_a) {
    var plan = _a.plan, licenseKey = _a.licenseKey, expiryTimestamp = _a.expiryTimestamp;
    showError([
        'MUI X: Expired license key.',
        '',
        "Your annual license key to use MUI X ".concat(plan, " in non-production environments has expired. If you are seeing this development console message, you might be close to breach the license terms by making direct or indirect changes to the frontend of an app that render a MUI X ").concat(plan, " component (more details in https://mui.com/r/x-license-annual)."),
        '',
        'To solve the problem you can either:',
        '',
        '- Renew your license https://mui.com/r/x-get-license and use the new key',
        "- Stop making changes to code depending directly or indirectly on MUI X ".concat(plan, "'s APIs"),
        '',
        'Note that your license is perpetual in production environments with any version released before your license term ends.',
        '',
        "- License key expiry timestamp: ".concat(new Date(expiryTimestamp)),
        "- Installed license key: ".concat(licenseKey),
        '',
    ]);
}
function showExpiredAnnualLicenseKeyError(_a) {
    var plan = _a.plan, licenseKey = _a.licenseKey, expiryTimestamp = _a.expiryTimestamp;
    throw new Error([
        'MUI X: Expired license key.',
        '',
        "Your annual license key to use MUI X ".concat(plan, " in non-production environments has expired. If you are seeing this development console message, you might be close to breach the license terms by making direct or indirect changes to the frontend of an app that render a MUI X ").concat(plan, " component (more details in https://mui.com/r/x-license-annual)."),
        '',
        'To solve the problem you can either:',
        '',
        '- Renew your license https://mui.com/r/x-get-license and use the new key',
        "- Stop making changes to code depending directly or indirectly on MUI X ".concat(plan, "'s APIs"),
        '',
        'Note that your license is perpetual in production environments with any version released before your license term ends.',
        '',
        "- License key expiry timestamp: ".concat(new Date(expiryTimestamp)),
        "- Installed license key: ".concat(licenseKey),
        '',
    ].join('\n'));
}
