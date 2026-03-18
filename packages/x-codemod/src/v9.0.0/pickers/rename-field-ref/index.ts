import path from 'path';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import renameProps from '../../../util/renameProps';
import readFile from '../../../util/readFile';

const fieldNames = [
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
];

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
];

const props = {
  unstableFieldRef: 'fieldRef',
  unstableStartFieldRef: 'startFieldRef',
  unstableEndFieldRef: 'endFieldRef',
};

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  renameProps({ root, j, props, componentNames: fieldNames });

  pickerNames.forEach((componentName) => {
    root
      .find(j.JSXElement, { openingElement: { name: { name: componentName } } })
      .forEach((elementPath) => {
        j(elementPath)
          .find(j.JSXAttribute, { name: { name: 'slotProps' } })
          .forEach((slotPropsAttr) => {
            const value = slotPropsAttr.node.value;
            if (
              value?.type === 'JSXExpressionContainer' &&
              value.expression.type === 'ObjectExpression'
            ) {
              const fieldProp = (value.expression.properties as any[]).find(
                (p: any) => p.key.name === 'field' || p.key.value === 'field',
              );
              if (fieldProp && fieldProp.value.type === 'ObjectExpression') {
                const unstableFieldRefProp = fieldProp.value.properties.find(
                  (p: any) =>
                    p.key.name === 'unstableFieldRef' || p.key.value === 'unstableFieldRef',
                );
                if (unstableFieldRefProp) {
                  unstableFieldRefProp.key.name = 'fieldRef';
                }
              }
            }
          });

        j(elementPath)
          .find(j.JSXAttribute)
          .filter((path) =>
            ['fieldRef', 'unstableFieldRef'].includes(path.value.name.name as string),
          )
          .forEach((attr) => {
            const value = attr.node.value;
            const slotPropsAttr = j(elementPath)
              .find(j.JSXAttribute, { name: { name: 'slotProps' } })
              .at(0);

            const fieldRefProperty = j.objectProperty(
              j.identifier('fieldRef'),
              value?.type === 'JSXExpressionContainer' ? (value.expression as any) : (value as any),
            );

            if (slotPropsAttr.size() > 0) {
              const slotPropsValue = slotPropsAttr.get().node.value;
              if (slotPropsValue.type === 'JSXExpressionContainer') {
                const expression = slotPropsValue.expression;
                if (expression.type === 'ObjectExpression') {
                  const fieldProp = expression.properties.find(
                    (p: any) => p.key.name === 'field' || p.key.value === 'field',
                  );

                  if (fieldProp && fieldProp.value.type === 'ObjectExpression') {
                    fieldProp.value.properties.push(fieldRefProperty);
                  } else {
                    expression.properties.push(
                      j.objectProperty(
                        j.identifier('field'),
                        j.objectExpression([fieldRefProperty]),
                      ),
                    );
                  }
                }
              }
            } else {
              elementPath.value.openingElement.attributes?.push(
                j.jsxAttribute(
                  j.jsxIdentifier('slotProps'),
                  j.jsxExpressionContainer(
                    j.objectExpression([
                      j.objectProperty(
                        j.identifier('field'),
                        j.objectExpression([fieldRefProperty]),
                      ),
                    ]),
                  ),
                ),
              );
            }

            j(attr).remove();
          });
      });
  });

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'rename-field-ref',
  specFiles: [
    {
      name: 'rename unstable field refs to stable ones',
      actual: readFile(path.join(import.meta.dirname, 'actual.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected.spec.tsx')),
    },
  ],
});
