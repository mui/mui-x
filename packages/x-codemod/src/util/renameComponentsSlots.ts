import type { Collection, JSCodeshift } from 'jscodeshift';

interface RenamePropsArgs {
  root: Collection<any>;
  componentNames: string[];
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
