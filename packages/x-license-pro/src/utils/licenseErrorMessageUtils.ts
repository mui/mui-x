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
    'MUI: License key plan mismatch.',
    '',
    'Your use of MUI X is not compatible with the plan of your license key.',
    'You are rendering a `DataGridPremium` component that requires a license key for the Premium plan but your license key is for the Pro plan.',
    '',
    'You can solve the issue by upgrading to Premium at https://mui.com/r/x-get-license?scope=premium',
    'Alternatively, you can replace the import of `DataGridPremium` with `DataGridPro`.',
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
