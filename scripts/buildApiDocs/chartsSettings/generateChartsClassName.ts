import fs from 'fs';
import path from 'path';
import createGenerateClassName from '../createGenerateClassName';

const PACKAGE_ROOTS = [
  path.join(process.cwd(), 'packages/x-charts/src'),
  path.join(process.cwd(), 'packages/x-charts-pro/src'),
  path.join(process.cwd(), 'packages/x-charts-premium/src'),
];

const GENERATE_UTILITY_CLASS_CALL = /generateUtilityClass(?:es)?\(\s*['"](Mui[A-Za-z0-9]+)['"]/;
const MUI_NAME_CONST =
  /(?:const|let|var)\s+[A-Za-z0-9_]+\s*(?::\s*[A-Za-z0-9_<>[\]]+)?\s*=\s*['"](Mui[A-Za-z0-9]+)['"]/;
const EXPORT_INTERFACE_CLASSES = /export\s+interface\s+([A-Z][A-Za-z0-9]*Classes)\b/g;
const EXPORT_FACTORY_FN = /export\s+function\s+(get[A-Z][A-Za-z0-9]*UtilityClass)\b/g;
const COMPOSE_CLASSES_CALL = /composeClasses\s*\([^,]+,\s*([A-Za-z][A-Za-z0-9_]*)/g;
const IMPORT_STATEMENT =
  /import\s+(?:type\s+)?(\{[^}]*\}|[A-Za-z0-9_*\s,]+?)?\s*from\s+['"]([^'"]+)['"]/g;
const PARTIAL_CLASSES_USAGE = /Partial<\s*([A-Z][A-Za-z0-9]*Classes)\s*>/g;

interface ClassesFileInfo {
  modulePath: string;
  ownerMuiName: string;
  interfaceNames: Set<string>;
  factoryFns: Set<string>;
}

function walk(dir: string, predicate: (name: string) => boolean): string[] {
  const out: string[] = [];
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full, predicate));
    } else if (entry.isFile() && predicate(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function readFile(file: string): string | null {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
}

const WORKSPACE_PACKAGE_PREFIX = /^@mui\/(x-charts(?:-pro|-premium)?)(\/.*)?$/;

function resolveImportPath(fromFile: string, specifier: string): string | null {
  let base: string;
  if (specifier.startsWith('.')) {
    base = path.resolve(path.dirname(fromFile), specifier);
  } else {
    const m = specifier.match(WORKSPACE_PACKAGE_PREFIX);
    if (!m) {
      return null;
    }
    base = path.join(process.cwd(), 'packages', m[1], 'src', m[2] ?? '');
  }
  const candidates = [
    `${base}.ts`,
    `${base}.tsx`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return c;
    }
  }
  return null;
}

// Files that knowingly violate the consistency checks below for backwards-compatibility
// reasons (they dual-emit a legacy `MuiXxx` prefix alongside the correct one). Remove these
// entries when the legacy prefixes are dropped — tracked at #22675 for v10.
const KNOWN_INCONSISTENT_CLASSES_FILES = new Set([
  path.join(process.cwd(), 'packages/x-charts/src/ChartsLegend/piecewiseColorLegendClasses.ts'),
  path.join(
    process.cwd(),
    'packages/x-charts-pro/src/ChartsZoomSlider/internals/chartsAxisZoomSliderThumbClasses.ts',
  ),
]);

function collectMuiNamesInFile(content: string): { source: string; muiName: string }[] {
  const found: { source: string; muiName: string }[] = [];
  for (const match of content.matchAll(new RegExp(GENERATE_UTILITY_CLASS_CALL, 'g'))) {
    found.push({ source: 'generateUtilityClass call', muiName: match[1] });
  }
  for (const match of content.matchAll(new RegExp(MUI_NAME_CONST, 'g'))) {
    found.push({ source: `const declaration`, muiName: match[1] });
  }
  return found;
}

function assertConsistent(file: string, interfaceNames: Set<string>, muiName: string): void {
  if (KNOWN_INCONSISTENT_CLASSES_FILES.has(file)) {
    return;
  }
  if (muiName.endsWith('Classes')) {
    // The interface name leaked into the muiName literal (e.g. `MuiFooClasses` instead of
    // `MuiFoo`). This is the bug pattern that bit `piecewiseColorLegendClasses`.
    throw new Error(
      `[generateChartsClassName] Suspicious muiName "${muiName}" in ${file}: ends with "Classes". ` +
        `Expected the interface name (${Array.from(interfaceNames).join(', ')}) ` +
        `stripped of the "Classes" suffix, not the full interface name.`,
    );
  }
  for (const interfaceName of interfaceNames) {
    const interfaceCore = interfaceName.replace(/Classes$/, '');
    const muiCore = muiName.replace(/^Mui/, '');
    if (!muiCore.includes(interfaceCore)) {
      // muiName doesn't reference the interface core anywhere — likely a typo (the
      // `chartsAxisZoomSliderThumbClasses` file is missing the `s` in `Charts`).
      throw new Error(
        `[generateChartsClassName] muiName "${muiName}" in ${file} does not contain ` +
          `the core of interface "${interfaceName}" ("${interfaceCore}"). Possible typo.`,
      );
    }
  }
}

function collectClassesFiles(): {
  classesFiles: ClassesFileInfo[];
  factoryOwnerByFn: Map<string, string>;
} {
  const result: ClassesFileInfo[] = [];
  const factoryOwnerByFn = new Map<string, string>();
  const pendingByFactory: Array<{ file: string; content: string; interfaceNames: Set<string> }> =
    [];
  for (const root of PACKAGE_ROOTS) {
    const files = walk(root, (name) => /[Cc]lasses\.ts$/.test(name));
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const allMuiNames = collectMuiNamesInFile(content);
      const distinctMuiNames = Array.from(new Set(allMuiNames.map((m) => m.muiName)));
      if (distinctMuiNames.length > 1 && !KNOWN_INCONSISTENT_CLASSES_FILES.has(file)) {
        // Different detection paths (literal call vs. const declaration) disagreed on the
        // owner muiName for the same file. This is almost always a bug (a typo or a
        // copy-paste error); add the file to `KNOWN_INCONSISTENT_CLASSES_FILES` if it's
        // intentional (e.g. dual-emit for backwards compat).
        throw new Error(
          `[generateChartsClassName] Inconsistent muiNames in ${file}: ` +
            `${allMuiNames.map((m) => `"${m.muiName}" (${m.source})`).join(', ')}.`,
        );
      }
      const interfaceNames = new Set<string>();
      for (const match of content.matchAll(EXPORT_INTERFACE_CLASSES)) {
        interfaceNames.add(match[1]);
      }
      const factoryFns = new Set<string>();
      for (const match of content.matchAll(EXPORT_FACTORY_FN)) {
        factoryFns.add(match[1]);
      }
      const ownerMuiName = distinctMuiNames[0];
      if (ownerMuiName) {
        if (interfaceNames.size > 0) {
          assertConsistent(file, interfaceNames, ownerMuiName);
        }
        result.push({ modulePath: file, ownerMuiName, interfaceNames, factoryFns });
        for (const fn of factoryFns) {
          if (!factoryOwnerByFn.has(fn)) {
            factoryOwnerByFn.set(fn, ownerMuiName);
          }
        }
      } else {
        pendingByFactory.push({ file, content, interfaceNames });
      }
    }
  }
  for (const { file, content, interfaceNames } of pendingByFactory) {
    for (const match of content.matchAll(COMPOSE_CLASSES_CALL)) {
      const owner = factoryOwnerByFn.get(match[1]);
      if (owner) {
        result.push({
          modulePath: file,
          ownerMuiName: owner,
          interfaceNames,
          factoryFns: new Set(),
        });
        break;
      }
    }
  }
  return { classesFiles: result, factoryOwnerByFn };
}

const REEXPORT_STATEMENT = /export\s+(?:\*|\{[^}]*\}|type\s+\{[^}]*\})\s+from\s+['"]([^'"]+)['"]/g;

