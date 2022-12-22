import transformLocalizationProviderRenameLocale from '../localization-provider-rename-locale';
import transformTextPropsToLocaleText from '../text-props-to-localeText';
import transformViewComponentsRename from '../view-components-rename';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformLocalizationProviderRenameLocale(file, api, options);

  // Should be run before the renaming of components such as `ClockPicker` to `TimeClock`.
  file.source = transformTextPropsToLocaleText(file, api, options);

  file.source = transformViewComponentsRename(file, api, options);

  return file.source;
}
