/**
 * Script to replace barrel imports with deep imports in packages/x-charts/src
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.join(__dirname, '..');
const srcDir = path.join(baseDir, 'packages', 'x-charts', 'src');

function getRelPath(fromFile, toAbsPath) {
  const fromDir = path.dirname(fromFile);
  let rel = path.relative(fromDir, toAbsPath).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel;
}

/**
 * Process a file, replacing imports from barrelDir with deep imports.
 * exportMap: { exportName: 'deepFileRelativeToBarrelDir' }
 * absoluteExports: { exportName: '@scope/pkg/...' } for external packages
 */
function processFile(filePath, barrelDir, exportMap) {
  if (!fs.existsSync(filePath)) {
    console.warn(`  MISSING: ${filePath}`);
    return false;
  }
  const content = fs.readFileSync(filePath, 'utf8');

  // Compute what import paths could refer to this barrel from this file
  const fromDir = path.dirname(filePath);
  let relToBarrel = path.relative(fromDir, barrelDir).replace(/\\/g, '/');
  if (!relToBarrel.startsWith('.')) relToBarrel = './' + relToBarrel;
  const barrelPatterns = new Set([relToBarrel, relToBarrel + '/index']);

  // Regex to match any import (possibly multi-line) from a barrel path
  // We'll process line by line collecting multi-line imports
  const lines = content.split('\n');
  const newLines = [...lines];
  let changed = false;

  // We need to handle multi-line imports. Build them up:
  let i = 0;
  while (i < newLines.length) {
    const line = newLines[i];

    // Check if this line starts an import that comes from our barrel
    // Simple check: does this line contain "from 'barrelPattern'"
    // But the from clause might be at end of a multi-line import
    // Strategy: find all complete import statements (may span multiple lines)

    // Check single-line import
    const singleMatch = line.match(/^(import(?:\s+type)?\s+\{[^}]+\})\s+from\s+(['"])(.*?)\2;?$/);
    if (singleMatch && barrelPatterns.has(singleMatch[3])) {
      const replacement = buildReplacement(singleMatch[1], filePath, barrelDir, exportMap, false);
      if (replacement !== null) {
        newLines[i] = replacement;
        changed = true;
      }
      i++;
      continue;
    }

    // Check start of multi-line import: "import { ... or import type { ..."
    // where the closing } from ... is on a later line
    const multiStart = line.match(/^(import(?:\s+type)?\s+\{)(.*)$/);
    if (multiStart && !line.includes('}')) {
      // Accumulate lines until we find the closing } from ...
      let j = i + 1;
      let accumulated = line;
      while (j < newLines.length) {
        accumulated += '\n' + newLines[j];
        if (newLines[j].includes('}')) break;
        j++;
      }
      // Now check if the 'from' is on line j or j+1
      // Look for "} from '...'"
      const closingMatch = accumulated.match(/\}\s+from\s+(['"])(.*?)\1;?$/s);
      if (closingMatch && barrelPatterns.has(closingMatch[2])) {
        // Extract the full specifiers block
        const specsBlock = accumulated.match(/\{([\s\S]*?)\}/);
        if (specsBlock) {
          const isTypeImport = /^import\s+type/.test(line);
          const replacement = buildReplacement(
            (isTypeImport ? 'import type {' : 'import {') + specsBlock[1] + '}',
            filePath, barrelDir, exportMap, isTypeImport
          );
          if (replacement !== null) {
            // Replace lines i through j
            newLines.splice(i, j - i + 1, replacement);
            changed = true;
            // Don't increment i, the new content is at i
            continue;
          }
        }
      }
    }

    i++;
  }

  if (changed) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
    return true;
  }
  return false;
}

function buildReplacement(importHead, filePath, barrelDir, exportMap, isTypeImport) {
  // Extract specifiers from importHead: "import [type] { spec1, type spec2, ... }"
  const specsMatch = importHead.match(/\{([\s\S]*)\}/);
  if (!specsMatch) return null;

  const specifiers = specsMatch[1]
    .split(',')
    .map(s => s.trim().replace(/\n/g, ' ').replace(/\s+/g, ' '))
    .filter(Boolean)
    .map(s => {
      const typeMatch = s.match(/^type\s+(.+)$/);
      if (typeMatch) return { name: typeMatch[1].trim(), isType: true };
      return { name: s, isType: false };
    });

  // Group by deep file
  const byDeepFile = new Map();
  const unknown = [];

  for (const spec of specifiers) {
    // Handle aliased imports: "Name as Alias"
    const actualName = spec.name.split(/\s+as\s+/)[0].trim();
    const deepFile = exportMap[actualName];
    if (deepFile === undefined) {
      unknown.push(spec);
      console.warn(`    UNKNOWN export: ${actualName} in ${filePath}`);
    } else {
      if (!byDeepFile.has(deepFile)) byDeepFile.set(deepFile, []);
      byDeepFile.get(deepFile).push(spec);
    }
  }

  // Build import statements
  const stmts = [];
  for (const [deepFile, specs] of byDeepFile) {
    let importPath;
    if (deepFile.startsWith('@')) {
      importPath = deepFile;
    } else {
      const absoluteDeep = path.join(barrelDir, deepFile);
      importPath = getRelPath(filePath, absoluteDeep);
    }

    const allType = isTypeImport || specs.every(s => s.isType);
    const typePrefix = allType ? 'import type' : 'import';
    const specList = specs.map(s => {
      if (s.isType && !isTypeImport) return `type ${s.name}`;
      return s.name;
    }).join(', ');
    stmts.push(`${typePrefix} { ${specList} } from '${importPath}';`);
  }

  if (unknown.length > 0) {
    // Keep unknown ones in the original barrel import - they'll be left as is
    // Actually we just warn and skip for now
  }

  return stmts.join('\n');
}

// =============================================================================
// EXPORT MAPS
// =============================================================================

// hooks/ barrel
const hooksDir = path.join(srcDir, 'hooks');
const hooksExportMap = {
  useXAxes: 'useAxis',
  useYAxes: 'useAxis',
  useXAxis: 'useAxis',
  useYAxis: 'useAxis',
  useRotationAxes: 'useAxis',
  useRadiusAxes: 'useAxis',
  useDrawingArea: 'useDrawingArea',
  ChartDrawingArea: 'useDrawingArea',
  useChartId: 'useChartId',
  useLineSeriesContext: 'useLineSeries',
  useLineSeries: 'useLineSeries',
  useScatterSeriesContext: 'useScatterSeries',
  useScatterSeries: 'useScatterSeries',
  usePieSeries: 'usePieSeries',
  usePieSeriesContext: 'usePieSeries',
  UsePieSeriesReturnValue: 'usePieSeries',
  UsePieSeriesContextReturnValue: 'usePieSeries',
  useBarSeries: 'useBarSeries',
  useBarSeriesContext: 'useBarSeries',
  useRadarSeries: 'useRadarSeries',
  useRadarSeriesContext: 'useRadarSeries',
  useItemHighlightState: 'useItemHighlightState',
  useItemHighlightStateGetter: 'useItemHighlightStateGetter',
  getValueToPositionMapper: 'getValueToPositionMapper',
  useColorScale: 'useColorScale',
  useScale: 'useScale',
  useXScale: 'useScale',
  useYScale: 'useScale',
  useRotationScale: 'useScale',
  useRadiusScale: 'useScale',
  useZAxis: 'useZAxis',
  useChartsLayerContainerRef: 'useChartsLayerContainerRef',
  useSeries: 'useSeries',
  useDataset: 'useDataset',
  useLegend: 'useLegend',
  useChartGradientId: 'useChartGradientId',
  useChartGradientIdObjectBound: 'useChartGradientId',
  useChartRootRef: 'useChartRootRef',
  useChartsLocalization: 'useChartsLocalization',
  useBrush: 'useBrush',
  useFocusedItem: 'useFocusedItem',
  useXAxisCoordinates: 'useAxisCoordinates',
  useYAxisCoordinates: 'useAxisCoordinates',
  AxisCoordinates: 'useAxisCoordinates',
  useAxisTicks: 'useAxisTicks',
  TickItem: 'useTicks',
  useAnimate: 'animation/useAnimate',
  useAnimateArea: 'animation/useAnimateArea',
  useAnimateBar: 'animation/useAnimateBar',
  useAnimateBarLabel: 'animation/useAnimateBarLabel',
  useAnimateLine: 'animation/useAnimateLine',
  useAnimatePieArc: 'animation/useAnimatePieArc',
  useAnimatePieArcLabel: 'animation/useAnimatePieArcLabel',
};

// models/ barrel - build dynamically
const modelsDir = path.join(srcDir, 'models');

function buildModelsExportMap() {
  const map = {};

  // Axis exports
  const axisExports = ['AxisConfig', 'ChartsYAxisProps', 'ChartsXAxisProps', 'ScaleName',
    'ContinuousScaleName', 'ChartsAxisData', 'XAxis', 'YAxis', 'RadiusAxis', 'RotationAxis',
    'AxisItemIdentifier', 'AxisValueFormatterContext'];
  for (const e of axisExports) map[e] = 'axis';

  // position
  map['Position'] = 'position';
  // curve
  map['CurveType'] = 'curve';
  // timeTicks
  for (const e of ['TickFrequency', 'OrdinalTimeTicks', 'TickFrequencyDefinition']) map[e] = 'timeTicks';

  // External
  map['NumberValue'] = '@mui/x-charts-vendor/d3-scale';
  map['PropsFromSlot'] = '@mui/x-internals/slots';

  // Scan each seriesType file for exports
  const seriesTypeFiles = [
    { file: path.join(srcDir, 'models', 'seriesType', 'bar.ts'), deep: 'seriesType/bar' },
    { file: path.join(srcDir, 'models', 'seriesType', 'line.ts'), deep: 'seriesType/line' },
    { file: path.join(srcDir, 'models', 'seriesType', 'scatter.ts'), deep: 'seriesType/scatter' },
    { file: path.join(srcDir, 'models', 'seriesType', 'pie.ts'), deep: 'seriesType/pie' },
    { file: path.join(srcDir, 'models', 'seriesType', 'radar.ts'), deep: 'seriesType/radar' },
    { file: path.join(srcDir, 'models', 'seriesType', 'common.ts'), deep: 'seriesType/common' },
    { file: path.join(srcDir, 'models', 'seriesType', 'config.ts'), deep: 'seriesType/config' },
  ];

  for (const { file, deep } of seriesTypeFiles) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const exportRegex = /\bexport\s+(?:type\s+)?(?:interface|type|class|const|function|enum)\s+(\w+)/g;
    let m;
    while ((m = exportRegex.exec(content)) !== null) {
      if (!map[m[1]]) map[m[1]] = deep;
    }
    const reExportRegex = /export\s+(?:type\s+)?\{([^}]+)\}/g;
    while ((m = reExportRegex.exec(content)) !== null) {
      for (const s of m[1].split(',')) {
        const name = s.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
        if (name && !map[name]) map[name] = deep;
      }
    }
  }

  // Scan stacking, slots, featureFlags
  const simpleFiles = [
    { file: path.join(srcDir, 'models', 'stacking.ts'), deep: 'stacking' },
    { file: path.join(srcDir, 'models', 'slots.ts'), deep: 'slots' },
    { file: path.join(srcDir, 'models', 'featureFlags.ts'), deep: 'featureFlags' },
  ];
  for (const { file, deep } of simpleFiles) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const exportRegex = /\bexport\s+(?:type\s+)?(?:interface|type|class|const|function|enum)\s+(\w+)/g;
    let m;
    while ((m = exportRegex.exec(content)) !== null) {
      if (!map[m[1]]) map[m[1]] = deep;
    }
    const reExportRegex = /export\s+(?:type\s+)?\{([^}]+)\}/g;
    while ((m = reExportRegex.exec(content)) !== null) {
      for (const s of m[1].split(',')) {
        const name = s.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
        if (name && !map[name]) map[name] = deep;
      }
    }
  }

  // seriesType/index re-exports (SeriesItemIdentifier, etc)
  // These are defined in seriesType/index.ts (which we're not modifying)
  // but they are exported from the models barrel
  const stIndexFile = path.join(srcDir, 'models', 'seriesType', 'index.ts');
  if (fs.existsSync(stIndexFile)) {
    const content = fs.readFileSync(stIndexFile, 'utf8');
    const exportRegex = /\bexport\s+(?:type\s+)?(?:interface|type|class|const|function|enum)\s+(\w+)/g;
    let m;
    while ((m = exportRegex.exec(content)) !== null) {
      if (!map[m[1]]) map[m[1]] = 'seriesType';
    }
  }

  return map;
}

