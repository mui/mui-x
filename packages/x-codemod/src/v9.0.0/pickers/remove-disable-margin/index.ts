import path from 'path';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import readFile from '../../../util/readFile';

// Components on which disableMargin was a direct prop
const dayComponentNames = ['PickerDay', 'PickersDay', 'DateRangePickerDay'];

/**
 * Returns true if a disableMargin JSX attribute is considered enabled (i.e. `disableMargin` or
 * `disableMargin={true}`). Returns false for `disableMargin={false}`.
 */
function isDisableMarginEnabled(attr: any): boolean {
  if (!attr.value) {
    // bare `disableMargin` with no value — equivalent to true
    return true;
  }
  if (
    attr.value.type === 'JSXExpressionContainer' &&
    attr.value.expression.type === 'BooleanLiteral'
  ) {
    return attr.value.expression.value;
  }
  // Any other expression (variable, etc.) — conservatively treat as enabled
  return true;
}

/**
 * Merges `mx: 0` into an existing ObjectExpression used as an `sx` value.
 * Only merges when the expression is a plain object literal.
 * Returns true if the merge succeeded.
 */
function mergeMxIntoSxObject(j: any, sxExpr: any): boolean {
  if (sxExpr.type !== 'ObjectExpression') {
    return false;
  }
  // Avoid adding mx: 0 if it's already there
  const alreadyHasMx = sxExpr.properties.some(
    (p: any) =>
      p.type === 'ObjectProperty' && (p.key?.name === 'mx' || p.key?.value === 'mx'),
  );
  if (!alreadyHasMx) {
    sxExpr.properties.push(
      j.objectProperty(j.identifier('mx'), j.numericLiteral(0)),
    );
  }
  return true;
}

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  // ─── Case 1: disableMargin directly on a day component JSX element ───────────
  root
    .find(j.JSXOpeningElement)
    .filter((p: any) => {
      const name = p.node.name;
      return name.type === 'JSXIdentifier' && dayComponentNames.includes(name.name);
    })
    .forEach((openingElPath: any) => {
      const attrs: any[] = openingElPath.node.attributes;
      const dmIndex = attrs.findIndex(
        (a: any) => a.type === 'JSXAttribute' && a.name?.name === 'disableMargin',
      );
      if (dmIndex === -1) {
        return;
      }

      const dmAttr = attrs[dmIndex];
      const enabled = isDisableMarginEnabled(dmAttr);
      attrs.splice(dmIndex, 1);

      if (enabled) {
        const sxIndex = attrs.findIndex(
          (a: any) => a.type === 'JSXAttribute' && a.name?.name === 'sx',
        );
        if (sxIndex === -1) {
          attrs.push(
            j.jsxAttribute(
              j.jsxIdentifier('sx'),
              j.jsxExpressionContainer(
                j.objectExpression([
                  j.objectProperty(j.identifier('mx'), j.numericLiteral(0)),
                ]),
              ),
            ),
          );
        } else {
          const sxAttr = attrs[sxIndex];
          if (sxAttr.value?.type === 'JSXExpressionContainer') {
            mergeMxIntoSxObject(j, sxAttr.value.expression);
          }
        }
      }
    });

  // ─── Case 2: disableMargin inside a slotProps.day object ─────────────────────
  root.find(j.JSXAttribute, { name: { name: 'slotProps' } }).forEach((slotPropsAttrPath: any) => {
    const container = slotPropsAttrPath.node.value;
    if (container?.type !== 'JSXExpressionContainer') {
      return;
    }
    const slotPropsObj = container.expression;
    if (slotPropsObj.type !== 'ObjectExpression') {
      return;
    }

    slotPropsObj.properties.forEach((prop: any) => {
      if (prop.type !== 'ObjectProperty') {
        return;
      }
      const keyName = prop.key?.name ?? prop.key?.value;
      if (keyName !== 'day') {
        return;
      }
      const dayObj = prop.value;
      if (dayObj.type !== 'ObjectExpression') {
        return;
      }

      const dmIndex = dayObj.properties.findIndex(
        (p: any) =>
          p.type === 'ObjectProperty' &&
          (p.key?.name === 'disableMargin' || p.key?.value === 'disableMargin'),
      );
      if (dmIndex === -1) {
        return;
      }

      const dmProp = dayObj.properties[dmIndex];
      const enabled =
        dmProp.value.type === 'BooleanLiteral' ? dmProp.value.value : true;
      dayObj.properties.splice(dmIndex, 1);

      if (enabled) {
        const sxIndex = dayObj.properties.findIndex(
          (p: any) =>
            p.type === 'ObjectProperty' && (p.key?.name === 'sx' || p.key?.value === 'sx'),
        );
        if (sxIndex === -1) {
          dayObj.properties.push(
            j.objectProperty(
              j.identifier('sx'),
              j.objectExpression([
                j.objectProperty(j.identifier('mx'), j.numericLiteral(0)),
              ]),
            ),
          );
        } else {
          mergeMxIntoSxObject(j, dayObj.properties[sxIndex].value);
        }
      }
    });
  });

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'remove-disable-margin',
  specFiles: [
    {
      name: 'remove disableMargin prop and replace with sx={{ mx: 0 }}',
      actual: readFile(path.join(import.meta.dirname, 'actual.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected.spec.tsx')),
    },
  ],
});
