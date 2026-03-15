/**
 * Phase 2 of barrel import refactoring - handling missed files
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

function processFile(filePath, barrelDir, exportMap) {
  if (!fs.existsSync(filePath)) {
    console.warn(`  MISSING: ${filePath}`);
    return false;
  }
  const content = fs.readFileSync(filePath, 'utf8');

  const fromDir = path.dirname(filePath);
  let relToBarrel = path.relative(fromDir, barrelDir).replace(/\\/g, '/');
  if (!relToBarrel.startsWith('.')) relToBarrel = './' + relToBarrel;
  const barrelPatterns = new Set([relToBarrel, relToBarrel + '/index']);

  const lines = content.split('\n');
  const newLines = [...lines];
  let changed = false;

  let i = 0;
  while (i < newLines.length) {
    const line = newLines[i];

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

    const multiStart = line.match(/^(import(?:\s+type)?\s+\{)(.*)$/);
    if (multiStart && !line.includes('}')) {
      let j = i + 1;
      let accumulated = line;
      while (j < newLines.length) {
        accumulated += '\n' + newLines[j];
        if (newLines[j].includes('}')) break;
        j++;
      }
      const closingMatch = accumulated.match(/\}\s+from\s+(['"])(.*?)\1;?$/s);
      if (closingMatch && barrelPatterns.has(closingMatch[2])) {
        const specsBlock = accumulated.match(/\{([\s\S]*?)\}/);
        if (specsBlock) {
          const isTypeImport = /^import\s+type/.test(line);
          const replacement = buildReplacement(
            (isTypeImport ? 'import type {' : 'import {') + specsBlock[1] + '}',
            filePath, barrelDir, exportMap, isTypeImport
          );
          if (replacement !== null) {
            newLines.splice(i, j - i + 1, replacement);
            changed = true;
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

  const byDeepFile = new Map();

  for (const spec of specifiers) {
    const actualName = spec.name.split(/\s+as\s+/)[0].trim();
    const deepFile = exportMap[actualName];
    if (deepFile === undefined) {
      console.warn(`    UNKNOWN export: ${actualName} in ${filePath}`);
      if (!byDeepFile.has('__UNKNOWN__')) byDeepFile.set('__UNKNOWN__', []);
      byDeepFile.get('__UNKNOWN__').push(spec);
    } else {
      if (!byDeepFile.has(deepFile)) byDeepFile.set(deepFile, []);
      byDeepFile.get(deepFile).push(spec);
    }
  }

  if (byDeepFile.has('__UNKNOWN__')) {
    // Can't safely transform - keep original
    return null;
  }

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

  return stmts.join('\n');
}

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

// =============================================
// BUILD EXPORT MAPS
// =============================================

// models/ barrel
const modelsDir = path.join(srcDir, 'models');

function buildModelsExportMap() {
  const map = {};

  // Axis exports
  const axisExports = ['AxisConfig', 'ChartsYAxisProps', 'ChartsXAxisProps', 'ScaleName',
    'ContinuousScaleName', 'ChartsAxisData', 'XAxis', 'YAxis', 'RadiusAxis', 'RotationAxis',
    'AxisItemIdentifier', 'AxisValueFormatterContext'];
  for (const e of axisExports) map[e] = 'axis';
  map['Position'] = 'position';
  map['CurveType'] = 'curve';
  for (const e of ['TickFrequency', 'OrdinalTimeTicks', 'TickFrequencyDefinition']) map[e] = 'timeTicks';
  map['NumberValue'] = '@mui/x-charts-vendor/d3-scale';
  map['PropsFromSlot'] = '@mui/x-internals/slots';

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
  }

  // seriesType/index re-exports types like SeriesItemIdentifier, HighlightItemIdentifier etc.
  // These are only defined in seriesType/index.ts, not re-exported from sub-files
  // Map them to 'seriesType' which would be the index (but we can't use index...)
  // Actually SeriesItemIdentifier is defined in seriesType/index.ts directly
  // Since we can't import from seriesType/index.ts directly (it's an index file... wait,
  // the rule says don't MODIFY index files, not that we can't import FROM them)
  // Actually looking at the task: "Do NOT modify: src/index.ts, internals/index.ts, ..."
  // seriesType/index.ts is listed explicitly as DO NOT MODIFY
  // But we can import FROM it
  // Let me check what SeriesItemIdentifier is defined in
  const stIndexFile = path.join(srcDir, 'models', 'seriesType', 'index.ts');
  if (fs.existsSync(stIndexFile)) {
    const content = fs.readFileSync(stIndexFile, 'utf8');
    const exportRegex = /\bexport\s+(?:type\s+)?(?:type|interface)\s+(\w+)/g;
    let m;
    while ((m = exportRegex.exec(content)) !== null) {
      if (!map[m[1]]) map[m[1]] = 'seriesType';
    }
  }

  return map;
}

const modelsExportMap = buildModelsExportMap();
console.log('Models export map:', Object.keys(modelsExportMap).length, 'entries');

// plugins/models barrel
const pluginsModelsDir = path.join(srcDir, 'internals', 'plugins', 'models');
function buildPluginsModelsExportMap() {
  const map = {};
  const files = ['helpers', 'plugin', 'chart'];
  for (const f of files) {
    const fp = path.join(pluginsModelsDir, f + '.ts');
    if (!fs.existsSync(fp)) continue;
    const content = fs.readFileSync(fp, 'utf8');
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

const pluginsModelsExportMap = buildPluginsModelsExportMap();
console.log('Plugins models export map:', Object.keys(pluginsModelsExportMap).length, 'entries');
console.log(JSON.stringify(pluginsModelsExportMap, null, 2));

// Process models barrel - additional missed files
processFiles('Additional models barrel consumers', [
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartCartesianAxis/computeAxisValue.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartCartesianAxis/createAxisFilterMapper.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartCartesianAxis/createZoomLookup.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartCartesianAxis/defaultizeAxis.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartCartesianAxis/getAxisExtrema.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisPosition.selectors.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartHighlight/highlightCreator.types.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartPolarAxis/computeAxisValue.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartPolarAxis/defaultizeAxis.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartSeriesConfig/types/identifierCleaner.types.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartSeriesConfig/types/identifierSerializer.types.ts',
  'packages/x-charts/src/internals/plugins/corePlugins/useChartSeriesConfig/utils/cleanIdentifier.ts',
], modelsDir, modelsExportMap);

// Process plugins/models barrel
processFiles('Plugins/models barrel consumers', [
  'packages/x-charts/src/ChartsDataProvider/useChartsDataProviderProps.ts',
  'packages/x-charts/src/context/ChartApi.ts',
  'packages/x-charts/src/context/ChartProvider/ChartProvider.types.ts',
  'packages/x-charts/src/context/ChartsProvider/ChartsProvider.tsx',
  'packages/x-charts/src/context/ChartsProvider/ChartsProvider.types.ts',
  'packages/x-charts/src/context/ChartsProvider/useChartsContext.ts',
  'packages/x-charts/src/Gauge/GaugeContainer.tsx',
  'packages/x-charts/src/hooks/useInteractionItemProps.ts',
  'packages/x-charts/src/internals/store/extractPluginParamsFromProps.ts',
  'packages/x-charts/src/internals/store/useCharts.ts',
  'packages/x-charts/src/internals/store/useCharts.types.ts',
  'packages/x-charts/src/internals/store/useStore.ts',
  'packages/x-charts/src/RadarChart/RadarAxisHighlight/useRadarAxisHighlight.ts',
], pluginsModelsDir, pluginsModelsExportMap);

console.log('\nDone!');
