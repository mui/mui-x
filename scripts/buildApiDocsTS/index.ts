#!/usr/bin/env tsx
/**
 * Generates API documentation from TypeScript type definitions.
 * Replaces both `pnpm proptypes` and `pnpm docs:api`.
 *
 * Usage: tsx scripts/buildApiDocsTS/index.ts [--grep pattern]
 */
import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'node:fs';
import * as fsp from 'node:fs/promises';
import * as prettier from 'prettier';
import { kebabCase } from 'es-toolkit/string';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {
  createTSProgram,
  extractJsDoc,
  formatPropType,
  extractFunctionSignature,
  isMuiXProp,
  isMuiXDeclaration,
  type PropInfo,
  type PropTypeInfo,
  type JsDocInfo,
} from './typeUtils';

const CWD = process.cwd();

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

interface PackageConfig {
  name: string;
  packageDir: string;
  section: string; // data-grid | date-pickers | charts | tree-view
  /** How to discover components: 'whitelist' uses explicit list, 'scan' scans src/ */
  discovery: 'whitelist' | 'scan';
  /** For whitelist: list of file paths relative to package root */
  whitelist?: string[];
  /**
   * Skip component predicate (for 'scan' mode)
   * @param filename
   */
  skipComponent?: (filename: string) => boolean;
  /** Include Unstable_ prefixed components */
  includeUnstable?: boolean;
  /** Import patterns for this package */
  reExportPackages: string[];
}

interface ComponentApi {
  name: string;
  filename: string;
  packageName: string;
  section: string;
  props: Record<string, PropInfo>;
  slots: SlotInfo[];
  classes: ClassInfo[];
  imports: string[];
  muiName: string;
  forwardsRefTo?: string;
  spread?: boolean;
  themeDefaultProps?: boolean | null;
  demos: string;
  inheritance: null;
  cssComponent: false;
  // For translations
  componentDescription: string;
  propDescriptions: Record<string, TranslationPropDesc>;
  slotDescriptions: Record<string, string>;
  classDescriptions: Record<string, TranslationClassDesc>;
}

interface SlotInfo {
  name: string;
  description: string;
  default?: string;
  class: string | null;
}

interface ClassInfo {
  key: string;
  className: string;
  description: string;
  isGlobal: boolean;
}

interface TranslationPropDesc {
  description: string;
  typeDescriptions?: Record<string, { name: string; description: string }>;
  seeMoreText?: string;
}

interface TranslationClassDesc {
  description: string;
  nodeName?: string;
}

// Charts: skip components by file path suffix (matches chartsSettings/index.ts)
const CHARTS_SKIP_PATHS = [
  'x-charts/src/Gauge/GaugeReferenceArc.tsx',
  'x-charts/src/Gauge/GaugeValueArc.tsx',
  'x-charts/src/Gauge/GaugeValueText.tsx',
  'x-charts/src/BarChart/FocusedBar.tsx',
  'x-charts/src/ScatterChart/FocusedScatterMark.tsx',
  'x-charts/src/ChartsReferenceLine/ChartsXReferenceLine.tsx',
  'x-charts/src/ChartsReferenceLine/ChartsYReferenceLine.tsx',
  'x-charts/src/ChartsOverlay/ChartsOverlay.tsx',
  'x-charts/src/ChartsOverlay/ChartsNoDataOverlay.tsx',
  'x-charts/src/ChartsOverlay/ChartsLoadingOverlay.tsx',
  'x-charts/src/LineChart/CircleMarkElement.tsx',
  'x-charts/src/ScatterChart/ScatterMarker.tsx',
  'x-charts/src/BarChart/AnimatedBarElement.tsx',
  'x-charts/src/BarChart/BatchBarPlot/BarGroup.tsx',
  'x-charts/src/BarChart/BatchBarPlot/BatchBarPlot.tsx',
  'x-charts/src/RadarChart/RadarDataProvider/RadarDataProvider.tsx',
  'x-charts/src/LineChart/FocusedLineMark.tsx',
  'x-charts/src/PieChart/FocusedPieArc.tsx',
  'x-charts/src/ScatterChart/BatchScatter.tsx',
  'x-charts/src/BarChart/BatchBarPlot.tsx',
  'x-charts/src/BarChart/IndividualBarPlot.tsx',
  'x-charts-pro/src/Heatmap/HeatmapSVGPlot.tsx',
  'x-charts-pro/src/SankeyChart/SankeyLinkPlot.tsx',
  'x-charts-pro/src/SankeyChart/SankeyNodePlot.tsx',
  'x-charts-pro/src/SankeyChart/SankeyLinkLabelPlot.tsx',
  'x-charts-pro/src/SankeyChart/SankeyNodeLabelPlot.tsx',
  'x-charts-premium/src/BarChartPremium/RangeBar/AnimatedRangeBarElement.tsx',
  'x-charts-premium/src/ChartsRenderer/ChartsRenderer.tsx',
  'x-charts-premium/src/ChartsRenderer/components/PaletteOption.tsx',
  'x-charts-premium/src/HeatmapPremium/HeatmapPlotPremium.tsx',
  'x-charts-premium/src/HeatmapPremium/webgl/HeatmapWebGLPlot.tsx',
  'x-charts-premium/src/HeatmapPremium/webgl/HeatmapWebGLRenderer.tsx',
  'x-charts-premium/src/ChartsWebGLLayer/ChartsWebGLLayer.tsx',
  'x-charts/src/ChartsLayerContainer/ChartsLayerContainer.tsx',
  'x-charts/src/ChartsSvgLayer/ChartsSvgLayer.tsx',
  'x-charts/src/ChartContainer/ChartContainer.tsx',
  'x-charts-pro/src/ChartContainerPro/ChartContainerPro.tsx',
  'x-charts-premium/src/ChartContainerPremium/ChartContainerPremium.tsx',
  'x-charts/src/ChartProvider/ChartProvider.tsx',
  'x-charts/src/ChartsProvider/ChartsProvider.tsx',
  'x-charts/src/ChartDataProvider/ChartDataProvider.tsx',
  'x-charts-pro/src/ChartDataProviderPro/ChartDataProviderPro.tsx',
  'x-charts-premium/src/ChartDataProviderPremium/ChartDataProviderPremium.tsx',
  'x-charts-premium/src/CandlestickChart/seriesConfig/OHLCTooltipContent.tsx',
];

