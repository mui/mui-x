import transformLocalizationProviderRenameLocale from '../localization-provider-rename-locale';
import transformTextPropsToLocaleText from '../text-props-to-localeText';
import transformViewComponentsRename from '../view-components-rename';
import transformViewComponentsRenameValueProp from '../view-components-rename-value-prop';
import transformAdapterChangeImport from '../adapter-change-import';
import transformReplaceTabsProps from '../replace-tabs-props';
import transformReplaceToolbarPropsBySlot from '../replace-toolbar-props-by-slot';
import transformMigrateToComponentsComponetsProps from '../migrate-to-components-componentsProps';
import transformReplaceArrowsButtonSlot from '../replace-arrows-button-slot';
import transformRenameShouldDisableTime from '../rename-should-disable-time';
import transformRenameDefaultToolbarTitleLocaleText from '../rename-default-toolbar-title-localeText';

import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformLocalizationProviderRenameLocale(file, api, options);

  // All the codemods impacting the view components should be run before renaming these components
  file.source = transformTextPropsToLocaleText(file, api, options);
  file.source = transformViewComponentsRenameValueProp(file, api, options);

  file.source = transformViewComponentsRename(file, api, options);
  file.source = transformAdapterChangeImport(file, api, options);
  file.source = transformReplaceTabsProps(file, api, options);
  file.source = transformReplaceToolbarPropsBySlot(file, api, options);
  file.source = transformMigrateToComponentsComponetsProps(file, api, options);
  file.source = transformReplaceArrowsButtonSlot(file, api, options);
  file.source = transformRenameShouldDisableTime(file, api, options);
  file.source = transformRenameDefaultToolbarTitleLocaleText(file, api, options);

  return file.source;
}
