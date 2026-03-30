import { AppType } from './licenseAppType';
import { LicenseModel } from './licenseModel';
import { PlanScope, PlanVersion } from './licensePlan';

/**
 * The version of the license key encoding format.
 * - `1`: Legacy format.
 * - `2`: Adds plan scope and license model.
 * - `3`: Adds quantity and app type.
 */
export type KeyVersion = 1 | 2 | 3;

/**
 * The details of a MUI X license.
 */
export interface LicenseDetails {
  /**
   * The type of application the license covers.
   * - `'single'`: A single application.
   * - `'multi'`: Multiple applications.
   * Only available in key version 3+.
   */
  appType?: AppType;
  /**
   * The date when the license expires.
   */
  expiryDate: Date;
  /**
   * The timestamp (in milliseconds) when the license expires.
   */
  expiryTimestamp: number;
  /**
   * The license model.
   * Only available in key version 2+.
   */
  licenseModel?: LicenseModel;
  /**
   * The order id associated with the license.
   */
  orderId: string;
  /**
   * The plan scope (e.g., 'pro' or 'premium').
   * Only available in key version 2+.
   */
  planScope?: PlanScope;
  /**
   * The plan version (e.g., 'initial', 'Q3-2024').
   */
  planVersion: PlanVersion;
  /**
   * The number of developer seats covered by the license.
   * Only available in key version 3+.
   */
  quantity?: number;
  /**
   * The version of the license key encoding format.
   */
  keyVersion: KeyVersion;
}

export type NullableLicenseDetails = {
  [K in keyof LicenseDetails]: LicenseDetails[K] | null;
} & { isTestKey: boolean };
