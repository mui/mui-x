import * as path from 'path';
import * as ts from 'typescript';
import {
  formatType,
  getSymbolDescription,
  getSymbolJSDocTags,
  Project,
  writePrettifiedFile,
} from './utils';

interface BuildSelectorsDocumentationOptions {
  project: Project;
  outputDirectory: string;
}

interface Selector {
  name: string;
  returnType: string;
  category?: string;
  deprecated?: string;
  description?: string;
}

export default function buildSelectorsDocumentation(options: BuildSelectorsDocumentationOptions) {
  const { project, outputDirectory } = options;

  const selectors = Object.values(project.exports)
    .map((symbol): Selector | null => {
      if (!symbol.name.endsWith('Selector')) {
        return null;
      }

      const tags = getSymbolJSDocTags(symbol);
      if (tags.ignore) {
        return null;
      }

      const type = project.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);
      const signature = project.checker.getSignaturesOfType(type, ts.SignatureKind.Call)?.[0];

      if (!signature) {
        return null;
      }

      const parameterSymbol = signature.getParameters()[0];

      let isSelector = false;

      if (
        project.checker.getTypeOfSymbolAtLocation(
          parameterSymbol,
          parameterSymbol.valueDeclaration!,
        ).symbol?.name === 'GridState'
      ) {
        // Selector not wrapped in `createSelector`
        isSelector = true;
      } else if (
        // Selector wrapped in `createSelector`
        type.getProperties().some((property) => property.escapedName === 'memoizedResultFunc')
      ) {
        isSelector = true;
      }

      if (!isSelector) {
        return null;
      }

      const returnType = formatType(
        project.checker.typeToString(
          signature.getReturnType(),
          undefined,
          ts.TypeFormatFlags.NoTruncation,
        ),
      );
      const category = tags.category?.text?.[0].text;
      const deprecated = tags.deprecated?.text?.[0].text;
      const description = getSymbolDescription(symbol, project);

      return {
        name: symbol.name,
        returnType,
        category,
        deprecated,
        description,
      };
    })
    .filter((el): el is Selector => !!el)
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  writePrettifiedFile(
    path.resolve(outputDirectory, `selectors.json`),
    JSON.stringify(selectors),
    project,
  );
}
