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
    'Material-UI X: Invalid license.',
    '',
    'Your license for Material-UI X is not valid, please visit',
    'https://material-ui.com/r/x-license to get a valid license.',
  ]);
}

export function showNotFoundLicenseError() {
  showError([
    'Material-UI X: License key not found.',
    '',
    'This is an trial only version of Material-UI X.',
    'While all the features are unlocked, it is not licensed for',
    'development on projects intended for production.',
    '',
    'If you want a license to use the features, please visit',
    'https://material-ui.com/r/x-license to get a valid license.',
  ]);
}

export function showExpiredLicenseError() {
  showError([
    'Material-UI X: License key expired.',
    '',
    'Please visit https://material-ui.com/r/x-license to renew',
    'your subscription and get the latest version of Material-UI X.',
  ]);
}
