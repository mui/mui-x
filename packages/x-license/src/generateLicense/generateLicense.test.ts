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
        planVersion: 'initial',
      }),
    ).to.equal(
      'e8fad422a82720084ec67dd693f08056Tz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXBybyxMTT1zdWJzY3JpcHRpb24sUFY9aW5pdGlhbCxLVj0y',
    );
  });

  it('should generate premium license when `scope: "premium"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'premium',
        licensingModel: 'subscription',
        planVersion: 'initial',
      }),
    ).to.equal(
      '8ca0384bfb92ec214d4cd72483f5110bTz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXByZW1pdW0sTE09c3Vic2NyaXB0aW9uLFBWPWluaXRpYWwsS1Y9Mg==',
    );
  });

  it('should generate annual license when `licensingModel: "subscription"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'pro',
        licensingModel: 'subscription',
        planVersion: 'initial',
      }),
    ).to.equal(
      'e8fad422a82720084ec67dd693f08056Tz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXBybyxMTT1zdWJzY3JpcHRpb24sUFY9aW5pdGlhbCxLVj0y',
    );
  });

  it('should generate perpetual license when `licensingModel: "perpetual"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'pro',
        licensingModel: 'perpetual',
        planVersion: 'initial',
      }),
    ).to.equal(
      'aaf2e3c60b06199962fbbab985843d97Tz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXBybyxMTT1wZXJwZXR1YWwsUFY9aW5pdGlhbCxLVj0y',
    );
  });

  it('should generate subscription Pro license when `planVersion: "Q3-2024"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'pro',
        licensingModel: 'subscription',
        planVersion: 'Q3-2024',
      }),
    ).to.equal(
      '4adf08e54d606215809064d1d31b6b39Tz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXBybyxMTT1zdWJzY3JpcHRpb24sUFY9UTMtMjAyNCxLVj0y',
    );
  });

  it('should generate subscription Premium license when `planVersion: "Q3-2024"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'premium',
        licensingModel: 'subscription',
        planVersion: 'Q3-2024',
      }),
    ).to.equal(
      'b76c2067275b3b566fcae1d28ad23c91Tz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXByZW1pdW0sTE09c3Vic2NyaXB0aW9uLFBWPVEzLTIwMjQsS1Y9Mg==',
    );
  });
});
