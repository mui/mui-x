import transformTreeView from '../tree-view/preset-safe';
import transformPickers from '../pickers/preset-safe';
import transformCharts from '../charts/preset-safe';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformTreeView(file, api, options);
  file.source = transformPickers(file, api, options);
  file.source = transformCharts(file, api, options);

  return file.source;
}
