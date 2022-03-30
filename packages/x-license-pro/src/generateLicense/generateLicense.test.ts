import { expect } from 'chai';
import { generateLicense } from './generateLicense';

describe('License: generateLicense', () => {
  it('should generate DataGridPro License properly when "type" is not provided', () => {
    expect(
      generateLicense({ expiryDate: new Date(1591723879062), orderNumber: 'MUI-123' }),
    ).to.equal(
      '821e1299774f9b5de8d7e638c4a40649T1JERVI6TVVJLTEyMyxFWFBJUlk9MTU5MTcyMzg3OTA2MixLRVlWRVJTSU9OPTEsdHlwZT1wcm8=',
    );
  });

  it('should generate DataGridPro License properly when `type: "pro"`', () => {
    expect(
      generateLicense({ expiryDate: new Date(1591723879062), orderNumber: 'MUI-123', type: 'pro' }),
    ).to.equal(
      '821e1299774f9b5de8d7e638c4a40649T1JERVI6TVVJLTEyMyxFWFBJUlk9MTU5MTcyMzg3OTA2MixLRVlWRVJTSU9OPTEsdHlwZT1wcm8=',
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
      '8e3a29d6dc4f46c8a9c32980bee6484dT1JERVI6TVVJLTEyMyxFWFBJUlk9MTU5MTcyMzg3OTA2MixLRVlWRVJTSU9OPTEsdHlwZT1wcmVtaXVt',
    );
  });
});
