import transformLocalizationProviderRenameLocale from './localization-provider-rename-locale';

/**
 * @param {import('jscodeshift').FileInfo} file
 * @param {import('jscodeshift').API} api
 */
export default function transformer(file, api, options) {
  file.source = transformLocalizationProviderRenameLocale(file, api, options);

  return file.source;
}
