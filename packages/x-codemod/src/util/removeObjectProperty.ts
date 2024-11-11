import type { Collection, JSCodeshift, JSXAttribute, Identifier } from 'jscodeshift';

const getAttributeName = (attribute: JSXAttribute): string =>
  attribute.name.type === 'JSXIdentifier' ? attribute.name.name : attribute.name.name.name;

interface RemoveObjectPropertyArgs {
  root: Collection<any>;
  componentsNames: string[];
  /**
   * Prop which contains the object whose property will be removed
   * @example "experimentalFeatures"
   */
  propName: string;
  /**
   * `key` of the property that needs to be removed
   * To remove `newEditingApi` from:
   * <DataGrid experimentalFeatures={{ newEditingApi: true }} />
   * pass "newEditingApi"
   */
  propKey: string;
  j: JSCodeshift;
}

export default function removeObjectProperty({
  root,
  propName,
  componentsNames,
  propKey,
  j,
}: RemoveObjectPropertyArgs) {
  root
    .find(j.JSXElement)
    .filter((path) => {
      switch (path.value.openingElement.name.type) {
        case 'JSXNamespacedName':
          return componentsNames.includes(path.value.openingElement.name.name.name);
        case 'JSXIdentifier':
          return componentsNames.includes(path.value.openingElement.name.name);
        default:
          return false;
      }
    })
    .forEach((element) => {
      const targetAttribute = element.value.openingElement.attributes
        ?.filter((attribute): attribute is JSXAttribute => attribute.type === 'JSXAttribute')
        ?.find((attribute) => getAttributeName(attribute) === propName);
      if (!targetAttribute) {
        return;
      }
      const definedKeys: any[] = [];
      const properties = j(targetAttribute).find(j.Property);
      const objectProperties = j(targetAttribute).find(j.ObjectProperty);

      const propertiesToProcess = properties.length > 0 ? properties : objectProperties;
      if (propertiesToProcess.length === 0) {
        return;
      }

      propertiesToProcess.forEach((path) => {
        const keyName = (path.value.key as Identifier).name;
        if (keyName) {
          definedKeys.push(keyName);
        }
      });

      if (definedKeys.length === 1 && definedKeys[0] === propKey) {
        // only that property is defined, remove the whole prop
        j(element)
          .find(j.JSXAttribute)
          .filter((a) => a.value.name.name === propName)
          .forEach((path) => {
            j(path).remove();
          });
      } else {
        propertiesToProcess.forEach((path) => {
          const name = (path.value.key as Identifier).name;
          if (name === propKey) {
            j(path).remove();
          }
        });
      }
    });
}
