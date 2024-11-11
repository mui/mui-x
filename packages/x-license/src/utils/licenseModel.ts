export const LICENSE_MODELS = [
  /**
   * A license is outdated if the current version of the software was released after the expiry date of the license.
   * But the license can be used indefinitely with an older version of the software.
   */
  'perpetual',
  /**
   * On development, a license is outdated if the expiry date has been reached
   * On production, a license is outdated if the current version of the software was released after the expiry date of the license (see "perpetual")
   */
  'annual',
  /**
   * Legacy. The previous name for 'annual'.
   * Can be removed once old license keys generated with 'subscription' are no longer supported.
   * To support for a while. We need more years of backward support and we sell multi year licenses.
   */
  'subscription',
] as const;

export type LicenseModel = (typeof LICENSE_MODELS)[number];
