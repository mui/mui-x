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
  ExtractResult,
} from './types';

// ---------------------------------------------------------------------------
// Component API extraction (main function)
// ---------------------------------------------------------------------------

export function extractComponentApi(
  comp: DiscoveredComponent,
  checker: ts.TypeChecker,
  program: ts.Program,
  demos: DemoMap,
): ExtractResult {
  const sourceFile = program.getSourceFile(comp.filePath);
  if (!sourceFile) {
    return { kind: 'skipped', reason: 'source file not found in TS program' };
  }

  // Skip components marked with @ignore on their definition.
  if (hasIgnoreOnDefinition(sourceFile, comp.name)) {
    return { kind: 'skipped', reason: '@ignore on component definition' };
  }

  // Find the component's props type
  const propsType = findComponentPropsType(comp.name, sourceFile, checker);
  if (!propsType) {
    return { kind: 'skipped', reason: 'could not resolve props type' };
  }

  // Get component description from JSDoc
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  let componentDescription = '';
  if (moduleSymbol) {
    const exports = checker.getExportsOfModule(moduleSymbol);
    const compSymbol = exports.find(
      (exportSymbol) =>
        exportSymbol.name === comp.name || exportSymbol.name === `Unstable_${comp.name}`,
    );
    if (compSymbol) {
      componentDescription = ts.displayPartsToString(compSymbol.getDocumentationComment(checker));
    }
  }

  // Extract props
  const allProps = propsType.getProperties();
  const props: Record<string, PropInfo> = {};
  const propDescriptions: Record<string, TranslationPropDesc> = {};

  for (const prop of allProps) {
    // Only include props declared in MUI X packages
    if (!isMuiXProp(prop)) {
      continue;
    }
    // Exclude commonly inherited props (apiRef, children, className, sx, theme, ref)
    // unless they have JSDoc directly on the component's own type
    if (COMMON_INHERITED_PROPS.has(prop.name)) {
      const jsDocCheck = extractJsDoc(prop, checker);
      if (!jsDocCheck.description) {
        continue;
      }
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
      // These props are not fully expanded — show the type alias name instead of "object"
      const rawPropType = checker.getTypeOfSymbol(prop);
      const strippedPropType = stripOptionalType(rawPropType, checker);
      const typeName = checker
        .typeToString(strippedPropType, undefined, ts.TypeFormatFlags.NoTruncation)
        .replace(/"/g, "'");
      const isArr =
        checker.isArrayType(strippedPropType) ||
        (strippedPropType as any).target?.getSymbol()?.name === 'Array' ||
        (strippedPropType as any).target?.getSymbol()?.name === 'ReadonlyArray';
      if (isArr) {
        const elemType = (strippedPropType as ts.TypeReference).typeArguments?.[0];
        const elemName = elemType
          ? checker
              .typeToString(elemType, undefined, ts.TypeFormatFlags.NoTruncation)
              .replace(/"/g, "'")
          : '{}';
        typeInfo = { name: 'arrayOf', description: `Array&lt;${elemName}&gt;` };
      } else if (typeName === 'any' || typeName.includes('{') || typeName.length > 80) {
        // Fall back to plain "object" for unreadable types
        typeInfo = { name: '{}' };
      } else {
        typeInfo = { name: 'shape', description: typeName };
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
    if (isFunc && (jsDoc.params.size > 0 || jsDoc.returnDescription)) {
      const typeDescriptions: Record<string, { name: string; description: string }> = {};
      for (const [paramName, paramDesc] of jsDoc.params) {
        typeDescriptions[paramName] = {
          name: paramName,
          description: htmlEncode(paramDesc),
        };
      }
      // Add return type description (keyed by the return type name from the signature)
      if (propInfo.signature?.returned && jsDoc.returnDescription) {
        typeDescriptions[propInfo.signature.returned] = {
          name: propInfo.signature.returned,
          description: htmlEncode(jsDoc.returnDescription),
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

  // Metadata (muiName needed for class extraction)
  const muiNameEarly = extractMuiName(sourceFile, comp.name);

  // Extract classes
  const classes = extractClasses(
    path.dirname(comp.filePath),
    comp.name,
    muiNameEarly,
    checker,
    program,
  );

  // For slot → class linking, also consider classes from any *Classes.ts file in the
  // component's folder (not just the ones "owned" by this component). This handles
  // sub-components like AreaPlot whose slots reference the parent chart's classes
  // (e.g. MuiLineChart-area).
  const slotLinkClasses = classes.length
    ? classes
    : extractAllFolderClasses(path.dirname(comp.filePath), checker, program);
  for (const slot of slots) {
    const matchingClass = slotLinkClasses.find((c) => c.key === slot.name);
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
  const muiName = muiNameEarly;

  // Compute imports
  const subdirSuffix = getSubdirectoryImportSuffix(comp.filePath, comp.packageDir);
  const imports: string[] = [];
  if (comp.subdirImportForAllPackages) {
    // Show subdirectory + root import for every package
    for (const pkg of comp.reExportPackages) {
      if (subdirSuffix) {
        imports.push(`import { ${comp.name} } from '${pkg}/${subdirSuffix}';`);
      }
      imports.push(`import { ${comp.name} } from '${pkg}';`);
    }
  } else {
    // Subdirectory import for the originating package only, then root imports
    if (subdirSuffix) {
      imports.push(`import { ${comp.name} } from '${comp.reExportPackages[0]}/${subdirSuffix}';`);
    }
    for (const pkg of comp.reExportPackages) {
      imports.push(`import { ${comp.name} } from '${pkg}';`);
    }
  }

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

  // Add conformance test info if available, fall back to family default
  if (conformance.forwardsRefTo !== undefined) {
    result.forwardsRefTo = conformance.forwardsRefTo;
  } else if (comp.defaultForwardsRefTo) {
    result.forwardsRefTo = comp.defaultForwardsRefTo;
  }
  if (conformance.spread !== undefined) {
    result.spread = conformance.spread;
  }
  if (conformance.themeDefaultProps !== undefined) {
    result.themeDefaultProps = conformance.themeDefaultProps;
  }

  return { kind: 'ok', api: result };
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
    (exportSymbol) =>
      exportSymbol.name === componentName || exportSymbol.name === `Unstable_${componentName}`,
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
  dir: string,
  componentName: string,
  muiName: string,
  checker: ts.TypeChecker,
  program: ts.Program,
): ClassInfo[] {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return [];
  }

  const candidates = discoverClassesFiles(dir, program);

  // Priority 1: classes file whose name matches the component (e.g. piecewiseColorLegendClasses.ts
  // for PiecewiseColorLegend). In this case the component's muiName is authoritative, regardless
  // of what `generateUtilityClasses` was called with (source sometimes has typos there).
  const lowerFirst = componentName[0].toLowerCase() + componentName.slice(1);
  const nameMatch = candidates.find(
    (c) => path.basename(c.filePath, path.extname(c.filePath)) === `${lowerFirst}Classes`,
  );
  if (nameMatch) {
    const result = buildClassesFromCandidate(nameMatch, muiName, checker);
    if (result) {
      return result;
    }
  }

  // Priority 2: any classes file whose `generateUtilityClasses('Mui<X>', ...)` prefix matches
  // the component's muiName. Handles cases like barClasses.ts → MuiBarChart.
  for (const candidate of candidates) {
    if (candidate === nameMatch || candidate.prefix !== muiName) {
      continue;
    }
    const result = buildClassesFromCandidate(candidate, muiName, checker);
    if (result) {
      return result;
    }
  }

  return [];
}

/**
 * Collects ClassInfo entries from every *Classes.ts file in the folder, using each file's
 * own `generateUtilityClasses('Mui<X>', ...)` prefix. Used for slot → class linking on
 * sub-components that don't "own" classes themselves.
 */
function extractAllFolderClasses(
  dir: string,
  checker: ts.TypeChecker,
  program: ts.Program,
): ClassInfo[] {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return [];
  }
  const result: ClassInfo[] = [];
  for (const candidate of discoverClassesFiles(dir, program)) {
    const classes = buildClassesFromCandidate(candidate, candidate.prefix, checker);
    if (classes) {
      result.push(...classes);
    }
  }
  return result;
}

interface ClassesCandidate {
  filePath: string;
  sourceFile: ts.SourceFile;
  /** `Mui<X>` prefix passed to `generateUtilityClasses`. */
  prefix: string;
  /** The `<X>Classes` interface the const was annotated with. */
  interfaceName: string;
}

/**
 * Finds every `*Classes.ts` file in `dir` that exposes a
 * `export const xxxClasses: <X>Classes = generateUtilityClasses('Mui<Y>', [...])`-style
 * declaration (or the spread variant used by some files). Returns the prefix and interface
 * name parsed from the AST — no regex over source.
 */
function discoverClassesFiles(dir: string, program: ts.Program): ClassesCandidate[] {
  const candidates: ClassesCandidate[] = [];
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('Classes.ts') && !file.endsWith('Classes.tsx')) {
      continue;
    }
    const classesFile = path.join(dir, file);
    const sourceFile = program.getSourceFile(classesFile);
    if (!sourceFile) {
      continue;
    }
    const parsed = parseClassesFile(sourceFile);
    if (parsed) {
      candidates.push({ filePath: classesFile, sourceFile, ...parsed });
    }
  }
  return candidates;
}

/**
 * Walks the classes source file to find the exported `<X>Classes`-typed const and the
 * `generateUtilityClasses('Mui<Y>', ...)` call it contains (directly or via spread).
 */
function parseClassesFile(
  sourceFile: ts.SourceFile,
): { prefix: string; interfaceName: string } | null {
  for (const stmt of sourceFile.statements) {
    if (!ts.isVariableStatement(stmt)) {
      continue;
    }
    for (const decl of stmt.declarationList.declarations) {
      if (!decl.type || !ts.isTypeReferenceNode(decl.type)) {
        continue;
      }
      if (!ts.isIdentifier(decl.type.typeName)) {
        continue;
      }
      const interfaceName = decl.type.typeName.text;
      if (!interfaceName.endsWith('Classes')) {
        continue;
      }
      if (!decl.initializer) {
        continue;
      }
      const prefix = findGenerateUtilityClassesPrefix(decl.initializer);
      if (prefix) {
        return { prefix, interfaceName };
      }
    }
  }
  return null;
}

/**
 * Given an initializer expression, finds the first `generateUtilityClasses('Mui<X>', ...)`
 * call reachable inside it (directly, or inside an ObjectLiteralExpression with a spread).
 */
function findGenerateUtilityClassesPrefix(node: ts.Node): string | undefined {
  let result: string | undefined;
  const visit = (n: ts.Node): void => {
    if (result) {
      return;
    }
    if (
      ts.isCallExpression(n) &&
      ts.isIdentifier(n.expression) &&
      n.expression.text === 'generateUtilityClasses' &&
      n.arguments.length > 0 &&
      ts.isStringLiteral(n.arguments[0])
    ) {
      result = n.arguments[0].text;
      return;
    }
    ts.forEachChild(n, visit);
  };
  visit(node);
  return result;
}

function buildClassesFromCandidate(
  candidate: ClassesCandidate,
  prefix: string,
  checker: ts.TypeChecker,
): ClassInfo[] | null {
  const moduleSymbol = checker.getSymbolAtLocation(candidate.sourceFile);
  if (!moduleSymbol) {
    return null;
  }
  const exports = checker.getExportsOfModule(moduleSymbol);
  const classesSymbol = exports.find((s) => s.name === candidate.interfaceName);
  if (!classesSymbol) {
    return null;
  }
  const classesType = checker.getDeclaredTypeOfSymbol(classesSymbol);
  return buildClassInfos(classesType.getProperties(), prefix, checker);
}

function buildClassInfos(
  properties: ts.Symbol[],
  prefix: string,
  checker: ts.TypeChecker,
): ClassInfo[] {
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
    const classPrefix = isGlobal ? 'Mui' : prefix;
    const className = `${classPrefix}-${prop.name}`;

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
// MuiName extraction via AST
// ---------------------------------------------------------------------------

/**
 * Walks the component's source file AST to find its canonical Mui name.
 * Priority 1: `useThemeProps({ props: ..., name: 'MuiXxx' })` — the canonical
 * component-level name.
 * Priority 2: `styled(..., { name: 'MuiXxx' })` — only if the name actually
 * corresponds to this component (ends with its name). This prevents
 * sub-components like HeatmapCell (styled with the parent's namespace
 * 'MuiHeatmap') from being mis-labeled.
 */
export function extractMuiName(
  sourceFile: ts.SourceFile,
  componentName: string,
): string {
  let themePropsName: string | undefined;
  const styledNames: string[] = [];

  const visit = (node: ts.Node): void => {
    if (!themePropsName && ts.isCallExpression(node)) {
      const calleeName = getCalleeName(node);
      if (calleeName === 'useThemeProps') {
        const name = getNameOptionFromCall(node);
        if (name) {
          themePropsName = name;
        }
      } else if (calleeName === 'styled') {
        const name = getNameOptionFromCall(node);
        if (name) {
          styledNames.push(name);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  if (themePropsName) {
    return themePropsName;
  }
  for (const name of styledNames) {
    const x = name.slice(3); // strip "Mui"
    if (x === componentName || x.endsWith(componentName)) {
      return name;
    }
  }
  return `Mui${componentName}`;
}

/** Returns the identifier name of the callee (handles plain calls and member calls). */
function getCalleeName(call: ts.CallExpression): string | undefined {
  const expr = call.expression;
  if (ts.isIdentifier(expr)) {
    return expr.text;
  }
  if (ts.isPropertyAccessExpression(expr) && ts.isIdentifier(expr.name)) {
    return expr.name.text;
  }
  return undefined;
}

/** Find a `name: '...'` property in any object-literal argument of the call. */
function getNameOptionFromCall(call: ts.CallExpression): string | undefined {
  for (const arg of call.arguments) {
    if (ts.isObjectLiteralExpression(arg)) {
      for (const prop of arg.properties) {
        if (
          ts.isPropertyAssignment(prop) &&
          ts.isIdentifier(prop.name) &&
          prop.name.text === 'name' &&
          ts.isStringLiteral(prop.initializer)
        ) {
          return prop.initializer.text;
        }
      }
    }
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// @ignore detection via JSDoc tags
// ---------------------------------------------------------------------------

/**
 * Checks whether the component declaration carries an `@ignore` JSDoc tag.
 * Walks the source file for a top-level declaration with the given name and
 * inspects its JSDoc via `ts.getJSDocTags`.
 */
export function hasIgnoreOnDefinition(
  sourceFile: ts.SourceFile,
  componentName: string,
): boolean {
  for (const stmt of sourceFile.statements) {
    // function Foo() {}
    if (ts.isFunctionDeclaration(stmt) && stmt.name?.text === componentName) {
      if (hasIgnoreJsDocTag(stmt)) {
        return true;
      }
    }
    // const Foo = ...
    if (ts.isVariableStatement(stmt)) {
      for (const decl of stmt.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.name.text === componentName) {
          if (hasIgnoreJsDocTag(stmt)) {
            return true;
          }
        }
      }
    }
    // export default function Foo() {} / export default Foo
    if (ts.isExportAssignment(stmt) && !stmt.isExportEquals) {
      if (
        ts.isIdentifier(stmt.expression) &&
        stmt.expression.text === componentName &&
        hasIgnoreJsDocTag(stmt)
      ) {
        return true;
      }
    }
  }
  return false;
}

function hasIgnoreJsDocTag(node: ts.Node): boolean {
  const tags = ts.getJSDocTags(node);
  return tags.some((tag) => tag.tagName.text === 'ignore');
}

// ---------------------------------------------------------------------------
// Test file parsing (for forwardsRefTo, spread, themeDefaultProps)
// ---------------------------------------------------------------------------

export function parseConformanceTest(componentFilePath: string): ConformanceInfo {
  const dir = path.dirname(componentFilePath);
  const baseName = path.basename(componentFilePath, '.tsx');

  // Search for test files in several conventional locations.
  const pkgSrc = dir.replace(/\/src\/.*/, '/src');
  const candidateDirs = [
    dir,
    path.join(dir, 'tests'),
    path.join(dir, '..'),
    path.join(pkgSrc, 'tests'),
  ];

  let testFilePath: string | undefined;
  let testFallback: string | undefined;
  for (const testDir of candidateDirs) {
    if (!fs.existsSync(testDir) || !fs.statSync(testDir).isDirectory()) {
      continue;
    }
    for (const file of fs.readdirSync(testDir)) {
      if (!file.endsWith(`${baseName}.test.tsx`) && !file.endsWith(`${baseName}.test.ts`)) {
        continue;
      }
      const candidatePath = path.join(testDir, file);
      const content = fs.readFileSync(candidatePath, 'utf8');
      if (content.includes('describeConformance')) {
        testFilePath = candidatePath;
        break;
      }
      if (!testFallback) {
        testFallback = candidatePath;
      }
    }
    if (testFilePath) {
      break;
    }
  }
  const finalPath = testFilePath ?? testFallback;
  if (!finalPath) {
    return {};
  }

  const content = fs.readFileSync(finalPath, 'utf8');
  if (!content.includes('describeConformance')) {
    return {};
  }

  const sourceFile = ts.createSourceFile(
    finalPath,
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const info = extractConformanceInfoFromAst(sourceFile);
  // If the file mentions describeConformance but we couldn't find a concrete call
  // (e.g. the file has a hand-rolled adaptation instead of the helper), default to
  // the "assumed conformant" values so we don't regress vs. the old output.
  if (info.spread === undefined) {
    info.spread = true;
  }
  if (info.themeDefaultProps === undefined) {
    info.themeDefaultProps = true;
  }
  return info;
}

/**
 * Walks a parsed test file AST to extract the options passed to `describeConformance`.
 * Looks for a call to `describeConformance(component, () => ({...}))` and reads the
 * returned object literal's `refInstanceof` and `skip` properties.
 */
function extractConformanceInfoFromAst(sourceFile: ts.SourceFile): ConformanceInfo {
  let result: ConformanceInfo = {};

  const visit = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'describeConformance'
    ) {
      const callback = node.arguments[1];
      if (
        callback &&
        (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback))
      ) {
        const optionsObj = findReturnedObjectLiteral(callback);
        if (optionsObj) {
          result = readConformanceObject(optionsObj);
        }
      }
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  return result;
}

/** Given an arrow/function expression, find the returned ObjectLiteralExpression. */
function findReturnedObjectLiteral(
  fn: ts.ArrowFunction | ts.FunctionExpression,
): ts.ObjectLiteralExpression | undefined {
  const body = fn.body;
  // `() => ({...})`
  if (ts.isParenthesizedExpression(body) && ts.isObjectLiteralExpression(body.expression)) {
    return body.expression;
  }
  // `() => ({...})` without parens (rare)
  if (ts.isObjectLiteralExpression(body)) {
    return body;
  }
  // `() => { return {...}; }`
  if (ts.isBlock(body)) {
    for (const stmt of body.statements) {
      if (
        ts.isReturnStatement(stmt) &&
        stmt.expression &&
        ts.isObjectLiteralExpression(stmt.expression)
      ) {
        return stmt.expression;
      }
    }
  }
  return undefined;
}

/** Reads `refInstanceof: window.X` and `skip: [...]` from the options object literal. */
function readConformanceObject(obj: ts.ObjectLiteralExpression): ConformanceInfo {
  let forwardsRefTo: string | undefined;
  const skipped: string[] = [];

  for (const prop of obj.properties) {
    if (!ts.isPropertyAssignment(prop) || !ts.isIdentifier(prop.name)) {
      continue;
    }
    if (prop.name.text === 'refInstanceof') {
      const init = prop.initializer;
      if (
        ts.isPropertyAccessExpression(init) &&
        ts.isIdentifier(init.expression) &&
        init.expression.text === 'window'
      ) {
        forwardsRefTo = init.name.text;
      }
    } else if (prop.name.text === 'skip' && ts.isArrayLiteralExpression(prop.initializer)) {
      for (const elem of prop.initializer.elements) {
        if (ts.isStringLiteral(elem)) {
          skipped.push(elem.text);
        }
      }
    }
  }

  return {
    forwardsRefTo,
    spread: !skipped.includes('propsSpread'),
    themeDefaultProps: !skipped.includes('themeDefaultProps'),
  };
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

/**
 * Get the subdirectory import suffix for a component file.
 * e.g. src/LineChart/AreaPlot.tsx → "LineChart"
 * e.g. src/DataGrid/DataGrid.tsx → "DataGrid"
 * Returns empty string if the component is at the root of src/.
 */
export function getSubdirectoryImportSuffix(filePath: string, packageDir: string): string {
  const relativePath = path.relative(path.resolve(CWD, packageDir), filePath).replace(/\\/g, '/');
  const parts = relativePath.replace(/^src\//, '').split('/');
  if (parts.length > 1) {
    return parts[0];
  }
  return '';
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
