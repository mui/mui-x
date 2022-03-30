import { expect } from 'chai';
import { generateLicense } from './generateLicense';

describe('License: generateLicense', () => {
  it('should generate DataGridPro License properly when "type" is not provided', () => {
    expect(
      generateLicense({ expiryDate: new Date(1591723879062), orderNumber: 'MUI-123' }),
    ).to.equal(
      'f18848d49206ea51988c364a2b4b60b4T1JERVI6TVVJLTEyMyxFWFBJUlk9MTU5MTcyMzg3OTA2MixLRVlWRVJTSU9OPTEsVFlQRT1wcm8=',
    );
  });

  it('should generate DataGridPro License properly when `type: "pro"`', () => {
    expect(
      generateLicense({ expiryDate: new Date(1591723879062), orderNumber: 'MUI-123', type: 'pro' }),
    ).to.equal(
      'f18848d49206ea51988c364a2b4b60b4T1JERVI6TVVJLTEyMyxFWFBJUlk9MTU5MTcyMzg3OTA2MixLRVlWRVJTSU9OPTEsVFlQRT1wcm8=',
    );
  });

  it('should generate DataGridPremium License properly when `type: "premium"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        type: 'premium',
      }),
    ).to.equal(
      '2a6d48e3c64728e5ccd9275d4d5e0b94T1JERVI6TVVJLTEyMyxFWFBJUlk9MTU5MTcyMzg3OTA2MixLRVlWRVJTSU9OPTEsVFlQRT1wcmVtaXVt',
    );
  });
});
