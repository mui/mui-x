import { md5 } from './encoding/md5';
import { base64Encode } from './encoding/base64';

export interface LicenseDetails {
  name: string;
  expiryDate: Date;
  developerCount: number;
  version: string;
}

function getClearLicenseString(details: LicenseDetails): string {
  return `NAME:${details.name},DEVELOPER_COUNT=${
    details.developerCount
  },EXPIRY=${details.expiryDate.getTime()},VERSION=${details.version}`;
}

export const generateLicence = (details: LicenseDetails): string => {
  const clearLicense = getClearLicenseString(details);
  return `${md5(base64Encode(clearLicense))}${base64Encode(clearLicense)}`;
};
