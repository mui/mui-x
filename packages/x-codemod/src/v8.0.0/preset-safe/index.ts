import transformTreeView from '../tree-view/preset-safe';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformTreeView(file, api, options);

  return file.source;
}
