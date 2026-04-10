/* eslint-disable no-bitwise */
/**
 * Interface documentation builder.
 */
import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'node:fs';
import { kebabCase } from 'es-toolkit/string';
import { CWD, debug, MAX_EXPAND_DEPTH, MAX_EXPAND_PROPERTIES, MAX_EXPANDED_LENGTH } from './config';
import { extractJsDoc } from './jsDocUtils';
import type { FileWrite } from './types';

/** typeToString with NoTruncation and single quotes for string literals */
function typeToStr(checker: ts.TypeChecker, type: ts.Type): string {
  return checker
    .typeToString(type, undefined, ts.TypeFormatFlags.NoTruncation)
    .replace(/"/g, "'");
}

/**
 * Build full documentation pages for interfaces (JSON + translation + JS wrapper).
 * Returns the files to write and a map of documented interface names → packages.
 */
export function buildInterfacePages(
  entry: { folder: string; packages: string[]; documentedInterfaces: string[] },
  checker: ts.TypeChecker,
  program: ts.Program,
): { files: FileWrite[]; documentedInterfaces: Map<string, string[]> } {
  const files: FileWrite[] = [];
  const documentedInterfaces = new Map<string, string[]>();

  for (const interfaceName of entry.documentedInterfaces) {
    const projects: string[] = [];
    let interfaceType: ts.Type | undefined;
    let interfaceSymbol: ts.Symbol | undefined;

    for (const pkg of entry.packages) {
      const entryPath = path.resolve(CWD, `packages/${pkg}/src/index.ts`);
      const sf = program.getSourceFile(entryPath);
      if (!sf) {
        continue;
      }

      const modSymbol = checker.getSymbolAtLocation(sf);
      if (!modSymbol) {
        continue;
      }

      const exports = checker.getExportsOfModule(modSymbol);
      const found = exports.find((exportSymbol) => exportSymbol.name === interfaceName);
      if (found) {
        projects.push(pkg);
        // Always update to the current package's symbol — the last (most complete)
        // package in the list will have all properties including augmentations
        let resolved = found;
        if (resolved.flags & ts.SymbolFlags.Alias) {
          resolved = checker.getAliasedSymbol(resolved);
        }
        interfaceSymbol = resolved;
        interfaceType = checker.getDeclaredTypeOfSymbol(resolved);
      }
    }

    if (!interfaceType || !interfaceSymbol) {
      continue;
    }

    documentedInterfaces.set(interfaceName, projects);

    const slug = kebabCase(interfaceName);
    const description = ts.displayPartsToString(interfaceSymbol.getDocumentationComment(checker));

    // Extract demos from @demos JSDoc tag on declarations
    let demos: string | undefined;
    const interfaceDecls = interfaceSymbol.getDeclarations() || [];
    for (const decl of interfaceDecls) {
      for (const jsDocTag of ts.getJSDocTags(decl)) {
        if (jsDocTag.tagName.text === 'demos') {
          const comment =
            typeof jsDocTag.comment === 'string'
              ? jsDocTag.comment
              : ts.getTextOfJSDocComment(jsDocTag.comment);
          if (comment) {
            demos = comment;
          }
        }
      }
    }

    // Build imports
    const imports = projects.map((p) => `import { ${interfaceName} } from '@mui/${p}';`);

    // Build properties
    const properties: Record<string, any> = {};
    const propDescriptions: Record<string, { description: string }> = {};

    for (const prop of interfaceType.getProperties()) {
      const jsDoc = extractJsDoc(prop, checker);
      if (jsDoc.ignore) {
        continue;
      }

      const typeStr = resolvePropertyType(prop, checker);

      const propInfo: Record<string, any> = {
        type: { description: escapeHtml(typeStr) },
      };

      if (jsDoc.defaultValue !== undefined) {
        propInfo.default = jsDoc.defaultValue;
      }
      // Check required from declarations (merged symbol flags can be wrong)
      if (!isOptionalProperty(prop)) {
        propInfo.required = true;
      }

      // Detect plan level from projects
      const propDeclarations = prop.getDeclarations();
      if (propDeclarations) {
        const isPro = propDeclarations.some((d) => d.getSourceFile().fileName.includes('-pro'));
        const isPremium = propDeclarations.some((d) =>
          d.getSourceFile().fileName.includes('-premium'),
        );
        if (isPremium) {
          propInfo.isPremiumPlan = true;
        } else if (isPro) {
          propInfo.isProPlan = true;
        }
      }

      properties[prop.name] = propInfo;
      propDescriptions[prop.name] = { description: jsDoc.description };
    }

    // Sort: required first, then alphabetically
    const sortedProps: Record<string, any> = {};
    const sortedDescs: Record<string, { description: string }> = {};
    const propNames = Object.keys(properties).sort((a, b) => {
      const aReq = properties[a].required ? 0 : 1;
      const bReq = properties[b].required ? 0 : 1;
      if (aReq !== bReq) {
        return aReq - bReq;
      }
      return a.localeCompare(b);
    });
    for (const name of propNames) {
      sortedProps[name] = properties[name];
      sortedDescs[name] = propDescriptions[name];
    }

    // Content JSON
    files.push({
      path: `docs/pages/x/api/${entry.folder}/${slug}.json`,
      content: JSON.stringify({
        name: interfaceName,
        imports,
        ...(demos ? { demos } : {}),
        properties: sortedProps,
      }),
    });

    // Translation JSON
    files.push({
      path: `docs/translations/api-docs/${entry.folder}/${slug}/${slug}.json`,
      content: JSON.stringify({
        interfaceDescription: description,
        propertiesDescriptions: sortedDescs,
      }),
    });

    // JS page wrapper
    const isDataGrid = entry.folder === 'data-grid';
    const layoutImport = isDataGrid
      ? "import layoutConfig from 'docsx/src/modules/utils/dataGridLayoutConfig';\n"
      : '';
    const layoutProp = isDataGrid ? '{...layoutConfig} ' : '';
    const jsContent = `import * as React from 'react';
import InterfaceApiPage from 'docsx/src/modules/components/InterfaceApiPage';
${layoutImport}import mapApiPageTranslations from 'docs/src/modules/utils/mapApiPageTranslations';
import jsonPageContent from './${slug}.json';

export default function Page(props) {
  const { descriptions } = props;
  return <InterfaceApiPage ${layoutProp}descriptions={descriptions} pageContent={jsonPageContent} />;
}

export async function getStaticProps() {
  const req = require.context(
    'docsx/translations/api-docs/${entry.folder}/${slug}',
    false,
    /\\.\\/${slug}.*\\.json$/,
  );
  const descriptions = mapApiPageTranslations(req);
  return { props: { descriptions } };
}
`;
    files.push({
      path: `docs/pages/x/api/${entry.folder}/${slug}.js`,
      content: jsContent,
    });
  }

  return { files, documentedInterfaces };
}

/**
 * Build JSON-only interface docs (no dedicated page, embedded in demos).
 */
export function buildJsonOnlyInterfaces(
  group: { folder: string; packages: string[]; names: string[] },
  checker: ts.TypeChecker,
  program: ts.Program,
): FileWrite[] {
  const files: FileWrite[] = [];

  const mostCompletePkg = group.packages[group.packages.length - 1];
  const entryPath = path.resolve(CWD, `packages/${mostCompletePkg}/src/index.ts`);
  const sf = program.getSourceFile(entryPath);
  if (!sf) {
    return files;
  }
  const modSymbol = checker.getSymbolAtLocation(sf);
  if (!modSymbol) {
    return files;
  }
  const exports = checker.getExportsOfModule(modSymbol);

  for (const interfaceName of group.names) {
    const found = exports.find((exportSymbol) => exportSymbol.name === interfaceName);
    if (!found) {
      continue;
    }

    let resolved = found;
    if (resolved.flags & ts.SymbolFlags.Alias) {
      resolved = checker.getAliasedSymbol(resolved);
    }

    const interfaceType = checker.getDeclaredTypeOfSymbol(resolved);
    const description = ts.displayPartsToString(resolved.getDocumentationComment(checker));

    const properties: { name: string; description: string; type: string }[] = [];
    for (const prop of interfaceType.getProperties()) {
      const jsDoc = extractJsDoc(prop, checker);
      if (jsDoc.ignore) {
        continue;
      }

      properties.push({
        name: prop.name,
        description: jsDoc.description,
        type: resolvePropertyType(prop, checker),
      });
    }
    properties.sort((a, b) => a.name.localeCompare(b.name));

    const slug = kebabCase(interfaceName);
    files.push({
      path: `docs/pages/x/api/${group.folder}/${slug}.json`,
      content: JSON.stringify({ name: interfaceName, description, properties }),
    });

    debug(`    ${interfaceName} (json-only)`);
  }

  return files;
}

/**
 * Replace [[InterfaceName]] references in translation files with links.
 */
export function linkifyTranslations(
  directory: string,
  documentedInterfaces: Map<string, string[]>,
  folder: string,
): void {
  if (!fs.existsSync(directory)) {
    return;
  }

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      linkifyTranslations(fullPath, documentedInterfaces, folder);
    } else if (entry.name.endsWith('.json')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const modified = content.replace(/\[\[([^\]]+)\]\]/g, (_match, name) => {
        if (documentedInterfaces.has(name)) {
          const slug = kebabCase(name);
          return `<a href="/x/api/${folder}/${slug}/">${name}</a>`;
        }
        return name;
      });
      if (modified !== content) {
        fs.writeFileSync(fullPath, modified, 'utf8');
      }
    }
  }
}

