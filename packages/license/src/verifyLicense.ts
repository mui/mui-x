import { base64Decode, base64Encode } from './encoding/base64';
import { md5 } from './encoding/md5';

export enum LicenseStatus {
  NotFound = 'NotFound',
  Invalid = 'Invalid',
  Expired = 'Expired',
  Valid = 'Valid',
}

export const generateReleaseInfo = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return base64Encode(today.getTime().toString());
};

const MUI_DOMAINS = ['https://muix-preview.netlify.app/', 'https://muix-storybook.netlify.app/', 'material-ui.com/'];
const isOnMUIDomain = () => MUI_DOMAINS.some(domain => window != null && window.location.href.indexOf(domain) > -1);

const expiryReg = /^.*EXPIRY=([0-9]+),.*$/;

export const verifyLicense = (releaseInfo: string, encodedLicense: string) => {
  if (isOnMUIDomain()) {
    return LicenseStatus.Valid;
  }

  if (!releaseInfo) {
    throw new Error('Release Info missing! Not able to validate license!');
  }

  if (!encodedLicense) {
    return LicenseStatus.NotFound;
  }

  const hash = encodedLicense.substr(0, 32);
  const encoded = encodedLicense.substr(32);

  if (hash !== md5(encoded)) {
    return LicenseStatus.Invalid;
  }

  const clearLicense = base64Decode(encoded);
  let expiryTimestamp = 0;
  try {
    expiryTimestamp = parseInt(clearLicense.match(expiryReg)![1], 10);
    if (!expiryTimestamp || isNaN(expiryTimestamp)) {
      console.error('Error checking license. Expiry timestamp not found or invalid!');
      return LicenseStatus.Invalid;
    }
  } catch (err) {
    console.error('Error extracting license expiry timestamp.', err);
    return LicenseStatus.Invalid;
  }

  const pkgTimestamp = parseInt(base64Decode(releaseInfo), 10);
  if (isNaN(pkgTimestamp)) {
    throw new Error('Package ReleaseInfo is invalid. Cannot check license key!');
  }

  if (expiryTimestamp < pkgTimestamp) {
    return LicenseStatus.Expired;
  }

  return LicenseStatus.Valid;
};
