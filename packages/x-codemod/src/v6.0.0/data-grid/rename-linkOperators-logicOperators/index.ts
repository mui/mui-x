import { ASTPath, ImportDeclaration } from 'jscodeshift';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

const renamedIdentifiers = {
  GridLinkOperator: 'GridLogicOperator',
  linkOperatorInputProps: 'logicOperatorInputProps',
  linkOperator: 'logicOperator',
  linkOperators: 'logicOperators',
  setFilterLinkOperator: 'setFilterLogicOperator',
};
const renamedLiterals = {
  filterPanelLinkOperator: 'filterPanelLogicOperator',
  '& .MuiDataGrid-filterFormLinkOperatorInput': '& .MuiDataGrid-filterFormLogicOperatorInput',
};

const PACKAGE_REGEXP = /@mui\/x-data-grid(-pro|-premium)?/;

const matchImport = (path: ASTPath<ImportDeclaration>) =>
  ((path.node.source.value as any).toString() || '').match(PACKAGE_REGEXP);

// Press ctrl+space for code completion
export default function transform(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  const matchingImports = root.find(j.ImportDeclaration).filter((path) => !!matchImport(path));

  if (matchingImports.length > 0) {
    // Rename the identifiers
    // - import { gridSelectionStateSelector } from '@mui/x-data-grid'
    // + import { gridRowSelectionStateSelector } from '@mui/x-data-grid'
    root
      .find(j.Identifier)
      .filter((path) => !!renamedIdentifiers[path.node.name])
      .replaceWith((path) => j.importSpecifier(j.identifier(renamedIdentifiers[path.node.name])));

    // Rename the literals
    // - apiRef.current.getLocaleText('filterPanelLinkOperator')
    // + apiRef.current.getLocaleText('filterPanelLogicOperator')
    root
      .find(j.Literal)
      .filter((path) => !!renamedLiterals[path.node.value as any])
      .replaceWith((path) => j.literal(renamedLiterals[path.node.value as any]));
  }

  return root.toSource(printOptions);
}
