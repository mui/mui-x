import { md5 } from '../encoding/md5';
import { base64Encode } from '../encoding/base64';
import { PLAN_SCOPES, PlanScope, PlanVersion } from '../utils/plan';
import { LICENSE_MODELS, LicenseModel } from '../utils/licenseModel';

const licenseVersion = '2';

export interface LicenseDetails {
  expiryDate: Date;
  licenseModel?: LicenseModel;
  orderNumber: string;
  planScope?: PlanScope;
  planVersion: PlanVersion;
}

function getClearLicenseString(details: LicenseDetails) {
  if (details.planScope && !PLAN_SCOPES.includes(details.planScope)) {
    throw new Error('MUI X: Invalid scope');
  }

  if (details.licenseModel && !LICENSE_MODELS.includes(details.licenseModel)) {
    throw new Error('MUI X: Invalid licensing model');
  }

  const keyParts = [
    `O=${details.orderNumber}`,
    `E=${details.expiryDate.getTime()}`,
    `S=${details.planScope}`,
    `LM=${details.licenseModel}`,
    `PV=${details.planVersion}`,
    `KV=${licenseVersion}`,
  ];

  return keyParts.join(',');
}

export function generateLicense(details: LicenseDetails) {
  const licenseStr = getClearLicenseString(details);

  return `${md5(base64Encode(licenseStr))}${base64Encode(licenseStr)}`;
}
