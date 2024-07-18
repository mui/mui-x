function showError(message: string[]) {
  console.error(
    [
      '*************************************************************',
      '',
      ...message,
      '',
      '*************************************************************',
    ].join('\n'),
  );
}

export function showInvalidLicenseKeyError() {
  showError([
    'MUI X: Invalid license key.',
    '',
    "Your MUI X license key format isn't valid. It could be because the license key is missing a character or has a typo.",
    '',
    'To solve the issue, you need to double check that `setLicenseKey()` is called with the right argument',
    'Please check the license key installation https://mui.com/r/x-license-key-installation.',
  ]);
}

export function showLicenseKeyPlanMismatchError() {
  showError([
    'MUI X: License key plan mismatch.',
    '',
    'Your use of MUI X is not compatible with the plan of your license key. The feature you are trying to use is not included in the plan of your license key. This happens if you try to use `DataGridPremium` with a license key for the Pro plan.',
    '',
    'To solve the issue, you can upgrade your plan from Pro to Premium at https://mui.com/r/x-get-license?scope=premium.',
    "Of if you didn't intend to use Premium features, you can replace the import of `@mui/x-data-grid-premium` with `@mui/x-data-grid-pro`.",
  ]);
}

export function showNotAvailableInInitialProPlanError() {
  showError([
    'MUI X: Component not included in your license.',
    '',
    'The component you are trying to use is not included in the Pro Plan you purchased.',
    '',
    'Your license is from an old version of the Pro Plan that is only compatible with the `@mui/x-data-grid-pro` and `@mui/x-date-pickers-pro` commercial packages.',
    '',
    'To start using another Pro package, please consider reaching to our sales team to upgrade your license or visit https://mui.com/r/x-get-license to get a new license key.',
  ]);
}

export function showMissingLicenseKeyError({
  plan,
  packageName,
}: {
  plan: string;
  packageName: string;
}) {
  showError([
    'MUI X: Missing license key.',
    '',
    `The license key is missing. You might not be allowed to use \`${packageName}\` which is part of MUI X ${plan}.`,
    '',
    'To solve the issue, you can check the free trial conditions: https://mui.com/r/x-license-trial.',
    'If you are eligible no actions are required. If you are not eligible to the free trial, you need to purchase a license https://mui.com/r/x-get-license or stop using the software immediately.',
  ]);
}

export function showExpiredPackageVersionError({ packageName }: { packageName: string }) {
  showError([
    'MUI X: Expired package version.',
    '',
    `You have installed a version of \`${packageName}\` that is outside of the maintenance plan of your license key. By default, commercial licenses provide access to new versions released during the first year after the purchase.`,
    '',
    'To solve the issue, you can renew your license https://mui.com/r/x-get-license or install an older version of the npm package that is compatible with your license key.',
  ]);
}

export function showExpiredAnnualGraceLicenseKeyError({
  plan,
  licenseKey,
  expiryTimestamp,
}: {
  plan: string;
  licenseKey: string;
  expiryTimestamp: number;
}) {
  showError([
    'MUI X: Expired license key.',
    '',
    `Your annual license key to use MUI X ${plan} in non-production environments has expired. If you are seeing this development console message, you might be close to breach the license terms by making direct or indirect changes to the frontend of an app that render a MUI X ${plan} component (more details in https://mui.com/r/x-license-annual).`,
    '',
    'To solve the problem you can either:',
    '',
    '- Renew your license https://mui.com/r/x-get-license and use the new key',
    `- Stop making changes to code depending directly or indirectly on MUI X ${plan}'s APIs`,
    '',
    'Note that your license is perpetual in production environments with any version released before your license term ends.',
    '',
    `- License key expiry timestamp: ${new Date(expiryTimestamp)}`,
    `- Installed license key: ${licenseKey}`,
    '',
  ]);
}

export function showExpiredAnnualLicenseKeyError({
  plan,
  licenseKey,
  expiryTimestamp,
}: {
  plan: string;
  licenseKey: string;
  expiryTimestamp: number;
}) {
  throw new Error(
    [
      'MUI X: Expired license key.',
      '',
      `Your annual license key to use MUI X ${plan} in non-production environments has expired. If you are seeing this development console message, you might be close to breach the license terms by making direct or indirect changes to the frontend of an app that render a MUI X ${plan} component (more details in https://mui.com/r/x-license-annual).`,
      '',
      'To solve the problem you can either:',
      '',
      '- Renew your license https://mui.com/r/x-get-license and use the new key',
      `- Stop making changes to code depending directly or indirectly on MUI X ${plan}'s APIs`,
      '',
      'Note that your license is perpetual in production environments with any version released before your license term ends.',
      '',
      `- License key expiry timestamp: ${new Date(expiryTimestamp)}`,
      `- Installed license key: ${licenseKey}`,
      '',
    ].join('\n'),
  );
}
