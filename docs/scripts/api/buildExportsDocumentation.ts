import path from 'path';
import * as ts from 'typescript'
import {Project, writePrettifiedFile} from './utils';

interface BuildExportsDocumentationOptions {
  project: Project;
  workspaceRoot: string;
  prettierConfigPath: string;
}

export default function buildExportsDocumentation(options: BuildExportsDocumentationOptions) {
  const { project, workspaceRoot, prettierConfigPath } = options;

  const syntaxKindToSyntaxName = {}
  Object.entries(ts.SyntaxKind).forEach(([syntaxName, syntaxKind]) => {
      syntaxKindToSyntaxName[syntaxKind] = syntaxName.replace('Declaration', '')
  })

  const exports = Object.entries(project.exports)
    .map(([name, symbol]) => {
      return {
        name,
        kind: syntaxKindToSyntaxName[symbol.declarations?.[0].kind!]
      };
    })
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  writePrettifiedFile(
    path.resolve(workspaceRoot, 'scripts/exportsSnapshot.json'),
    JSON.stringify(exports),
    prettierConfigPath,
  );
}
