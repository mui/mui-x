import type { Collection, JSCodeshift } from 'jscodeshift';

interface RemovePropsArgs {
  j: JSCodeshift;
  root: Collection<any>;
  componentNames: string[];
  propName: string;
  propValue: any;
}

/**
 * Adds a prop to specified JSX components in the AST.
 *
 * Can be configured to only add the prop if it is absent.
 */
export default function addProp({ j, root, componentNames, propName, propValue }: RemovePropsArgs) {
  return root
    .find(j.JSXElement)
    .filter((path) => {
      return componentNames.includes((path.value.openingElement.name as any).name);
    })
    .forEach((path) => {
      const hasProp = path.value.openingElement.attributes?.some((attr) => {
        return attr.type === 'JSXAttribute' && (attr.name as any).name === propName;
      });

      if (!hasProp) {
        path.value.openingElement.attributes?.push(
          j.jsxAttribute(
            j.jsxIdentifier(propName),
            typeof propValue === 'boolean' && propValue
              ? null
              : j.jsxExpressionContainer(j.literal(propValue)),
          ),
        );
      }
    });
}
