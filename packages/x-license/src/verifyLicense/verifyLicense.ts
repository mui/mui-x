import { base64Decode } from '../encoding/base64';
import { md5 } from '../encoding/md5';
import { LICENSE_STATUS, LicenseStatus } from '../utils/licenseStatus';
import {
  PlanScope,
  PLAN_SCOPES,
  PlanVersion,
  isPlanVersionOlderOrEqual,
} from '../utils/licensePlan';
import type { AppType } from '../utils/licenseAppType';
import { LicenseModel, LICENSE_MODELS } from '../utils/licenseModel';
import type { NullableLicenseDetails } from '../utils/licenseDetails';
import { MuiCommercialPackageName, CommercialPackageInfo } from '../utils/commercialPackages';

function isPlanScopeSufficient(packageName: MuiCommercialPackageName, planScope: PlanScope) {
  let acceptedScopes: PlanScope[];
  if (packageName.includes('-pro')) {
    acceptedScopes = ['pro', 'premium'];
  } else if (packageName.includes('-premium')) {
    acceptedScopes = ['premium'];
  } else {
    acceptedScopes = [];
  }

  return acceptedScopes.includes(planScope);
}

const expiryReg = /^.*EXPIRY=([0-9]+),.*$/;
const orderReg = /^.*ORDER:([0-9]+),.*$/;

const PRO_PACKAGES_AVAILABLE_IN_INITIAL_PRO_PLAN: MuiCommercialPackageName[] = [
  'x-data-grid-pro',
  'x-date-pickers-pro',
];

const MAX_V8_PLAN_VERSION: PlanVersion = 'Q3-2024';

/**
 * Format: ORDER:${orderNumber},EXPIRY=${expiryTimestamp},KEYVERSION=1
 */
function decodeLicenseVersion1(license: string): NullableLicenseDetails {
  let expiryTimestamp: number | null;
  let orderId: number | null;
  try {
    expiryTimestamp = parseInt(license.match(expiryReg)![1], 10);
    if (!expiryTimestamp || Number.isNaN(expiryTimestamp)) {
      expiryTimestamp = null;
    }

    orderId = parseInt(license.match(orderReg)![1], 10);
    if (!orderId || Number.isNaN(orderId)) {
      orderId = null;
    }
  } catch (err) {
    expiryTimestamp = null;
    orderId = null;
  }

  return {
    keyVersion: 1,
    licenseModel: 'perpetual',
    planScope: 'pro',
    planVersion: 'initial',
    expiryTimestamp,
    expiryDate: expiryTimestamp ? new Date(expiryTimestamp) : null,
    orderId: orderId != null ? String(orderId) : null,
    appType: 'multi',
    quantity: null,
    isTestKey: license.includes('T=true'),
  };
}

/**
 * Parse a comma-separated key=value license string into a NullableLicenseDetails object.
 */
export function parseLicenseTokens(license: string, licenseInfo: NullableLicenseDetails): void {
  license
    .split(',')
    .map((token) => token.split('='))
    .filter((el) => el.length === 2)
    .forEach(([key, value]) => {
      if (key === 'S') {
        licenseInfo.planScope = value as PlanScope;
      }

      if (key === 'LM') {
        licenseInfo.licenseModel = value as LicenseModel;
      }

      if (key === 'E') {
        const expiryTimestamp = parseInt(value, 10);
        if (expiryTimestamp && !Number.isNaN(expiryTimestamp)) {
          licenseInfo.expiryTimestamp = expiryTimestamp;
          licenseInfo.expiryDate = new Date(expiryTimestamp);
        }
      }

      if (key === 'PV') {
        licenseInfo.planVersion = value as PlanVersion;
      }

      if (key === 'O') {
        licenseInfo.orderId = value;
      }

      if (key === 'Q') {
        const qty = parseInt(value, 10);
        if (qty && !Number.isNaN(qty)) {
          licenseInfo.quantity = qty;
        }
      }

      if (key === 'AT') {
        licenseInfo.appType = value as AppType;
      }

      if (key === 'T') {
        licenseInfo.isTestKey = value === 'true';
      }
    });
}

/**
 * Format: O=${orderNumber},E=${expiryTimestamp},S=${planScope},LM=${licenseModel},PV=${planVersion},KV=2
 */
export function decodeLicenseVersion2(license: string): NullableLicenseDetails {
  const licenseInfo: NullableLicenseDetails = {
    keyVersion: 2,
    licenseModel: null,
    planScope: null,
    planVersion: 'initial',
    expiryTimestamp: null,
    expiryDate: null,
    orderId: null,
    appType: 'multi',
    quantity: null,
    isTestKey: false,
  };

  parseLicenseTokens(license, licenseInfo);
  return licenseInfo;
}

/**
 * Decode the license based on its key version and return a version-agnostic `NullableLicenseDetails` object.
 */
export function decodeLicense(encodedLicense: string): NullableLicenseDetails | null {
  const license = base64Decode(encodedLicense);

  if (license.includes('KEYVERSION=1')) {
    return decodeLicenseVersion1(license);
  }

  if (license.includes('KV=2')) {
    return decodeLicenseVersion2(license);
  }

  return null;
}

