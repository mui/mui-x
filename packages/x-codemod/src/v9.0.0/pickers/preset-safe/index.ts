import renameFieldRef from '../rename-field-ref';
import removePickerDay2 from '../remove-picker-day-2';
import renamePickersDay from '../rename-pickers-day';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  [renameFieldRef, removePickerDay2, renamePickersDay].forEach((transform) => {
    file.source = transform(file, api, options);
  });

  return file.source;
}
