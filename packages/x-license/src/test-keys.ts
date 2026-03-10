// =============================================================================
// Test license keys for use in test suites.
// All keys contain T=true in their payload and are rejected outside test environments.
// Import via '@mui/x-license/internals'.
// =============================================================================

/**
 * Test Premium license key.
 * orderId: #123, scope: premium, licenseModel: annual, planVersion: Q3-2024
 * keyVersion: 2, expiryDate: 2099-12-30T23:00:00.000Z
 */
export const TEST_LICENSE_KEY_PREMIUM =
  '715a2f48d6140e8e6f2484e6c4b981aeTz0xMjMsRT00MTAyMzU0ODAwMDAwLFM9cHJlbWl1bSxMTT1hbm51YWwsUFY9UTMtMjAyNCxUPXRydWUsS1Y9Mg==';

/**
 * Test Pro license key.
 * orderId: #123, scope: pro, licenseModel: annual, planVersion: Q3-2024
 * keyVersion: 2, expiryDate: 2099-12-30T23:00:00.000Z
 */
export const TEST_LICENSE_KEY_PRO =
  '8d0500f3fe93ffea84445b2aed17c59cTz0xMjMsRT00MTAyMzU0ODAwMDAwLFM9cHJvLExNPWFubnVhbCxQVj1RMy0yMDI0LFQ9dHJ1ZSxLVj0y';

// --- Key format v1 ---

/**
 * Key version 1 format (pro, perpetual, initial implied).
 * orderId: #123, expiryDate: 2026-08-02
 */
export const TEST_KEY_V1 =
  '8f5bd7d70e4d7aeecd1d5b9d0d1759bbT1JERVI6MTIzLEVYUElSWT0xNzg1ODc0MDEwNzA4LFQ9dHJ1ZSxLRVlWRVJTSU9OPTE=';

// --- Keys for verifyLicense tests (paired with releaseDate = 2018-01-01) ---

/**
 * Pro subscription, initial, expiry = releaseDate + 1 day.
 * orderId: #123, keyVersion: 2
 */
export const TEST_KEY_PRO_SUBSCRIPTION =
  'b4cb282aa165b05f65f70a4caddadc81Tz0xMjMsRT0xNTE0NzYxMjAwMDAwLFM9cHJvLExNPXN1YnNjcmlwdGlvbixQVj1pbml0aWFsLFQ9dHJ1ZSxLVj0y';

/**
 * Premium subscription, initial, expiry = releaseDate + 1 day.
 * orderId: #123, keyVersion: 2
 */
export const TEST_KEY_PREMIUM_SUBSCRIPTION =
  '22bd1051015e3c663f8ca5cba9ebe56aTz0xMjMsRT0xNTE0NzYxMjAwMDAwLFM9cHJlbWl1bSxMTT1zdWJzY3JpcHRpb24sUFY9aW5pdGlhbCxUPXRydWUsS1Y9Mg==';

/**
 * Pro perpetual, initial, expiry = releaseDate + 1 day (valid).
 * orderId: #123, keyVersion: 2
 */
export const TEST_KEY_PRO_PERPETUAL =
  'f4221ac32d1b8b102c143dcf65080414Tz0xMjMsRT0xNTE0NzYxMjAwMDAwLFM9cHJvLExNPXBlcnBldHVhbCxQVj1pbml0aWFsLFQ9dHJ1ZSxLVj0y';

/**
 * Pro perpetual, initial, expiry = releaseDate - 1 day (expired before release).
 * orderId: #123, keyVersion: 2
 */
export const TEST_KEY_PRO_PERPETUAL_EXPIRED =
  '64245e2bb861fc92856e682b32dc8bf2Tz0xMjMsRT0xNTE0NTg4NDAwMDAwLFM9cHJvLExNPXBlcnBldHVhbCxQVj1pbml0aWFsLFQ9dHJ1ZSxLVj0y';

/**
 * Pro annual, initial, expiry = releaseDate + 1 day.
 * orderId: #123, keyVersion: 2
 */
export const TEST_KEY_PRO_ANNUAL_INITIAL =
  'd82e3196c55fc5dc21a4145b796a77a7Tz0xMjMsRT0xNTE0NzYxMjAwMDAwLFM9cHJvLExNPWFubnVhbCxQVj1pbml0aWFsLFQ9dHJ1ZSxLVj0y';

/**
 * Premium annual, initial, expiry = releaseDate + 1 day.
 * orderId: #123, keyVersion: 2
 */
export const TEST_KEY_PREMIUM_ANNUAL_INITIAL =
  '8fc9fa79e1b5f30ce737ccec8f3e36f4Tz0xMjMsRT0xNTE0NzYxMjAwMDAwLFM9cHJlbWl1bSxMTT1hbm51YWwsUFY9aW5pdGlhbCxUPXRydWUsS1Y9Mg==';

// --- Keys for time-sensitive tests (used with vi.useFakeTimers, fakeNow = 2024-06-15) ---

/**
 * Pro subscription, initial, expiry = 2024-06-14 (fakeNow - 1 day, within grace period).
 * orderId: #123, keyVersion: 2
 */
export const TEST_KEY_EXPIRED_GRACE =
  '84dcbd1c5a6169c74e6c70ec23e0df55Tz0xMjMsRT0xNzE4MzIzMjAwMDAwLFM9cHJvLExNPXN1YnNjcmlwdGlvbixQVj1pbml0aWFsLFQ9dHJ1ZSxLVj0y';

