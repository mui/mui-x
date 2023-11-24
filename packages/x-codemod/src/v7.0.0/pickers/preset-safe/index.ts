import transformRenameComponentsToSlots from '../rename-components-to-slots';
import transformRenameDefaultCalendarMonthToReferenceDate from '../rename-default-calendar-month-to-reference-date';
import transformRenameDayPickerClasses from '../rename-day-picker-classes';

import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformRenameComponentsToSlots(file, api, options);
  file.source = transformRenameDefaultCalendarMonthToReferenceDate(file, api, options);
  file.source = transformRenameDayPickerClasses(file, api, options);

  return file.source;
}
