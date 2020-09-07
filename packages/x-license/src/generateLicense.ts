import { md5 } from './encoding/md5';
import { base64Encode } from './encoding/base64';

const licenseVersion = '1';
export interface LicenseDetails {
  orderNumber: string;
  expiryDate: Date;
}

function getClearLicenseString(details: LicenseDetails) {
  return `ORDER:${
    details.orderNumber
  },EXPIRY=${details.expiryDate.getTime()},KEYVERSION=${licenseVersion}`;
}

export function generateLicence(details: LicenseDetails) {
  const clearLicense = getClearLicenseString(details);
  return `${md5(base64Encode(clearLicense))}${base64Encode(clearLicense)}`;
}
