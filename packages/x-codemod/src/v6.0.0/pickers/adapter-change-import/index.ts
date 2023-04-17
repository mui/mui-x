import { ASTPath, ImportDeclaration } from 'jscodeshift';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

const adapters = {
  'date-fns': 'AdapterDateFns',
  'date-fns-jalali': 'AdapterDateFnsJalali',
  dayjs: 'AdapterDayjs',
  luxon: 'AdapterLuxon',
  moment: 'AdapterMoment',
  hijri: 'AdapterMomentHijri',
  jalaali: 'AdapterMomentJalaali',
};

const getDateIoSubPackage = (path: ASTPath<ImportDeclaration>) =>
  (path.node.source.value?.toString() ?? '').match(/@date-io\/(.*)/)?.[1];

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  const matchingImports = root.find(j.ImportDeclaration).filter((path) => {
    const subPackage = getDateIoSubPackage(path);
    return !!subPackage && !!adapters[subPackage];
  });

  const adapterVariableNames: Record<string, string> = {};

  // Replace the default import specifier by an import specifiers
  // - import WhateverDateFns from '@mui/x-date-pickers/MonthPicker'
  // + import { AdapterDateFns } from '@mui/x-date-pickers/MonthPicker'
  matchingImports.find(j.ImportDefaultSpecifier).replaceWith((path) => {
    const subPackage = getDateIoSubPackage(path.parentPath.parentPath)!;
    const adapterVariableName = (path.value.local?.name as string) ?? '';
    adapterVariableNames[adapterVariableName] = adapters[subPackage];
    return j.importSpecifier(j.identifier(adapters[subPackage]));
  });

  // Rename the import declarations
  // - import {} from '@date-io/date-fns'
  // + import {} from '@mui/x-date-pickers/AdapterDateFns'
  matchingImports.replaceWith((path) => {
    const subPackage = getDateIoSubPackage(path)!;

    return j.importDeclaration(
      path.node.specifiers, // copy over the existing import specifiers
      j.stringLiteral(`@mui/x-date-pickers/${adapters[subPackage]}`), // Replace the source with our new source
    );
  });

  // Rename the import usage
  // - <LocalizationProvider dateAdapter={WhateverDateFns} />
  // + <LocalizationProvider dateAdapter={AdapterDateFns} />
  root
    .find(j.Identifier)
    .filter((path) => adapterVariableNames.hasOwnProperty(path.node.name))
    .replaceWith((path) => j.identifier(adapterVariableNames[path.node.name]));

  return root.toSource(printOptions);
}