const GRID_WHITELIST: Record<string, string[]> = {
  'x-data-grid': [
    'src/DataGrid/DataGrid.tsx',
    'src/components/panel/filterPanel/GridFilterForm.tsx',
    'src/components/panel/filterPanel/GridFilterPanel.tsx',
    'src/components/toolbar/GridToolbarQuickFilter.tsx',
    'src/components/toolbarV8/Toolbar.tsx',
    'src/components/toolbarV8/ToolbarButton.tsx',
    'src/components/export/ExportPrint.tsx',
    'src/components/export/ExportCsv.tsx',
    'src/components/quickFilter/QuickFilter.tsx',
    'src/components/quickFilter/QuickFilterControl.tsx',
    'src/components/quickFilter/QuickFilterClear.tsx',
    'src/components/quickFilter/QuickFilterTrigger.tsx',
    'src/components/filterPanel/FilterPanelTrigger.tsx',
    'src/components/columnsPanel/ColumnsPanelTrigger.tsx',
  ],
  'x-data-grid-pro': ['src/DataGridPro/DataGridPro.tsx'],
  'x-data-grid-premium': [
    'src/DataGridPremium/DataGridPremium.tsx',
    'src/components/export/ExportExcel.tsx',
    'src/components/pivotPanel/PivotPanelTrigger.tsx',
    'src/components/chartsPanel/GridChartsPanel.tsx',
    'src/components/chartsPanel/ChartsPanelTrigger.tsx',
    'src/components/aiAssistantPanel/AiAssistantPanelTrigger.tsx',
    'src/components/promptField/PromptField.tsx',
    'src/components/promptField/PromptFieldRecord.tsx',
    'src/components/promptField/PromptFieldControl.tsx',
    'src/components/promptField/PromptFieldSend.tsx',
    'src/context/GridChartsRendererProxy.tsx',
  ],
};

// Packages config
function getPackageConfigs(): PackageConfig[] {
  const configs: PackageConfig[] = [];

  // Data Grid
  for (const [pkg, files] of Object.entries(GRID_WHITELIST)) {
    configs.push({
      name: pkg,
      packageDir: `packages/${pkg}`,
      section: 'data-grid',
      discovery: 'whitelist',
      whitelist: files,
      reExportPackages: getReExportPackages(pkg),
    });
  }

  // Date Pickers
  for (const pkg of ['x-date-pickers', 'x-date-pickers-pro']) {
    configs.push({
      name: pkg,
      packageDir: `packages/${pkg}`,
      section: 'date-pickers',
      discovery: 'scan',
      includeUnstable: true,
      reExportPackages: getReExportPackages(pkg),
    });
  }

  // Charts
  for (const pkg of ['x-charts', 'x-charts-pro', 'x-charts-premium']) {
    configs.push({
      name: pkg,
      packageDir: `packages/${pkg}`,
      section: 'charts',
      discovery: 'scan',
      includeUnstable: true,
      skipComponent: (filename: string) => {
        if (filename.includes('/context/')) {
          return true;
        }
        return CHARTS_SKIP_PATHS.some((skipPath) => filename.endsWith(skipPath));
      },
      reExportPackages: getReExportPackages(pkg),
    });
  }

  // Tree View
  for (const pkg of ['x-tree-view', 'x-tree-view-pro']) {
    configs.push({
      name: pkg,
      packageDir: `packages/${pkg}`,
      section: 'tree-view',
      discovery: 'scan',
      includeUnstable: true,
      skipComponent: (filename: string) => filename.includes('/components/'),
      reExportPackages: getReExportPackages(pkg),
    });
  }

  return configs;
}

