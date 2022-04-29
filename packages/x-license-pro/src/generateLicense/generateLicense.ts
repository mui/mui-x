import { md5 } from '../encoding/md5';
import { base64Encode } from '../encoding/base64';
import { LicenseScope } from '../utils/licenseScope';
import { LicenseTerm } from '../utils/licenseTerm';

const licenseVersion = '2';

export interface LicenseDetails {
  orderNumber: string;
  expiryDate: Date;
  // TODO: to be made required once the store is updated
  scope?: LicenseScope;
  // TODO: to be made required once the store is updated
  term?: LicenseTerm;
}

function getClearLicenseString(details: LicenseDetails) {
  return `ORDER=${
    details.orderNumber
  },E=${details.expiryDate.getTime()},KEYVERSION=${licenseVersion},SCOPE=${
    details.scope ?? 'pro'
  },TERM=${details.term ?? 'subscription'}`;
}

export function generateLicense(details: LicenseDetails) {
  const licenseStr = getClearLicenseString(details);

  return `${md5(base64Encode(licenseStr))}${base64Encode(licenseStr)}`;
}
