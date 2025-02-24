import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import { renameImports } from '../../../util/renameImports';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  let root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  root = renameImports({
    j,
    root,
    packageNames: ['@mui/x-date-pickers', '@mui/x-date-pickers-pro'],
    imports: [
      {
        oldEndpoint: 'hooks',
        importsMapping: {
          usePickersTranslations: 'usePickerTranslations',
          usePickersContext: 'usePickerContext',
        },
      },
      {
        oldEndpoint: 'models',
        importsMapping: {
          FieldValueType: 'PickerValueType',
        },
      },
      {
        oldEndpoint: 'PickersShortcuts',
        newEndpoint: 'models',
        importsMapping: {
          PickerShortcutChangeImportance: 'PickerChangeImportance',
        },
      },
    ],
  });

  root = renameImports({
    j,
    root,
    packageNames: ['@mui/x-date-pickers-pro'],
    imports: [
      {
        oldEndpoint: 'models',
        importsMapping: {
          RangeFieldSection: 'FieldRangeSection',
        },
      },
    ],
  });
  return root.toSource(printOptions);
}
