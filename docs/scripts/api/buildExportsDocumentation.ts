import * as TypeDoc from 'typedoc';
import path from 'path';
import { writePrettifiedFile } from './utils';

interface BuildExportsDocumentationOptions {
  reflections: TypeDoc.Reflection[];
  workspaceRoot: string;
  prettierConfigPath: string;
}

export default function buildExportsDocumentation(options: BuildExportsDocumentationOptions) {
  const { reflections, workspaceRoot, prettierConfigPath } = options;

  const exports = reflections.map((child) => ({
    name: child.name,
    kind: child?.kindString,
  }));

  writePrettifiedFile(
    path.resolve(workspaceRoot, 'scripts/exportsSnapshot.json'),
    JSON.stringify(exports),
    prettierConfigPath,
  );
}
