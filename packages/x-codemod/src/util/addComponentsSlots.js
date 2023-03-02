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
    const propertyToAdd = j.objectProperty(j.identifier(path), value);
    if (object === null) {
      return j.objectExpression([propertyToAdd]);
    }

    return j.objectExpression([
      ...(object.properties ?? []).filter((property) => property.key.name !== path),
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
  const correspondingObject = (object.properties ?? []).find(
    (property) => property.key.name === targetKey,
  );

  const propertyToAdd = j.objectProperty(
    j.identifier(targetKey),
    // Here we use recursion to mix the new value with the current one
    addItemToObject(remainingPath, value, correspondingObject?.value ?? null, j),
  );

  return j.objectExpression([
    ...(object.properties ?? []).filter((property) => property.key.name !== targetKey),
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
