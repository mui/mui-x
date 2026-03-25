import path from 'path';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import readFile from '../../../util/readFile';

const pickerNames = [
  'DatePicker',
  'DesktopDatePicker',
  'MobileDatePicker',
  'StaticDatePicker',
  'DateTimePicker',
  'DesktopDateTimePicker',
  'MobileDateTimePicker',
  'StaticDateTimePicker',
  'TimePicker',
  'DesktopTimePicker',
  'MobileTimePicker',
  'StaticTimePicker',
  'DateRangePicker',
  'DesktopDateRangePicker',
  'MobileDateRangePicker',
  'StaticDateRangePicker',
  'DateTimeRangePicker',
  'DesktopDateTimeRangePicker',
  'MobileDateTimeRangePicker',
  'TimeRangePicker',
  'DesktopTimeRangePicker',
  'MobileTimeRangePicker',
  'DateCalendar',
  'DayCalendar',
];

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  const dayComponents = ['PickerDay2', 'DateRangePickerDay2'];

  root.find(j.ObjectExpression).forEach((objectExpressionPath) => {
    const properties = objectExpressionPath.node.properties;
    const dayPropIndex = properties.findIndex((prop: any) => {
      const keyName = prop.key?.name || prop.key?.value;
      if (keyName !== 'day') {
        return false;
      }
      const val = prop.value;
      return val.type === 'Identifier' && dayComponents.includes(val.name);
    });

    if (dayPropIndex !== -1) {
      properties.splice(dayPropIndex, 1);
      if (properties.length === 0) {
        const attrCollection = j(objectExpressionPath).closest(j.JSXAttribute, {
          name: { name: 'slots' },
        });
        if (attrCollection.length > 0) {
          const openingElement = j(objectExpressionPath).closest(j.JSXOpeningElement);
          if (openingElement.length > 0) {
            const nameNode = openingElement.get().value.name;
            const componentName = nameNode.type === 'JSXIdentifier' ? nameNode.name : null;
            if (componentName && pickerNames.includes(componentName)) {
              attrCollection.remove();
            }
          }
        }
      }
    }
  });

  // Remove imports if no longer used
  dayComponents.forEach((componentName) => {
    const usages = root.find(j.Identifier, { name: componentName }).filter((componentPath) => {
      const { parent } = componentPath;
      if (parent.value.type === 'ImportSpecifier') {
        return false;
      }
      return true;
    });

    if (usages.length === 0) {
      root
        .find(j.ImportSpecifier, { imported: { name: componentName } })
        .filter((componentPath) => {
          const importDeclaration = componentPath.parentPath.parentPath.value;
          return (
            importDeclaration.source.value.startsWith('@mui/x-date-pickers') ||
            importDeclaration.source.value.startsWith('@mui/x-date-pickers-pro')
          );
        })
        .forEach((componentPath) => {
          const importDeclaration = componentPath.parentPath.parentPath;
          j(componentPath).remove();
          if (importDeclaration.value.specifiers.length === 0) {
            j(importDeclaration).remove();
          }
        });
    }
  });

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'remove-picker-day-2',
  specFiles: [
    {
      name: 'remove PickerDay2 and DateRangePickerDay2 from slots',
      actual: readFile(path.join(import.meta.dirname, 'actual.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected.spec.tsx')),
    },
  ],
});
