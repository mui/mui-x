import renameFieldRef from '../rename-field-ref';
import removePickerDay2 from '../remove-picker-day-2';
import renamePickerDay2 from '../rename-picker-day-2';
import renamePickersDay from '../rename-pickers-day';
import renamePickerClasses from '../rename-picker-classes';
import removeDisableMargin from '../remove-disable-margin';
import removeEnableAccessibleFieldDOMStructure from '../remove-enable-accessible-field-dom-structure';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

// Order matters: removePickerDay2 must run before renamePickerDay2
// because it looks for `PickerDay2` identifiers in slot objects.
// If renamePickerDay2 ran first, those identifiers would already be
// renamed to `PickerDay` and removePickerDay2 would not find them.
const allModules = [
  renameFieldRef,
  removePickerDay2,
  renamePickerDay2,
  renamePickersDay,
  renamePickerClasses,
  removeDisableMargin,
  removeEnableAccessibleFieldDOMStructure,
];

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  allModules.forEach((transform) => {
    file.source = transform(file, api, options);
  });

  return file.source;
}

export const testConfig = {
  allModules,
};
