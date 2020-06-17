function showError(message: string[]) {
  console.error(
    [
      '************************************************************',
      '*************************************************************',
      ,
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
    'Your license for Material-UI X is not valid, please contact',
    'license@material-ui.com to get a valid license.',
  ]);
}

export function showNotFoundLicenseError() {
  showError([
    'Material-UI X: License key not found.',
    '',
    'All Material-UI X features are unlocked.',
    'This is an evaluation only version, it is not licensed for',
    'development projects intended for production.',
    '',
    'If you want a license to use the features, please email',
    'license@material-ui.com  for a trial license.',
  ]);
}

export function showExpiredLicenseError() {
  showError([
    'Material-UI X: License key expired.',
    '',
    'Please contact license@material-ui.com to renew your subscription',
    'and get the latest version of Material-UI X.',
  ]);
}
