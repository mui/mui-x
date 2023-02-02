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
};

const renamedClasses = {
  'MuiDataGrid-filterFormLinkOperatorInput': 'MuiDataGrid-filterFormLogicOperatorInput',
  'MuiDataGrid-withBorder': 'MuiDataGrid-withBorderColor',
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
    // - import { linkOperatorInputProps } from '@mui/x-data-grid'
    // + import { logicOperatorInputProps } from '@mui/x-data-grid'
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

    // Rename the classes
    // - 'MuiDataGrid-filterFormLinkOperatorInput'
    // + 'MuiDataGrid-filterFormLogicOperatorInput'
    root
      .find(j.Literal)
      .filter(
        (path) =>
          !!Object.keys(renamedClasses).find((className) => {
            const literal = path.node.value as any;
            return (
              typeof literal === 'string' &&
              literal.includes(className) &&
              !literal.includes(renamedClasses[className])
            );
          }),
      )
      .replaceWith((path) => {
        const literal = path.node.value as any;
        const targetClassKey = Object.keys(renamedClasses).find((className) =>
          literal.includes(className),
        )!;
        return j.literal(literal.replace(targetClassKey, renamedClasses[targetClassKey]));
      });
  }

  return root.toSource(printOptions);
}
