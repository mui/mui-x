import { readFileSync } from 'fs';

const baselinePath = './test-results-baseline/results.json';
const regressionPath = './test-results-regression/results.json';

// Read and parse JSON files
const baseline = JSON.parse(readFileSync(baselinePath, 'utf-8'));
const regression = JSON.parse(readFileSync(regressionPath, 'utf-8'));

// Create a map of test results by fullName
function createTestMap(results) {
  const map = new Map();

  for (const testResult of results.testResults) {
    const suiteName = testResult.name;

    for (const assertion of testResult.assertionResults) {
      const fullName = assertion.fullName;
      map.set(fullName, {
        duration: assertion.duration,
        suiteName,
        title: assertion.title,
        ancestorTitles: assertion.ancestorTitles
      });
    }
  }

  return map;
}

const baselineMap = createTestMap(baseline);
const regressionMap = createTestMap(regression);

// Calculate regressions
const regressions = [];

for (const [fullName, regressionData] of regressionMap) {
  const baselineData = baselineMap.get(fullName);

  if (!baselineData) {
    console.warn(`Test not found in baseline: ${fullName}`);
    continue;
  }

  const baselineDuration = baselineData.duration;
  const regressionDuration = regressionData.duration;
  const diff = regressionDuration - baselineDuration;
  const percentChange = ((diff / baselineDuration) * 100);

  regressions.push({
    fullName,
    suiteName: regressionData.suiteName,
    title: regressionData.title,
    ancestorTitles: regressionData.ancestorTitles,
    baselineDuration,
    regressionDuration,
    diff,
    percentChange
  });
}

// Sort by percentage change (highest first)
regressions.sort((a, b) => b.percentChange - a.percentChange);

// Calculate suite-level aggregations
const suiteStats = new Map();

for (const reg of regressions) {
  if (!suiteStats.has(reg.suiteName)) {
    suiteStats.set(reg.suiteName, {
      suiteName: reg.suiteName,
      totalBaselineDuration: 0,
      totalRegressionDuration: 0,
      testCount: 0
    });
  }

  const stats = suiteStats.get(reg.suiteName);
  stats.totalBaselineDuration += reg.baselineDuration;
  stats.totalRegressionDuration += reg.regressionDuration;
  stats.testCount++;
}

// Calculate suite-level differences and percentages
const suiteRegressions = Array.from(suiteStats.values()).map(stats => ({
  ...stats,
  diff: stats.totalRegressionDuration - stats.totalBaselineDuration,
  percentChange: ((stats.totalRegressionDuration - stats.totalBaselineDuration) / stats.totalBaselineDuration) * 100
}));

// Sort suites by percentage change
suiteRegressions.sort((a, b) => b.percentChange - a.percentChange);

// Output results
console.log('='.repeat(120));
console.log('TEST REGRESSION ANALYSIS');
console.log('='.repeat(120));
console.log();

// Top 50 regressed tests
console.log('TOP 50 REGRESSED TESTS (by percentage)');
console.log('-'.repeat(120));
console.log();

for (let i = 0; i < Math.min(50, regressions.length); i++) {
  const reg = regressions[i];
  const ancestorPath = reg.ancestorTitles.join(' > ');

  console.log(`${i + 1}. ${reg.title}`);
  console.log(`   Suite: ${reg.suiteName}`);
  if (ancestorPath) {
    console.log(`   Path: ${ancestorPath}`);
  }
  console.log(`   Baseline: ${reg.baselineDuration.toFixed(2)}ms`);
  console.log(`   Regression: ${reg.regressionDuration.toFixed(2)}ms`);
  console.log(`   Difference: +${reg.diff.toFixed(2)}ms (+${reg.percentChange.toFixed(2)}%)`);
  console.log();
}

console.log();
console.log('='.repeat(120));
console.log('SUITE-LEVEL REGRESSION ANALYSIS');
console.log('='.repeat(120));
console.log();

console.log('TOP 50 REGRESSED SUITES (by percentage)');
console.log('-'.repeat(120));
console.log();

for (let i = 0; i < Math.min(50, suiteRegressions.length); i++) {
  const suite = suiteRegressions[i];

  console.log(`${i + 1}. ${suite.suiteName}`);
  console.log(`   Tests: ${suite.testCount}`);
  console.log(`   Baseline Total: ${suite.totalBaselineDuration.toFixed(2)}ms`);
  console.log(`   Regression Total: ${suite.totalRegressionDuration.toFixed(2)}ms`);
  console.log(`   Difference: +${suite.diff.toFixed(2)}ms (+${suite.percentChange.toFixed(2)}%)`);
  console.log();
}

// Summary statistics
console.log();
console.log('='.repeat(120));
console.log('SUMMARY STATISTICS');
console.log('='.repeat(120));
console.log();

const totalBaselineDuration = regressions.reduce((sum, r) => sum + r.baselineDuration, 0);
const totalRegressionDuration = regressions.reduce((sum, r) => sum + r.regressionDuration, 0);
const totalDiff = totalRegressionDuration - totalBaselineDuration;
const totalPercentChange = (totalDiff / totalBaselineDuration) * 100;

console.log(`Total tests analyzed: ${regressions.length}`);
console.log(`Total baseline duration: ${(totalBaselineDuration / 1000).toFixed(2)}s`);
console.log(`Total regression duration: ${(totalRegressionDuration / 1000).toFixed(2)}s`);
console.log(`Total difference: +${(totalDiff / 1000).toFixed(2)}s (+${totalPercentChange.toFixed(2)}%)`);
console.log();

const testsWithRegression = regressions.filter(r => r.diff > 0).length;
const testsWithImprovement = regressions.filter(r => r.diff < 0).length;
const testsUnchanged = regressions.filter(r => r.diff === 0).length;

console.log(`Tests with any regression (>0ms): ${testsWithRegression} (${((testsWithRegression / regressions.length) * 100).toFixed(2)}%)`);
console.log(`Tests with any improvement (<0ms): ${testsWithImprovement} (${((testsWithImprovement / regressions.length) * 100).toFixed(2)}%)`);
console.log(`Tests unchanged: ${testsUnchanged} (${((testsUnchanged / regressions.length) * 100).toFixed(2)}%)`);
console.log();

// Threshold-based statistics
console.log('THRESHOLD-BASED ANALYSIS:');
console.log();

const thresholds = [1, 5, 10];
for (const threshold of thresholds) {
  const regressionCount = regressions.filter(r => r.percentChange > threshold).length;
  const improvementCount = regressions.filter(r => r.percentChange < -threshold).length;

  console.log(`Tests with >${threshold}% regression: ${regressionCount} (${((regressionCount / regressions.length) * 100).toFixed(2)}%)`);
  console.log(`Tests with >${threshold}% improvement: ${improvementCount} (${((improvementCount / regressions.length) * 100).toFixed(2)}%)`);
  console.log();
}
