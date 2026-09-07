import * as ts from 'typescript';
import { CHAT_SPECIFIER_RE } from './entryPoints';

export interface ImportedName {
  /** The exported identifier being imported (the left side of `X as Y`). */
  imported: string;
  /** Whether the binding (or whole clause) is `import type`. */
  isTypeOnly: boolean;
  /** 1-based line within the parsed snippet/file. */
  line: number;
}

export interface ChatImport {
  /** The `@mui/x-chat...` module specifier. */
  specifier: string;
  /** Named bindings (`import { X, Y as Z }`). */
  names: ImportedName[];
  /** `true` for `import * as ns from '…'`. */
  isNamespace: boolean;
  /** `true` for a default import (`import X from '…'`). */
  hasDefault: boolean;
  /** 1-based line of the import declaration. */
  line: number;
}

/**
 * Parse a TS/TSX source string and extract every `import`/re-export declaration
 * whose module specifier matches `@mui/x-chat...`. Uses `ts.createSourceFile`
 * (parse only — fast, no typecheck), so it handles multiline imports,
 * `import type`, aliasing (`X as Y`), and mixed value/type clauses.
 *
 * `declare module '…'` blocks are `ModuleDeclaration`s, not import declarations,
 * and are ignored. Snippets are allowed to be fragments (undeclared variables,
 * `// ...` ellipses): only import declarations are inspected, so partial snippets
 * never false-positive.
 *
 * @param code  The source text.
 * @param lineOffset  Added to each reported line (so md fence lines map back to
 *   the original file). Pass the fence's `startLine - 1`; pass `0` for `.tsx`
 *   files.
 */
export function extractChatImports(code: string, lineOffset = 0): ChatImport[] {
  const sourceFile = ts.createSourceFile(
    'snippet.tsx',
    code,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    ts.ScriptKind.TSX,
  );

  const imports: ChatImport[] = [];

  const lineOf = (node: ts.Node): number =>
    sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1 + lineOffset;

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement)) {
      const specifier = getSpecifier(statement.moduleSpecifier);
      if (!specifier || !CHAT_SPECIFIER_RE.test(specifier)) {
        continue;
      }

      const declLine = lineOf(statement);
      const result: ChatImport = {
        specifier,
        names: [],
        isNamespace: false,
        hasDefault: false,
        line: declLine,
      };

      const clause = statement.importClause;
      if (!clause) {
        // Side-effect import (`import '…'`) — always passes.
        imports.push(result);
        continue;
      }

      const clauseIsTypeOnly = clause.isTypeOnly;
      if (clause.name) {
        result.hasDefault = true;
      }
      const { namedBindings } = clause;
      if (namedBindings) {
        if (ts.isNamespaceImport(namedBindings)) {
          result.isNamespace = true;
        } else {
          for (const element of namedBindings.elements) {
            const importedName = (element.propertyName ?? element.name).text;
            result.names.push({
              imported: importedName,
              isTypeOnly: clauseIsTypeOnly || element.isTypeOnly,
              line: lineOf(element),
            });
          }
        }
      }

      imports.push(result);
    } else if (ts.isExportDeclaration(statement) && statement.moduleSpecifier) {
      // Re-export from a chat entry point (`export { X } from '@mui/x-chat'`).
      const specifier = getSpecifier(statement.moduleSpecifier);
      if (!specifier || !CHAT_SPECIFIER_RE.test(specifier)) {
        continue;
      }

      const declLine = lineOf(statement);
      const result: ChatImport = {
        specifier,
        names: [],
        isNamespace: false,
        hasDefault: false,
        line: declLine,
      };

      const exportClause = statement.exportClause;
      if (!exportClause) {
        // `export * from '…'` — re-exports everything; always passes.
        result.isNamespace = true;
      } else if (ts.isNamedExports(exportClause)) {
        for (const element of exportClause.elements) {
          const exportedName = (element.propertyName ?? element.name).text;
          result.names.push({
            imported: exportedName,
            isTypeOnly: statement.isTypeOnly || element.isTypeOnly,
            line: lineOf(element),
          });
        }
      }

      imports.push(result);
    }
  }

  return imports;
}

function getSpecifier(moduleSpecifier: ts.Expression): string | undefined {
  if (ts.isStringLiteral(moduleSpecifier)) {
    return moduleSpecifier.text;
  }
  return undefined;
}
