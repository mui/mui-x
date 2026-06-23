import path from 'node:path';
import * as ts from 'typescript';
import { ENTRY_POINTS, workspaceRoot } from './entryPoints';

export interface ExportInfo {
  /** `true` when the export carries a runtime value (component, hook, const, function, …). */
  isValue: boolean;
}

export type ExportSurface = Map<string, ExportInfo>;

/**
 * The `paths` mapping that lets the TypeScript program resolve the workspace
 * package specifiers (notably `@mui/x-chat-headless`, reached through
 * `export * from '@mui/x-chat-headless'` in `src/headless/index.ts`) to their
 * source `index.ts` rather than to a built artifact. Mirrors the relevant slice
 * of the root `tsconfig.json#paths`.
 */
const WORKSPACE_PATHS: Record<string, string[]> = {
  '@mui/x-chat': ['./packages/x-chat/src'],
  '@mui/x-chat/*': ['./packages/x-chat/src/*'],
  '@mui/x-chat-headless': ['./packages/x-chat-headless/src'],
  '@mui/x-chat-headless/*': ['./packages/x-chat-headless/src/*'],
};

/* eslint-disable no-bitwise -- TypeScript symbol flags are a bitmask. */
const SYMBOL_VALUE_FLAGS =
  ts.SymbolFlags.Value |
  ts.SymbolFlags.Function |
  ts.SymbolFlags.Class |
  ts.SymbolFlags.Variable |
  ts.SymbolFlags.Enum |
  ts.SymbolFlags.ValueModule |
  ts.SymbolFlags.Method |
  ts.SymbolFlags.GetAccessor;

function isValueSymbol(symbol: ts.Symbol, checker: ts.TypeChecker): boolean {
  let resolved = symbol;
  // `export { X } from '…'` and `export *` produce alias symbols; classify the
  // aliased target so a value re-export is recognised as a value, not a type.
  if (resolved.flags & ts.SymbolFlags.Alias) {
    try {
      resolved = checker.getAliasedSymbol(resolved);
    } catch {
      // Keep the alias symbol if it cannot be resolved (defensive; should not happen).
    }
  }
  return (resolved.flags & SYMBOL_VALUE_FLAGS) !== 0;
}
/* eslint-enable no-bitwise */

let cachedSurfaces: Map<string, ExportSurface> | undefined;

/**
 * Enumerate the public export surface of every allowed `@mui/x-chat*` entry
 * point, using the TypeScript checker (`checker.getExportsOfModule`) — the same
 * technique as `docs/scripts/api/buildExportsDocumentation.ts`. Unlike a runtime
 * `import * as` enumeration, this includes type-only exports (`ChatAdapter`,
 * `ChatError`, …) that docs snippets legitimately import.
 *
 * Returns a map: entry-point specifier → (export name → { isValue }).
 * Computed once and cached for the test run.
 */
export function getExportSurfaces(): Map<string, ExportSurface> {
  if (cachedSurfaces) {
    return cachedSurfaces;
  }

  const entryFiles = Object.values(ENTRY_POINTS);

  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    baseUrl: workspaceRoot,
    paths: WORKSPACE_PATHS,
    jsx: ts.JsxEmit.ReactJSX,
    esModuleInterop: true,
    skipLibCheck: true,
    noEmit: true,
    allowJs: false,
    strict: false,
  };

  const program = ts.createProgram({ rootNames: entryFiles, options: compilerOptions });
  const checker = program.getTypeChecker();

  const surfaces = new Map<string, ExportSurface>();

  for (const [specifier, entryFile] of Object.entries(ENTRY_POINTS)) {
    const sourceFile = program.getSourceFile(entryFile);
    if (!sourceFile) {
      throw new Error(
        `MUI X Chat docs-correctness guard: could not load entry point ${specifier} ` +
          `(${path.relative(workspaceRoot, entryFile)}). The export surface cannot be enumerated.`,
      );
    }
    const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
    if (!moduleSymbol) {
      throw new Error(
        `MUI X Chat docs-correctness guard: ${specifier} has no module symbol ` +
          `(${path.relative(workspaceRoot, entryFile)}); it may be missing exports.`,
      );
    }

    const surface: ExportSurface = new Map();
    for (const symbol of checker.getExportsOfModule(moduleSymbol)) {
      surface.set(symbol.name, { isValue: isValueSymbol(symbol, checker) });
    }
    surfaces.set(specifier, surface);
  }

  cachedSurfaces = surfaces;
  return surfaces;
}
