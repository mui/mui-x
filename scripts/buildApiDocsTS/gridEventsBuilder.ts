/**
 * Grid events documentation builder.
 */
import * as ts from 'typescript';
import * as path from 'path';
import { kebabCase } from 'es-toolkit/string';
import { CWD, debug, getInterfacesToDocument } from './config';
import { extractJsDoc } from './jsDocUtils';
import { escapeHtml } from './interfaceBuilder';
import type { FileWrite } from './types';

// Build a lookup of documented interface names → their URL folder
const interfaceLookup = new Map<string, string>();
for (const entry of getInterfacesToDocument()) {
  for (const name of entry.documentedInterfaces) {
    interfaceLookup.set(name, entry.folder);
  }
}

/** Convert [[InterfaceName]] to an <a> link if the interface has a docs page, otherwise bare name */
function linkifyInterface(name: string): string {
  const folder = interfaceLookup.get(name);
  if (folder) {
    const slug = kebabCase(name);
    return `<a href="/x/api/${folder}/${slug}/">${name}</a>`;
  }
  return name;
}

/** Normalize source type text: re-indent to 2 spaces and remove semicolons */
function normalizeTypeText(text: string): string {
  const lines = text.split('\n');
  if (lines.length === 1) {
    return text.trim();
  }
  return lines
    .map((line) => {
      const trimmed = line.trimStart();
      if (trimmed === '{' || trimmed === '}') {
        return trimmed;
      }
      const stripped = trimmed.replace(/;$/, '');
      return trimmed.length === line.length ? stripped : `  ${stripped}`;
    })
    .join('\n');
}

export function buildGridEventsDocumentation(
  checker: ts.TypeChecker,
  program: ts.Program,
): FileWrite[] {
  const files: FileWrite[] = [];
  const gridProjects = ['x-data-grid', 'x-data-grid-pro', 'x-data-grid-premium'] as const;

  // Collect GridEventLookup properties from ALL packages, since module augmentations
  // make some events visible only from specific entry points.
  const allEventProps = new Map<string, { prop: ts.Symbol; visibleIn: Set<string> }>();

  for (const pkg of gridProjects) {
    const entryPath = path.resolve(CWD, `packages/${pkg}/src/index.ts`);
    const sf = program.getSourceFile(entryPath);
    if (!sf) {
      continue;
    }
    const mod = checker.getSymbolAtLocation(sf);
    if (!mod) {
      continue;
    }
    const exports = checker.getExportsOfModule(mod);
    const lookupSym = exports.find((s) => s.name === 'GridEventLookup');
    if (!lookupSym) {
      continue;
    }
    let resolved = lookupSym;
    // eslint-disable-next-line no-bitwise
    if (resolved.flags & ts.SymbolFlags.Alias) {
      resolved = checker.getAliasedSymbol(resolved);
    }
    const lookupType = checker.getDeclaredTypeOfSymbol(resolved);
    for (const prop of lookupType.getProperties()) {
      const existing = allEventProps.get(prop.name);
      if (existing) {
        existing.visibleIn.add(pkg);
      } else {
        allEventProps.set(prop.name, { prop, visibleIn: new Set([pkg]) });
      }
    }
  }

  const events: Record<string, any> = {};

  for (const [, { prop, visibleIn }] of allEventProps) {
    const jsDoc = extractJsDoc(prop, checker);
    if (jsDoc.ignore) {
      continue;
    }

    // Determine which packages own this event by checking where it's declared.
    // Module augmentations make events visible in all packages, but ownership
    // is determined by the declaring package.
    const declarations = prop.getDeclarations() || [];
    const declaringPackages = new Set<string>();
    for (const decl of declarations) {
      const fileName = decl.getSourceFile().fileName;
      for (const pkg of gridProjects) {
        if (fileName.includes(`/${pkg}/`)) {
          declaringPackages.add(pkg);
        }
      }
    }
    // If declared in a specific package, only include that package and its re-exporters
    // e.g. declared in premium → ['x-data-grid-premium']
    // e.g. declared in pro → ['x-data-grid-pro', 'x-data-grid-premium']
    // e.g. declared in community → all three
    let projects: string[];
    if (declaringPackages.size > 0) {
      const lowestIdx = Math.min(
        ...Array.from(declaringPackages).map((pkg) => gridProjects.indexOf(pkg as any)),
      );
      projects = gridProjects.slice(lowestIdx);
    } else {
      projects = gridProjects.filter((pkg) => visibleIn.has(pkg));
    }

    const propType = checker.getTypeOfSymbol(prop);
    const members = propType.getProperties();

    let paramsStr = '';
    let eventStr = 'MuiEvent<{}>';

    for (const member of members) {
      const memberDecls = member.getDeclarations() || [];
      const srcDecl = memberDecls.find((d) => ts.isPropertySignature(d) && d.type) as
        | ts.PropertySignature
        | undefined;

      if (member.name === 'params') {
        paramsStr = srcDecl?.type
          ? normalizeTypeText(srcDecl.type.getText())
          : checker.typeToString(
              checker.getTypeOfSymbol(member),
              undefined,
              ts.TypeFormatFlags.NoTruncation,
            );
      } else if (member.name === 'event') {
        const evtText = srcDecl?.type
          ? normalizeTypeText(srcDecl.type.getText())
          : checker.typeToString(
              checker.getTypeOfSymbol(member),
              undefined,
              ts.TypeFormatFlags.NoTruncation,
            );
        eventStr = `MuiEvent<${evtText}>`;
      }
    }

    const description = escapeHtml(jsDoc.description)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, ' ')
      .replace(/\[\[(\w+)\]\]/g, (_match, name) => linkifyInterface(name))
      .replace(/'/g, '&#39;');

    events[prop.name] = {
      projects,
      name: prop.name,
      description,
      params: paramsStr,
      event: eventStr,
    };
  }

  // Match events to component props by reading GridEventListener<'eventName'>
  // from the source declaration text of DataGridPremiumProps
  const premiumEntry = path.resolve(CWD, 'packages/x-data-grid-premium/src/index.ts');
  const premiumSf = program.getSourceFile(premiumEntry);
  const premiumMod = premiumSf ? checker.getSymbolAtLocation(premiumSf) : undefined;
  const premiumExports = premiumMod ? checker.getExportsOfModule(premiumMod) : [];
  const dgProps = premiumExports.find((s) => s.name === 'DataGridPremiumProps');
  if (dgProps) {
    const resolvedProps =
      // eslint-disable-next-line no-bitwise
      dgProps.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(dgProps) : dgProps;
    const propsType = checker.getDeclaredTypeOfSymbol(resolvedProps);
    for (const prop of propsType.getProperties()) {
      const propDecls = prop.getDeclarations() || [];
      const srcType = propDecls
        .filter((d): d is ts.PropertySignature => ts.isPropertySignature(d) && !!d.type)
        .map((d) => d.type!.getText())
        .join('');
      const eventNameMatch = srcType.match(/GridEventListener<'(\w+)'>/);
      // stateChange is excluded to match the old system's behavior
      if (eventNameMatch && eventNameMatch[1] !== 'stateChange' && events[eventNameMatch[1]]) {
        events[eventNameMatch[1]].componentProp = prop.name;
      }
    }
  }

  const sorted = Object.values(events).sort((a: any, b: any) => a.name.localeCompare(b.name));
  files.push({
    path: 'docs/data/data-grid/events/events.json',
    content: JSON.stringify(sorted),
  });

  debug('  Built events file');
  return files;
}
