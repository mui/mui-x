export class LicenseKey {
  public static key: string;

  public static setLicenseKey(key: string) {
    LicenseKey.key = key;
  }
}