const modelsExportMap = buildModelsExportMap();
console.log('Models export map built with', Object.keys(modelsExportMap).length, 'entries');

// ChartsLegend barrel - build by scanning files
const chartsLegendDir = path.join(srcDir, 'ChartsLegend');
function buildChartsLegendExportMap() {
  const map = {};
  const files = [
    'ChartsLegend', 'chartsLegend.types', 'direction', 'legendContext.types',
    'chartsLegendClasses', 'ContinuousColorLegend', 'colorLegend.types',
    'continuousColorLegendClasses', 'PiecewiseColorLegend', 'piecewiseColorLegendClasses',
    'piecewiseColorDefaultLabelFormatter', 'piecewiseColorLegend.types', 'legend.types',
  ];
  for (const f of files) {
    const fp = path.join(chartsLegendDir, f + '.ts');
    const fpx = path.join(chartsLegendDir, f + '.tsx');
    const existing = fs.existsSync(fp) ? fp : fs.existsSync(fpx) ? fpx : null;
    if (!existing) continue;
    const content = fs.readFileSync(existing, 'utf8');
    const exportRegex = /\bexport\s+(?:type\s+)?(?:interface|type|class|const|function|enum)\s+(\w+)/g;
    let m;
    while ((m = exportRegex.exec(content)) !== null) {
      if (!map[m[1]]) map[m[1]] = f;
    }
    const reExportRegex = /export\s+(?:type\s+)?\{([^}]+)\}/g;
    while ((m = reExportRegex.exec(content)) !== null) {
      for (const s of m[1].split(',')) {
        const name = s.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
        if (name && !map[name]) map[name] = f;
      }
    }
  }
  return map;
}

