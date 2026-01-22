import type { Collection, JSCodeshift } from 'jscodeshift';

interface RenamePropsArgs {
  root: Collection<any>;
  /**
   * Names of the components to target
   * @example ["DataGrid", "DataGridPro"]
   */
  componentNames: string[];
  /**
   * Translation mapping from component names to slot names
   * @example { Root: "root", Input: "input" }
   */
  translation: Record<string, string>;
  j: JSCodeshift;
}

const lowerCase = (key: string) => `${key.slice(0, 1).toLowerCase()}${key.slice(1)}`;

const getSlotsTranslation = (translations: Record<string, string>) => {
  const lowercasedTranslation = {};
  Object.entries(translations).forEach(([key, value]) => {
    lowercasedTranslation[lowerCase(key)] = lowerCase(value);
  });

  return lowercasedTranslation;
};

/**
 * Replace the components / componentsProps by their equivalent slots / slotProps.
 * Only used for v6 -> v7 migration.
 */
export default function renameComponentsSlots({
  root,
  componentNames,
  translation,
  j,
}: RenamePropsArgs) {
  return root
    .find(j.JSXElement)
    .filter((path) => {
      return componentNames.includes((path.value.openingElement.name as any).name);
    })
    .find(j.JSXAttribute)
    .filter((attribute) =>
      ['components', 'componentsProps', 'slots', 'slotProps'].includes(
        attribute.node.name.name as string,
      ),
    )
    .forEach((attribute) => {
      const usedTranslation =
        (attribute.node.name.name as string) === 'components'
          ? translation
          : getSlotsTranslation(translation);

      j(attribute)
        .find(j.Property)
        .forEach((property) => {
          if (
            property.value.key.type === 'Identifier' &&
            usedTranslation[property.value.key.name as string] !== undefined
          ) {
            property.value.key.name = usedTranslation[property.value.key.name];
          }
        });
    });
}
