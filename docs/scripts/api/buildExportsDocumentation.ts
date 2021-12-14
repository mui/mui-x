import path from 'path';
import * as ts from 'typescript';
import { Project, writePrettifiedFile } from './utils';

interface BuildExportsDocumentationOptions {
  project: Project;
}

export default function buildExportsDocumentation(options: BuildExportsDocumentationOptions) {
  const { project } = options;

  const syntaxKindToSyntaxName = {};
  Object.entries(ts.SyntaxKind).forEach(([syntaxName, syntaxKind]) => {
    syntaxKindToSyntaxName[syntaxKind] = syntaxName.replace('Declaration', '');
  });

  const exports = Object.entries(project.exports)
    .map(([name, symbol]) => {
      return {
        name,
        kind: syntaxKindToSyntaxName[symbol.declarations?.[0].kind!],
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  writePrettifiedFile(
    path.resolve(project.workspaceRoot, 'scripts/exportsSnapshot.json'),
    JSON.stringify(exports),
    project,
  );
}
