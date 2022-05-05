import { expect } from 'chai';
import { generateLicense } from './generateLicense';

describe('License: generateLicense', () => {
  // TODO: Remove
  it('should generate pro license properly when "scope" is not provided', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        salesModel: 'subscription',
      }),
    ).to.equal(
      '3a55ceb4fe74634bfe7ca47f877ccd93Tz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXBybyxTTT1zdWJzY3JpcHRpb24sS1Y9Mg==',
    );
  });

  it('should generate pro license properly when `scope: "pro"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'pro',
        salesModel: 'subscription',
      }),
    ).to.equal(
      '3a55ceb4fe74634bfe7ca47f877ccd93Tz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXBybyxTTT1zdWJzY3JpcHRpb24sS1Y9Mg==',
    );
  });

  it('should generate premium license when `scope: "premium"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'premium',
        salesModel: 'subscription',
      }),
    ).to.equal(
      'ca7044d364f2445987cf24248dbe1609Tz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXByZW1pdW0sU009c3Vic2NyaXB0aW9uLEtWPTI=',
    );
  });

  // TODO: Remove
  it('should generate perpetual license when "salesModel" is not provided', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'pro',
      }),
    ).to.equal(
      'e15ecb11b201864ea67930bf5899d917Tz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXBybyxTTT1wZXJwZXR1YWwsS1Y9Mg==',
    );
  });

  it('should generate subscription license when `salesModel: "subscription"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'pro',
        salesModel: 'subscription',
      }),
    ).to.equal(
      '3a55ceb4fe74634bfe7ca47f877ccd93Tz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXBybyxTTT1zdWJzY3JpcHRpb24sS1Y9Mg==',
    );
  });

  it('should generate perpetual license when `salesModel: "perpetual"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'pro',
        salesModel: 'perpetual',
      }),
    ).to.equal(
      'e15ecb11b201864ea67930bf5899d917Tz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXBybyxTTT1wZXJwZXR1YWwsS1Y9Mg==',
    );
  });
});
