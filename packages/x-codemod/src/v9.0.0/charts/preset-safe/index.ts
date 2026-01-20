import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  [
    // Add others here as they are created
    (a, _b, _c) => a.source, // placeholder to maintain structure,
  ].forEach((transform) => {
    file.source = transform(file, api, options);
  });

  return file.source;
}
