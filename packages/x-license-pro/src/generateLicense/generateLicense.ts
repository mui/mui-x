import { md5 } from '../encoding/md5';
import { base64Encode } from '../encoding/base64';

const licenseVersion = '2';

export type LicenseScope = 'pro' | 'premium';

export interface LicenseDetails {
  orderNumber: string;
  expiryDate: Date;
  // TODO: to be made required once the store is updated
  scope?: LicenseScope;
}

function getClearLicenseString(details: LicenseDetails) {
  return `ORDER:${
    details.orderNumber
  },EXPIRY=${details.expiryDate.getTime()},KEYVERSION=${licenseVersion},SCOPE=${details.scope}`;
}

export function generateLicense(details: LicenseDetails) {
  let clearLicense;
  if (details.scope) {
    clearLicense = getClearLicenseString(details);
  } else {
    clearLicense = getClearLicenseString({ ...details, scope: 'pro' });
  }

  return `${md5(base64Encode(clearLicense))}${base64Encode(clearLicense)}`;
}
