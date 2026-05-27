import path from 'path';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import removeProps from '../../../util/removeProps';
import readFile from '../../../util/readFile';

const componentNames = [
  'DateField',
  'DateTimeField',
  'TimeField',
  'DateRangeField',
  'DateTimeRangeField',
  'TimeRangeField',
  'MultiInputDateRangeField',
  'MultiInputDateTimeRangeField',
  'MultiInputTimeRangeField',
  'SingleInputDateRangeField',
  'SingleInputDateTimeRangeField',
  'SingleInputTimeRangeField',
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
];

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  removeProps({ root, j, componentNames, props: ['enableAccessibleFieldDOMStructure'] });

  // Also remove enableAccessibleFieldDOMStructure from slotProps.field
  componentNames.forEach((componentName) => {
    root
      .find(j.JSXElement, { openingElement: { name: { name: componentName } } })
      .forEach((elementPath) => {
        j(elementPath)
          .find(j.JSXAttribute, { name: { name: 'slotProps' } })
          .forEach((slotPropsAttr) => {
            const value = slotPropsAttr.node.value;
            if (
              value?.type !== 'JSXExpressionContainer' ||
              value.expression.type !== 'ObjectExpression'
            ) {
              return;
            }

            const fieldProp = (value.expression.properties as any[]).find(
              (p: any) => p.key?.name === 'field' || p.key?.value === 'field',
            );
            if (!fieldProp || fieldProp.value.type !== 'ObjectExpression') {
              return;
            }

            fieldProp.value.properties = fieldProp.value.properties.filter(
              (p: any) =>
                p.key?.name !== 'enableAccessibleFieldDOMStructure' &&
                p.key?.value !== 'enableAccessibleFieldDOMStructure',
            );

            // If field object is now empty, remove it from slotProps
            if (fieldProp.value.properties.length === 0) {
              value.expression.properties = (value.expression.properties as any[]).filter(
                (p: any) => p !== fieldProp,
              );
              // If slotProps object is now empty, remove the whole attribute
              if (value.expression.properties.length === 0) {
                j(slotPropsAttr).remove();
              }
            }
          });
      });
  });

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'remove-enable-accessible-field-dom-structure',
  specFiles: [
    {
      name: 'remove enableAccessibleFieldDOMStructure prop',
      actual: readFile(path.join(import.meta.dirname, 'actual.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected.spec.tsx')),
    },
  ],
});
