// Cross-major license compatibility tests.
//
// The published `@mui/x-license` (and its predecessor `@mui/x-license-pro`) inside an older
// installed version of the X packages is whatever shipped with that major. Once a customer
// installs `@mui/x-data-grid-pro@v6` (etc.), they don't get our latest verifyLicense
// they get the one frozen at v6's release. So when we issue a license today, it has to
// remain readable by every older verifyLicense we still support.
//
// The matrix below covers three axes:
//   - x-license major (v5 / v6 / v7 / v8 / v9): the verifyLicense baked into customer installs
//   - license-key format that may be in the wild: every key version the dispatcher
//     needs to handle:
//       - KEYVERSION=1: legacy perpetual format (no longer issued, but old customers
//         still have them)
//       - KV=2: added `S=` / `LM=` / `PV=` tokens; used through v6/v7/v8
//       - KV=3: added `Q=` / `AT=` tokens; the format issued today
//   - commercial package the license is presented to (data-grid-pro, charts-pro, tree-view-pro)
//
// All five majors are pinned to specific published versions (see this workspace's
// package.json) so the matrix is locked to actual released contracts, not in-flight
// workspace changes. Pinned v9 was built with `__ALLOW_TEST_LICENSES__` inlined as `false`,
// which would normally reject every `T=true` test fixture; the workspace's vitest config
// patches that single guard at transform time so the pinned v9 verifyLicense runs as if
// test licenses were allowed (see vitest.config.jsdom.mts).
//
// A failing cell is a real backwards-compat regression, either the wire format changed in a
// way an older major can't decode, or we shipped a token an older major doesn't recognize.
//
// ⚠️ KV=3 cells are intentionally marked `it.fails`. KV=3 was introduced in v9 and is unknown
// to v5–v8 verifyLicense, so any KV=3 key returns Invalid for everyone on those older majors.
// We can't remove the KV=3 format from v9+ retroactively because ~36 KV=3 keys have already
// been issued to real customers; they need the v9+ decoder to keep working.
// Going forward, no new KV should be introduced, extend KV=2 with optional tokens instead
// (older parsers silently ignore unknown tokens). The `it.fails` markers exist so this
// regression stays visible in CI and the day older majors are no longer supported, the
// markers can be removed cleanly.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { verifyLicense as verifyLicenseV5, LicenseStatus as STATUS_V5 } from 'x-license-v5';
import { verifyLicense as verifyLicenseV6, LICENSE_STATUS as STATUS_V6 } from 'x-license-v6';
import { verifyLicense as verifyLicenseV7, LICENSE_STATUS as STATUS_V7 } from 'x-license-v7';
import { verifyLicense as verifyLicenseV8, LICENSE_STATUS as STATUS_V8 } from 'x-license-v8';
import {
  verifyLicense as verifyLicenseV9,
  LicenseStatus as STATUS_V9,
} from 'x-license-v9/internals';
import {
  TEST_KEY_V1,
  TEST_LICENSE_KEY_PRO,
  TEST_KEY_PRO_SUBSCRIPTION_FUTURE,
  TEST_KEY_PRO_ANNUAL_Q1_2026,
  TEST_KEY_PRO_ANNUAL_V3,
  TEST_KEY_PRO_ANNUAL_Q1_2026_V3,
} from '@mui/x-license/test-keys';

// `releaseInfo` / `releaseDate` is the base64-encoded ms timestamp the package was built at.
// Pinning it well before any license expiry keeps the perpetual/annual logic from
// short-circuiting these tests on date math.
const RELEASE_INFO = Buffer.from(String(new Date(2018, 0, 0).getTime()), 'utf8').toString('base64');

const ACCEPTED_SCOPES: ('pro' | 'premium')[] = ['pro', 'premium'];

// Pro-tier commercial packages a customer might install. We use only pro packages because
// the test license keys all carry `S=pro`; pointing a pro license at a `-premium` package
// surfaces OutOfScope, which is correct behavior, not a compat issue.
const PRO_PACKAGES = ['x-data-grid-pro', 'x-charts-pro', 'x-tree-view-pro'] as const;

type Major = 'v5' | 'v6' | 'v7' | 'v8' | 'v9';
type PackageName = (typeof PRO_PACKAGES)[number];

const licenseMajors: ReadonlyArray<{
  name: Major;
  call: (licenseKey: string, packageName: PackageName) => unknown;
  valid: unknown;
}> = [
  {
    name: 'v5',
    // v5 takes `acceptedScopes` and ignores any package-name concept; pointing at a
    // different commercial package doesn't change v5's behavior, so we just pass it
    // through for symmetry of the cell signature.
    call: (licenseKey) =>
      verifyLicenseV5({
        releaseInfo: RELEASE_INFO,
        licenseKey,
        acceptedScopes: ACCEPTED_SCOPES,
        isProduction: true,
      }),
    valid: STATUS_V5.Valid,
  },
  {
    name: 'v6',
    // v6 also has no packageName concept.
    call: (licenseKey) =>
      verifyLicenseV6({
        releaseInfo: RELEASE_INFO,
        licenseKey,
        acceptedScopes: ACCEPTED_SCOPES,
      }).status,
    valid: STATUS_V6.Valid,
  },
  {
    name: 'v7',
    // v7 introduced packageName so it can gate things like `NotAvailableInInitialProPlan`.
    call: (licenseKey, packageName) =>
      verifyLicenseV7({
        releaseInfo: RELEASE_INFO,
        licenseKey,
        packageName,
      }).status,
    valid: STATUS_V7.Valid,
  },
  {
    name: 'v8',
    call: (licenseKey, packageName) =>
      verifyLicenseV8({
        releaseInfo: RELEASE_INFO,
        licenseKey,
        packageName,
      }).status,
    valid: STATUS_V8.Valid,
  },
  {
    name: 'v9',
    // v9 reshaped the signature: releaseInfo/packageName moved into `packageInfo`.
    // Empty `version` skips the v9-specific upgrade gate; we're verifying wire-format
    // compatibility here, not v9's plan-version enforcement.
    call: (licenseKey, packageName) =>
      verifyLicenseV9({
        packageInfo: { releaseDate: RELEASE_INFO, version: '', name: packageName },
        licenseKey,
      }).status,
    // v9's published `internals` doesn't re-export the LICENSE_STATUS enum at runtime,
    // but the value is just the string 'Valid' (same as every other major).
    valid: 'Valid' as STATUS_V9,
  },
];

