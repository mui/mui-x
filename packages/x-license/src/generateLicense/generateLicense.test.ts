import { expect } from 'chai';
import { generateLicense } from './generateLicense';

describe('License: generateLicense', () => {
  it('should generate pro license properly when `scope: "pro"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'pro',
        licensingModel: 'subscription',
        planVersion: 'legacy',
      }),
    ).to.equal(
      '076fc290e354b9a04720190023e1f868Tz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXBybyxMTT1zdWJzY3JpcHRpb24sUFY9bGVnYWN5LEtWPTI=',
    );
  });

  it('should generate premium license when `scope: "premium"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'premium',
        licensingModel: 'subscription',
        planVersion: 'legacy',
      }),
    ).to.equal(
      'fafc52d1dbb97e825702a7ccf5986fbbTz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXByZW1pdW0sTE09c3Vic2NyaXB0aW9uLFBWPWxlZ2FjeSxLVj0y',
    );
  });

  it('should generate annual license when `licensingModel: "subscription"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'pro',
        licensingModel: 'subscription',
        planVersion: 'legacy',
      }),
    ).to.equal(
      '076fc290e354b9a04720190023e1f868Tz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXBybyxMTT1zdWJzY3JpcHRpb24sUFY9bGVnYWN5LEtWPTI=',
    );
  });

  it('should generate perpetual license when `licensingModel: "perpetual"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'pro',
        licensingModel: 'perpetual',
        planVersion: 'legacy',
      }),
    ).to.equal(
      'a32c4d6c8cce5d9ca0132527a252e999Tz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXBybyxMTT1wZXJwZXR1YWwsUFY9bGVnYWN5LEtWPTI=',
    );
  });
});
