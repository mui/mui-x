import { ponyfillGlobal } from '@mui/utils';

// Store the license information in a global so it can be shared
// when module duplication occurs. The duplication of the modules can happen
// if using multiple version of MUI X at the same time of the bundler
// decide to duplicate to improve the size of the chunks.
// eslint-disable-next-line no-underscore-dangle
ponyfillGlobal.__MUI_LICENSE_INFO__ = ponyfillGlobal.__MUI_LICENSE_INFO__ || {
  key: undefined as undefined | string,
  releaseInfo: undefined as undefined | string,
};

// This is the package release date. Each package version should update this const
// automatically when a new version is published on npm.
let RELEASE_INFO = '__RELEASE_INFO__';

// eslint-disable-next-line no-useless-concat
if (process.env.NODE_ENV !== 'production' && RELEASE_INFO === '__RELEASE' + '_INFO__') {
  // eslint-disable-next-line no-underscore-dangle
  RELEASE_INFO = ponyfillGlobal.__MUI_RELEASE_INFO__;
}

ponyfillGlobal.__MUI_LICENSE_INFO__.releaseInfo = RELEASE_INFO;

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
}
