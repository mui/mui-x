/**
 * Phase 3 of barrel import refactoring - handling remaining missed files
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

    const multiStart = line.match(/^(import(?:\s+type)?\s+\{)(.*)$/) && !line.includes('}');
    if (multiStart) {
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
      return null; // Can't safely transform
    }
    if (!byDeepFile.has(deepFile)) byDeepFile.set(deepFile, []);
    byDeepFile.get(deepFile).push(spec);
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

// Hooks export map
const hooksDir = path.join(srcDir, 'hooks');
const hooksExportMap = {
  useXAxes: 'useAxis', useYAxes: 'useAxis', useXAxis: 'useAxis', useYAxis: 'useAxis',
  useRotationAxes: 'useAxis', useRadiusAxes: 'useAxis',
  useDrawingArea: 'useDrawingArea', ChartDrawingArea: 'useDrawingArea',
  useChartId: 'useChartId', useLineSeriesContext: 'useLineSeries', useLineSeries: 'useLineSeries',
  useScatterSeriesContext: 'useScatterSeries', useScatterSeries: 'useScatterSeries',
  usePieSeries: 'usePieSeries', usePieSeriesContext: 'usePieSeries',
  UsePieSeriesReturnValue: 'usePieSeries', UsePieSeriesContextReturnValue: 'usePieSeries',
  useBarSeries: 'useBarSeries', useBarSeriesContext: 'useBarSeries',
  useRadarSeries: 'useRadarSeries', useRadarSeriesContext: 'useRadarSeries',
  useItemHighlightState: 'useItemHighlightState', useItemHighlightStateGetter: 'useItemHighlightStateGetter',
  getValueToPositionMapper: 'getValueToPositionMapper',
  useColorScale: 'useColorScale', useScale: 'useScale', useXScale: 'useScale', useYScale: 'useScale',
  useRotationScale: 'useScale', useRadiusScale: 'useScale', useZAxis: 'useZAxis',
  useChartsLayerContainerRef: 'useChartsLayerContainerRef',
  useSeries: 'useSeries', useDataset: 'useDataset', useLegend: 'useLegend',
  useChartGradientId: 'useChartGradientId', useChartGradientIdObjectBound: 'useChartGradientId',
  useChartRootRef: 'useChartRootRef', useChartsLocalization: 'useChartsLocalization',
  useBrush: 'useBrush', useFocusedItem: 'useFocusedItem',
  useXAxisCoordinates: 'useAxisCoordinates', useYAxisCoordinates: 'useAxisCoordinates',
  AxisCoordinates: 'useAxisCoordinates', useAxisTicks: 'useAxisTicks', TickItem: 'useTicks',
  useAnimate: 'animation/useAnimate', useAnimateArea: 'animation/useAnimateArea',
  useAnimateBar: 'animation/useAnimateBar', useAnimateBarLabel: 'animation/useAnimateBarLabel',
  useAnimateLine: 'animation/useAnimateLine', useAnimatePieArc: 'animation/useAnimatePieArc',
  useAnimatePieArcLabel: 'animation/useAnimatePieArcLabel',
};

processFiles('Additional hooks barrel consumers', [
  'packages/x-charts/src/internals/components/ChartsAxesGradients/ChartsAxesGradients.tsx',
  'packages/x-charts/src/internals/plugins/featurePlugins/shared/useRegisterPointerInteractions.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartCartesianAxis/computeAxisValue.ts',
  'packages/x-charts/src/internals/plugins/featurePlugins/useChartPolarAxis/computeAxisValue.ts',
], hooksDir, hooksExportMap);

// Now check for any remaining barrel imports from component barrels in the whole src
// Let's also look for any ChartsTooltip barrel imports we might have missed
// (e.g. from ItemTooltip which maps to a plugin file)
const chartsTooltipDir = path.join(srcDir, 'ChartsTooltip');

// Read ChartsTooltip/useItemTooltip.ts to find what it exports
const useItemTooltipContent = fs.readFileSync(path.join(chartsTooltipDir, 'useItemTooltip.ts'), 'utf8');
console.log('\n--- useItemTooltip.ts exports ---');
const exportRegex = /\bexport\s+(?:type\s+)?(?:interface|type|class|const|function|enum)\s+(\w+)/g;
let m;
while ((m = exportRegex.exec(useItemTooltipContent)) !== null) {
  console.log(' ', m[1]);
}

console.log('\nDone!');
