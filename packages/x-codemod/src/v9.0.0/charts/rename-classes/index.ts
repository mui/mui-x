import path from 'path';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import readFile from '../../../util/readFile';
import { renameClasses } from '../../../util/renameClasses';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  renameClasses({
    j,
    root,
    packageNames: ['@mui/x-charts', '@mui/x-charts-pro'],
    classes: {
      barElementClasses: {
        newClassName: 'barClasses',
        properties: { root: 'element' },
      },
    },
  });

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'rename-classes',
  specFiles: [
    {
      name: 'rename barElementClasses to barClasses',
      actual: readFile(path.join(import.meta.dirname, 'actual-imports.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected-imports.spec.tsx')),
    },
  ],
});