/**
 * Check if a property is optional by looking at its declarations.
 * The merged symbol flag can be wrong for properties across discriminated union members.
 */
function isOptionalProperty(prop: ts.Symbol): boolean {
  const declarations = prop.getDeclarations();
  if (!declarations || declarations.length === 0) {
    return !!(prop.flags & ts.SymbolFlags.Optional);
  }
  // If ALL declarations have a question token, it's optional.
  // If ANY declaration is required, the property is required.
  return declarations.every((d) => ts.isPropertySignature(d) && !!d.questionToken);
}

// Types whose internals should NOT be expanded (keep the alias name)
const OPAQUE_TYPE_NAMES = new Set([
  // React
  'ReactNode',
  'ReactElement',
  'ComponentType',
  'ComponentClass',
  'FunctionComponent',
  'FC',
  'JSXElementConstructor',
  'Component',
  'RefObject',
  'MutableRefObject',
  'CSSProperties',
  // MUI
  'SxProps',
  'Theme',
  // DOM
  'HTMLElement',
  'SVGElement',
  'MouseEvent',
  'Event',
  // Collections
  'Array',
  'ReadonlyArray',
  'Map',
  'Set',
  'Promise',
]);

/**
 * Recursively expand a TypeScript type to a human-readable string.
 * Resolves type aliases to their definitions but stops at React/DOM/opaque types.
 */
