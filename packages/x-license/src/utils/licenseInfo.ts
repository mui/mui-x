import { ponyfillGlobal } from '@mui/utils';

/**
 * @ignore - do not document.
 */
export interface MuiLicenseInfo {
  key: string | undefined;
}

// Store the license information in a global, so it can be shared
// when module duplication occurs. The duplication of the modules can happen
// if using multiple version of MUI X at the same time of the bundler
// decide to duplicate to improve the size of the chunks.
// eslint-disable-next-line no-underscore-dangle
ponyfillGlobal.__MUI_LICENSE_INFO__ = ponyfillGlobal.__MUI_LICENSE_INFO__ || {
  key: undefined,
};

export class LicenseInfo {
  private static hasSetLicenseKeyRun: boolean = false;

  private static isLicenseKeySet: boolean = false;

  private static getLicenseInfo() {
    // eslint-disable-next-line no-underscore-dangle
    return ponyfillGlobal.__MUI_LICENSE_INFO__;
  }

  public static getLicenseKey(): MuiLicenseInfo['key'] {
    return LicenseInfo.getLicenseInfo().key;
  }

  public static setLicenseKey(key: string) {
    const licenseInfo = LicenseInfo.getLicenseInfo();
    licenseInfo.key = key;
    LicenseInfo.isLicenseKeySet = !!key;
    LicenseInfo.hasSetLicenseKeyRun = true;
  }

  public static getIsLicenseKeySet(): boolean {
    return LicenseInfo.isLicenseKeySet;
  }

  public static getHasSetLicenseKeyRun(): boolean {
    return LicenseInfo.hasSetLicenseKeyRun;
  }
}
