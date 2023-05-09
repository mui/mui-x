/* eslint-disable no-underscore-dangle */
import type { Collection, JSCodeshift, ASTPath, ImportDeclaration } from 'jscodeshift';

export interface PreRequisiteUsage {
  /**
   * List of possible paths, if defined, at least one of them must be found
   * for the pre-req to be satisfied.
   * Example value: ['initialState.filter', 'filterModel', 'componentsProps.filter']
   */
  possiblePaths?: string[];
  /**
   * List of components, one of which must be found
   * as an imported component (and also imported from one of the given packages,
   * if `packageRegex` is provided) for pre-req to be satisfied.
   * Example value: ['DataGrid', 'DataGridPro', 'DataGridPremium']
   */
  components?: string[];
  /**
   * If packageRegex is passed then one of the import declarations must satisfy `packageRegex`
   * Example value: /@mui\/x-data-grid(-pro|-premium)?/
   */
  packageRegex?: RegExp;
}

interface RenameIdentifiersArgs {
  root: Collection<any>;
  identifiers: Record<string, string>;
  preRequisiteUsages: { [identifierName: string]: PreRequisiteUsage };
  j: JSCodeshift;
}

export const matchImport = (path: ASTPath<ImportDeclaration>, regex) =>
  ((path.node.source.value as any).toString() || '').match(regex);

const findDeepASTPath = (j, currentPath, currentIdentifiers) => {
  if (!currentIdentifiers.length) {
    return true;
  }
  const target = j(currentPath)
    .find(j.Identifier)
    .filter((path) => path.value.name === currentIdentifiers[0]);
  if (target.__paths.length === 0) {
    return false;
  }
  return findDeepASTPath(j, currentPath, currentIdentifiers.slice(1));
};

/**
 * Checks if all pre-requisites are satisfied for the given path `root`.
 * For it to be satisfied, at least one condition of all the pre-requisites must be fulfilled.
 *
 * @param {*} j
 * @param {*} root
 * @param {PreRequisiteUsage} preReqs
 * @returns {boolean}
 */
export const checkPreRequisitesSatisfied = (j, root, preReqs: PreRequisiteUsage): boolean => {
  if (preReqs.packageRegex || preReqs.components) {
    // check if any of the components is imported from a package which satisfies `preReqs.packageRegex`
    const imports = root.find(j.ImportDeclaration);
    const matchingImports = preReqs.packageRegex
      ? imports.filter((path) => !!matchImport(path, preReqs.packageRegex))
      : imports;
    if (!matchingImports.__paths.length) {
      return false;
    }
    // check if any of the `preReqs.components` is imported from the matching imports
    const satisfyingImports = preReqs.components?.length
      ? matchingImports
          .find(j.Identifier)
          .filter((path) => preReqs.components!.includes(path.node.name))
      : matchingImports;

    if (!satisfyingImports.__paths.length) {
      return false;
    }
  }

  if (!preReqs.possiblePaths?.length) {
    return true;
  }

  const allComponents = root.find(j.JSXElement);
  const matchingComponents = preReqs.components?.length
    ? allComponents.filter((path) =>
        preReqs.components!.includes(path.node.openingElement.name.name),
      )
    : allComponents;

  const matchingAttributes = matchingComponents
    .find(j.JSXAttribute)
    // filter by props first
    .filter((attribute) =>
      preReqs.possiblePaths!.map((path) => path.split('.')[0]).includes(attribute.node.name.name),
    )
    // filter by nested levels
    .filter((attribute) =>
      findDeepASTPath(
        j,
        attribute,
        preReqs
          .possiblePaths!.find((path) => path.startsWith(attribute.node.name.name))!
          .split('.')
          .slice(1),
      ),
    );
  return matchingAttributes.__paths.length > 0;
};

/**
 * Renames identifiers based on the `identifiers` object passed plus an optional `preRequisiteUsages` object
 * to control renaming based on certain conditions.
 *
 * @export renameIdentifiers
 * @param {RenameIdentifiersArgs} {
 *   root, // jscodeshift root
 *   identifiers, // object of identifiers to rename
 *   preRequisiteUsages, // an optional list of pre-requisite to control renaming based on certain conditions
 *                       // if any of the pre-requisites is satisfied then the identifier will be renamed
 *                       // for more details, see the type definition of `PreRequisiteUsage`
 *   j, // jscodeshift
 * }
 */
export default function renameIdentifiers({
  root,
  identifiers,
  preRequisiteUsages,
  j,
}: RenameIdentifiersArgs) {
  root
    .find(j.Identifier)
    .filter((path) => identifiers.hasOwnProperty(path.node.name))
    .replaceWith((path) => {
      if (!preRequisiteUsages || !preRequisiteUsages[path.node.name]) {
        return j.importSpecifier(j.identifier(identifiers[path.node.name]));
      }
      const shouldReplace = checkPreRequisitesSatisfied(
        j,
        root,
        preRequisiteUsages[path.node.name],
      );
      if (shouldReplace) {
        return j.importSpecifier(j.identifier(identifiers[path.node.name]));
      }
      return j.importSpecifier(j.identifier(path.node.name));
    });
}