// ChartsSurface
const chartsSurfaceDir = path.join(srcDir, 'ChartsSurface');
const chartsSurfaceExportMap = {
  ChartsSurface: 'ChartsSurface',
  ChartsSurfaceProps: 'ChartsSurface',
  chartsSurfaceClasses: 'chartsSurfaceClasses',
  ChartsSurfaceClasses: 'chartsSurfaceClasses',
};

// ChartsText
const chartsTextDir = path.join(srcDir, 'ChartsText');
const chartsTextExportMap = {
  ChartsText: 'ChartsText',
  ChartsTextProps: 'ChartsText',
  ChartsTextStyle: '../internals/getWordsByLines', // special: cross-component
};

// ChartsTooltip
const chartsTooltipDir = path.join(srcDir, 'ChartsTooltip');
function buildChartsTooltipExportMap() {
  const map = {};
  const files = [
    'ChartsTooltip', 'ChartsTooltipContainer', 'chartsTooltipClasses',
    'ChartsAxisTooltipContent', 'ChartsItemTooltipContent', 'ChartsTooltipTable',
    'useItemTooltip', 'useAxesTooltip', 'utils', 'ChartTooltip.types',
  ];
  for (const f of files) {
    const fp = path.join(chartsTooltipDir, f + '.ts');
    const fpx = path.join(chartsTooltipDir, f + '.tsx');
    const existing = fs.existsSync(fp) ? fp : fs.existsSync(fpx) ? fpx : null;
    if (!existing) continue;
    const content = fs.readFileSync(existing, 'utf8');
    const exportRegex = /\bexport\s+(?:type\s+)?(?:interface|type|class|const|function|enum)\s+(\w+)/g;
    let m;
    while ((m = exportRegex.exec(content)) !== null) {
      if (!map[m[1]]) map[m[1]] = f;
    }
    const reExportRegex = /export\s+(?:type\s+)?\{([^}]+)\}/g;
    while ((m = reExportRegex.exec(content)) !== null) {
      for (const s of m[1].split(',')) {
        const name = s.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
        if (name && !map[name]) map[name] = f;
      }
    }
  }
  // Also add special one from internals that the barrel re-exports
  map['ItemTooltip'] = '../internals/plugins/corePlugins/useChartSeriesConfig';
  return map;
}

