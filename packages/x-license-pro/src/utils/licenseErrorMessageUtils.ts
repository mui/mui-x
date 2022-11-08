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

export function showInvalidLicenseError() {
  showError([
    'MUI: Invalid license key.',
    '',
    "Your MUI X license key isn't valid. Please check your license key installation https://mui.com/r/x-license-key-installation.",
    '',
    'To purchase a license, please visit https://mui.com/r/x-get-license.',
  ]);
}

export function showOutOfScopeLicenseError() {
  showError([
    'MUI: Out of scope license key.',
    '',
    'Your MUI X license key isn\'t valid. You are rendering a DataGridPremium component that requires a license key with the "premium" feature scope but your license key has the "pro" feature scope.',
    '',
    'You can solve the issue by purchasing a Premium license at https://mui.com/r/x-get-license?scope=premium',
    'Alternatively, you can replace the import on DataGridPremium with DataGridPro.',
  ]);
}

export function showNotFoundLicenseError({
  plan,
  packageName,
}: {
  plan: string;
  packageName: string;
}) {
  showError([
    `MUI: License key not found for ${packageName}.`,
    '',
    `This is a trial-only version of MUI X ${plan}.`,
    'See the conditons here: https://mui.com/r/x-license-trial.',
    '',
    'To purchase a license, please visit https://mui.com/r/x-get-license.',
  ]);
}

export function showExpiredLicenseError() {
  showError([
    'MUI: License key expired.',
    '',
    'Please visit https://mui.com/r/x-get-license to renew your subscription of MUI X.',
  ]);
}
