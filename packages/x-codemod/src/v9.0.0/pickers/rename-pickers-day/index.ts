import path from 'path';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import readFile from '../../../util/readFile';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  const renames = {
    PickersDay: 'PickerDay',
    PickersDayProps: 'PickerDayProps',
    pickersDayClasses: 'pickerDayClasses',
    PickersDayClassKey: 'PickerDayClassKey',
    PickersDaySlots: 'PickerDaySlots',
    PickersDaySlotProps: 'PickerDaySlotProps',
    PickersDayOwnerState: 'PickerDayOwnerState',
  };

  const renameKeys = Object.keys(renames);

  // Rename imports and usages
  renameKeys.forEach((oldName) => {
    const newName = renames[oldName as keyof typeof renames];
    root.find(j.Identifier, { name: oldName }).forEach((path) => {
      // Avoid renaming property keys in objects unless they are shorthand or identifiers in other contexts
      if (
        path.parent.value.type === 'Property' &&
        path.parent.value.key === path.node &&
        !path.parent.value.shorthand
      ) {
        return;
      }
      // Avoid renaming member expressions like something.PickersDay
      if (
        path.parent.value.type === 'MemberExpression' &&
        path.parent.value.property === path.node &&
        !path.parent.value.computed
      ) {
        return;
      }

      j(path).replaceWith(j.identifier(newName));
    });
  });

  // Rename theme components in createTheme / theme augmentation
  root.find(j.Identifier, { name: 'MuiPickersDay' }).forEach((path) => {
    j(path).replaceWith(j.identifier('MuiPickerDay'));
  });

  // Also handle string literals for MuiPickersDay if any (e.g. in theme overrides or sx)
  root.find(j.StringLiteral).forEach((path) => {
    if (path.value.value.includes('MuiPickersDay')) {
      j(path).replaceWith(j.stringLiteral(path.value.value.replace(/MuiPickersDay/g, 'MuiPickerDay')));
    }
  });

  // Update import sources if they point to PickersDay (though usually they point to @mui/x-date-pickers)
  root.find(j.ImportDeclaration).forEach((path) => {
    if (typeof path.value.source.value === 'string') {
      if (path.value.source.value.includes('/PickersDay')) {
        path.value.source.value = path.value.source.value.replace('/PickersDay', '/PickerDay');
      }
    }
  });

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'rename-pickers-day',
  specFiles: [
    {
      name: 'rename PickersDay to PickerDay and related types',
      actual: readFile(path.join(import.meta.dirname, 'actual.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected.spec.tsx')),
    },
  ],
});
