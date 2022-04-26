import { expect } from 'chai';
import { generateLicense } from './generateLicense';

describe('License: generateLicense', () => {
  it('should generate DataGridPro License properly when "scope" is not provided', () => {
    expect(
      generateLicense({ expiryDate: new Date(1591723879062), orderNumber: 'MUI-123' }),
    ).to.equal(
      '90b5a76151089447618ede1917227a1bT1JERVI6TVVJLTEyMyxFWFBJUlk9MTU5MTcyMzg3OTA2MixLRVlWRVJTSU9OPTIsU0NPUEU9cHJv',
    );
  });

  it('should generate DataGridPro License properly when `scope: "pro"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'pro',
      }),
    ).to.equal(
      '90b5a76151089447618ede1917227a1bT1JERVI6TVVJLTEyMyxFWFBJUlk9MTU5MTcyMzg3OTA2MixLRVlWRVJTSU9OPTIsU0NPUEU9cHJv',
    );
  });

  it('should generate DataGridPremium License properly when `scope: "premium"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'premium',
      }),
    ).to.equal(
      '0d79eeaf5facce7184422f22eeeb369aT1JERVI6TVVJLTEyMyxFWFBJUlk9MTU5MTcyMzg3OTA2MixLRVlWRVJTSU9OPTIsU0NPUEU9cHJlbWl1bQ==',
    );
  });
});
