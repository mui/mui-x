import removeExperimentalFeatures from '../remove-stabilized-experimentalFeatures';
import removeProps from '../remove-props';
import renameProps from '../rename-props';
import reformRowSelectionModel from '../reform-row-selection-model';
import renameImports from '../rename-imports';
import renamePackage from '../rename-package';
import addShowToolbarProp from '../add-showToolbar-prop';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = removeExperimentalFeatures(file, api, options);
  file.source = renameProps(file, api, options);
  file.source = removeProps(file, api, options);
  file.source = reformRowSelectionModel(file, api, options);
  file.source = renameImports(file, api, options);
  file.source = renamePackage(file, api, options);
  file.source = addShowToolbarProp(file, api, options);
  return file.source;
}
