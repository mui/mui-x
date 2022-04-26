import { expect } from 'chai';
import { generateLicense } from './generateLicense';

describe('License: generateLicense', () => {
  it('should generate DataGridPro License properly when "scope" is not provided', () => {
    expect(
      generateLicense({ expiryDate: new Date(1591723879062), orderNumber: 'MUI-123' }),
    ).to.equal(
      'ffcb515c4564c351579ec2cb922939d2T1JERVI9TVVJLTEyMyxFWFBJUlk9MTU5MTcyMzg3OTA2MixLRVlWRVJTSU9OPTIsU0NPUEU9cHJv',
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
      'ffcb515c4564c351579ec2cb922939d2T1JERVI9TVVJLTEyMyxFWFBJUlk9MTU5MTcyMzg3OTA2MixLRVlWRVJTSU9OPTIsU0NPUEU9cHJv',
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
      '405dfca9f4f49c6f2ece584b3ab7f954T1JERVI9TVVJLTEyMyxFWFBJUlk9MTU5MTcyMzg3OTA2MixLRVlWRVJTSU9OPTIsU0NPUEU9cHJlbWl1bQ==',
    );
  });
});
