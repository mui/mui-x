import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import { renameImports } from '../../../util/renameImports';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  renameImports({
    j,
    root,
    packageNames: ['@mui/x-date-pickers', '@mui/x-date-pickers-pro'],
    imports: [
      {
        oldEndpoint: 'AdapterDateFns',
        newEndpoint: 'AdapterDateFnsV2',
        importsMapping: {
          AdapterDateFns: 'AdapterDateFns',
        },
      },
      {
        oldEndpoint: 'AdapterDateFnsV3',
        newEndpoint: 'AdapterDateFns',
        importsMapping: {
          AdapterDateFns: 'AdapterDateFns',
        },
      },
      {
        oldEndpoint: 'AdapterDateFnsJalali',
        newEndpoint: 'AdapterDateFnsJalaliV2',
        importsMapping: {
          AdapterDateFnsJalali: 'AdapterDateFnsJalali',
        },
      },
      {
        oldEndpoint: 'AdapterDateFnsJalaliV3',
        newEndpoint: 'AdapterDateFnsJalali',
        importsMapping: {
          AdapterDateFnsJalali: 'AdapterDateFnsJalali',
        },
      },
    ],
  });
  return root.toSource(printOptions);
}
