import renameFieldRef from '../rename-field-ref';
import removePickerDay2 from '../remove-picker-day-2';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  [renameFieldRef, removePickerDay2].forEach((transform) => {
    file.source = transform(file, api, options);
  });

  return file.source;
}