function expandTypeDeep(type: ts.Type, checkerRef: ts.TypeChecker, depth: number = 0): string {
  if (depth > MAX_EXPAND_DEPTH) {
    return typeToStr(checkerRef, type);
  }

  // Strip undefined/null from unions
  if (type.isUnion()) {
    const members = type.types.filter(
      (t) => !(t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)),
    );
    if (members.length === 0) {
      return 'never';
    }
    // Detect boolean (true | false union)
    if (members.length === 2 && members.every((m) => !!(m.flags & ts.TypeFlags.BooleanLiteral))) {
      return 'boolean';
    }
    if (members.length === 1) {
      return expandTypeDeep(members[0], checkerRef, depth);
    }
    // Deduplicate expanded members
    const expanded = members.map((m) => expandTypeDeep(m, checkerRef, depth));
    return [...new Set(expanded)].sort().join(' | ');
  }

  // Primitives & literals
  if (type.flags & ts.TypeFlags.String) {
    return 'string';
  }
  if (type.flags & ts.TypeFlags.Number) {
    return 'number';
  }
  if (type.flags & (ts.TypeFlags.Boolean | ts.TypeFlags.BooleanLiteral)) {
    return 'boolean';
  }
  if (type.flags & ts.TypeFlags.Null) {
    return 'null';
  }
  if (type.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) {
    return 'any';
  }
  if (type.isStringLiteral()) {
    return `'${type.value}'`;
  }
  if (type.isNumberLiteral()) {
    return String(type.value);
  }

  // Check symbol name — stop expansion for opaque types
  const symbol = type.getSymbol() || type.aliasSymbol;
  const symbolName = symbol?.name || '';
  if (OPAQUE_TYPE_NAMES.has(symbolName)) {
    return typeToStr(checkerRef, type);
  }

  // Functions — expand signature
  const callSigs = type.getCallSignatures();
  if (callSigs.length > 0) {
    const sig = callSigs[0];
    const params = sig.parameters.map((p) => {
      const pt = checkerRef.getTypeOfSymbol(p);
      // Detect optional parameters from their declaration
      const isOptional = p.declarations?.some((d) => ts.isParameter(d) && !!d.questionToken);
      const opt = isOptional ? '?' : '';
      return `${p.name}${opt}: ${expandTypeDeep(pt, checkerRef, depth + 1)}`;
    });
    const ret = checkerRef.getReturnTypeOfSignature(sig);
    return `(${params.join(', ')}) => ${expandTypeDeep(ret, checkerRef, depth + 1)}`;
  }

  // Arrays
  if (checkerRef.isArrayType(type)) {
    const typeArgs = (type as ts.TypeReference).typeArguments;
    if (typeArgs && typeArgs.length > 0) {
      return `${expandTypeDeep(typeArgs[0], checkerRef, depth + 1)}[]`;
    }
    return 'any[]';
  }
  const ref = type as ts.TypeReference;
  if (ref.target?.getSymbol()?.name === 'ReadonlyArray') {
    const typeArgs = ref.typeArguments;
    if (typeArgs && typeArgs.length > 0) {
      return `readonly ${expandTypeDeep(typeArgs[0], checkerRef, depth + 1)}[]`;
    }
  }

  // Object types with a manageable number of properties — expand
  if (type.flags & ts.TypeFlags.Object) {
    const props = type.getProperties();
    if (props.length > 0 && props.length <= MAX_EXPAND_PROPERTIES && callSigs.length === 0) {
      // Skip if it looks like a React/DOM/class type
      if (symbolName && /^[A-Z]/.test(symbolName) && !symbolName.includes('__')) {
        const fileName = symbol?.declarations?.[0]?.getSourceFile().fileName || '';
        if (fileName.includes('node_modules') && !fileName.includes('@mui/x-')) {
          return typeToStr(checkerRef, type);
        }
      }
      const parts = props.map((p) => {
        const pt = checkerRef.getTypeOfSymbol(p);
        const opt = p.flags & ts.SymbolFlags.Optional ? '?' : '';
        return `${p.name}${opt}: ${expandTypeDeep(pt, checkerRef, depth + 1)}`;
      });
      return `{ ${parts.join(', ')} }`;
    }
  }

  return typeToStr(checkerRef, type);
}