function ownersInFileContent(
  content: string,
  byInterfaceName: Map<string, ClassesFileInfo>,
  factoryOwnerByFn: Map<string, string>,
  out: Set<string>,
): void {
  for (const match of content.matchAll(PARTIAL_CLASSES_USAGE)) {
    const info = byInterfaceName.get(match[1]);
    if (info) {
      out.add(info.ownerMuiName);
    }
  }
  for (const match of content.matchAll(COMPOSE_CLASSES_CALL)) {
    const owner = factoryOwnerByFn.get(match[1]);
    if (owner) {
      out.add(owner);
    }
  }
}

function ownersInFileAndReexports(
  file: string,
  byInterfaceName: Map<string, ClassesFileInfo>,
  factoryOwnerByFn: Map<string, string>,
  byModulePath: Map<string, ClassesFileInfo>,
  out: Set<string>,
  visited: Set<string>,
  depth: number,
): void {
  if (visited.has(file) || depth < 0) {
    return;
  }
  visited.add(file);
  const content = readFile(file);
  if (content === null) {
    return;
  }
  ownersInFileContent(content, byInterfaceName, factoryOwnerByFn, out);
  for (const match of content.matchAll(IMPORT_STATEMENT)) {
    const resolved = resolveImportPath(file, match[2]);
    if (resolved) {
      const classesInfo = byModulePath.get(resolved);
      if (classesInfo) {
        out.add(classesInfo.ownerMuiName);
      }
    }
  }
  if (depth === 0) {
    return;
  }
  for (const match of content.matchAll(REEXPORT_STATEMENT)) {
    const resolved = resolveImportPath(file, match[1]);
    if (resolved) {
      ownersInFileAndReexports(
        resolved,
        byInterfaceName,
        factoryOwnerByFn,
        byModulePath,
        out,
        visited,
        depth - 1,
      );
    }
  }
}

