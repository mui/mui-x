import { base64Decode, base64Encode } from './encoding/base64';
import { md5 } from './encoding/md5';

export enum LicenseStatus {
  Invalid = 'Invalid',
  Expired = 'Expired',
  Valid = 'Valid',
}

export const generateReleaseInfo = (date: Date) => {
  return base64Encode(date.getTime().toString());
};

// This is the grid release date
// each grid version should update this const automatically when a new version of the grid is published to NPM
const RELEASE_INFO = generateReleaseInfo(new Date(new Date().getTime() - 100));
const expiryReg = /^.*EXPIRY=([0-9]+),.*$/;

export const verifyLicense = (encodedLicense: string) => {
  const hash = encodedLicense.substr(0, 32);
  const encoded = encodedLicense.substr(32);

  if (hash !== md5(encoded)) {
    return LicenseStatus.Invalid;
  }

  const clearLicense = base64Decode(encoded);
  try {
    const expiryTimestamp = parseInt(clearLicense.match(expiryReg)![1], 10);
    if (!expiryTimestamp) {
      console.error('Error checking license. Expiry timestamp not found!');
      return LicenseStatus.Invalid;
    }

    if (expiryTimestamp < parseInt(base64Decode(RELEASE_INFO), 10)) {
      return LicenseStatus.Expired;
    }

    return LicenseStatus.Valid;
  } catch (e) {
    console.error('Error checking license. Expiry timestamp not found!');
    return LicenseStatus.Invalid;
  }
};
