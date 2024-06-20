// eslint-disable-next-line @typescript-eslint/naming-convention
export enum LICENSE_STATUS {
  NotFound = 'NotFound',
  Invalid = 'Invalid',
  ExpiredAnnual = 'ExpiredAnnual',
  ExpiredAnnualGrace = 'ExpiredAnnualGrace',
  ExpiredVersion = 'ExpiredVersion',
  Valid = 'Valid',
  OutOfScope = 'OutOfScope',
  ProductNotCovered = 'ProductNotCovered',
}

export type LicenseStatus = keyof typeof LICENSE_STATUS;
