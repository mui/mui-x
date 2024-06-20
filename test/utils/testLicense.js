import { LicenseInfo, generateLicense } from '@mui/x-license';

export function generateTestLicenseKey() {
  const expiryDate = new Date();
  // Set the expiry date to 1 hour from now just to be on the safe side.
  // Tests usually take up to 15 minutes to run on CI.
  expiryDate.setHours(expiryDate.getHours() + 1);
  return generateLicense({
    licensingModel: 'subscription',
    scope: 'premium',
    orderNumber: 'MUI X tests',
    expiryDate,
    planVersion: 'Q3-2024',
  });
}

export function setupTestLicenseKey(licenseKey = generateTestLicenseKey()) {
  LicenseInfo.setLicenseKey(licenseKey);
}
