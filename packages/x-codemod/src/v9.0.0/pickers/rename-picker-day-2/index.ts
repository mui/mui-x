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
    PickerDay2: 'PickerDay',
    PickerDay2Props: 'PickerDayProps',
    pickerDay2Classes: 'pickerDayClasses',
    PickerDay2ClassKey: 'PickerDayClassKey',
    PickerDay2Slots: 'PickerDaySlots',
    PickerDay2SlotProps: 'PickerDaySlotProps',
    PickerDay2OwnerState: 'PickerDayOwnerState',
    DateRangePickerDay2: 'DateRangePickerDay',
    DateRangePickerDay2Props: 'DateRangePickerDayProps',
    dateRangePickerDay2Classes: 'dateRangePickerDayClasses',
    DateRangePickerDay2ClassKey: 'DateRangePickerDayClassKey',
    DateRangePickerDay2Slots: 'DateRangePickerDaySlots',
    DateRangePickerDay2SlotProps: 'DateRangePickerDaySlotProps',
    DateRangePickerDay2OwnerState: 'DateRangePickerDayOwnerState',
  };

  const renameKeys = Object.keys(renames);

  // Rename imports and usages
  renameKeys.forEach((oldName) => {
    const newName = renames[oldName as keyof typeof renames];
    root.find(j.Identifier, { name: oldName }).forEach((keyPath) => {
      // Avoid renaming property keys in objects unless they are shorthand or identifiers in other contexts
      if (
        keyPath.parent.value.type === 'Property' &&
        keyPath.parent.value.key === keyPath.node &&
        !keyPath.parent.value.shorthand
      ) {
        return;
      }
      // Avoid renaming member expressions like something.PickerDay2
      if (
        keyPath.parent.value.type === 'MemberExpression' &&
        keyPath.parent.value.property === keyPath.node &&
        !keyPath.parent.value.computed
      ) {
        return;
      }

      j(keyPath).replaceWith(j.identifier(newName));
    });
  });

  // Rename theme components in createTheme / theme augmentation
  root.find(j.Identifier, { name: 'MuiPickerDay2' }).forEach((keyPath) => {
    j(keyPath).replaceWith(j.identifier('MuiPickerDay'));
  });
  root.find(j.Identifier, { name: 'MuiDateRangePickerDay2' }).forEach((keyPath) => {
    j(keyPath).replaceWith(j.identifier('MuiDateRangePickerDay'));
  });

  // Also handle string literals and template literals
  const replaceClass = (value: string) =>
    value
      .replace(/MuiPickerDay2\b/g, 'MuiPickerDay')
      .replace(/MuiDateRangePickerDay2\b/g, 'MuiDateRangePickerDay');

  root.find(j.StringLiteral).forEach((keyPath) => {
    if (
      keyPath.value.value.includes('MuiPickerDay2') ||
      keyPath.value.value.includes('MuiDateRangePickerDay2')
    ) {
      j(keyPath).replaceWith(j.stringLiteral(replaceClass(keyPath.value.value)));
    }
  });

  root.find(j.TemplateLiteral).forEach((keyPath) => {
    keyPath.value.quasis.forEach((quasi) => {
      if (
        quasi.value.raw.includes('MuiPickerDay2') ||
        quasi.value.raw.includes('MuiDateRangePickerDay2')
      ) {
        quasi.value.raw = replaceClass(quasi.value.raw);
      }
      if (
        quasi.value.cooked &&
        (quasi.value.cooked.includes('MuiPickerDay2') ||
          quasi.value.cooked.includes('MuiDateRangePickerDay2'))
      ) {
        quasi.value.cooked = replaceClass(quasi.value.cooked);
      }
    });
  });

  // Update import sources
  root.find(j.ImportDeclaration).forEach((importPath) => {
    if (typeof importPath.value.source.value === 'string') {
      if (importPath.value.source.value.includes('/PickerDay2')) {
        importPath.value.source.value = importPath.value.source.value.replace(
          '/PickerDay2',
          '/PickerDay',
        );
      }
      if (importPath.value.source.value.includes('/DateRangePickerDay2')) {
        importPath.value.source.value = importPath.value.source.value.replace(
          '/DateRangePickerDay2',
          '/DateRangePickerDay',
        );
      }
    }
  });

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'rename-picker-day-2',
  specFiles: [
    {
      name: 'rename PickerDay2 and DateRangePickerDay2 to PickerDay and DateRangePickerDay',
      actual: readFile(path.join(import.meta.dirname, 'actual.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected.spec.tsx')),
    },
  ],
});