// ChartsGrid
const chartsGridDir = path.join(srcDir, 'ChartsGrid');
const chartsGridExportMap = {
  ChartsGrid: 'ChartsGrid',
  ChartsGridProps: 'ChartsGrid',
  chartsGridClasses: 'chartsGridClasses',
  ChartsGridClasses: 'chartsGridClasses',
  getChartsGridUtilityClass: 'chartsGridClasses',
};

// ChartsAxisHighlight
const chartsAxisHighlightDir = path.join(srcDir, 'ChartsAxisHighlight');
function buildChartsAxisHighlightExportMap() {
  const map = {};
  const files = ['ChartsAxisHighlight', 'chartsAxisHighlightClasses', 'ChartsAxisHighlight.types', 'ChartsAxisHighlightPath'];
  for (const f of files) {
    const fp = path.join(chartsAxisHighlightDir, f + '.ts');
    const fpx = path.join(chartsAxisHighlightDir, f + '.tsx');
    const existing = fs.existsSync(fp) ? fp : fs.existsSync(fpx) ? fpx : null;
    if (!existing) continue;
    const content = fs.readFileSync(existing, 'utf8');
    const exportRegex = /\bexport\s+(?:type\s+)?(?:interface|type|class|const|function|enum)\s+(\w+)/g;
    let m;
    while ((m = exportRegex.exec(content)) !== null) {
      if (!map[m[1]]) map[m[1]] = f;
    }
    const reExportRegex = /export\s+(?:type\s+)?\{([^}]+)\}/g;
    while ((m = reExportRegex.exec(content)) !== null) {
      for (const s of m[1].split(',')) {
        const name = s.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
        if (name && !map[name]) map[name] = f;
      }
    }
  }
  return map;
}

// ChartContainer
const chartContainerDir = path.join(srcDir, 'ChartContainer');
const chartContainerExportMap = {
  ChartContainer: 'ChartContainer',
  ChartContainerProps: 'ChartContainer',
};

// ChartsOverlay
const chartsOverlayDir = path.join(srcDir, 'ChartsOverlay');
function buildChartsOverlayExportMap() {
  const map = {};
  const files = ['ChartsOverlay', 'ChartsLoadingOverlay', 'ChartsNoDataOverlay'];
  for (const f of files) {
    const fp = path.join(chartsOverlayDir, f + '.ts');
    const fpx = path.join(chartsOverlayDir, f + '.tsx');
    const existing = fs.existsSync(fp) ? fp : fs.existsSync(fpx) ? fpx : null;
    if (!existing) continue;
    const content = fs.readFileSync(existing, 'utf8');
    const exportRegex = /\bexport\s+(?:type\s+)?(?:interface|type|class|const|function|enum)\s+(\w+)/g;
    let m;
    while ((m = exportRegex.exec(content)) !== null) {
      if (!map[m[1]]) map[m[1]] = f;
    }
    const reExportRegex = /export\s+(?:type\s+)?\{([^}]+)\}/g;
    while ((m = reExportRegex.exec(content)) !== null) {
      for (const s of m[1].split(',')) {
        const name = s.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
        if (name && !map[name]) map[name] = f;
      }
    }
  }
  return map;
}

// ChartDataProvider
const chartDataProviderDir = path.join(srcDir, 'ChartDataProvider');
const chartDataProviderExportMap = {
  ChartDataProvider: 'ChartDataProvider',
  ChartDataProviderProps: 'ChartDataProvider',
};

// ChartsWrapper
const chartsWrapperDir = path.join(srcDir, 'ChartsWrapper');
const chartsWrapperExportMap = {
  ChartsWrapper: 'ChartsWrapper',
  ChartsWrapperProps: 'ChartsWrapper',
};

