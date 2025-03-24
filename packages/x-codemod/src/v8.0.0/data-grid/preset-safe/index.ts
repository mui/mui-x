import removeExperimentalFeatures from '../remove-stabilized-experimentalFeatures';
import removeProps from '../remove-props';
import renameProps from '../rename-props';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = removeExperimentalFeatures(file, api, options);
  file.source = renameProps(file, api, options);
  file.source = removeProps(file, api, options);

  return file.source;
}
