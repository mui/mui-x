import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import renameNestedProps from '../../../util/renameNestedProps';

const propsToRename = {
  localeText: {
    datePickerDefaultToolbarTitle: 'datePickerToolbarTitle',
    timePickerDefaultToolbarTitle: 'timePickerToolbarTitle',
    dateTimePickerDefaultToolbarTitle: 'dateTimePickerToolbarTitle',
    dateRangePickerDefaultToolbarTitle: 'dateRangePickerToolbarTitle',
  },
};

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  renameNestedProps({
    root,
    componentNames: ['LocalizationProvider'],
    nestedProps: propsToRename,
    j,
  });

  return root.toSource(printOptions);
}
