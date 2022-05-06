import { base64Decode, base64Encode } from '../encoding/base64';
import { md5 } from '../encoding/md5';
import { LicenseStatus } from '../utils/licenseStatus';
import { LicenseScope, LICENSE_SCOPES } from '../utils/licenseScope';
import { LicensingModel, LICENSING_MODELS } from '../utils/licensingModel';

const getDefaultReleaseDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today;
};

export function generateReleaseInfo(releaseDate = getDefaultReleaseDate()) {
  return base64Encode(releaseDate.getTime().toString());
}

const expiryReg = /^.*EXPIRY=([0-9]+),.*$/;

interface MuiLicense {
  licensingModel: LicensingModel | null;
  scope: LicenseScope | null;
  expiryTimestamp: number | null;
}

/**
 * Format: ORDER:${orderNumber},EXPIRY=${expiryTimestamp},KEYVERSION=1
 */
const decodeLicenseVersion1 = (license: string): MuiLicense => {
  let expiryTimestamp: number | null;
  try {
    expiryTimestamp = parseInt(license.match(expiryReg)![1], 10);
    if (!expiryTimestamp || Number.isNaN(expiryTimestamp)) {
      expiryTimestamp = null;
    }
  } catch (err) {
    expiryTimestamp = null;
  }

  return {
    scope: 'pro',
    licensingModel: 'perpetual',
    expiryTimestamp,
  };
};

/**
 * Format: O=${orderNumber},E=${expiryTimestamp},S=${scope},LM=${licensingModel},KV=2`;
 */
const decodeLicenseVersion2 = (license: string): MuiLicense => {
  const licenseInfo: MuiLicense = {
    scope: null,
    licensingModel: null,
    expiryTimestamp: null,
  };

  license
    .split(',')
    .map((token) => token.split('='))
    .filter((el) => el.length === 2)
    .forEach(([key, value]) => {
      if (key === 'S') {
        licenseInfo.scope = value as LicenseScope;
      }

      if (key === 'LM') {
        licenseInfo.licensingModel = value as LicensingModel;
      }

      if (key === 'E') {
        const expiryTimestamp = parseInt(value, 10);
        if (expiryTimestamp && !Number.isNaN(expiryTimestamp)) {
          licenseInfo.expiryTimestamp = expiryTimestamp;
        }
      }
    });

  return licenseInfo;
};

/**
 * Decode the license based on its key version and return a version-agnostic `MuiLicense` object.
 */
const decodeLicense = (encodedLicense: string): MuiLicense | null => {
  const license = base64Decode(encodedLicense);

  if (license.includes('KEYVERSION=1')) {
    return decodeLicenseVersion1(license);
  }

  if (license.includes('KV=2')) {
    return decodeLicenseVersion2(license);
  }

  return null;
};

export function verifyLicense({
  releaseInfo,
  licenseKey,
  acceptedScopes,
  isProduction,
}: {
  releaseInfo: string;
  licenseKey: string | undefined;
  acceptedScopes: LicenseScope[];
  isProduction: boolean;
}) {
  if (!releaseInfo) {
    throw new Error('MUI: The release information is missing. Not able to validate license.');
  }

  if (!licenseKey) {
    return LicenseStatus.NotFound;
  }

  const hash = licenseKey.substr(0, 32);
  const encoded = licenseKey.substr(32);

  if (hash !== md5(encoded)) {
    return LicenseStatus.Invalid;
  }

  const license = decodeLicense(encoded);

  if (license == null) {
    console.error('Error checking license. Key version not found!');
    return LicenseStatus.Invalid;
  }

  if (license.licensingModel == null || !LICENSING_MODELS.includes(license.licensingModel)) {
    console.error('Error checking license. Sales model not found or invalid!');
    return LicenseStatus.Invalid;
  }

  if (license.expiryTimestamp == null) {
    console.error('Error checking license. Expiry timestamp not found or invalid!');
    return LicenseStatus.Invalid;
  }

  if (license.licensingModel === 'perpetual' || isProduction) {
    const pkgTimestamp = parseInt(base64Decode(releaseInfo), 10);
    if (Number.isNaN(pkgTimestamp)) {
      throw new Error('MUI: The release information is invalid. Not able to validate license.');
    }

    if (license.expiryTimestamp < pkgTimestamp) {
      return LicenseStatus.Expired;
    }
  } else if (license.licensingModel === 'subscription') {
    if (license.expiryTimestamp < new Date().getTime()) {
      return LicenseStatus.Expired;
    }
  }

  if (license.scope == null || !LICENSE_SCOPES.includes(license.scope)) {
    console.error('Error checking license. scope not found or invalid!');
    return LicenseStatus.Invalid;
  }

  if (!acceptedScopes.includes(license.scope)) {
    return LicenseStatus.Invalid;
  }

  return LicenseStatus.Valid;
}