function findOwnerForComponent(
  entryFile: string,
  componentMuiName: string,
  byInterfaceName: Map<string, ClassesFileInfo>,
  factoryOwnerByFn: Map<string, string>,
  byModulePath: Map<string, ClassesFileInfo>,
): string | null {
  const inFile = new Set<string>();
  const content = readFile(entryFile);
  if (content === null) {
    return null;
  }
  ownersInFileContent(content, byInterfaceName, factoryOwnerByFn, inFile);
  if (inFile.size === 1) {
    return inFile.values().next().value!;
  }
  if (inFile.has(componentMuiName)) {
    return componentMuiName;
  }
  if (inFile.size > 0) {
    return inFile.values().next().value!;
  }

  for (const match of content.matchAll(IMPORT_STATEMENT)) {
    const specifier = match[2];
    const resolved = resolveImportPath(entryFile, specifier);
    if (!resolved) {
      continue;
    }
    const classesInfo = byModulePath.get(resolved);
    if (classesInfo) {
      return classesInfo.ownerMuiName;
    }
  }

  const candidates = new Set<string>();
  for (const match of content.matchAll(IMPORT_STATEMENT)) {
    const namedImportsRaw = match[1] ?? '';
    const specifier = match[2];
    const resolved = resolveImportPath(entryFile, specifier);
    if (!resolved) {
      continue;
    }
    const dir = path.dirname(resolved);
    const componentDir = path.dirname(entryFile);
    const isSibling = dir === componentDir;
    const basename = path.basename(resolved);
    const isTypesOrClassesFile =
      /\.types\.ts$/.test(basename) || /[Cc]lasses\.tsx?$/.test(basename);
    const namedImports = namedImportsRaw
      .replace(/[{}]/g, '')
      .split(',')
      .map(
        (s) =>
          s
            .trim()
            .replace(/^type\s+/, '')
            .split(/\s+as\s+/)[0],
      )
      .filter(Boolean);
    const hasOwnerStateOrPropsImport = namedImports.some((n) => /(?:OwnerState|Props)$/.test(n));
    if (!isSibling && !isTypesOrClassesFile && !hasOwnerStateOrPropsImport) {
      continue;
    }
    ownersInFileAndReexports(
      resolved,
      byInterfaceName,
      factoryOwnerByFn,
      byModulePath,
      candidates,
      new Set(),
      1,
    );
  }
  if (candidates.has(componentMuiName)) {
    return componentMuiName;
  }
  if (candidates.size > 0) {
    return candidates.values().next().value!;
  }
  return null;
}

function buildSharedClassNameOwners(): Record<string, string> {
  const { classesFiles, factoryOwnerByFn } = collectClassesFiles();
  const byInterfaceName = new Map<string, ClassesFileInfo>();
  const byModulePath = new Map<string, ClassesFileInfo>();
  for (const info of classesFiles) {
    byModulePath.set(info.modulePath, info);
    for (const interfaceName of info.interfaceNames) {
      if (!byInterfaceName.has(interfaceName)) {
        byInterfaceName.set(interfaceName, info);
      }
    }
  }

  const owners: Record<string, string> = {};
  for (const root of PACKAGE_ROOTS) {
    const componentFiles = walk(root, (name) => /\.tsx$/.test(name) && !/\.test\.tsx$/.test(name));
    for (const file of componentFiles) {
      const basename = path.basename(file, '.tsx');
      if (!/^[A-Z]/.test(basename)) {
        continue;
      }
      const componentMuiName = `Mui${basename}`;
      const ownerMuiName = findOwnerForComponent(
        file,
        componentMuiName,
        byInterfaceName,
        factoryOwnerByFn,
        byModulePath,
      );
      if (ownerMuiName && ownerMuiName !== componentMuiName) {
        owners[componentMuiName] = ownerMuiName;
      }
    }
  }
  return owners;
}

export const sharedClassNameOwners = buildSharedClassNameOwners();

const generateChartsClassName = createGenerateClassName(sharedClassNameOwners);

export default generateChartsClassName;