// Toolbar
const toolbarDir = path.join(srcDir, 'Toolbar');
function buildToolbarExportMap() {
  const map = {};
  const files = ['Toolbar', 'ToolbarButton', 'Toolbar.types', 'chartToolbarClasses'];
  for (const f of files) {
    const fp = path.join(toolbarDir, f + '.ts');
    const fpx = path.join(toolbarDir, f + '.tsx');
    const existing = fs.existsSync(fp) ? fp : fs.existsSync(fpx) ? fpx : null;
    if (!existing) continue;
    const content = fs.readFileSync(existing, 'utf8');
    const exportRegex = /\bexport\s+(?:type\s+)?(?:interface|type|class|const|function|enum)\s+(\w+)/g;
    let m;
    while ((m = exportRegex.exec(content)) !== null) {
      if (!map[m[1]]) map[m[1]] = f;
    }
    const reExportRegex = /export\s+(?:type\s+)?\{([^}]+)\}/g;
    while ((m = reExportRegex.exec(content)) !== null) {
      for (const s of m[1].split(',')) {
        const name = s.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
        if (name && !map[name]) map[name] = f;
      }
    }
  }
  return map;
}

// internals/plugins/models
const pluginsModelsDir = path.join(srcDir, 'internals', 'plugins', 'models');
function buildPluginsModelsExportMap() {
  const map = {};
  const files = ['helpers', 'plugin', 'chart'];
  for (const f of files) {
    const fp = path.join(pluginsModelsDir, f + '.ts');
    const fpx = path.join(pluginsModelsDir, f + '.tsx');
    const existing = fs.existsSync(fp) ? fp : fs.existsSync(fpx) ? fpx : null;
    if (!existing) continue;
    const content = fs.readFileSync(existing, 'utf8');
    const exportRegex = /\bexport\s+(?:type\s+)?(?:interface|type|class|const|function|enum)\s+(\w+)/g;
    let m;
    while ((m = exportRegex.exec(content)) !== null) {
      if (!map[m[1]]) map[m[1]] = f;
    }
    const reExportRegex = /export\s+(?:type\s+)?\{([^}]+)\}/g;
    while ((m = reExportRegex.exec(content)) !== null) {
      for (const s of m[1].split(',')) {
        const name = s.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
        if (name && !map[name]) map[name] = f;
      }
    }
  }
  return map;
}

// internals/plugins/corePlugins barrel
const corePluginsDir = path.join(srcDir, 'internals', 'plugins', 'corePlugins');
const corePluginsExportMap = {
  CHART_CORE_PLUGINS: 'corePlugins',
  ChartCorePluginSignatures: 'corePlugins',
  ChartCorePluginParameters: 'corePlugins',
  UseChartElementRefSignature: 'useChartElementRef/useChartElementRef.types',
  UseChartElementRefInstance: 'useChartElementRef/useChartElementRef.types',
};

// =============================================================================
// Run the processing
// =============================================================================

function processFiles(label, consumerFiles, barrelDir, exportMap) {
  console.log(`\n=== ${label} ===`);
  let count = 0;
  for (const f of consumerFiles) {
    const absPath = path.join(baseDir, f);
    const changed = processFile(absPath, barrelDir, exportMap);
    if (changed) {
      count++;
      console.log(`  Updated: ${f}`);
    }
  }
  console.log(`  ${count} files updated`);
}

// Phase 1: hooks
processFiles('Phase 1: hooks', [
  'packages/x-charts/src/ScatterChart/ScatterPlot.tsx',
  'packages/x-charts/src/ScatterChart/FocusedScatterMark.tsx',
  'packages/x-charts/src/PieChart/PieArc.tsx',
  'packages/x-charts/src/LineChart/MarkPlot.tsx',
  'packages/x-charts/src/LineChart/LinePlot.tsx',
  'packages/x-charts/src/ChartsTooltip/ChartsTooltipContainer.tsx',
  'packages/x-charts/src/ChartsLayerContainer/ChartsLayerContainer.tsx',
  'packages/x-charts/src/BarChart/BatchBarPlot/BatchBarPlot.tsx',
  'packages/x-charts/src/BarChart/BarPlot.tsx',
  'packages/x-charts/src/LineChart/useMarkPlotData.ts',
  'packages/x-charts/src/LineChart/useLinePlotData.ts',
  'packages/x-charts/src/LineChart/useAreaPlotData.ts',
  'packages/x-charts/src/ChartsAxisHighlight/ChartsXAxisHighlight.tsx',
  'packages/x-charts/src/ChartsAxisHighlight/ChartsYAxisHighlight.tsx',
  'packages/x-charts/src/BarChart/FocusedBar.tsx',
  'packages/x-charts/src/ChartsAxis/ChartsAxis.tsx',
  'packages/x-charts/src/ScatterChart/useScatterPlotData.ts',
  'packages/x-charts/src/RadarChart/RadarGrid/useRadarGridData.ts',
  'packages/x-charts/src/PieChart/getPieCoordinates.ts',
  'packages/x-charts/src/LineChart/FocusedLineMark.tsx',
  'packages/x-charts/src/LineChart/AnimatedLine.tsx',
  'packages/x-charts/src/LineChart/AppearingMask.tsx',
  'packages/x-charts/src/ChartsYAxis/shortenLabels.tsx',
  'packages/x-charts/src/ChartsYAxis/ChartsYAxis.tsx',
  'packages/x-charts/src/ChartsXAxis/ChartsXAxisImpl.tsx',
  'packages/x-charts/src/ChartsReferenceLine/ChartsXReferenceLine.tsx',
  'packages/x-charts/src/ChartsReferenceLine/ChartsYReferenceLine.tsx',
], hooksDir, hooksExportMap);

