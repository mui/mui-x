/* eslint-disable no-underscore-dangle */
import { ponyfillGlobal } from '@mui/utils';

// Store the license information in a global so it can be shared
// when module duplication occurs. The duplication of the modules can happen
// if using multiple version of MUI X at the same time of the bundler
// decide to duplicate to improve the size of the chunks.
ponyfillGlobal.__MUI_LICENSE_INFO__ = ponyfillGlobal.__MUI_LICENSE_INFO__ || {
  key: undefined as undefined | string,
  releaseInfo: undefined as undefined | string,
};

export class LicenseInfo {
  public static getKey(): string {
    return ponyfillGlobal.__MUI_LICENSE_INFO__.key;
  }

  public static getReleaseInfo(): string {
    return ponyfillGlobal.__MUI_LICENSE_INFO__.releaseInfo;
  }

  public static setLicenseKey(key: string) {
    ponyfillGlobal.__MUI_LICENSE_INFO__.key = key;
  }

  public static setReleaseInfo(encodedReleaseInfo: string) {
    ponyfillGlobal.__MUI_LICENSE_INFO__.releaseInfo = encodedReleaseInfo;
  }
}