function getReExportPackages(pkg: string): string[] {
  switch (pkg) {
    case 'x-data-grid':
      return ['@mui/x-data-grid', '@mui/x-data-grid-pro', '@mui/x-data-grid-premium'];
    case 'x-data-grid-pro':
      return ['@mui/x-data-grid-pro', '@mui/x-data-grid-premium'];
    case 'x-data-grid-premium':
      return ['@mui/x-data-grid-premium'];
    case 'x-date-pickers':
      return ['@mui/x-date-pickers', '@mui/x-date-pickers-pro'];
    case 'x-date-pickers-pro':
      return ['@mui/x-date-pickers-pro'];
    case 'x-charts':
      return ['@mui/x-charts', '@mui/x-charts-pro', '@mui/x-charts-premium'];
    case 'x-charts-pro':
      return ['@mui/x-charts-pro', '@mui/x-charts-premium'];
    case 'x-charts-premium':
      return ['@mui/x-charts-premium'];
    case 'x-tree-view':
      return ['@mui/x-tree-view', '@mui/x-tree-view-pro'];
    case 'x-tree-view-pro':
      return ['@mui/x-tree-view-pro'];
    default:
      return [`@mui/${pkg}`];
  }
}

// ---------------------------------------------------------------------------
// Component discovery
// ---------------------------------------------------------------------------

interface DiscoveredComponent {
  name: string;
  filePath: string;
  packageName: string;
  packageDir: string;
  section: string;
  reExportPackages: string[];
}

function getComponentFilesInFolder(folderPath: string): string[] {
  if (!fs.existsSync(folderPath)) {
    return [];
  }
  const results: string[] = [];
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...getComponentFilesInFolder(fullPath));
    } else if (/^[A-Z].*\.tsx$/.test(entry.name)) {
      results.push(fullPath.replace(/\\/g, '/'));
    }
  }
  return results;
}

function discoverComponents(
  configs: PackageConfig[],
  checker: ts.TypeChecker,
  program: ts.Program,
): DiscoveredComponent[] {
  const components: DiscoveredComponent[] = [];

  for (const config of configs) {
    const pkgRoot = path.resolve(CWD, config.packageDir);
    let files: string[] = [];

    if (config.discovery === 'whitelist' && config.whitelist) {
      files = config.whitelist.map((f) => path.resolve(pkgRoot, f));
    } else {
      // Scan src/ for component files
      files = getComponentFilesInFolder(path.join(pkgRoot, 'src'));
    }

    for (const filePath of files) {
      if (!fs.existsSync(filePath)) {
        continue;
      }
      if (config.skipComponent?.(filePath)) {
        continue;
      }

      const componentName = path.basename(filePath, '.tsx');
      if (componentName.startsWith('use')) {
        continue;
      } // Skip hooks

      // Check if exported from the package
      const sourceFile = program.getSourceFile(filePath);
      if (!sourceFile) {
        continue;
      }

      // For scan mode, verify the component is actually exported
      if (config.discovery === 'scan') {
        const entryPath = path.resolve(pkgRoot, 'src/index.ts');
        const entryFile = program.getSourceFile(entryPath);
        if (entryFile) {
          const entrySymbol = checker.getSymbolAtLocation(entryFile);
          if (entrySymbol) {
            const exports = checker.getExportsOfModule(entrySymbol);
            const isExported = exports.some(
              (e) =>
                e.name === componentName ||
                (config.includeUnstable && e.name === `Unstable_${componentName}`),
            );
            if (!isExported) {
              continue;
            }
          }
        }
      }

      components.push({
        name: componentName,
        filePath,
        packageName: config.name,
        packageDir: config.packageDir,
        section: config.section,
        reExportPackages: config.reExportPackages,
      });
    }
  }

  return components;
}

// ---------------------------------------------------------------------------
// Demo extraction from markdown files
// ---------------------------------------------------------------------------

interface DemoInfo {
  demoPageTitle: string;
  demoPathname: string;
}

type DemoMap = Map<string, DemoInfo[]>;

function loadDemos(): DemoMap {
  const demos: DemoMap = new Map();

  const sections: { dir: string; prefix: string; urlPrefix: string }[] = [
    { dir: 'docs/data/charts', prefix: '/charts', urlPrefix: '/x/react-charts' },
    { dir: 'docs/data/date-pickers', prefix: '/date-pickers', urlPrefix: '/x/react-date-pickers' },
    { dir: 'docs/data/tree-view', prefix: '/tree-view', urlPrefix: '/x/react-tree-view' },
    { dir: 'docs/data/data-grid', prefix: '/data-grid', urlPrefix: '/x/react-data-grid' },
  ];

  for (const { dir, prefix, urlPrefix } of sections) {
    const mdFiles = findMarkdownFiles(path.resolve(CWD, dir));
    for (const mdFile of mdFiles) {
      const content = fs.readFileSync(mdFile, 'utf8');
      const headers = parseMarkdownHeaders(content);
      if (!headers.components) {
        continue;
      }

      const relativePath = path.relative(path.resolve(CWD, dir), mdFile);
      // Compute pathname: remove /data segment, get directory path
      const pathParts = relativePath.replace(/\\/g, '/').split('/');
      // Remove the filename - use directory path
      pathParts.pop();
      let pathname = `/${prefix.replace(/^\//, '')}/${pathParts.join('/')}`;
      // Clean up double slashes
      pathname = pathname.replace(/\/+/g, '/');

      const title = extractTitle(content);

      for (const comp of headers.components) {
        const existing = demos.get(comp) || [];

        // Handle data-grid components differently
        let demoPathname: string;
        if (prefix === '/data-grid' && mdFile.includes('/components/')) {
          demoPathname = `/x/react-data-grid/components/${pathParts[pathParts.length - 1]}`;
        } else {
          demoPathname = `${pathname.replace(prefix, urlPrefix)}/`;
        }

        existing.push({ demoPageTitle: title, demoPathname });
        demos.set(comp, existing);
      }
    }
  }

  return demos;
}

function findMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md') && !/-[a-z]{2}\.md$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function parseMarkdownHeaders(content: string): { components?: string[] } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return {};
  }
  const yaml = match[1];
  const compMatch = yaml.match(/^components:\s*(.+)$/m);
  if (!compMatch) {
    return {};
  }
  const components = compMatch[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return { components };
}

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  if (match) {
    return match[1].trim();
  }
  // Fall back to title in YAML header
  const yamlMatch = content.match(/^---\r?\n[\s\S]*?^title:\s*(.+)$/m);
  return yamlMatch ? yamlMatch[1].trim() : '';
}

// ---------------------------------------------------------------------------
// Test file parsing (for forwardsRefTo, spread, themeDefaultProps)
// ---------------------------------------------------------------------------

interface ConformanceInfo {
  forwardsRefTo?: string;
  spread?: boolean;
  themeDefaultProps?: boolean | null;
}

function parseConformanceTest(componentFilePath: string): ConformanceInfo {
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
// MuiName extraction from source
// ---------------------------------------------------------------------------

function extractMuiName(filePath: string, componentName: string): string {
  const content = fs.readFileSync(filePath, 'utf8');
  // Look for name: 'MuiXxx' in styled() or useUtilityClasses
  const match = content.match(/name:\s*'(Mui\w+)'/);
  if (match) {
    return match[1];
  }
  return `Mui${componentName}`;
}

// ---------------------------------------------------------------------------
// Slot extraction
// ---------------------------------------------------------------------------

function extractSlots(
  propsType: ts.Type,
  checker: ts.TypeChecker,
  componentName: string,
  section: string,
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

function stripOptionalType(type: ts.Type, checker: ts.TypeChecker): ts.Type {
  if (type.isUnion()) {
    const filtered = type.types.filter(
      (t) => !(t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)),
    );
    if (filtered.length === 1) {
      return filtered[0];
    }
    if (filtered.length > 1) {
      return checker.getUnionType(filtered);
    }
  }
  return type;
}

// ---------------------------------------------------------------------------
// Class extraction
// ---------------------------------------------------------------------------

function extractClasses(
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
  const classesSymbol = exports.find((e) => e.name === classesInterfaceName);
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
// Extract prop names from the generated PropTypes block in source files
// ---------------------------------------------------------------------------

function extractPropTypesNames(filePath: string): Set<string> {
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
      depth++;
    } else if (ch === '}') {
      depth--;
    }
    i++;
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
        braceDepth++;
      } else if (c === '}') {
        braceDepth--;
      } else if (c === '(') {
        parenDepth++;
      } else if (c === ')') {
        parenDepth--;
      } else if (c === '[') {
        bracketDepth++;
      } else if (c === ']') {
        bracketDepth--;
      }
    }
  }

  return names;
}

// ---------------------------------------------------------------------------
// Check if a component definition has @ignore in its JSDoc
// ---------------------------------------------------------------------------

