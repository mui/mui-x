import transformPickers from '../pickers/preset-safe';
import transformDataGrid from '../data-grid/preset-safe';
import transformTreeView from '../tree-view/preset-safe';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformPickers(file, api, options);
  file.source = transformDataGrid(file, api, options);
  file.source = transformTreeView(file, api, options);

  return file.source;
}
