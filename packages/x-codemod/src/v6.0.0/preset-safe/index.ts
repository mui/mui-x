import transformLocalizationProviderRenameLocale from '../localization-provider-rename-locale';
import transformTextPropsToLocaleText from '../text-props-to-localeText';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformLocalizationProviderRenameLocale(file, api, options);
  file.source = transformTextPropsToLocaleText(file, api, options);

  return file.source;
}
