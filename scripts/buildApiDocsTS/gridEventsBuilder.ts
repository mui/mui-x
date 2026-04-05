/**
 * Grid events documentation builder.
 */
import * as ts from 'typescript';
import * as path from 'path';
import { CWD, debug } from './config';
import { extractJsDoc } from './jsDocUtils';
import type { FileWrite } from './types';

export function buildGridEventsDocumentation(
  checker: ts.TypeChecker,
  program: ts.Program,
): FileWrite[] {
  const files: FileWrite[] = [];
  const gridProjects = ['x-data-grid', 'x-data-grid-pro', 'x-data-grid-premium'];

  const events: Record<string, any> = {};

  for (const pkg of gridProjects) {
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
    const eventLookup = exports.find((exportSymbol) => exportSymbol.name === 'GridEventLookup');
    if (!eventLookup) {
      continue;
    }

    let resolved = eventLookup;
    // eslint-disable-next-line no-bitwise
    if (resolved.flags & ts.SymbolFlags.Alias) {
      resolved = checker.getAliasedSymbol(resolved);
    }

    const eventType = checker.getDeclaredTypeOfSymbol(resolved);
    for (const prop of eventType.getProperties()) {
      const jsDoc = extractJsDoc(prop, checker);
      if (jsDoc.ignore) {
        continue;
      }

      if (events[prop.name]) {
        events[prop.name].projects.push(pkg);
        continue;
      }

      const propType = checker.getTypeOfSymbol(prop);
      const members = propType.getProperties();

      let paramsStr = '';
      let eventStr = 'MuiEvent<{}>';

      for (const member of members) {
        if (member.name === 'params') {
          const memberType = checker.getTypeOfSymbol(member);
          paramsStr = checker.typeToString(memberType, undefined, ts.TypeFormatFlags.NoTruncation);
        } else if (member.name === 'event') {
          const memberType = checker.getTypeOfSymbol(member);
          const evtStr = checker.typeToString(
            memberType,
            undefined,
            ts.TypeFormatFlags.NoTruncation,
          );
          eventStr = `MuiEvent<${evtStr}>`;
        }
      }

      events[prop.name] = {
        projects: [pkg],
        name: prop.name,
        description: jsDoc.description,
        params: paramsStr,
        event: eventStr,
      };
    }
  }

  // Match events to component props
  const premiumEntry = path.resolve(CWD, 'packages/x-data-grid-premium/src/index.ts');
  const sf = program.getSourceFile(premiumEntry);
  if (sf) {
    const modSymbol = checker.getSymbolAtLocation(sf);
    if (modSymbol) {
      const exports = checker.getExportsOfModule(modSymbol);
      const dgProps = exports.find((exportSymbol) => exportSymbol.name === 'DataGridPremiumProps');
      if (dgProps) {
        let resolved = dgProps;
        // eslint-disable-next-line no-bitwise
        if (resolved.flags & ts.SymbolFlags.Alias) {
          resolved = checker.getAliasedSymbol(resolved);
        }
        const propsType = checker.getDeclaredTypeOfSymbol(resolved);
        for (const prop of propsType.getProperties()) {
          const propType = checker.getTypeOfSymbol(prop);
          const typeStr = checker.typeToString(
            propType,
            undefined,
            ts.TypeFormatFlags.NoTruncation,
          );
          // Check for GridEventListener type
          const eventNameMatch = typeStr.match(/GridEventListener<'(\w+)'>/);
          if (eventNameMatch && events[eventNameMatch[1]]) {
            events[eventNameMatch[1]].componentProp = prop.name;
          }
        }
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
