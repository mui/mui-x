import transformCharts from '../charts/preset-safe';
import transformPickers from '../pickers/preset-safe';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  [
    // Add others here as they are created
    transformCharts,
    transformPickers,
  ].forEach((transform) => {
    file.source = transform(file, api, options);
  });

  return file.source;
}
