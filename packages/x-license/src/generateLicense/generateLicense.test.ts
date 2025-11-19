import { generateLicense } from './generateLicense';

describe('License: generateLicense', () => {
  it('should generate pro license properly when `scope: "pro"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: '123',
        planScope: 'pro',
        licenseModel: 'subscription',
        planVersion: 'initial',
      }),
    ).to.equal(
      'dcb6ef99ea44c162494608dd6c3b43eaTz0xMjMsRT0xNTkxNzIzODc5MDYyLFM9cHJvLExNPXN1YnNjcmlwdGlvbixQVj1pbml0aWFsLEtWPTI=',
    );
  });

  it('should generate premium license when `scope: "premium"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: '123',
        planScope: 'premium',
        licenseModel: 'subscription',
        planVersion: 'initial',
      }),
    ).to.equal(
      '5f42b577a8a4875dada84e712bf0e1eaTz0xMjMsRT0xNTkxNzIzODc5MDYyLFM9cHJlbWl1bSxMTT1zdWJzY3JpcHRpb24sUFY9aW5pdGlhbCxLVj0y',
    );
  });

  it('should generate annual license when `licenseModel: "subscription"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: '123',
        planScope: 'pro',
        licenseModel: 'subscription',
        planVersion: 'initial',
      }),
    ).to.equal(
      'dcb6ef99ea44c162494608dd6c3b43eaTz0xMjMsRT0xNTkxNzIzODc5MDYyLFM9cHJvLExNPXN1YnNjcmlwdGlvbixQVj1pbml0aWFsLEtWPTI=',
    );
  });

  it('should generate perpetual license when `licenseModel: "perpetual"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: '123',
        planScope: 'pro',
        licenseModel: 'perpetual',
        planVersion: 'initial',
      }),
    ).to.equal(
      '1930a9d5475565836e69ea1ac98208eeTz0xMjMsRT0xNTkxNzIzODc5MDYyLFM9cHJvLExNPXBlcnBldHVhbCxQVj1pbml0aWFsLEtWPTI=',
    );
  });

  it('should generate subscription Pro license when `planVersion: "Q3-2024"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: '123',
        planScope: 'pro',
        licenseModel: 'subscription',
        planVersion: 'Q3-2024',
      }),
    ).to.equal(
      'a43dfef1c82eb79935c6cd38272b8fdeTz0xMjMsRT0xNTkxNzIzODc5MDYyLFM9cHJvLExNPXN1YnNjcmlwdGlvbixQVj1RMy0yMDI0LEtWPTI=',
    );
  });

  it('should generate subscription Premium license when `planVersion: "Q3-2024"`', () => {
    expect(
      generateLicense({
        expiryDate: new Date(1591723879062),
        orderNumber: '123',
        planScope: 'premium',
        licenseModel: 'subscription',
        planVersion: 'Q3-2024',
      }),
    ).to.equal(
      '21b1d706d059d60add6dd17e3b28e2b8Tz0xMjMsRT0xNTkxNzIzODc5MDYyLFM9cHJlbWl1bSxMTT1zdWJzY3JpcHRpb24sUFY9UTMtMjAyNCxLVj0y',
    );
  });
});
