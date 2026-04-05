/* eslint-disable no-bitwise */
/**
 * Interface documentation builder.
 */
import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'node:fs';
import { kebabCase } from 'es-toolkit/string';
import { CWD, INTERFACES_TO_DOCUMENT, DATAGRID_API_INTERFACES } from './config';
import { extractJsDoc } from './jsDocUtils';
import type { FileWrite } from './types';

export function buildInterfaceDocumentation(checker: ts.TypeChecker, program: ts.Program): FileWrite[] {
  const files: FileWrite[] = [];
  const documentedInterfaces = new Map<string, string[]>();

  for (const entry of INTERFACES_TO_DOCUMENT) {
    for (const interfaceName of entry.documentedInterfaces) {
      // Find the interface in one of the packages
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

        const propType = checker.getTypeOfSymbol(prop);
        const typeStr = checker.typeToString(propType, undefined, ts.TypeFormatFlags.NoTruncation);

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

      // Generate files
      const content = {
        name: interfaceName,
        imports,
        ...(demos ? { demos } : {}),
        properties: sortedProps,
      };
      files.push({
        path: `docs/pages/x/api/${entry.folder}/${slug}.json`,
        content: JSON.stringify(content),
      });

      // Translation
      const translation = {
        interfaceDescription: description,
        propertiesDescriptions: sortedDescs,
      };
      files.push({
        path: `docs/translations/api-docs/${entry.folder}/${slug}/${slug}.json`,
        content: JSON.stringify(translation),
      });

      // JS page
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
  }

  // Data grid API interfaces (embedded in demo pages)
  for (const interfaceName of DATAGRID_API_INTERFACES) {
    const entryPath = path.resolve(CWD, 'packages/x-data-grid-premium/src/index.ts');
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

      const propType = checker.getTypeOfSymbol(prop);
      const typeStr = checker.typeToString(propType, undefined, ts.TypeFormatFlags.NoTruncation);

      properties[prop.name] = {
        type: { description: escapeHtml(typeStr) },
      };
    }

    const slug = kebabCase(interfaceName);
    files.push({
      path: `docs/pages/x/api/data-grid/${slug}.json`,
      content: JSON.stringify({ name: interfaceName, description, properties }),
    });

    // eslint-disable-next-line no-console
    console.log(`  Built JSON file for ${interfaceName}`);
  }

  // Linkify translations
  for (const entry of INTERFACES_TO_DOCUMENT) {
    const translationDir = path.resolve(CWD, `docs/translations/api-docs/${entry.folder}`);
    linkifyTranslations(translationDir, documentedInterfaces, entry.folder);
  }

  return files;
}

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
      const modified = content.replace(/\[\[([^\]]+)\]\]/g, (match, name) => {
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
