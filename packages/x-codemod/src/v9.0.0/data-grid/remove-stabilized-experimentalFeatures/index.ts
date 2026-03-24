import path from 'path';
import removeObjectProperty from '../../../util/removeObjectProperty';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import readFile from '../../../util/readFile';

const componentsNames = ['DataGridPremium'];

const propName = 'experimentalFeatures';
const propKeys = ['charts'];

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  propKeys.forEach((propKey) => {
    removeObjectProperty({ root, j, propName, componentsNames, propKey });
  });

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'remove-stabilized-experimentalFeatures',
  specFiles: [
    {
      name: 'remove charts from experimentalFeatures',
      actual: readFile(path.join(import.meta.dirname, 'actual.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected.spec.tsx')),
    },
  ],
});
