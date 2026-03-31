import { jsx as _jsx } from "react/jsx-runtime";
import { fastMemo } from '@mui/x-internals/fastMemo';
import { useLicenseVerifier } from '../useLicenseVerifier';
import { LICENSE_STATUS } from '../utils/licenseStatus';
function getLicenseErrorMessage(licenseStatus) {
    switch (licenseStatus) {
        case LICENSE_STATUS.ExpiredAnnualGrace:
        case LICENSE_STATUS.ExpiredAnnual:
            return 'MUI X Expired license key';
        case LICENSE_STATUS.ExpiredVersion:
            return 'MUI X Expired package version';
        case LICENSE_STATUS.Invalid:
            return 'MUI X Invalid license key';
        case LICENSE_STATUS.OutOfScope:
            return 'MUI X License key plan mismatch';
        case LICENSE_STATUS.NotAvailableInInitialProPlan:
            return 'MUI X Product not covered by plan';
        case LICENSE_STATUS.NotFound:
            return 'MUI X Missing license key';
        case LICENSE_STATUS.NotValidForPackage:
            return 'MUI X License key version mismatch';
        default:
            throw new Error('MUI X: Unhandled license status encountered in watermark display. ' +
                'This is an internal error indicating an unknown license status. ' +
                'Please report this issue if you encounter it.');
    }
}
function Watermark(props) {
    const { packageInfo } = props;
    const licenseStatus = useLicenseVerifier(packageInfo);
    if (licenseStatus.status === LICENSE_STATUS.Valid) {
        return null;
    }
    return (_jsx("div", { style: {
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
const MemoizedWatermark = fastMemo(Watermark);
export { MemoizedWatermark as Watermark };
