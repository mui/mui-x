import { md5 } from '../encoding/md5';
import { base64Encode } from '../encoding/base64';
import { LICENSE_SCOPES, LicenseScope, PlanVersion } from '../utils/licenseScope';
import { LICENSING_MODELS, LicensingModel } from '../utils/licensingModel';

const licenseVersion = '2';

export interface LicenseDetails {
  orderNumber: string;
  expiryDate: Date;
  scope: LicenseScope;
  licensingModel: LicensingModel;
  planVersion: PlanVersion;
}

function getClearLicenseString(details: LicenseDetails) {
  if (details.scope && !LICENSE_SCOPES.includes(details.scope)) {
    throw new Error('MUI X: Invalid scope');
  }

  if (details.licensingModel && !LICENSING_MODELS.includes(details.licensingModel)) {
    throw new Error('MUI X: Invalid licensing model');
  }

  const keyParts = [
    `O=${details.orderNumber}`,
    `E=${details.expiryDate.getTime()}`,
    `S=${details.scope}`,
    `LM=${details.licensingModel}`,
    `PV=${details.planVersion}`,
    `KV=${licenseVersion}`,
  ];

  return keyParts.join(',');
}

export function generateLicense(details: LicenseDetails) {
  const licenseStr = getClearLicenseString(details);

  return `${md5(base64Encode(licenseStr))}${base64Encode(licenseStr)}`;
}
