import renameFieldRef from '../rename-field-ref';
import removePickerDay2 from '../remove-picker-day-2';
import renamePickerDay2 from '../rename-picker-day-2';
import renamePickersDay from '../rename-pickers-day';
import renamePickerClasses from '../rename-picker-classes';
import removeDisableMargin from '../remove-disable-margin';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  [
    renameFieldRef,
    removePickerDay2,
    renamePickerDay2,
    renamePickersDay,
    renamePickerClasses,
    removeDisableMargin,
  ].forEach((transform) => {
    file.source = transform(file, api, options);
  });

  return file.source;
}
