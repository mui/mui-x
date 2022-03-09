import * as path from 'path';
import * as ts from 'typescript';
import { formatType, getSymbolDescription, getSymbolJSDocTags, writePrettifiedFile } from './utils';
import { Project } from '../getTypeScriptProjects';

interface BuildSelectorsDocumentationOptions {
  project: Project;
  documentationRoot: string;
}

interface Selector {
  name: string;
  returnType: string;
  category?: string;
  deprecated?: string;
  description?: string;
  supportsApiRef?: boolean;
}

export default function buildGridSelectorsDocumentation(
  options: BuildSelectorsDocumentationOptions,
) {
  const { project, documentationRoot } = options;

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
      let supportsApiRef = false;

      const firstParamName = project.checker.getTypeOfSymbolAtLocation(
        parameterSymbol,
        parameterSymbol.valueDeclaration!,
      ).symbol?.name;

      if (['GridStatePro', 'GridStateCommunity'].includes(firstParamName)) {
        // Selector not wrapped in `createSelector`
        isSelector = true;
      } else if (
        // Selector wrapped in `createSelector`
        type.symbol.name === 'OutputSelector'
      ) {
        isSelector = true;
        supportsApiRef = true;
      }

      if (!isSelector) {
        return null;
      }

      const returnType = formatType(
        project.checker
          .typeToString(signature.getReturnType(), undefined, ts.TypeFormatFlags.NoTruncation)
          // For now the community selectors are not overloading when exported from the pro
          .replace(/<GridApi(Community|Pro)>/g, ''),
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
        supportsApiRef,
      };
    })
    .filter((el): el is Selector => !!el)
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  writePrettifiedFile(
    path.resolve(documentationRoot, project.documentationFolderName, `selectors.json`),
    JSON.stringify(selectors),
    project,
  );
}
