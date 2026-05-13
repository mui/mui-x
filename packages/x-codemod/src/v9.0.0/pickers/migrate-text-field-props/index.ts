import path from 'path';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import readFile from '../../../util/readFile';
// @ts-ignore - JS file without types
import { transformNestedProp, addItemToObject } from '../../../util/addComponentsSlots';
import removeProps from '../../../util/removeProps';

/**
 * Maps a legacy text-field prop name to the corresponding key inside `slotProps`.
 */
const PROP_TO_SLOT: Record<string, string> = {
  InputProps: 'input',
  inputProps: 'htmlInput',
  InputLabelProps: 'inputLabel',
  FormHelperTextProps: 'formHelperText',
};

const LEGACY_PROP_NAMES = Object.keys(PROP_TO_SLOT);

const FIELD_AND_PICKER_NAMES = [
  // Fields
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
  // Pickers
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

const ALL_TARGET_NAMES = [...FIELD_AND_PICKER_NAMES, 'PickersTextField'];

const getKeyName = (key: any): string | undefined => {
  if (!key) {
    return undefined;
  }
  if (key.type === 'Identifier') {
    return key.name;
  }
  if (key.type === 'Literal' || key.type === 'StringLiteral') {
    return String(key.value);
  }
  return undefined;
};

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  // 1. Rewrite legacy props passed directly as JSX attributes on field / picker components.
  root
    .find(j.JSXElement)
    .filter((elementPath) => {
      const nameNode: any = elementPath.value.openingElement.name;
      return (
        nameNode && nameNode.type === 'JSXIdentifier' && ALL_TARGET_NAMES.includes(nameNode.name)
      );
    })
    .forEach((elementPath) => {
      const nameNode: any = elementPath.value.openingElement.name;
      // For PickersTextField the new keys live directly on `slotProps`.
      // For every other component they live on a nested `textField.slotProps` object.
      const pathPrefix = nameNode.name === 'PickersTextField' ? '' : 'textField.slotProps.';

      const attributesToTransform = j(elementPath)
        .find(j.JSXAttribute)
        .filter((attribute) => {
          const attributeParent = attribute.parentPath.parentPath;
          if (
            attributeParent.value.type !== 'JSXOpeningElement' ||
            attributeParent.value.name.name !== nameNode.name
          ) {
            return false;
          }
          return LEGACY_PROP_NAMES.includes(attribute.value.name.name as string);
        });

      attributesToTransform.forEach((attribute) => {
        const attributeName = attribute.value.name.name as string;
        const value =
          attribute.value.value?.type === 'JSXExpressionContainer'
            ? attribute.value.value.expression
            : attribute.value.value || j.booleanLiteral(true);
        transformNestedProp(
          elementPath,
          'slotProps',
          `${pathPrefix}${PROP_TO_SLOT[attributeName]}`,
          value,
          j,
        );
      });
    });

  // Drop the now-orphaned legacy attributes from the targeted components.
  removeProps({ root, componentNames: ALL_TARGET_NAMES, props: LEGACY_PROP_NAMES, j });

  // 2. Rewrite legacy props found inside `slotProps={{ field: { ... } }}` and
  //    `slotProps={{ textField: { ... } }}` regardless of which component they appear on.
  root.find(j.JSXAttribute, { name: { name: 'slotProps' } }).forEach((attrPath) => {
    const openingElement: any = attrPath.parentPath?.parentPath?.value;
    if (
      !openingElement ||
      openingElement.type !== 'JSXOpeningElement' ||
      openingElement.name?.type !== 'JSXIdentifier' ||
      !FIELD_AND_PICKER_NAMES.includes(openingElement.name.name)
    ) {
      return;
    }
    const attrValue = attrPath.value.value;
    if (!attrValue || attrValue.type !== 'JSXExpressionContainer') {
      return;
    }
    const expression = attrValue.expression;
    if (expression.type !== 'ObjectExpression') {
      return;
    }
    // Collect legacy props found inside `field` / `textField` slot objects.
    // - `textField` legacy props are migrated in-place under `textField.slotProps.<newKey>`.
    // - `field` legacy props cannot be nested under `field.slotProps.textField.slotProps.<newKey>`
    //   because the `field` slotProps type does not allow it. Hoist them to the sibling
    //   `textField.slotProps.<newKey>` instead.
    const fieldCollected: { newKey: string; value: any }[] = [];
    expression.properties.forEach((prop: any) => {
      if (prop.type === 'SpreadElement' || prop.type === 'ExperimentalSpreadProperty') {
        console.warn(
          `[migrate-text-field-props] ${file.path}: encountered a spread inside slotProps; ` +
            `cannot inspect for legacy text field props. Migrate manually if needed.`,
        );
        return;
      }
      if (prop.type !== 'Property' && prop.type !== 'ObjectProperty') {
        return;
      }
      const keyName = getKeyName(prop.key);
      if (keyName !== 'field' && keyName !== 'textField') {
        return;
      }
      if (prop.value.type !== 'ObjectExpression') {
        console.warn(
          `[migrate-text-field-props] ${file.path}: \`slotProps.${keyName}\` is set to a ` +
            `non-literal value (e.g. a variable or a function); cannot migrate legacy ` +
            `text field props automatically. Migrate manually if needed.`,
        );
        return;
      }
      let target = prop.value;
      const remaining: any[] = [];
      const collected: { newKey: string; value: any }[] = [];
      target.properties.forEach((innerProp: any) => {
        if (innerProp.type !== 'Property' && innerProp.type !== 'ObjectProperty') {
          remaining.push(innerProp);
          return;
        }
        const innerKey = getKeyName(innerProp.key);
        if (innerKey && LEGACY_PROP_NAMES.includes(innerKey)) {
          collected.push({ newKey: PROP_TO_SLOT[innerKey], value: innerProp.value });
          return;
        }
        remaining.push(innerProp);
      });
      if (collected.length === 0) {
        return;
      }
      if (keyName === 'field') {
        // Defer: hoist these to the sibling `textField` slot below.
        target.properties = remaining;
        fieldCollected.push(...collected);
        return;
      }
      target.properties = remaining;
      // Use the same recursive merge helper used by `transformNestedProp`.
      collected.forEach(({ newKey, value }) => {
        target = addItemToObject(`slotProps.${newKey}`, value, target, j);
      });
      prop.value = target;
    });

    if (fieldCollected.length > 0) {
      // Drop `field` if it became empty.
      expression.properties = expression.properties.filter((prop: any) => {
        if (prop.type !== 'Property' && prop.type !== 'ObjectProperty') {
          return true;
        }
        if (getKeyName(prop.key) !== 'field') {
          return true;
        }
        return prop.value.type !== 'ObjectExpression' || prop.value.properties.length > 0;
      });
      // Hoist the collected legacy props to `textField.slotProps.<newKey>`.
      let merged: any = expression;
      fieldCollected.forEach(({ newKey, value }) => {
        merged = addItemToObject(`textField.slotProps.${newKey}`, value, merged, j);
      });
      expression.properties = merged.properties;
    }
  });

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'migrate-text-field-props',
  specFiles: [
    {
      name: 'migrate legacy text field props to slotProps',
      actual: readFile(path.join(import.meta.dirname, 'actual.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected.spec.tsx')),
    },
  ],
});
