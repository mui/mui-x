import { expect } from 'chai';
import { generateLicence } from './generateLicense';

describe('License: generateLicense', () => {
  it('should generate License properly', () => {
    expect(
      generateLicence({ expiryDate: new Date(1591723879062), orderNumber: 'MUI-123' }),
    ).to.equal(
      'e34253b37166e7a4a85189b91b653e63T1JERVI6TVVJLTEyMyxFWFBJUlk9MTU5MTcyMzg3OTA2MixLRVlWRVJTSU9OPTE=',
    );
  });
});
