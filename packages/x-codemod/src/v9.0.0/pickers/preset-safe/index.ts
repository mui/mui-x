import renameFieldRef from '../rename-field-ref';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  [renameFieldRef].forEach((transform) => {
    file.source = transform(file, api, options);
  });

  return file.source;
}
