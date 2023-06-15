import * as React from 'react';
import { MuiCommercialPackageName, useLicenseVerifier } from '../useLicenseVerifier';
import { LicenseStatus } from '../utils/licenseStatus';

function getLicenseErrorMessage(licenseStatus: LicenseStatus) {
  switch (licenseStatus) {
    case LicenseStatus.ExpiredAnnual:
      return 'MUI X Expired license key';
    case LicenseStatus.ExpiredVersion:
      return 'MUI X Expired package version';
    case LicenseStatus.Invalid:
      return 'MUI X Invalid license key';
    case LicenseStatus.OutOfScope:
      return 'MUI X License key plan mismatch';
    case LicenseStatus.NotFound:
      return 'MUI X Missing license key';
    default:
      throw new Error('MUI: Unhandled MUI X license status.');
  }
}

interface WatermarkProps {
  packageName: MuiCommercialPackageName;
  releaseInfo: string;
}

export function Watermark(props: WatermarkProps) {
  const { packageName, releaseInfo } = props;
  const licenseStatus = useLicenseVerifier(packageName, releaseInfo);
  const ref = React.useRef<HTMLDivElement>(null);
  const [key, setKey] = React.useState(2);

  if (licenseStatus === LicenseStatus.Valid) {
    return null;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/rules-of-hooks
  React.useEffect(() => {
    if (
      // The element was removed from the DOM, add it back
      ref.current!.parentElement === null ||
      // The element was hidden, add it back
      (ref.current!.checkVisibility &&
        !ref.current!.checkVisibility({
          checkOpacity: true,
          checkVisibilityCSS: true,
        }))
    ) {
      setKey(Math.random());
    }
  });

  return (
    <div
      ref={ref}
      key={key}
      style={{
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
      }}
    >
      {getLicenseErrorMessage(licenseStatus)}
    </div>
  );
}