// Phase 2: models
processFiles('Phase 2: models', [
  'packages/x-charts/src/RadarChart/RadarSeriesPlot/RadarSeriesMarks.tsx',
  'packages/x-charts/src/LineChart/seriesConfig/seriesProcessor.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartVisibilityManager/useChartVisibilityManager.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartVisibilityManager/useChartVisibilityManager.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartTooltip/useChartTooltip.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartTooltip/useChartTooltip.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartKeyboardNavigation/useChartKeyboardNavigation.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartKeyboardNavigation/useChartKeyboardNavigation.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartHighlight/useChartHighlight.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartHighlight/useChartHighlight.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartClosestPoint/useChartClosestPoint.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartClosestPoint/useChartClosestPoint.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/shared/useRegisterPointerInteractions.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartSeries/useChartSeries.types.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartSeriesConfig/useChartSeriesConfig.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartSeriesConfig/useChartSeriesConfig.types.ts',
  'packages/x-charts/src/internals/identifierSerializer.ts',
  'packages/x-charts/src/internals/identifierCleaner.ts',
  'packages/x-charts/src/PieChart/PieArcLabel.tsx',
  'packages/x-charts/src/ChartsLegend/legendContext.types.ts',
  'packages/x-charts/src/BarChart/BatchBarPlot/BatchBarPlot.tsx',
  'packages/x-charts/src/BarChart/BarPlot.tsx',
  'packages/x-charts/src/BarChart/BarLabel/BarLabelItem.tsx',
  'packages/x-charts/src/BarChart/BarLabel/BarLabel.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartZAxis/useChartZAxis.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartPolarAxis/useChartPolarAxis.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxis.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartBrush/useChartBrush.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartSeries/useChartSeries.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartInteractionListener/useChartInteractionListener.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartElementRef/useChartElementRef.types.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartElementRef/useChartElementRef.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartDimensions/useChartDimensions.ts',
  'packages/x-charts/src/ScatterChart/seriesConfig/seriesProcessor.ts',
  'packages/x-charts/src/LineChart/useMarkPlotData.ts',
  'packages/x-charts/src/LineChart/useLinePlotData.ts',
  'packages/x-charts/src/LineChart/useAreaPlotData.ts',
  'packages/x-charts/src/ChartsWrapper/ChartsWrapper.tsx',
  'packages/x-charts/src/BarChart/seriesConfig/bar/seriesProcessor.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartItemClick/useChartItemClick.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartItemClick/useChartItemClick.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxis.types.ts',
  'packages/x-charts/src/utils/niceDomain.ts',
  'packages/x-charts/src/moduleAugmentation/barChartBatchRendererOnItemClick.ts',
  'packages/x-charts/src/internals/plugins/utils/useLazySelectorEffect.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartZAxis/useChartZAxis.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartPolarAxis/useChartPolarAxis.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartInteraction/useChartInteraction.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartInteraction/useChartInteraction.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartBrush/useChartBrush.types.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartInteractionListener/useChartInteractionListener.types.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartId/useChartId.types.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartId/useChartId.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartExperimentalFeature/useChartExperimentalFeature.types.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartExperimentalFeature/useChartExperimentalFeature.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartDimensions/useChartDimensions.types.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartAnimation/useChartAnimation.types.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartAnimation/useChartAnimation.ts',
  'packages/x-charts/src/internals/dateHelpers.ts',
  'packages/x-charts/src/ScatterChart/useScatterPlotData.ts',
  'packages/x-charts/src/RadarChart/seriesConfig/seriesProcessor.ts',
  'packages/x-charts/src/PieChart/seriesConfig/seriesLayout.ts',
  'packages/x-charts/src/ChartsYAxis/shortenLabels.tsx',
  'packages/x-charts/src/BarChart/types.ts',
  'packages/x-charts/src/BarChart/IndividualBarPlot.tsx',
], modelsDir, modelsExportMap);

// Phase 3: Component barrels
const chartsLegendExportMap = buildChartsLegendExportMap();
processFiles('Phase 3a: ChartsLegend', [
  'packages/x-charts/src/themeAugmentation/props.ts',
  'packages/x-charts/src/hooks/useLegend.ts',
  'packages/x-charts/src/ScatterChart/ScatterChart.tsx',
  'packages/x-charts/src/RadarChart/useRadarChartProps.ts',
  'packages/x-charts/src/RadarChart/RadarChart.tsx',
  'packages/x-charts/src/PieChart/PieChart.tsx',
  'packages/x-charts/src/LineChart/seriesConfig/legend.ts',
  'packages/x-charts/src/LineChart/LineChart.tsx',
  'packages/x-charts/src/BarChart/BarChart.tsx',
  'packages/x-charts/src/ScatterChart/seriesConfig/legend.ts',
  'packages/x-charts/src/PieChart/seriesConfig/legend.ts',
  'packages/x-charts/src/ScatterChart/useScatterChartProps.ts',
  'packages/x-charts/src/LineChart/useLineChartProps.ts',
  'packages/x-charts/src/ChartsWrapper/ChartsWrapper.tsx',
  'packages/x-charts/src/BarChart/useBarChartProps.ts',
  'packages/x-charts/src/ChartsLegend/chartsLegendClasses.ts',
  'packages/x-charts/src/ChartsLegend/chartsLegend.types.ts',
], chartsLegendDir, chartsLegendExportMap);

