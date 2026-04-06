/* eslint-disable no-bitwise */
/**
 * Interface documentation builder.
 */
import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'node:fs';
import { kebabCase } from 'es-toolkit/string';
import { CWD, debug } from './config';
import { extractJsDoc } from './jsDocUtils';
import type { FileWrite } from './types';

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
        if (!interfaceSymbol) {
          let resolved = found;
          if (resolved.flags & ts.SymbolFlags.Alias) {
            resolved = checker.getAliasedSymbol(resolved);
          }
          interfaceSymbol = resolved;
          interfaceType = checker.getDeclaredTypeOfSymbol(resolved);
        }
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
      if (!(prop.flags & ts.SymbolFlags.Optional)) {
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
    const jsContent = `import * as React from 'react';
import InterfaceApiPage from 'docsx/src/modules/components/InterfaceApiPage';
import layoutConfig from 'docsx/src/modules/utils/dataGridLayoutConfig';
import mapApiPageTranslations from 'docs/src/modules/utils/mapApiPageTranslations';
import jsonPageContent from './${slug}.json';

export default function Page(props) {
  const { descriptions } = props;
  return <InterfaceApiPage ${entry.folder === 'data-grid' ? '{...layoutConfig} ' : ''}descriptions={descriptions} pageContent={jsonPageContent} />;
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

    const properties: Record<string, any> = {};
    for (const prop of interfaceType.getProperties()) {
      const jsDoc = extractJsDoc(prop, checker);
      if (jsDoc.ignore) {
        continue;
      }

      const typeStr = resolvePropertyType(prop, checker);

      properties[prop.name] = {
        type: { description: escapeHtml(typeStr) },
      };
    }

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

export function escapeHtml(s: string): string {
  return s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Resolve a property's type to a clean string for interface docs.
 * Uses getBaseConstraintOfType to resolve indexed access types and generics,
 * and strips undefined/null from optional props.
 */
function resolvePropertyType(prop: ts.Symbol, checker: ts.TypeChecker): string {
  let propType = checker.getTypeOfSymbol(prop);

  // Resolve indexed access types / generics (e.g. Partial<AxisProps>["className"] → string)
  const baseConstraint = checker.getBaseConstraintOfType(propType);
  if (baseConstraint) {
    propType = baseConstraint;
  }

  // Strip undefined/null for optional properties
  if (prop.flags & ts.SymbolFlags.Optional && propType.isUnion()) {
    const filtered = propType.types.filter(
      (t) => !(t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)),
    );
    if (filtered.length === 1) {
      propType = filtered[0];
    } else if (filtered.length > 1) {
      propType = (
        checker as unknown as { getUnionType(types: ts.Type[]): ts.Type }
      ).getUnionType(filtered);
    }
  }

  return checker.typeToString(propType, undefined, ts.TypeFormatFlags.NoTruncation);
}
