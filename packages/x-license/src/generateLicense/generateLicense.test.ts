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
      }),
    ).to.equal(
      'b2b2ea9c6fd846e11770da3c795d6f63Tz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXBybyxMTT1zdWJzY3JpcHRpb24sS1Y9Mg==',
    );
  });

  it('should generate premium license when `scope: "premium"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'premium',
        licensingModel: 'subscription',
      }),
    ).to.equal(
      'ac8d20b4ecd1f919157f3713f8ba1651Tz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXByZW1pdW0sTE09c3Vic2NyaXB0aW9uLEtWPTI=',
    );
  });

  it('should generate annual license when `licensingModel: "subscription"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'pro',
        licensingModel: 'subscription',
      }),
    ).to.equal(
      'b2b2ea9c6fd846e11770da3c795d6f63Tz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXBybyxMTT1zdWJzY3JpcHRpb24sS1Y9Mg==',
    );
  });

  it('should generate perpetual license when `licensingModel: "perpetual"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'pro',
        licensingModel: 'perpetual',
      }),
    ).to.equal(
      'b16edd8e6bc83293a723779a259f520cTz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXBybyxMTT1wZXJwZXR1YWwsS1Y9Mg==',
    );
  });
});
