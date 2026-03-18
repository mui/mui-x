import type { Collection, JSCodeshift } from 'jscodeshift';

interface ClassRenameConfig {
  /**
   * The new name of the classes object.
   * @example 'lineClasses' for renaming 'lineElementClasses'
   */
  newClassName: string;
  /**
   * The mapping of old property names to new property names.
   * @example { root: 'elementRoot', highlighted: 'elementHighlighted' }
   */
  properties: Record<string, string>;
}

interface RenameClassesParameters {
  j: JSCodeshift;
  root: Collection<any>;
  /**
   * The list of packages the classes can be imported from.
   * @example ['@mui/x-charts', '@mui/x-charts-pro']
   */
  packageNames: string[];
  /**
   * The mapping of old class names to their rename configuration.
   * @example { lineElementClasses: { newClassName: 'lineClasses', properties: { root: 'elementRoot' } } }
   */
  classes: Record<string, ClassRenameConfig>;
}

/**
 * Renames classes objects and their properties.
 *
 * Handles:
 * - Root imports: `import { lineElementClasses } from '@mui/x-charts'`
 * - Nested imports: `import { lineElementClasses } from '@mui/x-charts/LineChart'`
 * - Aliases: `import { lineElementClasses as lec } from '@mui/x-charts'`
 *   (renames imported name but keeps alias, still renames properties on aliased usage)
 * - Member expression property renaming: `lineElementClasses.root` → `lineClasses.elementRoot`
 */
export function renameClasses(parameters: RenameClassesParameters) {
  const { j, root, packageNames } = parameters;

  const packageRegExp = new RegExp(`^(${packageNames.join('|')})(/.*)?$`);

  // Track local names → old class name, so we can rename properties on aliased usages
  const localNameToOldClassName: Record<string, string> = {};
  // Track non-aliased identifiers that need renaming
  const renamedIdentifiersMap: Record<string, string> = {};

  const importDeclarations = root
    .find(j.ImportDeclaration)
    .filter((path) => {
      const pathStr = path.node.source.value?.toString() ?? '';
      return !!pathStr.match(packageRegExp);
    });

  // Rename import specifiers and collect local names for property renaming
  importDeclarations
    .find(j.ImportSpecifier)
    .filter((path) => parameters.classes.hasOwnProperty(path.node.imported.name as string))
    .replaceWith((path) => {
      const oldName = path.node.imported.name as string;
      const config = parameters.classes[oldName];
      const localName = path.node.local?.name as string;
      const hasAlias = localName !== oldName;

      // Track the local name for property renaming
      localNameToOldClassName[hasAlias ? localName : config.newClassName] = oldName;

      if (hasAlias) {
        // Keep the alias, only rename the imported name
        return j.importSpecifier(
          j.identifier(config.newClassName),
          j.identifier(localName),
        );
      }

      renamedIdentifiersMap[oldName] = config.newClassName;
      return j.importSpecifier(j.identifier(config.newClassName));
    });

  // Rename identifier usages (non-aliased)
  root
    .find(j.Identifier)
    .filter((path) => renamedIdentifiersMap.hasOwnProperty(path.node.name))
    .replaceWith((path) => {
      return j.identifier(renamedIdentifiersMap[path.node.name]);
    });

  // Rename member expression properties (e.g., lineElementClasses.root → lineClasses.elementRoot)
  root
    .find(j.MemberExpression)
    .filter((path) => {
      if (path.node.object.type !== 'Identifier') {
        return false;
      }
      const objectName = path.node.object.name;
      if (!localNameToOldClassName.hasOwnProperty(objectName)) {
        return false;
      }
      if (path.node.property.type !== 'Identifier') {
        return false;
      }
      const oldClassName = localNameToOldClassName[objectName];
      return parameters.classes[oldClassName].properties.hasOwnProperty(path.node.property.name);
    })
    .replaceWith((path) => {
      const objectName = (path.node.object as { name: string }).name;
      const oldPropertyName = (path.node.property as { name: string }).name;
      const oldClassName = localNameToOldClassName[objectName];
      const newPropertyName = parameters.classes[oldClassName].properties[oldPropertyName];

      return j.memberExpression(
        path.node.object,
        j.identifier(newPropertyName),
      );
    });

  return root;
}
