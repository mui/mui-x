/**
 * Recursive function that:
 * Return a jscodeshift object with `value` associated to path.
 * The path can be such as 'tabs.hidden' which will return `{ tabs: { hidden: value } }`.
 * If object is not null, path/value will be added respecting the other properties of the object.
 */
export const addItemToObject = (path, value, object, j) => {
  const splittedPath = path.split('.');

  // Final case where we have to add the property to the object.
  if (splittedPath.length === 1) {
    if (object === null) {
      const propertyToAdd = j.objectProperty(j.identifier(path), value);
      return j.objectExpression([propertyToAdd]);
    }

    // When both the existing and new values are ObjectExpressions, merge their properties
    // (new properties win on key conflicts) instead of replacing the entire object.
    const existingProperty = (object.properties ?? []).find(
      (property) => property.key?.name === path || property.key?.value === path,
    );
    if (
      existingProperty &&
      existingProperty.value.type === 'ObjectExpression' &&
      value.type === 'ObjectExpression'
    ) {
      // Spread elements (e.g. `{ ...rest }`) have no `key`, so guard against `undefined`
      // sneaking into the dedup set — otherwise existing spreads would be filtered out.
      const newKeys = new Set(
        value.properties.map((p) => p.key?.name ?? p.key?.value).filter((key) => key !== undefined),
      );
      const mergedValue = j.objectExpression([
        ...existingProperty.value.properties.filter((p) => {
          const key = p.key?.name ?? p.key?.value;
          return key === undefined || !newKeys.has(key);
        }),
        ...value.properties,
      ]);
      const mergedProperty = j.objectProperty(j.identifier(path), mergedValue);
      return j.objectExpression([
        ...(object.properties ?? []).filter(
          (property) => (property.key?.name ?? property.key?.value) !== path,
        ),
        mergedProperty,
      ]);
    }

    const propertyToAdd = j.objectProperty(j.identifier(path), value);
    return j.objectExpression([
      ...(object.properties ?? []).filter(
        (property) => (property.key?.name ?? property.key?.value) !== path,
      ),
      propertyToAdd,
    ]);
  }

  const remainingPath = splittedPath.slice(1).join('.');
  const targetKey = splittedPath[0];

  if (object === null) {
    // Simplest case, no object to take into consideration
    const propertyToAdd = j.objectProperty(
      j.identifier(targetKey),
      addItemToObject(remainingPath, value, null, j),
    );
    return j.objectExpression([propertyToAdd]);
  }

  // Look if the object we got already contains the property we have to use.
  // `property.key` is missing on spread / rest elements, so guard the access.
  const correspondingObject = (object.properties ?? []).find(
    (property) => (property.key?.name ?? property.key?.value) === targetKey,
  );

  const propertyToAdd = j.objectProperty(
    j.identifier(targetKey),
    // Here we use recursion to mix the new value with the current one
    addItemToObject(remainingPath, value, correspondingObject?.value ?? null, j),
  );

  return j.objectExpression([
    ...(object.properties ?? []).filter(
      (property) => (property.key?.name ?? property.key?.value) !== targetKey,
    ),
    propertyToAdd,
  ]);
};

/**
 *
 * @param elementPath jscodshift path of the element
 * @param propName the name of the prop to edit (`'componentsProps'` for example)
 * @param nestedPath path of the nested object keys with '.' to separate. ('tabs.hidden' for example)
 * @param value the jscodeshift value to associate to the key
 * @param j jscodeshift
 */
export const transformNestedProp = (elementPath, propName, nestedPath, value, j) => {
  const initialAttribute = elementPath.value.openingElement.attributes?.find(
    (attribute) => attribute.name.name === propName,
  );
  // the object in JSX element
  const initialValue = initialAttribute?.value.expression;

  // Add the value
  const withNewValues = addItemToObject(nestedPath, value, initialValue ?? null, j);

  // Create a new component with the prop added
  const newComponent = j.jsxElement(
    j.jsxOpeningElement(elementPath.node.openingElement.name, [
      ...(elementPath.node.openingElement.attributes ?? []).filter(
        (attribute) => attribute.name.name !== propName,
      ),
      // build and insert our new prop
      j.jsxAttribute(j.jsxIdentifier(propName), j.jsxExpressionContainer(withNewValues)),
    ]),
    elementPath.node.closingElement,
    elementPath.node.children,
  );
  newComponent.openingElement.selfClosing = elementPath.node.closingElement === null;
  newComponent.selfClosing = elementPath.node.closingElement === null;

  // Replace our original component with our modified one
  j(elementPath).replaceWith(newComponent);
};
