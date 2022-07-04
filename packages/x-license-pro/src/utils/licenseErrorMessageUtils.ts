function showError(message: string[]) {
  console.error(
    [
      '************************************************************',
      '*************************************************************',
      '',
      ...message,
      '',
      '*************************************************************',
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

export function showNotFoundLicenseError() {
  showError([
    'MUI: License key not found.',
    '',
    'This is a trial-only version of MUI X.',
    'See the conditons here: https://mui.com/r/x-license-eula#evaluation-trial-licenses.',
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
