import path from 'path';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import readFile from '../../../util/readFile';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
    wrapColumn: 40,
  };

  // Find all call expressions where the callee is `useChartRootRef`
  root
    .find(j.CallExpression, {
      callee: {
        type: 'Identifier',
        name: 'useChartRootRef',
      },
    })
    .forEach((itemPath) => {
      // @ts-ignore
      if (!itemPath.node.typeParameters) {
        // @ts-ignore
        itemPath.node.typeParameters = j.typeParameterInstantiation([
          j.typeParameter('HTMLDivElement'),
        ]);
      }
    });

  return root.toSource(printOptions);
}

export const testConfig = {
  name: 'add-use-chart-root-ref-type-argument',
  specFiles: [
    {
      name: 'add generics to useChartRootRef',
      actual: readFile(path.join(import.meta.dirname, 'actual.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected.spec.tsx')),
    },
  ],
};