export function verifyLicense({
  packageInfo,
  licenseKey,
}: {
  packageInfo: CommercialPackageInfo;
  licenseKey?: string;
}): { status: LicenseStatus; meta?: any } {
  const { name: packageName, releaseDate, version: packageVersion } = packageInfo;
  const packageMajorVersion = parseInt(packageVersion ?? '', 10);
  if (!releaseDate) {
    throw new Error(
      'MUI X: The release information is missing and license validation cannot proceed. ' +
        'This is an internal error that should not occur in normal usage. ' +
        'Please report this issue if you encounter it.',
    );
  }

  if (!licenseKey) {
    return { status: LICENSE_STATUS.NotFound };
  }

  const hash = licenseKey.slice(0, 32);
  const encoded = licenseKey.slice(32);

  if (hash !== md5(encoded)) {
    return { status: LICENSE_STATUS.Invalid };
  }

  const license = decodeLicense(encoded);

  if (license == null) {
    console.error('MUI X: Error checking license. Key version not found!');
    return { status: LICENSE_STATUS.Invalid };
  }

  // Reject test license keys outside of test environments.
  // Gets replaced with `false` during production builds, making it impossible
  // for users of published packages to use test licenses.
  // @ts-ignore
  if (license.isTestKey && !__ALLOW_TEST_LICENSES__) {
    console.error(
      'MUI X: Error checking license. Test license key used in a non-test environment!',
    );
    return { status: LICENSE_STATUS.Invalid };
  }

  if (license.licenseModel == null || !LICENSE_MODELS.includes(license.licenseModel)) {
    console.error('MUI X: Error checking license. License model not found or invalid!');
    return { status: LICENSE_STATUS.Invalid };
  }

  if (license.expiryTimestamp == null) {
    console.error('MUI X: Error checking license. Expiry timestamp not found or invalid!');
    return { status: LICENSE_STATUS.Invalid };
  }

  if (license.licenseModel === 'perpetual' || process.env.NODE_ENV === 'production') {
    const pkgTimestamp = parseInt(base64Decode(releaseDate), 10);
    if (Number.isNaN(pkgTimestamp)) {
      throw new Error(
        'MUI X: The release information is invalid and license validation cannot proceed. ' +
          'The package release timestamp could not be parsed. ' +
          'This may indicate a corrupted package. Try reinstalling the MUI X packages.',
      );
    }

    if (license.expiryTimestamp < pkgTimestamp) {
      // Perpetual v8 (or older) licenses whose expiry predates this package release
      // are not valid for v9 packages.
      if (
        packageMajorVersion != null &&
        packageMajorVersion >= 9 &&
        license.licenseModel === 'perpetual' &&
        isPlanVersionOlderOrEqual(license.planVersion as string, MAX_V8_PLAN_VERSION)
      ) {
        return { status: LICENSE_STATUS.NotValidForPackage, meta: { packageMajorVersion } };
      }
      return { status: LICENSE_STATUS.ExpiredVersion };
    }
  } else if (license.licenseModel === 'subscription' || license.licenseModel === 'annual') {
    if (new Date().getTime() > license.expiryTimestamp) {
      if (
        // 30 days grace
        new Date().getTime() < license.expiryTimestamp + 1000 * 3600 * 24 * 30 ||
        process.env.NODE_ENV !== 'development'
      ) {
        return {
          status: LICENSE_STATUS.ExpiredAnnualGrace,
          meta: { expiryTimestamp: license.expiryTimestamp, licenseKey },
        };
      }
      return {
        status: LICENSE_STATUS.ExpiredAnnual,
        meta: { expiryTimestamp: license.expiryTimestamp, licenseKey },
      };
    }
  }

  if (license.planScope == null || !PLAN_SCOPES.includes(license.planScope)) {
    console.error('MUI X: Error checking license. planScope not found or invalid!');
    return { status: LICENSE_STATUS.Invalid };
  }

  if (!isPlanScopeSufficient(packageName, license.planScope)) {
    return { status: LICENSE_STATUS.OutOfScope };
  }

  // 'charts-pro' or 'tree-view-pro' can only be used with a newer Pro license
  if (
    license.planVersion === 'initial' &&
    license.planScope === 'pro' &&
    !PRO_PACKAGES_AVAILABLE_IN_INITIAL_PRO_PLAN.includes(packageName)
  ) {
    return { status: LICENSE_STATUS.NotAvailableInInitialProPlan };
  }

  // v8 licenses (Q1-2026 and older) are not valid for v9 packages.
  // Perpetual licenses are exempt as they are already gated by the expiry date check.
  if (
    packageMajorVersion != null &&
    packageMajorVersion >= 9 &&
    license.licenseModel !== 'perpetual' &&
    isPlanVersionOlderOrEqual(license.planVersion as string, MAX_V8_PLAN_VERSION)
  ) {
    return { status: LICENSE_STATUS.NotValidForPackage, meta: { packageMajorVersion } };
  }

  return { status: LICENSE_STATUS.Valid };
}