export function escapeHtml(s: string): string {
  return s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Resolve a property's type to a fully expanded human-readable string.
 * Recursively expands type aliases while keeping React/DOM/opaque types as-is.
 */
function resolvePropertyType(prop: ts.Symbol, checker: ts.TypeChecker): string {
  let propType = checker.getTypeOfSymbol(prop);

  // Check if the raw type string contains indexed access types (Partial<X>["prop"]).
  // If so, resolve via base constraint first, since expandTypeDeep can't handle these.
  const rawStr = typeToStr(checker, propType);
  if (rawStr.includes('["') || rawStr.includes("['")) {
    const baseConstraint = checker.getBaseConstraintOfType(propType);
    if (baseConstraint) {
      propType = baseConstraint;
    }
  }

  const expanded = expandTypeDeep(propType, checker);

  // If expansion produced an unreasonable result, fall back to source declaration text
  if (
    expanded.includes('SystemCssProperties') ||
    expanded.includes('CSSPseudoSelector') ||
    expanded.includes('CSSSelectorObject') ||
    expanded.includes(' & ') ||
    expanded.length > MAX_EXPANDED_LENGTH
  ) {
    const declarations = prop.getDeclarations() || [];
    for (const decl of declarations) {
      if (ts.isPropertySignature(decl) && decl.type) {
        return decl.type.getText();
      }
    }
  }

  return expanded;
}
