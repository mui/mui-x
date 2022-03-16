import { ponyfillGlobal } from '@mui/utils';

export type MuiCommercialPackageName =
  | 'x-data-grid-pro'
  | 'x-data-grid-premium'
  | 'x-date-pickers-pro';

interface MuiLicenseInfo {
  releaseInfo: { [packageName in MuiCommercialPackageName]?: string };
  key: string | undefined;
}

// Store the license information in a global so it can be shared
// when module duplication occurs. The duplication of the modules can happen
// if using multiple version of MUI X at the same time of the bundler
// decide to duplicate to improve the size of the chunks.
// eslint-disable-next-line no-underscore-dangle
ponyfillGlobal.__MUI_LICENSE_INFO__ = ponyfillGlobal.__MUI_LICENSE_INFO__ || {
  key: undefined,
  releaseInfo: {},
};

export class LicenseInfo {
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
  }
}
