import path from 'path';
import * as ts from 'typescript';
import { writePrettifiedFile, resolveExportSpecifier } from './utils';
import { Project, Projects } from '../getTypeScriptProjects';

interface BuildExportsDocumentationOptions {
  projects: Projects;
}

const buildPackageExports = (project: Project) => {
  const syntaxKindToSyntaxName = {};
  Object.entries(ts.SyntaxKind).forEach(([syntaxName, syntaxKind]) => {
    syntaxKindToSyntaxName[syntaxKind] = syntaxName.replace('Declaration', '');
  });

  const exports = Object.entries(project.exports)
    .map(([name, symbol]) => {
      return {
        name,
        kind: syntaxKindToSyntaxName[
          resolveExportSpecifier(symbol, project).declarations?.[0].kind!
        ],
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  writePrettifiedFile(
    path.resolve(project.workspaceRoot, `scripts/${project.name}.exports.json`),
    JSON.stringify(exports),
    project,
  );
};

export default function buildExportsDocumentation(options: BuildExportsDocumentationOptions) {
  options.projects.forEach((project) => {
    buildPackageExports(project);
  });
}
