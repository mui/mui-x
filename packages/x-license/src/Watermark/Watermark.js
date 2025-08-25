"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Watermark = void 0;
var React = require("react");
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
        default:
            throw new Error('Unhandled MUI X license status.');
    }
}
function Watermark(props) {
    var packageName = props.packageName, releaseInfo = props.releaseInfo;
    var licenseStatus = (0, useLicenseVerifier_1.useLicenseVerifier)(packageName, releaseInfo);
    if (licenseStatus.status === licenseStatus_1.LICENSE_STATUS.Valid) {
        return null;
    }
    return (<div style={{
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
        }}>
      {getLicenseErrorMessage(licenseStatus.status)}
    </div>);
}
var MemoizedWatermark = (0, fastMemo_1.fastMemo)(Watermark);
exports.Watermark = MemoizedWatermark;
