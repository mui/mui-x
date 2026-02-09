import path from 'path';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import readFile from '../../../util/readFile';
import { renameImports } from '../../../util/renameImports';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
    wrapColumn: 40,
  };

  renameImports({
    j,
    root,
    packageNames: ['@mui/x-charts', '@mui/x-charts-pro', '@mui/x-charts-premium'],
    imports: [
      {
        oldEndpoint: 'ChartsTooltip',
        importsMapping: {
          useAxisTooltip: 'useAxesTooltip',
          UseAxisTooltipReturnValue: 'UseAxesTooltipReturnValue',
          UseAxisTooltipParams: 'UseAxesTooltipParams',
        },
      },
      {
        importsMapping: {
          useAxisTooltip: 'useAxesTooltip',
          UseAxisTooltipReturnValue: 'UseAxesTooltipReturnValue',
          UseAxisTooltipParams: 'UseAxesTooltipParams',
        },
      },
    ],
  });

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'rename-axis-tooltip-hook',
  specFiles: [
    {
      name: 'nested',
      actual: readFile(path.join(import.meta.dirname, 'actual-nested-imports.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected-nested-imports.spec.tsx')),
    },
    {
      name: 'root',
      actual: readFile(path.join(import.meta.dirname, 'actual-root-imports.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected-root-imports.spec.tsx')),
    },
  ],
});
