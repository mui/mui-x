import { ASTPath, ImportDeclaration } from 'jscodeshift';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import renameProps from '../../../util/renameProps';

const VARIABLES = {
  GridFilterMenuItem: 'GridColumnMenuFilterItem',
  HideGridColMenuItem: 'GridColumnMenuHideItem',
  GridColumnsMenuItem: 'GridColumnMenuColumnsItem',
  SortGridMenuItems: 'GridColumnMenuSortItem',
  GridColumnPinningMenuItems: 'GridColumnMenuPinningItem',
  GridAggregationColumnMenuItem: 'GridColumnMenuAggregationItem',
  GridFilterItemProps: 'GridColumnMenuItemProps',
};

const PACKAGE_REGEXP = /@mui\/x-data-grid(-pro|-premium)?/;

const matchImport = (path: ASTPath<ImportDeclaration>) =>
  (path.node.source.value?.toString() ?? '').match(PACKAGE_REGEXP);
export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  const matchingImports = root.find(j.ImportDeclaration).filter((path) => !!matchImport(path));

  // Rename the import specifiers
  // - import { GridFilterMenuItem } from '@mui/x-data-grid'
  // + import { GridColumnMenuFilterItem } from '@mui/x-data-grid'
  matchingImports
    .find(j.ImportSpecifier)
    .filter((path) => VARIABLES.hasOwnProperty(path.node.imported.name))
    .replaceWith((path) => j.importSpecifier(j.identifier(VARIABLES[path.node.imported.name])));

  // Rename the import usage
  // - <GridFilterMenuItem />
  // + <GridColumnMenuFilterItem />
  root
    .find(j.Identifier)
    .filter((path) => VARIABLES.hasOwnProperty(path.node.name))
    .replaceWith((path) => j.identifier(VARIABLES[path.node.name]));

  // Rename `column` prop to `colDef`
  // - <GridFilterMenuItem column={col} onClick={onClick} />
  // + <GridFilterMenuItem colDef={col} onClick={onClick} />
  return renameProps({
    root,
    componentNames: Object.values(VARIABLES),
    props: { column: 'colDef' },
    j,
  }).toSource(printOptions);
}
