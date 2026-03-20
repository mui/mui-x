"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Watermark = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var fastMemo_1 = require("@mui/x-internals/fastMemo");
var useLicenseVerifier_1 = require("../useLicenseVerifier");
var licenseStatus_1 = require("../utils/licenseStatus");
function getLicenseErrorMessage(licenseStatus) {
    switch (licenseStatus) {
        case licenseStatus_1.LICENSE_STATUS.ExpiredAnnualGrace:
        case licenseStatus_1.LICENSE_STATUS.ExpiredAnnual:
            return 'MUI X Expired license key';
        case licenseStatus_1.LICENSE_STATUS.ExpiredVersion:
            return 'MUI X Expired package version';
        case licenseStatus_1.LICENSE_STATUS.Invalid:
            return 'MUI X Invalid license key';
        case licenseStatus_1.LICENSE_STATUS.OutOfScope:
            return 'MUI X License key plan mismatch';
        case licenseStatus_1.LICENSE_STATUS.NotAvailableInInitialProPlan:
            return 'MUI X Product not covered by plan';
        case licenseStatus_1.LICENSE_STATUS.NotFound:
            return 'MUI X Missing license key';
        case licenseStatus_1.LICENSE_STATUS.NotValidForPackage:
            return 'MUI X License key version mismatch';
        default:
            throw new Error('MUI X: Unhandled license status encountered in watermark display. ' +
                'This is an internal error indicating an unknown license status. ' +
                'Please report this issue if you encounter it.');
    }
}
function Watermark(props) {
    var packageInfo = props.packageInfo;
    var licenseStatus = (0, useLicenseVerifier_1.useLicenseVerifier)(packageInfo);
    if (licenseStatus.status === licenseStatus_1.LICENSE_STATUS.Valid) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("div", { style: {
            position: 'absolute',
            pointerEvents: 'none',
            color: '#8282829e',
            zIndex: 100000,
            width: '100%',
            textAlign: 'center',
            bottom: '50%',
            right: 0,
            letterSpacing: 5,
            fontSize: 24,
        }, children: getLicenseErrorMessage(licenseStatus.status) }));
}
var MemoizedWatermark = (0, fastMemo_1.fastMemo)(Watermark);
exports.Watermark = MemoizedWatermark;
