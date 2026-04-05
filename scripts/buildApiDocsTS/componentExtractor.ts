/* eslint-disable no-bitwise */
/**
 * Component API extraction: extracts props, slots, classes, and metadata from components.
 */
import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'node:fs';
import { CWD, UNRESOLVED_OBJECT_PROPS, COMMON_INHERITED_PROPS } from './config';
import { extractJsDoc, isMuiXProp } from './jsDocUtils';
import { formatPropType, extractFunctionSignature } from './typeFormatting';
import type {
  ComponentApi,
  SlotInfo,
  ClassInfo,
  TranslationPropDesc,
  TranslationClassDesc,
  DiscoveredComponent,
  DemoInfo,
  DemoMap,
  ConformanceInfo,
  PropInfo,
} from './types';

// ---------------------------------------------------------------------------
// Component API extraction (main function)
// ---------------------------------------------------------------------------

export function extractComponentApi(
  comp: DiscoveredComponent,
  checker: ts.TypeChecker,
  program: ts.Program,
  demos: DemoMap,
): ComponentApi | null {
  const sourceFile = program.getSourceFile(comp.filePath);
  if (!sourceFile) {
    return null;
  }

  // Skip components marked with @ignore on their definition.
  // We look for "@ignore" in the JSDoc comment directly preceding the component definition
  // (const ComponentName, function ComponentName, or export ... ComponentName).
  if (hasIgnoreOnDefinition(sourceFile.getFullText(), comp.name)) {
    return null;
  }

  // Find the component's props type
  const propsType = findComponentPropsType(comp.name, sourceFile, checker);
  if (!propsType) {
    console.warn(`  Could not find props type for ${comp.name}`);
    return null;
  }

  // Get component description from JSDoc
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  let componentDescription = '';
  if (moduleSymbol) {
    const exports = checker.getExportsOfModule(moduleSymbol);
    const compSymbol = exports.find(
      (exportSymbol) => exportSymbol.name === comp.name || exportSymbol.name === `Unstable_${comp.name}`,
    );
    if (compSymbol) {
      componentDescription = ts.displayPartsToString(compSymbol.getDocumentationComment(checker));
    }
  }

  // Extract props
  const allProps = propsType.getProperties();
  const props: Record<string, PropInfo> = {};
  const propDescriptions: Record<string, TranslationPropDesc> = {};

  // Get the set of prop names from the generated PropTypes block in the source file.
  const propTypesNames = extractPropTypesNames(comp.filePath);

  for (const prop of allProps) {
    // Only include props that are in the PropTypes block
    if (propTypesNames.size > 0 && !propTypesNames.has(prop.name)) {
      continue;
    }
    // Fallback: if no PropTypes block found, use MUI X prop check
    if (propTypesNames.size === 0 && !isMuiXProp(prop)) {
      continue;
    }
    // Exclude commonly inherited props unless they have JSDoc directly on the component's type
    if (COMMON_INHERITED_PROPS.has(prop.name)) {
      // Check if the prop has a JSDoc description on the component's own type (not inherited)
      const jsDocCheck = extractJsDoc(prop, checker);
      if (!jsDocCheck.description) {
        continue;
      }
      // Check if the prop's description is from a base type (inherited)
      const declarations = prop.getDeclarations() || [];
      const declaredInComponent = declarations.some((d) => {
        const fileName = d.getSourceFile().fileName;
        return fileName === comp.filePath || fileName.includes(`/${comp.name}`);
      });
      if (!declaredInComponent) {
        continue;
      }
    }

    const jsDoc = extractJsDoc(prop, checker);
    if (jsDoc.ignore) {
      continue;
    }

    const propType = checker.getTypeOfSymbol(prop);

    let typeInfo;
    if (UNRESOLVED_OBJECT_PROPS.has(prop.name)) {
      // These are marked as 'object' or 'arrayOf object' in PropTypes (not expanded)
      // Check if it's an array type and preserve that
      const rawPropType = checker.getTypeOfSymbol(prop);
      const strippedPropType = stripOptionalType(rawPropType, checker);
      const isArr =
        checker.isArrayType(strippedPropType) ||
        (strippedPropType as any).target?.getSymbol()?.name === 'Array' ||
        (strippedPropType as any).target?.getSymbol()?.name === 'ReadonlyArray';
      if (isArr) {
        typeInfo = { name: 'arrayOf', description: 'Array&lt;object&gt;' };
      } else {
        typeInfo = { name: 'object' };
      }
    } else if (prop.name === 'children') {
      typeInfo = { name: 'node' };
    } else {
      typeInfo = formatPropType(propType, checker);
    }

    const isRequired = !(prop.flags & ts.SymbolFlags.Optional);
    const isFunc = typeInfo.name === 'func';

    const propInfo: PropInfo = { type: typeInfo };

    if (jsDoc.defaultValue !== undefined) {
      propInfo.default = jsDoc.defaultValue;
    }
    if (isRequired) {
      propInfo.required = true;
    }
    if (jsDoc.deprecated !== undefined) {
      propInfo.deprecated = true;
      if (jsDoc.deprecated) {
        propInfo.deprecationInfo = htmlEncode(jsDoc.deprecated);
      }
    }

    // Function signature
    if (isFunc) {
      const sig = extractFunctionSignature(propType, checker, jsDoc);
      if (sig) {
        propInfo.signature = sig;
      }
    }

    // See more link
    if (jsDoc.seeMoreLink) {
      propInfo.seeMoreLink = jsDoc.seeMoreLink;
    }

    // Additional info
    if (prop.name === 'classes') {
      propInfo.additionalInfo = { cssApi: true };
    } else if (prop.name === 'slots') {
      propInfo.additionalInfo = { slotsApi: true };
    } else if (prop.name === 'sx') {
      propInfo.additionalInfo = { sx: true };
    }

    props[prop.name] = propInfo;

    // Build translation description
    const desc: TranslationPropDesc = {
      description: htmlEncode(jsDoc.description),
    };
    if (jsDoc.seeMoreLink) {
      desc.seeMoreText = 'See {{link}} for more details.';
    }
    if (isFunc && jsDoc.params.size > 0) {
      const typeDescriptions: Record<string, { name: string; description: string }> = {};
      for (const [paramName, paramDesc] of jsDoc.params) {
        typeDescriptions[paramName] = {
          name: paramName,
          description: htmlEncode(paramDesc),
        };
      }
      desc.typeDescriptions = typeDescriptions;
    }
    propDescriptions[prop.name] = desc;
  }

  // Sort props: required first, then alphabetically
  const sortedProps: Record<string, PropInfo> = {};
  const sortedPropDescs: Record<string, TranslationPropDesc> = {};
  const propNames = Object.keys(props).sort((a, b) => {
    const aReq = props[a].required ? 0 : 1;
    const bReq = props[b].required ? 0 : 1;
    if (aReq !== bReq) {
      return aReq - bReq;
    }
    return a.localeCompare(b);
  });
  for (const name of propNames) {
    sortedProps[name] = props[name];
    sortedPropDescs[name] = propDescriptions[name];
  }

  // Extract slots
  const slots = extractSlots(propsType, checker, comp.name, comp.section);

  // Extract classes
  const classes = extractClasses(comp.filePath, comp.name, checker, program);

  // Link slots to classes
  for (const slot of slots) {
    const matchingClass = classes.find((c) => c.key === slot.name);
    if (matchingClass) {
      slot.class = matchingClass.className;
    }
  }

  // Build slot and class descriptions for translations
  const slotDescriptions: Record<string, string> = {};
  for (const slot of slots) {
    slotDescriptions[slot.name] = slot.description;
  }

  const classDescriptions: Record<string, TranslationClassDesc> = {};
  for (const cls of classes) {
    const desc = parseClassDescription(cls.description);
    classDescriptions[cls.key] = desc;
  }

  // Metadata
  const conformance = parseConformanceTest(comp.filePath);
  const muiName = extractMuiName(comp.filePath, comp.name);

  // Compute imports
  const subdir = getSubdirectoryImport(comp.filePath, comp.packageDir);
  const imports = [
    `import { ${comp.name} } from '${subdir}';`,
    ...comp.reExportPackages.map((pkg) => `import { ${comp.name} } from '${pkg}';`),
  ];

  // Handle tree-view special case: RichTreeView not re-exported to pro
  if (comp.name === 'RichTreeView' && comp.packageName === 'x-tree-view') {
    const proIdx = imports.findIndex((i) => i.includes('x-tree-view-pro'));
    if (proIdx >= 0) {
      imports.splice(proIdx, 1);
    }
  }

  // Demos
  const compDemos = demos.get(comp.name) || getDefaultDemos(comp);
  const demosHtml = formatDemosHtml(compDemos, comp);

  const result: ComponentApi = {
    name: comp.name,
    filename: `/packages/${path.relative(CWD, comp.filePath).replace(/\\/g, '/')}`.replace(
      /^\/packages\/packages\//,
      '/packages/',
    ),
    packageName: comp.packageName,
    section: comp.section,
    props: sortedProps,
    slots,
    classes,
    imports,
    muiName,
    demos: demosHtml,
    inheritance: null,
    cssComponent: false,
    componentDescription,
    propDescriptions: sortedPropDescs,
    slotDescriptions,
    classDescriptions,
  };

  // Add conformance test info if available
  if (conformance.forwardsRefTo !== undefined) {
    result.forwardsRefTo = conformance.forwardsRefTo;
  }
  if (conformance.spread !== undefined) {
    result.spread = conformance.spread;
  }
  if (conformance.themeDefaultProps !== undefined) {
    result.themeDefaultProps = conformance.themeDefaultProps;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Find component props type
// ---------------------------------------------------------------------------

export function findComponentPropsType(
  componentName: string,
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
): ts.Type | null {
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  if (!moduleSymbol) {
    return null;
  }

  const exports = checker.getExportsOfModule(moduleSymbol);
  const compSymbol = exports.find(
    (exportSymbol) => exportSymbol.name === componentName || exportSymbol.name === `Unstable_${componentName}`,
  );
  if (!compSymbol) {
    return null;
  }

  // Follow aliases
  let resolved = compSymbol;
  if (resolved.flags & ts.SymbolFlags.Alias) {
    resolved = checker.getAliasedSymbol(resolved);
  }

  const compType = checker.getTypeOfSymbol(resolved);

  // Get call signatures - the first parameter is the props type
  const callSigs = compType.getCallSignatures();
  if (callSigs.length > 0) {
    const sig = callSigs[0];
    const params = sig.getParameters();
    if (params.length > 0) {
      return checker.getTypeOfSymbol(params[0]);
    }
    // Component with no props parameter — look for ComponentNameProps interface
    const propsName = `${componentName}Props`;
    const propsSym = exports.find((exportSymbol) => exportSymbol.name === propsName);
    if (propsSym) {
      let resolvedProps = propsSym;
      if (resolvedProps.flags & ts.SymbolFlags.Alias) {
        resolvedProps = checker.getAliasedSymbol(resolvedProps);
      }
      return checker.getDeclaredTypeOfSymbol(resolvedProps);
    }
    // No props at all - return the empty object type
    return checker.getTypeOfSymbol(resolved);
  }

  // For ForwardRefExoticComponent, look at the type arguments
  // Try getting properties of the component type that might indicate it has a props type
  // Check if it's a class component
  const constructSigs = compType.getConstructSignatures();
  if (constructSigs.length > 0) {
    const sig = constructSigs[0];
    const params = sig.getParameters();
    if (params.length > 0) {
      return checker.getTypeOfSymbol(params[0]);
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Slot extraction
// ---------------------------------------------------------------------------

export function extractSlots(
  propsType: ts.Type,
  checker: ts.TypeChecker,
  _componentName: string,
  _section: string,
): SlotInfo[] {
  const slotsProp = propsType.getProperty('slots');
  if (!slotsProp) {
    return [];
  }

  const slotsType = checker.getTypeOfSymbol(slotsProp);
  const strippedSlotsType = stripOptionalType(slotsType, checker);

  const slots: SlotInfo[] = [];
  for (const prop of strippedSlotsType.getProperties()) {
    const jsDoc = extractJsDoc(prop, checker);
    if (jsDoc.ignore) {
      continue;
    }

    const slot: SlotInfo = {
      name: prop.name,
      description: jsDoc.description,
    };
    if (jsDoc.defaultValue) {
      slot.default = jsDoc.defaultValue;
    }
    slot.class = null;
    slots.push(slot);
  }

  slots.sort((a, b) => a.name.localeCompare(b.name));
  return slots;
}

export function stripOptionalType(type: ts.Type, checker: ts.TypeChecker): ts.Type {
  if (type.isUnion()) {
    const filtered = type.types.filter(
      (t) => !(t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)),
    );
    if (filtered.length === 1) {
      return filtered[0];
    }
    if (filtered.length > 1) {
      return (checker as unknown as { getUnionType(types: ts.Type[]): ts.Type }).getUnionType(
        filtered,
      );
    }
  }
  return type;
}

// ---------------------------------------------------------------------------
// Class extraction
// ---------------------------------------------------------------------------

export function extractClasses(
  filePath: string,
  componentName: string,
  checker: ts.TypeChecker,
  program: ts.Program,
): ClassInfo[] {
  // Look for the classes file
  const dir = path.dirname(filePath);
  const classesFileName = `${componentName[0].toLowerCase()}${componentName.slice(1)}Classes`;
  const candidates = [
    path.join(dir, `${classesFileName}.ts`),
    path.join(dir, `${classesFileName}.tsx`),
    path.join(dir, `${componentName}Classes.ts`),
    path.join(dir, `${componentName}Classes.tsx`),
  ];

  let classesFile: string | undefined;
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      classesFile = candidate;
      break;
    }
  }
  if (!classesFile) {
    return [];
  }

  const sourceFile = program.getSourceFile(classesFile);
  if (!sourceFile) {
    return [];
  }

  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  if (!moduleSymbol) {
    return [];
  }

  const exports = checker.getExportsOfModule(moduleSymbol);

  // Find the Classes interface
  const classesInterfaceName = `${componentName}Classes`;
  const classesSymbol = exports.find((exportSymbol) => exportSymbol.name === classesInterfaceName);
  if (!classesSymbol) {
    return [];
  }

  const classesType = checker.getDeclaredTypeOfSymbol(classesSymbol);
  const properties = classesType.getProperties();

  const muiName = extractMuiName(filePath, componentName);
  const classes: ClassInfo[] = [];

  const GLOBAL_STATES = new Set([
    'active',
    'checked',
    'completed',
    'disabled',
    'error',
    'expanded',
    'focusVisible',
    'focused',
    'readOnly',
    'required',
    'selected',
  ]);

  for (const prop of properties) {
    const jsDoc = extractJsDoc(prop, checker);
    if (jsDoc.ignore) {
      continue;
    }

    const isGlobal = GLOBAL_STATES.has(prop.name);
    const prefix = isGlobal ? 'Mui' : muiName;
    const className = `${prefix}-${prop.name}`;

    classes.push({
      key: prop.name,
      className,
      description: jsDoc.description,
      isGlobal,
    });
  }

  return classes;
}

// ---------------------------------------------------------------------------
// MuiName extraction from source
// ---------------------------------------------------------------------------

export function extractMuiName(filePath: string, componentName: string): string {
  const content = fs.readFileSync(filePath, 'utf8');
  // Look for name: 'MuiXxx' in styled() or useUtilityClasses
  const match = content.match(/name:\s*'(Mui\w+)'/);
  if (match) {
    return match[1];
  }
  return `Mui${componentName}`;
}

// ---------------------------------------------------------------------------
// Extract prop names from the generated PropTypes block in source files
// ---------------------------------------------------------------------------

export function extractPropTypesNames(filePath: string): Set<string> {
  const content = fs.readFileSync(filePath, 'utf8');

  // Find the PropTypes block: ComponentName.propTypes = { ... }
  const propTypesMatch = content.match(/\.propTypes\s*=\s*\{/);
  if (!propTypesMatch) {
    return new Set();
  }

  const startIdx = propTypesMatch.index! + propTypesMatch[0].length;

  // Extract top-level prop names (at depth 1 brace level)
  const names = new Set<string>();
  let depth = 1;
  let i = startIdx;

  while (i < content.length && depth > 0) {
    const ch = content[i];
    if (ch === '{') {
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
    }
    i += 1;
  }

  // Instead of tracking depth manually, use regex on lines
  // Extract the PropTypes block text
  const blockEnd = i;
  const block = content.slice(startIdx, blockEnd);

  // Re-parse: track depth and extract names at depth 0 (inside the outer {})
  let braceDepth = 0;
  let parenDepth = 0;
  let bracketDepth = 0;
  for (const line of block.split('\n')) {
    const trimmed = line.trim();

    // Only at top-level of the PropTypes object
    if (braceDepth === 0 && parenDepth === 0 && bracketDepth === 0) {
      const nameMatch = trimmed.match(/^(\w+)\s*:/);
      if (nameMatch && nameMatch[1] !== 'PropTypes') {
        names.add(nameMatch[1]);
      }
    }

    // Update depths
    for (const c of trimmed) {
      if (c === '{') {
        braceDepth += 1;
      } else if (c === '}') {
        braceDepth -= 1;
      } else if (c === '(') {
        parenDepth += 1;
      } else if (c === ')') {
        parenDepth -= 1;
      } else if (c === '[') {
        bracketDepth += 1;
      } else if (c === ']') {
        bracketDepth -= 1;
      }
    }
  }

  return names;
}

// ---------------------------------------------------------------------------
// Check if a component definition has @ignore in its JSDoc
// ---------------------------------------------------------------------------

export function hasIgnoreOnDefinition(sourceText: string, componentName: string): boolean {
  // Find the component definition (const X =, function X, export default function X, etc.)
  const defPattern = new RegExp(
    `(?:const|let|var|function)\\s+${componentName}\\b`,
  );
  const defMatch = defPattern.exec(sourceText);
  if (!defMatch) {
    return false;
  }

  // Look backwards from the definition for the closest JSDoc comment
  const beforeDef = sourceText.slice(0, defMatch.index);
  // Find the last JSDoc block: /** ... */
  const lastJsDoc = beforeDef.match(/\/\*\*[\s\S]*?\*\/\s*(?:export\s+(?:default\s+)?)?$/);
  if (!lastJsDoc) {
    return false;
  }

  return lastJsDoc[0].includes('@ignore');
}

// ---------------------------------------------------------------------------
// Test file parsing (for forwardsRefTo, spread, themeDefaultProps)
// ---------------------------------------------------------------------------

export function parseConformanceTest(componentFilePath: string): ConformanceInfo {
  const dir = path.dirname(componentFilePath);
  const baseName = path.basename(componentFilePath, '.tsx');

  // Look for test files
  const testPatterns = [
    path.join(dir, `${baseName}.test.tsx`),
    path.join(dir, `${baseName}.test.ts`),
    path.join(dir, 'tests', `${baseName}.test.tsx`),
    path.join(dir, '..', `${baseName}.test.tsx`),
  ];

  let testContent: string | undefined;
  for (const testPath of testPatterns) {
    if (fs.existsSync(testPath)) {
      testContent = fs.readFileSync(testPath, 'utf8');
      break;
    }
  }
  if (!testContent) {
    return {};
  }

  // Check for describeConformance
  const conformanceMatch = testContent.match(
    /describeConformance\b[\s\S]*?\(\s*[\s\S]*?,\s*\(\)\s*=>\s*\(\s*\{([\s\S]*?)\}\s*\)/,
  );
  if (!conformanceMatch) {
    return {};
  }

  const block = conformanceMatch[1];

  // Extract refInstanceof
  const refMatch = block.match(/refInstanceof:\s*window\.(\w+)/);
  const forwardsRefTo = refMatch?.[1];

  // Extract skip array
  const skipMatch = block.match(/skip:\s*\[([\s\S]*?)\]/);
  const skipContent = skipMatch?.[1] || '';
  const skippedTests = skipContent.match(/'([^']+)'/g)?.map((s) => s.replace(/'/g, '')) || [];

  const spread = !skippedTests.includes('propsSpread');
  const themeDefaultProps = !skippedTests.includes('themeDefaultProps');

  return { forwardsRefTo, spread, themeDefaultProps };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function htmlEncode(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\[\[(\w+)\]\]/g, (_, name) => name); // Linkification handled later
}

export function getSubdirectoryImport(filePath: string, packageDir: string): string {
  const relativePath = path.relative(path.resolve(CWD, packageDir), filePath).replace(/\\/g, '/');
  // e.g., src/LineChart/AreaPlot.tsx → @mui/x-charts/LineChart
  const parts = relativePath.replace(/^src\//, '').split('/');
  const pkgName = `@mui/${path.basename(packageDir)}`;
  if (parts.length > 1) {
    return `${pkgName}/${parts[0]}`;
  }
  return `${pkgName}/${parts[0].replace('.tsx', '')}`;
}

export function getDefaultDemos(comp: DiscoveredComponent): DemoInfo[] {
  if (comp.section === 'data-grid') {
    return [
      {
        demoPageTitle: 'DataGrid',
        demoPathname: '/x/react-data-grid/#community-version-free-forever',
      },
      { demoPageTitle: 'DataGridPro', demoPathname: '/x/react-data-grid/#pro-version' },
      { demoPageTitle: 'DataGridPremium', demoPathname: '/x/react-data-grid/#premium-version' },
    ];
  }
  return [];
}

export function formatDemosHtml(demoInfos: DemoInfo[], _comp: DiscoveredComponent): string {
  if (demoInfos.length === 0) {
    return '';
  }
  const items = demoInfos.map((d) => {
    let planBadge = '';
    if (d.demoPathname.includes('premium')) {
      planBadge = ' <span class="plan-premium"></span>';
    } else if (d.demoPathname.includes('pro')) {
      planBadge = ' <span class="plan-pro"></span>';
    }
    return `<li><a href="${d.demoPathname}">${d.demoPageTitle}</a>${planBadge}</li>`;
  });
  return `<ul>${items.join('\n')}</ul>`;
}

export function parseClassDescription(desc: string): TranslationClassDesc {
  // Parse patterns like "Styles applied to the root element."
  const match = desc.match(/^Styles applied to (.+)\.$/);
  if (match) {
    return {
      description: 'Styles applied to {{nodeName}}.',
      nodeName: match[1],
    };
  }

  // Check for conditional patterns
  const condMatch = desc.match(/^Styles applied to (.+?) if (.+)\.$/);
  if (condMatch) {
    return {
      description: 'Styles applied to {{nodeName}} if {{conditions}}.',
      nodeName: condMatch[1],
    };
  }

  return { description: desc };
}