// `knownIncompatible` returns true when the major is fundamentally incapable of accepting
// this license format (e.g. v5 never learned `annual`).
// `notAvailableForPackages` lists pro packages that the v7/v8/v9 plan-version gate excludes
// for this license (e.g. an `initial` plan license can't unlock charts-pro/tree-view-pro).
// `expectedToFail` lists majors where this format is known not to decode; cells for those
// majors get `it.fails.each(...)` so the suite stays green while documenting the regression.
type LicenseCase = {
  label: string;
  key: string;
  knownIncompatible?: (major: Major) => boolean;
  notAvailableForPackages?: ReadonlyArray<PackageName>;
  expectedToFail?: ReadonlySet<Major>;
};

// v7+ enforces `NotAvailableInInitialProPlan` for charts-pro / tree-view-pro when the
// license has the `initial` plan version (or KV=1, which is treated as initial). v5/v6
// don't have this gate, so they accept these packages. Excluding these cells keeps
// "Valid" the meaningful expectation rather than NotAvailableInInitialProPlan.
const INITIAL_PLAN_GATED: ReadonlyArray<PackageName> = ['x-charts-pro', 'x-tree-view-pro'];

// KV=3 keys are unknown to v5/v6/v7/v8, they all return Invalid. v9 understands KV=3,
// so v9 is intentionally absent from this set.
const KV3_BREAKS_ON: ReadonlySet<Major> = new Set(['v5', 'v6', 'v7', 'v8']);

const licenseKeys: LicenseCase[] = [
  {
    label: 'KEYVERSION=1 perpetual',
    key: TEST_KEY_V1,
    notAvailableForPackages: INITIAL_PLAN_GATED,
  },
  {
    label: 'KV=2 subscription (initial, far-future)',
    key: TEST_KEY_PRO_SUBSCRIPTION_FUTURE,
    notAvailableForPackages: INITIAL_PLAN_GATED,
  },
  {
    label: 'KV=2 annual (Q3-2024)',
    key: TEST_LICENSE_KEY_PRO,
    // v5's LICENSING_MODELS is ['perpetual', 'subscription'], `annual` was introduced in v6
    // v5 returns Invalid for any annual key. This is a frozen historical limitation of v5,
    // not a regression in the wire format we ship today.
    knownIncompatible: (major) => major === 'v5',
  },
  {
    label: 'KV=2 annual (Q1-2026)',
    key: TEST_KEY_PRO_ANNUAL_Q1_2026,
    knownIncompatible: (major) => major === 'v5',
  },
  {
    label: 'KV=3 annual (Q3-2024)',
    key: TEST_KEY_PRO_ANNUAL_V3,
    expectedToFail: KV3_BREAKS_ON,
  },
  {
    label: 'KV=3 annual (Q1-2026)',
    key: TEST_KEY_PRO_ANNUAL_Q1_2026_V3,
    expectedToFail: KV3_BREAKS_ON,
  },
];

describe('Cross-major license compatibility: every license must be accepted by every supported major', () => {
  // Older verifyLicense implementations log "Key version not found" via console.error
  // when they encounter a KV they don't understand. Silence it so vitest-fail-on-console
  // doesn't mask the real assertion failure.
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const allCells = licenseMajors.flatMap(({ name: major, call, valid }) =>
    licenseKeys
      .filter(({ knownIncompatible }) => !knownIncompatible?.(major))
      .flatMap(({ label, key, notAvailableForPackages, expectedToFail }) =>
        PRO_PACKAGES.filter((pkg) => !notAvailableForPackages?.includes(pkg)).map((pkg) => ({
          major,
          label,
          packageName: pkg,
          key,
          call,
          valid,
          shouldFail: expectedToFail?.has(major) ?? false,
        })),
      ),
  );

  const passingCells = allCells.filter((c) => !c.shouldFail);
  const knownFailingCells = allCells.filter((c) => c.shouldFail);

  it.each(passingCells)(
    '$major accepts $label on $packageName',
    ({ key, packageName, call, valid }) => {
      expect(call(key, packageName)).to.equal(valid);
    },
  );

  // `it.fails` asserts the test currently fails, keeps the suite green while
  // the KV=3-on-older-majors regression exists, and surfaces a real failure
  // the moment it gets fixed (so we know to remove these markers).
  it.fails.each(knownFailingCells)(
    '$major accepts $label on $packageName',
    ({ key, packageName, call, valid }) => {
      expect(call(key, packageName)).to.equal(valid);
    },
  );
});
