export class LicenseInfo {
  public static key: string;

  public static releaseInfo: string;

  public static setLicenseKey(key: string) {
    LicenseInfo.key = key;
  }

  public static setReleaseInfo(encodedReleaseInfo: string) {
    LicenseInfo.releaseInfo = encodedReleaseInfo;
  }
}