processFiles('Phase 3b: ChartsSurface', [
  'packages/x-charts/src/themeAugmentation/props.ts',
  'packages/x-charts/src/SparkLineChart/SparkLineChart.tsx',
  'packages/x-charts/src/ScatterChart/ScatterChart.tsx',
  'packages/x-charts/src/RadarChart/useRadarChartProps.ts',
  'packages/x-charts/src/RadarChart/RadarChart.tsx',
  'packages/x-charts/src/PieChart/PieChart.tsx',
  'packages/x-charts/src/LineChart/LineChart.tsx',
  'packages/x-charts/src/ChartsLayerContainer/ChartsLayerContainer.tsx',
  'packages/x-charts/src/ChartsContainer/ChartsContainer.tsx',
  'packages/x-charts/src/ChartsContainer/useChartsContainerProps.ts',
  'packages/x-charts/src/BarChart/BarChart.tsx',
  'packages/x-charts/src/Gauge/GaugeContainer.tsx',
], chartsSurfaceDir, chartsSurfaceExportMap);

processFiles('Phase 3c: ChartsText', [
  'packages/x-charts/src/models/axis.ts',
  'packages/x-charts/src/internals/invertTextAnchor.ts',
  'packages/x-charts/src/Gauge/GaugeValueText.tsx',
  'packages/x-charts/src/ChartsYAxis/useAxisTicksProps.ts',
  'packages/x-charts/src/ChartsYAxis/ChartsYAxisImpl.tsx',
  'packages/x-charts/src/ChartsXAxis/useAxisTicksProps.ts',
  'packages/x-charts/src/ChartsXAxis/ChartsXAxisImpl.tsx',
  'packages/x-charts/src/ChartsReferenceLine/ChartsXReferenceLine.tsx',
  'packages/x-charts/src/ChartsReferenceLine/ChartsYReferenceLine.tsx',
  'packages/x-charts/src/ChartsReferenceLine/common.tsx',
  'packages/x-charts/src/RadarChart/RadarMetricLabels/RadarMetricLabels.tsx',
], chartsTextDir, chartsTextExportMap);

const chartsTooltipExportMap = buildChartsTooltipExportMap();
processFiles('Phase 3d: ChartsTooltip', [
  'packages/x-charts/src/themeAugmentation/overrides.ts',
  'packages/x-charts/src/themeAugmentation/props.ts',
  'packages/x-charts/src/SparkLineChart/SparkLineChart.tsx',
  'packages/x-charts/src/ScatterChart/ScatterChart.tsx',
  'packages/x-charts/src/RadarChart/RadarChart.tsx',
  'packages/x-charts/src/PieChart/PieChart.tsx',
  'packages/x-charts/src/LineChart/LineChart.tsx',
  'packages/x-charts/src/BarChart/BarChart.tsx',
  'packages/x-charts/src/ChartsTooltip/ChartTooltip.types.ts',
], chartsTooltipDir, chartsTooltipExportMap);

processFiles('Phase 3e: ChartsGrid', [
  'packages/x-charts/src/themeAugmentation/overrides.ts',
  'packages/x-charts/src/themeAugmentation/props.ts',
  'packages/x-charts/src/ScatterChart/ScatterChart.tsx',
  'packages/x-charts/src/LineChart/LineChart.tsx',
  'packages/x-charts/src/BarChart/BarChart.tsx',
  'packages/x-charts/src/ScatterChart/useScatterChartProps.ts',
  'packages/x-charts/src/LineChart/useLineChartProps.ts',
  'packages/x-charts/src/BarChart/useBarChartProps.ts',
], chartsGridDir, chartsGridExportMap);

const chartsAxisHighlightExportMap = buildChartsAxisHighlightExportMap();
processFiles('Phase 3f: ChartsAxisHighlight', [
  'packages/x-charts/src/themeAugmentation/overrides.ts',
  'packages/x-charts/src/SparkLineChart/SparkLineChart.tsx',
  'packages/x-charts/src/ScatterChart/ScatterChart.tsx',
  'packages/x-charts/src/LineChart/LineChart.tsx',
  'packages/x-charts/src/BarChart/BarChart.tsx',
  'packages/x-charts/src/ScatterChart/useScatterChartProps.ts',
  'packages/x-charts/src/LineChart/useLineChartProps.ts',
  'packages/x-charts/src/BarChart/useBarChartProps.ts',
], chartsAxisHighlightDir, chartsAxisHighlightExportMap);

processFiles('Phase 3g: ChartContainer', [
  'packages/x-charts/src/SparkLineChart/SparkLineChart.tsx',
  'packages/x-charts/src/ScatterChart/ScatterChart.tsx',
  'packages/x-charts/src/PieChart/PieChart.tsx',
  'packages/x-charts/src/LineChart/LineChart.tsx',
  'packages/x-charts/src/ChartContainer/useChartContainerProps.ts',
  'packages/x-charts/src/BarChart/BarChart.tsx',
  'packages/x-charts/src/ScatterChart/useScatterChartProps.ts',
  'packages/x-charts/src/LineChart/useLineChartProps.ts',
  'packages/x-charts/src/BarChart/useBarChartProps.ts',
], chartContainerDir, chartContainerExportMap);

