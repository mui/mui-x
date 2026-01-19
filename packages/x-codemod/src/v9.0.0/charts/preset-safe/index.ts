import renameChartApiImport from '../rename-chart-api-import';

import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  [
    // Add others here as they are created
    renameChartApiImport,
  ].forEach((transform) => {
    file.source = transform(file, api, options);
  });

  return file.source;
}
