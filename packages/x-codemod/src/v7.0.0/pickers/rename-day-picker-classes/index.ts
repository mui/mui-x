import { ASTPath, ImportDeclaration } from 'jscodeshift';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

const PACKAGE_REGEXP = /@mui\/x-date-pickers(-pro|)(\/(.*)|)/;

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
  // - import { dayPickerClasses } from '@mui/x-date-pickers'
  // + import { dayCalendarClasses } from '@mui/x-date-pickers'
  matchingImports
    .find(j.ImportSpecifier)
    .filter((path) => path.node.imported.name === 'dayPickerClasses')
    .replaceWith((path) => j.importSpecifier(j.identifier('dayCalendarClasses'), path.value.local));

  // Rename the import usage
  // - dayPickerClasses.root
  // + dayCalendarClasses.root
  root
    .find(j.Identifier)
    .filter((path) => path.node.name === 'dayPickerClasses')
    .replaceWith(() => j.identifier('dayCalendarClasses'));

  return root.toSource(printOptions);
}
