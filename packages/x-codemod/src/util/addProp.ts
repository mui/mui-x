import type { Collection, JSCodeshift } from 'jscodeshift';

interface AddPropsArgs {
  j: JSCodeshift;
  root: Collection<any>;
  /**
   * Names of the components to add the prop to.
   */
  componentNames: string[];
  /**
   * Name of the prop to add.
   */
  propName: string;
  /**
   * Value of the prop to add.
   */
  propValue: any;
  /**
   * Whether to add the prop at the start or the end of the props list.
   */
  position: 'start' | 'end';
}

/**
 * Adds a prop to specified JSX components in the AST.
 *
 * Can be configured to only add the prop if it is absent.
 */
export default function addProp({
  j,
  root,
  componentNames,
  propName,
  propValue,
  position,
}: AddPropsArgs) {
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
        const fn = position === 'start' ? ('unshift' as const) : ('push' as const);

        path.value.openingElement.attributes?.[fn](
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
