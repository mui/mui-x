import { md5 } from '../encoding/md5';
import { base64Encode } from '../encoding/base64';

const licenseVersion = '1';

export type LicenseType = 'pro' | 'premium';

export interface LicenseDetails {
  orderNumber: string;
  expiryDate: Date;
  // TODO: to be made required once the store is updated
  type?: LicenseType;
}

function getClearLicenseString(details: LicenseDetails) {
  return `ORDER:${
    details.orderNumber
  },EXPIRY=${details.expiryDate.getTime()},KEYVERSION=${licenseVersion},TYPE=${details.type}`;
}

export function generateLicense(details: LicenseDetails) {
  let clearLicense;
  if (details.type) {
    clearLicense = getClearLicenseString(details);
  } else {
    clearLicense = getClearLicenseString({ ...details, type: 'pro' });
  }

  return `${md5(base64Encode(clearLicense))}${base64Encode(clearLicense)}`;
}
