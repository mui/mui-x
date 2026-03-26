import path from 'path';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import readFile from '../../../util/readFile';
import { renameClasses } from '../../../util/renameClasses';

const classRenames = {
  outsideCurrentMonth: 'dayOutsideMonth',
  hiddenDayFiller: 'fillerCell',
  hiddenDaySpacingFiller: 'fillerCell',
  rangeIntervalDayHighlightStart: 'selectionStart',
  rangeIntervalDayHighlightEnd: 'selectionEnd',
  rangeIntervalDayPreviewStart: 'previewStart',
  rangeIntervalDayPreviewEnd: 'previewEnd',
  dayInsideRangeInterval: 'insideSelection',
  rangeIntervalPreview: 'insidePreviewing',
  rangeIntervalDayHighlight: 'selectionStart',
  rangeIntervalDayPreview: 'previewStart',
};

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  renameClasses({
    j,
    root,
    packageNames: ['@mui/x-date-pickers', '@mui/x-date-pickers-pro'],
    classes: {
      dateRangePickerDayClasses: {
        newClassName: 'dateRangePickerDayClasses',
        properties: classRenames,
      },
      pickerDayClasses: {
        newClassName: 'pickerDayClasses',
        properties: classRenames,
      },
      pickersDayClasses: {
        newClassName: 'pickerDayClasses',
        properties: classRenames,
      },
    },
  });

  // Rename properties in styleOverrides
  const componentsToHandle = ['MuiDateRangePickerDay', 'MuiPickerDay', 'MuiPickersDay'];
  root.find(j.ObjectProperty).forEach((objPropPath) => {
    const keyName =
      objPropPath.node.key.type === 'Identifier'
        ? objPropPath.node.key.name
        : (objPropPath.node.key as any).value;
    if (
      componentsToHandle.includes(keyName) &&
      objPropPath.node.value.type === 'ObjectExpression'
    ) {
      j(objPropPath.node.value)
        .find(j.ObjectProperty)
        .filter((p) => {
          const k = p.node.key.type === 'Identifier' ? p.node.key.name : (p.node.key as any).value;
          return k === 'styleOverrides';
        })
        .forEach((styleOverridesPath) => {
          if (styleOverridesPath.node.value.type === 'ObjectExpression') {
            styleOverridesPath.node.value.properties.forEach((prop) => {
              if (prop.type === 'ObjectProperty') {
                const propKey =
                  prop.key.type === 'Identifier' ? prop.key.name : (prop.key as any).value;
                if (classRenames[propKey]) {
                  if (prop.key.type === 'Identifier') {
                    prop.key.name = classRenames[propKey];
                  } else if (prop.key.type === 'StringLiteral') {
                    prop.key.value = classRenames[propKey];
                  }
                }
              }
            });
          }
        });
    }
  });

  // Rename class names in strings and template literals
  const replaceClasses = (value: string) => {
    let newValue = value;
    Object.keys(classRenames).forEach((oldClass) => {
      const newClass = classRenames[oldClass];
      const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
      newValue = newValue.replace(regex, newClass);
    });
    return newValue;
  };

  root.find(j.StringLiteral).forEach((strPath) => {
    strPath.node.value = replaceClasses(strPath.node.value);
  });

  root.find(j.TemplateLiteral).forEach((templatePath) => {
    templatePath.node.quasis.forEach((quasi) => {
      quasi.value.raw = replaceClasses(quasi.value.raw);
      if (quasi.value.cooked) {
        quasi.value.cooked = replaceClasses(quasi.value.cooked);
      }
    });
  });

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'rename-picker-classes',
  specFiles: [
    {
      name: 'rename PickerDay and DateRangePickerDay class keys',
      actual: readFile(path.join(import.meta.dirname, 'actual.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected.spec.tsx')),
    },
  ],
});
