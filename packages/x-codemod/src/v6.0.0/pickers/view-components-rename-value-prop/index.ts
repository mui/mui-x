import renameProps from '../../../util/renameProps';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions;

  const result = renameProps({
    root,
    componentNames: ['MonthPicker', 'YearPicker', 'CalendarPicker', 'ClockPicker'],
    props: { date: 'value' },
    j,
  });
  return result.toSource(printOptions);
}
