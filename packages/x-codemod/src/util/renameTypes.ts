import type { Collection, JSCodeshift } from 'jscodeshift';

interface TypesOptions {
  oldTypeName?: string;
  newTypeName?: string;
}

interface RenameImportsParameters {
  j: JSCodeshift;
  root: Collection<any>;
  options: TypesOptions[];
}

const getTypeName = (parent) => {
  if (parent.type === 'Identifier') {
    return parent.name;
  }
  if (parent.type === 'TSQualifiedName') {
    return `${getTypeName(parent.left)}.${parent.right.name}`;
  }
  return '';
};

export default function renameTypes(parameters: RenameImportsParameters) {
  const { j, root, options } = parameters;

  options.forEach(({ oldTypeName, newTypeName }) => {
    // Replace all instances of the old type in TypeScript TSTypeReference nodes
    root
      .find(j.TSTypeReference)
      .filter(
        (path) =>
          path.node.typeName.type === 'Identifier' &&
          getTypeName(path.node.typeName) === oldTypeName,
      )
      .replaceWith(newTypeName);

    // Replace all instances of the old type in Flow GenericTypeAnnotation nodes
    root
      .find(j.GenericTypeAnnotation)
      .filter(
        (path) => path.node.id.type === 'Identifier' && getTypeName(path.node.id) === oldTypeName,
      )
      .replaceWith(newTypeName);
  });

  return root;
}
