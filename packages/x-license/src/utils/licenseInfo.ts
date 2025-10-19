/**
 * @ignore - do not document.
 */
export interface MuiLicenseInfo {
  key: string | undefined;
}

declare global {
  // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention, vars-on-top
  var __MUI_LICENSE_INFO__: MuiLicenseInfo;
}

// Store the license information in a global, so it can be shared
// when module duplication occurs. The duplication of the modules can happen
// if using multiple version of MUI X at the same time of the bundler
// decide to duplicate to improve the size of the chunks.
// eslint-disable-next-line no-underscore-dangle
globalThis.__MUI_LICENSE_INFO__ = globalThis.__MUI_LICENSE_INFO__ || {
  key: undefined,
};

export class LicenseInfo {
  private static getLicenseInfo() {
    // eslint-disable-next-line no-underscore-dangle
    return globalThis.__MUI_LICENSE_INFO__;
  }

  public static getLicenseKey(): MuiLicenseInfo['key'] {
    return LicenseInfo.getLicenseInfo().key;
  }

  public static setLicenseKey(key: string) {
    const licenseInfo = LicenseInfo.getLicenseInfo();
    licenseInfo.key = key;
  }
}