function hasIgnoreOnDefinition(sourceText: string, componentName: string): boolean {
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
// Component API extraction (main function)
// ---------------------------------------------------------------------------

function extractComponentApi(
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
      (e) => e.name === comp.name || e.name === `Unstable_${comp.name}`,
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
  // Also determine which props the old react-docgen system would include.
  // react-docgen only includes props with JSDoc descriptions directly on the props type,
  // not inherited base props like apiRef, children, className, sx, theme.
  const COMMON_INHERITED_PROPS = new Set(['apiRef', 'children', 'className', 'sx', 'theme', 'ref']);

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

    // Props that should not be resolved (matches generateProptypes.ts shouldResolveObject)
    const UNRESOLVED_OBJECT_PROPS = new Set([
      'classes',
      'slots',
      'slotProps',
      'columns',
      'currentColumn',
      'colDef',
      'initialState',
      'renderedColumns',
      'scrollBarState',
      'renderState',
      'visibleColumns',
      'cellFocus',
      'cellTabIndex',
      'csvOptions',
      'printOptions',
      'column',
      'groupingColDef',
      'rowNode',
      'pinnedColumns',
      'localeText',
      'columnGroupingModel',
      'fieldRef',
      'startFieldRef',
      'endFieldRef',
      'series',
      'axis',
      'plugins',
      'seriesConfig',
      'manager',
      // Date picker date objects
      'value',
      'defaultValue',
      'minDate',
      'maxDate',
      'minDateTime',
      'maxDateTime',
      'minTime',
      'maxTime',
      'referenceDate',
      'day',
      'currentMonth',
      'month',
    ]);

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

function findComponentPropsType(
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
    (e) => e.name === componentName || e.name === `Unstable_${componentName}`,
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
    const propsSym = exports.find((e) => e.name === propsName);
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
// Helpers
// ---------------------------------------------------------------------------

function htmlEncode(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\[\[(\w+)\]\]/g, (_, name) => name); // Linkification handled later
}

function getSubdirectoryImport(filePath: string, packageDir: string): string {
  const relativePath = path.relative(path.resolve(CWD, packageDir), filePath).replace(/\\/g, '/');
  // e.g., src/LineChart/AreaPlot.tsx → @mui/x-charts/LineChart
  const parts = relativePath.replace(/^src\//, '').split('/');
  const pkgName = `@mui/${path.basename(packageDir)}`;
  if (parts.length > 1) {
    return `${pkgName}/${parts[0]}`;
  }
  return `${pkgName}/${parts[0].replace('.tsx', '')}`;
}

function getDefaultDemos(comp: DiscoveredComponent): DemoInfo[] {
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

function formatDemosHtml(demoInfos: DemoInfo[], comp: DiscoveredComponent): string {
  if (demoInfos.length === 0) {
    return '';
  }
  const items = demoInfos.map((d) => {
    const planBadge = d.demoPathname.includes('premium')
      ? ' <span class="plan-premium"></span>'
      : d.demoPathname.includes('pro')
        ? ' <span class="plan-pro"></span>'
        : '';
    return `<li><a href="${d.demoPathname}">${d.demoPageTitle}</a>${planBadge}</li>`;
  });
  return `<ul>${items.join('\n')}</ul>`;
}

function parseClassDescription(desc: string): TranslationClassDesc {
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

// ---------------------------------------------------------------------------
// Output generation
// ---------------------------------------------------------------------------

interface FileWrite {
  path: string;
  content: string;
}

function generateComponentFiles(api: ComponentApi): FileWrite[] {
  const files: FileWrite[] = [];
  const slug = kebabCase(api.name);
  const apiDir = `docs/pages/x/api/${api.section}`;
  const translationDir = `docs/translations/api-docs/${api.section}/${slug}`;

  // 1. JSON API file
  const jsonContent: Record<string, any> = {
    props: api.props,
    name: api.name,
    imports: api.imports,
    slots: api.slots,
    classes: api.classes,
  };

  // Add optional metadata
  if (api.spread !== undefined) {
    jsonContent.spread = api.spread;
  }
  if (api.themeDefaultProps !== undefined) {
    jsonContent.themeDefaultProps = api.themeDefaultProps;
  }
  jsonContent.muiName = api.muiName;
  if (api.forwardsRefTo !== undefined) {
    jsonContent.forwardsRefTo = api.forwardsRefTo;
  }
  jsonContent.filename = api.filename;
  jsonContent.inheritance = api.inheritance;
  jsonContent.demos = api.demos;
  jsonContent.cssComponent = api.cssComponent;

  files.push({
    path: `${apiDir}/${slug}.json`,
    content: JSON.stringify(jsonContent),
  });

  // 2. JS wrapper page
  const isDataGrid =
    api.section === 'data-grid' &&
    ['DataGrid', 'DataGridPro', 'DataGridPremium'].includes(api.name);

  let jsContent: string;
  if (isDataGrid) {
    jsContent = `import * as React from 'react';
import ApiPage from 'docs/src/modules/components/ApiPage';
import mapApiPageTranslations from 'docs/src/modules/utils/mapApiPageTranslations';
import layoutConfig from 'docsx/src/modules/utils/dataGridLayoutConfig';
import jsonPageContent from './${slug}.json';

export default function Page(props) {
  const { descriptions } = props;
  return <ApiPage {...layoutConfig} descriptions={descriptions} pageContent={jsonPageContent} />;
}

export async function getStaticProps() {
  const req = require.context(
    'docsx/translations/api-docs/${api.section}/${slug}',
    false,
    /\\.\\/${slug}.*\\.json$/,
  );
  const descriptions = mapApiPageTranslations(req);

  return { props: { descriptions } };
}
`;
  } else {
    jsContent = `import * as React from 'react';
import ApiPage from 'docs/src/modules/components/ApiPage';
import mapApiPageTranslations from 'docs/src/modules/utils/mapApiPageTranslations';
import jsonPageContent from './${slug}.json';

export default function Page(props) {
  const { descriptions } = props;
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}

export async function getStaticProps() {
  const req = require.context(
    'docsx/translations/api-docs/${api.section}/${slug}',
    false,
    /\\.\\/${slug}.*\\.json$/,
  );
  const descriptions = mapApiPageTranslations(req);

  return { props: { descriptions } };
}
`;
  }

  files.push({ path: `${apiDir}/${slug}.js`, content: jsContent });

  // 3. Translation file
  const translation = {
    componentDescription: api.componentDescription,
    propDescriptions: api.propDescriptions,
    classDescriptions: api.classDescriptions,
    slotDescriptions: api.slotDescriptions,
  };
  files.push({
    path: `${translationDir}/${slug}.json`,
    content: JSON.stringify(translation),
  });

  return files;
}

function generateManifest(section: string, components: ComponentApi[]): FileWrite {
  type PageType = { pathname: string; title: string; plan?: string };
  const pages: PageType[] = components
    .map((c) => {
      const plan =
        (c.filename.includes('-pro') && 'pro') || (c.filename.includes('-premium') && 'premium');
      return {
        pathname: `/x/api/${section}/${kebabCase(c.name)}`,
        title: c.name,
        ...(plan ? { plan } : {}),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  // Deduplicate by pathname
  const seen = new Set<string>();
  const unique = pages.filter((p) => {
    if (seen.has(p.pathname)) {
      return false;
    }
    seen.add(p.pathname);
    return true;
  });

  const varName =
    section === 'data-grid'
      ? 'dataGridApiPages'
      : section === 'date-pickers'
        ? 'datePickersApiPages'
        : section === 'charts'
          ? 'chartsApiPages'
          : 'treeViewApiPages';

  const content = `import type { MuiPage } from '@mui/docs/MuiPage';

const ${varName}: MuiPage[] = ${JSON.stringify(unique, null, 2)};
export default ${varName};
`;

  const fileName =
    section === 'data-grid'
      ? 'dataGridApiPages'
      : section === 'date-pickers'
        ? 'datePickersApiPages'
        : section === 'charts'
          ? 'chartsApiPages'
          : 'treeViewApiPages';

  return { path: `docs/data/${fileName}.ts`, content };
}

// ---------------------------------------------------------------------------
// Interface documentation
// ---------------------------------------------------------------------------

interface InterfaceDocEntry {
  folder: string;
  packages: string[];
  documentedInterfaces: string[];
}

const INTERFACES_TO_DOCUMENT: InterfaceDocEntry[] = [
  {
    folder: 'data-grid',
    packages: ['x-data-grid', 'x-data-grid-pro', 'x-data-grid-premium', 'x-data-grid-generator'],
    documentedInterfaces: [
      'GridApi',
      'GridCellParams',
      'GridRenderContext',
      'GridRowParams',
      'GridRowClassNameParams',
      'GridRowSpacingParams',
      'GridExportStateParams',
      'GridRowOrderChangeParams',
      'GridColDef',
      'GridSingleSelectColDef',
      'GridActionsColDef',
      'GridListViewColDef',
      'GridCsvExportOptions',
      'GridPrintExportOptions',
      'GridExcelExportOptions',
      'GridFilterModel',
      'GridFilterItem',
      'GridFilterOperator',
      'GridAggregationFunction',
      'GridAggregationFunctionDataSource',
    ],
  },
  {
    folder: 'charts',
    packages: ['x-charts', 'x-charts-pro', 'x-charts-premium'],
    documentedInterfaces: [
      'BarSeries',
      'LineSeries',
      'PieSeries',
      'ScatterSeries',
      'FunnelSeries',
      'HeatmapSeries',
      'RadarSeries',
      'AxisConfig',
      'ChartImageExportOptions',
      'ChartPrintExportOptions',
      'LegendItemParams',
    ],
  },
];

const DATAGRID_API_INTERFACES = [
  'GridCellSelectionApi',
  'GridColumnPinningApi',
  'GridColumnResizeApi',
  'GridCsvExportApi',
  'GridDetailPanelApi',
  'GridEditingApi',
  'GridExcelExportApi',
  'GridFilterApi',
  'GridPaginationApi',
  'GridPrintExportApi',
  'GridRowGroupingApi',
  'GridRowMultiSelectionApi',
  'GridRowSelectionApi',
  'GridScrollApi',
  'GridSortApi',
  'GridVirtualizationApi',
];

function buildInterfaceDocumentation(checker: ts.TypeChecker, program: ts.Program): FileWrite[] {
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
        const found = exports.find((e) => e.name === interfaceName);
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
    const found = exports.find((e) => e.name === interfaceName);
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

    console.log(`  Built JSON file for ${interfaceName}`);
  }

  // Linkify translations
  for (const entry of INTERFACES_TO_DOCUMENT) {
    const translationDir = path.resolve(CWD, `docs/translations/api-docs/${entry.folder}`);
    linkifyTranslations(translationDir, documentedInterfaces, entry.folder);
  }

  return files;
}

function linkifyTranslations(
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

function escapeHtml(s: string): string {
  return s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---------------------------------------------------------------------------
// Grid events documentation
// ---------------------------------------------------------------------------

function buildGridEventsDocumentation(checker: ts.TypeChecker, program: ts.Program): FileWrite[] {
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
    const eventLookup = exports.find((e) => e.name === 'GridEventLookup');
    if (!eventLookup) {
      continue;
    }

    let resolved = eventLookup;
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
      const dgProps = exports.find((e) => e.name === 'DataGridPremiumProps');
      if (dgProps) {
        let resolved = dgProps;
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

  console.log('  Built events file');
  return files;
}

// ---------------------------------------------------------------------------
// Grid selectors documentation
// ---------------------------------------------------------------------------

function buildGridSelectorsDocumentation(
  checker: ts.TypeChecker,
  program: ts.Program,
): FileWrite[] {
  const files: FileWrite[] = [];

  const entryPath = path.resolve(CWD, 'packages/x-data-grid-premium/src/index.ts');
  const sf = program.getSourceFile(entryPath);
  if (!sf) {
    return files;
  }

  const modSymbol = checker.getSymbolAtLocation(sf);
  if (!modSymbol) {
    return files;
  }

  const exports = checker.getExportsOfModule(modSymbol);
  const selectors: any[] = [];

  for (const exp of exports) {
    if (!exp.name.endsWith('Selector')) {
      continue;
    }
    if (exp.name === 'useGridSelector') {
      continue;
    }
    if (!/^[a-z]/.test(exp.name)) {
      continue;
    }

    let resolved = exp;
    if (resolved.flags & ts.SymbolFlags.Alias) {
      resolved = checker.getAliasedSymbol(resolved);
    }

    const jsDoc = extractJsDoc(resolved, checker);
    if (jsDoc.ignore) {
      continue;
    }

    const type = checker.getTypeOfSymbol(resolved);
    const callSigs = type.getCallSignatures();

    let returnType = '';
    if (callSigs.length > 0) {
      const retType = checker.getReturnTypeOfSignature(callSigs[0]);
      returnType = checker.typeToString(retType, undefined, ts.TypeFormatFlags.NoTruncation);
      // Clean up generic params
      returnType = returnType.replace(/<GridApi(?:Community|Pro)?>/g, '');
    }

    // Extract JSDoc tags from declarations
    let categoryStr: string | undefined;
    let deprecatedStr: string | undefined;
    const selectorDecls = resolved.getDeclarations() || [];
    for (const decl of selectorDecls) {
      for (const jsDocTag of ts.getJSDocTags(decl)) {
        const comment =
          typeof jsDocTag.comment === 'string'
            ? jsDocTag.comment
            : ts.getTextOfJSDocComment(jsDocTag.comment);
        if (jsDocTag.tagName.text === 'category' && comment) {
          categoryStr = comment;
        } else if (jsDocTag.tagName.text === 'deprecated') {
          deprecatedStr = comment || '';
        }
      }
    }

    const selector: any = {
      name: exp.name,
      returnType,
    };

    if (categoryStr) {
      selector.category = categoryStr;
    }
    if (deprecatedStr !== undefined) {
      selector.deprecated = deprecatedStr || true;
    }
    if (jsDoc.description) {
      selector.description = jsDoc.description;
    }

    selectors.push(selector);
  }

  selectors.sort((a, b) => a.name.localeCompare(b.name));
  files.push({
    path: 'docs/pages/x/api/data-grid/selectors.json',
    content: JSON.stringify(selectors),
  });

  return files;
}

// ---------------------------------------------------------------------------
// Exports documentation
// ---------------------------------------------------------------------------

function buildExportsDocumentation(checker: ts.TypeChecker, program: ts.Program): FileWrite[] {
  const files: FileWrite[] = [];
  const packages = [
    'x-license',
    'x-data-grid',
    'x-data-grid-pro',
    'x-data-grid-premium',
    'x-data-grid-generator',
    'x-date-pickers',
    'x-date-pickers-pro',
    'x-charts',
    'x-charts-pro',
    'x-charts-premium',
    'x-tree-view',
    'x-tree-view-pro',
  ];

  const kindNames: Record<number, string> = {
    [ts.SyntaxKind.FunctionDeclaration]: 'Function',
    [ts.SyntaxKind.InterfaceDeclaration]: 'Interface',
    [ts.SyntaxKind.TypeAliasDeclaration]: 'TypeAlias',
    [ts.SyntaxKind.VariableDeclaration]: 'Variable',
    [ts.SyntaxKind.ClassDeclaration]: 'Class',
    [ts.SyntaxKind.EnumDeclaration]: 'Enum',
    [ts.SyntaxKind.ModuleDeclaration]: 'Module',
  };

  for (const pkg of packages) {
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
    const items: { name: string; kind: string }[] = [];

    for (const exp of exports) {
      let resolved = exp;
      if (resolved.flags & ts.SymbolFlags.Alias) {
        resolved = checker.getAliasedSymbol(resolved);
      }

      const declarations = resolved.getDeclarations();
      if (!declarations || declarations.length === 0) {
        continue;
      }

      const decl = declarations[0];
      const kind = kindNames[decl.kind] || 'Variable';
      items.push({ name: exp.name, kind });
    }

    items.sort((a, b) => a.name.localeCompare(b.name));
    files.push({
      path: `scripts/${pkg}.exports.json`,
      content: JSON.stringify(items),
    });
  }

  return files;
}

// ---------------------------------------------------------------------------
// Remove stale files that exist on disk but are not being generated
// ---------------------------------------------------------------------------

function cleanupStaleFiles(fileWrites: FileWrite[]): void {
  const generatedPaths = new Set(fileWrites.map((f) => path.resolve(CWD, f.path)));

  // Only clean directories that we write to
  const apiDirs = [
    'docs/pages/x/api/charts',
    'docs/pages/x/api/data-grid',
    'docs/pages/x/api/date-pickers',
    'docs/pages/x/api/tree-view',
  ];

  for (const dir of apiDirs) {
    const absDir = path.resolve(CWD, dir);
    if (!fs.existsSync(absDir)) {
      continue;
    }
    for (const file of fs.readdirSync(absDir)) {
      if (!file.endsWith('.json') && !file.endsWith('.js')) {
        continue;
      }
      const absFile = path.join(absDir, file);
      if (!generatedPaths.has(absFile)) {
        fs.unlinkSync(absFile);
      }
    }
  }

  // Also clean translation directories
  const translationDirs = [
    'docs/translations/api-docs/charts',
    'docs/translations/api-docs/data-grid',
    'docs/translations/api-docs/date-pickers',
    'docs/translations/api-docs/tree-view',
  ];

  for (const dir of translationDirs) {
    const absDir = path.resolve(CWD, dir);
    if (!fs.existsSync(absDir)) {
      continue;
    }
    for (const subdir of fs.readdirSync(absDir, { withFileTypes: true })) {
      if (!subdir.isDirectory()) {
        continue;
      }
      const subPath = path.join(absDir, subdir.name);
      // Check if any generated file targets this subdirectory
      const hasGeneratedFiles = fileWrites.some((f) =>
        path.resolve(CWD, f.path).startsWith(subPath),
      );
      if (!hasGeneratedFiles) {
        fs.rmSync(subPath, { recursive: true });
      }
    }
  }
}

// ---------------------------------------------------------------------------
// File writer with prettier
// ---------------------------------------------------------------------------

async function writeAllFiles(fileWrites: FileWrite[]): Promise<void> {
  // Ensure directories exist
  const dirs = new Set(fileWrites.map((f) => path.dirname(path.resolve(CWD, f.path))));
  for (const dir of dirs) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Format and write files in parallel batches.
  // Resolve prettier config per-file (the repo has no root .prettierrc —
  // config comes from the monorepo via overrides and editorconfig).
  const BATCH_SIZE = 50;
  for (let i = 0; i < fileWrites.length; i += BATCH_SIZE) {
    const batch = fileWrites.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (fw) => {
        const fullPath = path.resolve(CWD, fw.path);
        const config = await prettier.resolveConfig(fullPath);
        const formatted = await prettier.format(fw.content, {
          ...config,
          filepath: fullPath,
        });
        await fsp.writeFile(fullPath, formatted, 'utf8');
      }),
    );
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const start = Date.now();

  console.log('Creating TypeScript program...');
  const { program, checker } = createTSProgram();
  console.log(`  Program created in ${Date.now() - start}ms`);

  console.log('Loading demos from markdown...');
  const demos = loadDemos();
  console.log(`  Found demos for ${demos.size} components`);

  console.log('Discovering components...');
  const configs = getPackageConfigs();
  const components = discoverComponents(configs, checker, program);
  console.log(`  Found ${components.length} components`);

  console.log('Extracting component APIs...');
  const allFiles: FileWrite[] = [];
  const componentsBySection = new Map<string, ComponentApi[]>();

  for (const comp of components) {
    const api = extractComponentApi(comp, checker, program, demos);
    if (!api) {
      continue;
    }

    const sectionComponents = componentsBySection.get(comp.section) || [];
    sectionComponents.push(api);
    componentsBySection.set(comp.section, sectionComponents);

    allFiles.push(...generateComponentFiles(api));
    process.stdout.write(`  ${api.name}\r`);
  }
  console.log(`  Extracted ${allFiles.length / 3} component APIs`);

  // Generate manifests
  console.log('Generating manifests...');
  for (const [section, comps] of componentsBySection) {
    allFiles.push(generateManifest(section, comps));
  }

  // Interface documentation
  console.log('Building interface documentation...');
  allFiles.push(...buildInterfaceDocumentation(checker, program));

  // Grid events
  console.log('Building grid events...');
  allFiles.push(...buildGridEventsDocumentation(checker, program));

  // Grid selectors
  console.log('Building grid selectors...');
  allFiles.push(...buildGridSelectorsDocumentation(checker, program));

  // Exports
  console.log('Building exports documentation...');
  allFiles.push(...buildExportsDocumentation(checker, program));

  // Clean up stale files from previous runs
  console.log('Cleaning up stale files...');
  cleanupStaleFiles(allFiles);

  // Write all files
  console.log(`Writing ${allFiles.length} files...`);
  await writeAllFiles(allFiles);

  console.log(`Done in ${Date.now() - start}ms`);
}

yargs(hideBin(process.argv))
  .command({
    command: '$0',
    describe: 'Generates API documentation from TypeScript type definitions.',
    builder: (command) =>
      command.option('grep', {
        description: 'Filter components by name pattern',
        type: 'string',
      }),
    handler: () =>
      main().catch((e) => {
        console.error(e);
        process.exit(1);
      }),
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