const chartsOverlayExportMap = buildChartsOverlayExportMap();
processFiles('Phase 3h: ChartsOverlay', [
  'packages/x-charts/src/ScatterChart/ScatterChart.tsx',
  'packages/x-charts/src/RadarChart/useRadarChartProps.ts',
  'packages/x-charts/src/PieChart/PieChart.tsx',
  'packages/x-charts/src/LineChart/LineChart.tsx',
  'packages/x-charts/src/ScatterChart/useScatterChartProps.ts',
  'packages/x-charts/src/LineChart/useLineChartProps.ts',
  'packages/x-charts/src/BarChart/useBarChartProps.ts',
  'packages/x-charts/src/ChartsOverlay/ChartsLoadingOverlay.tsx',
  'packages/x-charts/src/ChartsOverlay/ChartsNoDataOverlay.tsx',
], chartsOverlayDir, chartsOverlayExportMap);

processFiles('Phase 3i: ChartDataProvider', [
  'packages/x-charts/src/SparkLineChart/SparkLineChart.tsx',
  'packages/x-charts/src/ScatterChart/ScatterChart.tsx',
  'packages/x-charts/src/PieChart/PieChart.tsx',
  'packages/x-charts/src/LineChart/LineChart.tsx',
  'packages/x-charts/src/ChartsContainer/useChartsContainerProps.ts',
  'packages/x-charts/src/BarChart/BarChart.tsx',
  'packages/x-charts/src/RadarChart/RadarDataProvider/RadarDataProvider.tsx',
], chartDataProviderDir, chartDataProviderExportMap);

processFiles('Phase 3j: ChartsWrapper', [
  'packages/x-charts/src/ScatterChart/ScatterChart.tsx',
  'packages/x-charts/src/RadarChart/useRadarChartProps.ts',
  'packages/x-charts/src/RadarChart/RadarChart.tsx',
  'packages/x-charts/src/PieChart/PieChart.tsx',
  'packages/x-charts/src/LineChart/LineChart.tsx',
  'packages/x-charts/src/BarChart/BarChart.tsx',
  'packages/x-charts/src/ScatterChart/useScatterChartProps.ts',
  'packages/x-charts/src/LineChart/useLineChartProps.ts',
  'packages/x-charts/src/BarChart/useBarChartProps.ts',
], chartsWrapperDir, chartsWrapperExportMap);

const toolbarExportMap = buildToolbarExportMap();
processFiles('Phase 3k: Toolbar', [
  'packages/x-charts/src/ScatterChart/ScatterChart.tsx',
  'packages/x-charts/src/RadarChart/RadarChart.tsx',
  'packages/x-charts/src/PieChart/PieChart.tsx',
  'packages/x-charts/src/LineChart/LineChart.tsx',
  'packages/x-charts/src/BarChart/BarChart.tsx',
  'packages/x-charts/src/ChartsWrapper/ChartsWrapper.tsx',
], toolbarDir, toolbarExportMap);

// Phase 4: Plugin barrels
const pluginsModelsExportMap = buildPluginsModelsExportMap();
processFiles('Phase 4a: internals/plugins/models', [
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartVisibilityManager/useChartVisibilityManager.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartVisibilityManager/useChartVisibilityManager.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartTooltip/useChartTooltip.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartTooltip/useChartTooltip.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartKeyboardNavigation/useChartKeyboardNavigation.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartKeyboardNavigation/useChartKeyboardNavigation.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartHighlight/useChartHighlight.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartHighlight/useChartHighlight.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartClosestPoint/useChartClosestPoint.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartClosestPoint/useChartClosestPoint.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/shared/useRegisterPointerInteractions.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartSeries/useChartSeries.types.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartSeriesConfig/useChartSeriesConfig.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartSeriesConfig/useChartSeriesConfig.types.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartSeries/useChartSeries.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartInteractionListener/useChartInteractionListener.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartElementRef/useChartElementRef.types.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartElementRef/useChartElementRef.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartDimensions/useChartDimensions.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartItemClick/useChartItemClick.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartItemClick/useChartItemClick.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxis.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartZAxis/useChartZAxis.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartPolarAxis/useChartPolarAxis.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxis.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartBrush/useChartBrush.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartZAxis/useChartZAxis.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartPolarAxis/useChartPolarAxis.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartInteraction/useChartInteraction.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartInteraction/useChartInteraction.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartBrush/useChartBrush.types.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartInteractionListener/useChartInteractionListener.types.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartId/useChartId.types.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartId/useChartId.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartExperimentalFeature/useChartExperimentalFeature.types.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartExperimentalFeature/useChartExperimentalFeature.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartDimensions/useChartDimensions.types.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartAnimation/useChartAnimation.types.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartAnimation/useChartAnimation.ts',
  'packages/x-charts/src/internals/plugins/utils/useLazySelectorEffect.ts',
], pluginsModelsDir, pluginsModelsExportMap);

processFiles('Phase 4b: internals/plugins/corePlugins', [
  // Only the corePlugins index itself imports from the barrel - skip it
  // Actually the grep only found corePlugins/index.ts which is excluded
], corePluginsDir, corePluginsExportMap);

console.log('\n=== All done! ===');