/**
 * Pro subscription, initial, expiry = 2024-05-16 (fakeNow - 30 days, past grace period).
 * orderId: #123, keyVersion: 2
 */
export const TEST_KEY_EXPIRED_30DAYS =
  '4081d3863dda2ca60be4a5b29f582117Tz0xMjMsRT0xNzE1ODE3NjAwMDAwLFM9cHJvLExNPXN1YnNjcmlwdGlvbixQVj1pbml0aWFsLFQ9dHJ1ZSxLVj0y';

// --- Keys for useLicenseVerifier plan combination tests (initial planVersion, far-future expiry) ---

/**
 * Pro subscription, initial, expiry = 3001-01-01.
 * orderId: #123, keyVersion: 2
 */
export const TEST_KEY_PRO_SUBSCRIPTION_FUTURE =
  'e83a283135bbd911e4aa0fd55ceea3ebTz0xMjMsRT0zMjUzNTEyNjAwMDAwMCxTPXBybyxMTT1zdWJzY3JpcHRpb24sUFY9aW5pdGlhbCxUPXRydWUsS1Y9Mg==';

/**
 * Premium subscription, initial, expiry = 3001-01-01.
 * orderId: #123, keyVersion: 2
 */
export const TEST_KEY_PREMIUM_SUBSCRIPTION_FUTURE =
  '1c6ea00fadedfcb3f2ef393f1de32f29Tz0xMjMsRT0zMjUzNTEyNjAwMDAwMCxTPXByZW1pdW0sTE09c3Vic2NyaXB0aW9uLFBWPWluaXRpYWwsVD10cnVlLEtWPTI=';

// --- Key format v3 ---

/**
 * Pro annual, Q3-2024, quantity: 5, appType: single.
 * orderId: #123, keyVersion: 3, expiryDate: 2099-12-30T23:00:00.000Z
 */
export const TEST_KEY_PRO_ANNUAL_V3 =
  '521a75b4cf0d0c5e8990ce070886e167Tz0xMjMsRT00MTAyMzU0ODAwMDAwLFM9cHJvLExNPWFubnVhbCxQVj1RMy0yMDI0LFE9NSxBVD1zaW5nbGUsVD10cnVlLEtWPTM=';

// --- Key format v3 Q1-2026 ---

/**
 * Pro annual, Q1-2026, quantity: 5, appType: single.
 * orderId: #123, keyVersion: 3, expiryDate: 3001-01-01
 */
export const TEST_KEY_PRO_ANNUAL_Q1_2026_V3 =
  '5f52871b5845f28ebdd0fabbe0b89695Tz0xMjMsRT0zMjUzNTEyNjAwMDAwMCxTPXBybyxMTT1hbm51YWwsUFY9UTEtMjAyNixRPTUsQVQ9c2luZ2xlLFQ9dHJ1ZSxLVj0z';

/**
 * Premium annual, Q1-2026, quantity: 10, appType: single.
 * orderId: #123, keyVersion: 3, expiryDate: 3001-01-01
 */
export const TEST_KEY_PREMIUM_ANNUAL_Q1_2026_V3 =
  '450d9fc1b28e709fcb73969bd10e1c30Tz0xMjMsRT0zMjUzNTEyNjAwMDAwMCxTPXByZW1pdW0sTE09YW5udWFsLFBWPVExLTIwMjYsUT0xMCxBVD1zaW5nbGUsVD10cnVlLEtWPTM=';

// --- Keys for v9 plan version check tests (perpetual + Q1-2026) ---

/**
 * Pro perpetual, Q1-2026, expiry = releaseDate + 1 day (not expired).
 * orderId: #123, keyVersion: 2
 */
export const TEST_KEY_PRO_PERPETUAL_Q1_2026 =
  '5f78509380f3ea3b3c91d7af3f5496eaTz0xMjMsRT0xNTE0NzYxMjAwMDAwLFM9cHJvLExNPXBlcnBldHVhbCxQVj1RMS0yMDI2LFQ9dHJ1ZSxLVj0y';

/**
 * Pro perpetual, Q1-2026, expiry = releaseDate - 1 day (expired before release).
 * orderId: #123, keyVersion: 2
 */
export const TEST_KEY_PRO_PERPETUAL_Q1_2026_EXPIRED =
  '191d8aaf174e38bcbf367e07fa39e423Tz0xMjMsRT0xNTE0NTg4NDAwMDAwLFM9cHJvLExNPXBlcnBldHVhbCxQVj1RMS0yMDI2LFQ9dHJ1ZSxLVj0y';

// --- Invalid / edge-case keys ---

/**
 * Invalid key: hash does not match payload (tampered).
 * Used to test that verifyLicense rejects tampered keys.
 */
export const TEST_KEY_INVALID =
  'c0b3c1c31055976260628def9b697020TkFNRTpNYC1VSSBTQVMsREVWRUxPUEVSX0NPVU5UPTEwLEVYUElSWT0xNTkxNzIzMDY3MDQyLFZFUlNJT049MS4yLjMsVD10cnVl';

/**
 * Valid hash but unknown key version (KV=99).
 * Used to test that decodeLicense returns null for unrecognized versions.
 */
export const TEST_KEY_UNKNOWN_VERSION =
  '64152474c774ae343484f08bbbc1a231Tz0xMjMsRT0xNTE0NzYxMjAwMDAwLFM9cHJvLExNPWFubnVhbCxQVj1pbml0aWFsLFQ9dHJ1ZSxLVj05OQ==';
