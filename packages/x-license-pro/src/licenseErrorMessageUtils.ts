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
    'MUI: Invalid license.',
    '',
    'Your license for MUI X is not valid, please visit',
    'https://mui.com/r/x-license to get a valid license.',
  ]);
}

export function showNotFoundLicenseError() {
  showError([
    'MUI: License key not found.',
    '',
    'This is a trial-only version of MUI X.',
    'While all the features are unlocked, it is not licensed for',
    'development use on projects intended for production.',
    '',
    'To purchase a license, please visit',
    'https://mui.com/r/x-license to get a valid license.',
  ]);
}

export function showExpiredLicenseError() {
  showError([
    'MUI: License key expired.',
    '',
    'Please visit https://mui.com/r/x-license to renew',
    'your subscription and get the latest version of MUI X.',
  ]);
}
