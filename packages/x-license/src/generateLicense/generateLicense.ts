import { LICENSE_UPDATE_TIMESTAMPS } from '@mui/x-license/generateLicense/licenseUpdateTimestamps';
import { md5 } from '../encoding/md5';
import { base64Encode } from '../encoding/base64';
import { LICENSE_SCOPES, LicenseScope } from '../utils/licenseScope';
import { LICENSING_MODELS, LicensingModel } from '../utils/licensingModel';

const licenseVersion = '2';

export interface LicenseDetails {
  orderNumber: string;
  expiryDate: Date;
  purchaseDate?: Date;
  scope: LicenseScope;
  licensingModel: LicensingModel;
}

function getClearLicenseString(details: LicenseDetails) {
  if (details.scope && !LICENSE_SCOPES.includes(details.scope)) {
    throw new Error('MUI X: Invalid scope');
  }

  if (details.licensingModel && !LICENSING_MODELS.includes(details.licensingModel)) {
    throw new Error('MUI X: Invalid licensing model');
  }

  if (!details.purchaseDate || new Date().getTime() < LICENSE_UPDATE_TIMESTAMPS['2024-07']) {
    throw new Error('MUI X: Licenses generated without a purchaseDate are not supported');
  }

  const parts = [
    `O=${details.orderNumber}`,
    `E=${details.expiryDate.getTime()}`,
    `S=${details.scope}`,
    `LM=${details.licensingModel}`,
    `KV=${licenseVersion}`,
  ];

  if (details.purchaseDate) {
    parts.splice(1, 0, `P=${details.purchaseDate.getTime()}`);
  }

  return parts.join(',');
}

export function generateLicense(details: LicenseDetails) {
  const licenseStr = getClearLicenseString(details);

  return `${md5(base64Encode(licenseStr))}${base64Encode(licenseStr)}`;
}
