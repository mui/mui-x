import { expect } from 'chai';
import { generateLicense } from './generateLicense';

describe('License: generateLicense', () => {
  it('should generate pro license properly when "scope" is not provided', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        term: 'subscription',
      }),
    ).to.equal(
      '2af8412f4b193d494ad14d311f20afdcTz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXBybyxUPXN1YnNjcmlwdGlvbixLVj0y',
    );
  });

  it('should generate pro license properly when `scope: "pro"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'pro',
        term: 'subscription',
      }),
    ).to.equal(
      '2af8412f4b193d494ad14d311f20afdcTz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXBybyxUPXN1YnNjcmlwdGlvbixLVj0y',
    );
  });

  it('should generate premium license when `scope: "premium"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'premium',
        term: 'subscription',
      }),
    ).to.equal(
      '846ffde2dae9865df655c0c4deea401dTz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXByZW1pdW0sVD1zdWJzY3JpcHRpb24sS1Y9Mg==',
    );
  });

  it('should generate subscription license when "term" is not provided', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'pro',
      }),
    ).to.equal(
      '2af8412f4b193d494ad14d311f20afdcTz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXBybyxUPXN1YnNjcmlwdGlvbixLVj0y',
    );
  });

  it('should generate subscription license when `term: "subscription"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'pro',
        term: 'subscription',
      }),
    ).to.equal(
      '2af8412f4b193d494ad14d311f20afdcTz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXBybyxUPXN1YnNjcmlwdGlvbixLVj0y',
    );
  });

  it('should generate perpetual license when `term: "perpetual"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: 'MUI-123',
        scope: 'pro',
        term: 'perpetual',
      }),
    ).to.equal(
      'f677f286ff9eaabf37e87e44a6fa3746Tz1NVUktMTIzLEU9MTU5MTcyMzg3OTA2MixTPXBybyxUPXBlcnBldHVhbCxLVj0y',
    );
  });
});
