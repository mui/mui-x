import { base64Decode, base64Encode } from './encoding/base64';
import { md5 } from './encoding/md5';
import { LicenseStatus } from './licenseStatus';

export function generateReleaseInfo() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return base64Encode(today.getTime().toString());
}

const expiryReg = /^.*EXPIRY=([0-9]+),.*$/;

export function verifyLicense(releaseInfo: string, encodedLicense: string) {
  if (!releaseInfo) {
    throw new Error('MUI: The release information is missing. Not able to validate license.');
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
    if (!expiryTimestamp || Number.isNaN(expiryTimestamp)) {
      console.error('Error checking license. Expiry timestamp not found or invalid!');
      return LicenseStatus.Invalid;
    }
  } catch (err) {
    console.error('Error extracting license expiry timestamp.', err);
    return LicenseStatus.Invalid;
  }

  const pkgTimestamp = parseInt(base64Decode(releaseInfo), 10);
  if (Number.isNaN(pkgTimestamp)) {
    throw new Error('MUI: The release information is invalid. Not able to validate license.');
  }

  if (expiryTimestamp < pkgTimestamp) {
    return LicenseStatus.Expired;
  }

  return LicenseStatus.Valid;
}
