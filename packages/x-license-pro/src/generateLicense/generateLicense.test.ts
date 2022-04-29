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
      '310495f37c0e32a88a5371ced300ac05T1JERVI9TVVJLTEyMyxFWFBJUlk9MTU5MTcyMzg3OTA2MixLRVlWRVJTSU9OPTIsU0NPUEU9cHJvLFRFUk09c3Vic2NyaXB0aW9u',
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
      '310495f37c0e32a88a5371ced300ac05T1JERVI9TVVJLTEyMyxFWFBJUlk9MTU5MTcyMzg3OTA2MixLRVlWRVJTSU9OPTIsU0NPUEU9cHJvLFRFUk09c3Vic2NyaXB0aW9u',
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
      '42e3b10f822986504fe9469ed53fc3dcT1JERVI9TVVJLTEyMyxFWFBJUlk9MTU5MTcyMzg3OTA2MixLRVlWRVJTSU9OPTIsU0NPUEU9cHJlbWl1bSxURVJNPXN1YnNjcmlwdGlvbg==',
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
      '310495f37c0e32a88a5371ced300ac05T1JERVI9TVVJLTEyMyxFWFBJUlk9MTU5MTcyMzg3OTA2MixLRVlWRVJTSU9OPTIsU0NPUEU9cHJvLFRFUk09c3Vic2NyaXB0aW9u',
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
      '310495f37c0e32a88a5371ced300ac05T1JERVI9TVVJLTEyMyxFWFBJUlk9MTU5MTcyMzg3OTA2MixLRVlWRVJTSU9OPTIsU0NPUEU9cHJvLFRFUk09c3Vic2NyaXB0aW9u',
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
      'ab260e0003d2473c4d3bc34eb83f4d8bT1JERVI9TVVJLTEyMyxFWFBJUlk9MTU5MTcyMzg3OTA2MixLRVlWRVJTSU9OPTIsU0NPUEU9cHJvLFRFUk09cGVycGV0dWFs',
    );
  });
});
