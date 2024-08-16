import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import { transformNestedProp } from '../../../util/addComponentsSlots';
import removeProps from '../../../util/removeProps';

const propsToSlots = {
  TransitionComponent: { prop: 'slots', path: 'groupTransition' },
  TransitionProps: { prop: 'slotProps', path: 'groupTransition' },
};

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  root
    .find(j.JSXElement)
    .filter((path) => (path.value.openingElement.name as any).name === 'TreeItem')
    .forEach((path) => {
      const attributesToTransform = j(path)
        .find(j.JSXAttribute)
        .filter((attribute) =>
          Object.keys(propsToSlots).includes(attribute.value.name.name as string),
        );
      attributesToTransform.forEach((attribute) => {
        const attributeName = attribute.value.name.name as string;

        // Get the value in case it's:
        // - prop={value}
        // - prop="value"
        // - prop (which means true)
        let value =
          attribute.value.value?.type === 'JSXExpressionContainer'
            ? attribute.value.value.expression
            : attribute.value.value || j.booleanLiteral(true);
        if (attributeName === 'showToolbar') {
          if (
            value.type === 'BooleanLiteral' ||
            (value.type === 'Literal' && typeof value.value === 'boolean')
          ) {
            value.value = !value.value;
          } else {
            value = j.unaryExpression('!', value as any);
          }
        }
        transformNestedProp(
          path,
          propsToSlots[attributeName].prop,
          propsToSlots[attributeName].path,
          value,
          j,
        );
      });
    });

  removeProps({ root, componentNames: ['TreeItem'], props: Object.keys(propsToSlots), j });

  return root.toSource(printOptions);
}
