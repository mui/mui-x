/**
 * jsdom Performance Regression Comparison
 *
 * This script compares performance between jsdom 26.0.0 and 27.1.0
 * when using @testing-library/dom's getByRole with nested role queries.
 *
 * The issue: Querying for gridcells within a grid has become ~10-20x slower
 * in jsdom 27.1.0 compared to 26.0.0.
 *
 * Test case from MUI X DateRangeCalendar component tests.
 */

import { readFileSync } from 'fs';
import { getByRole, within } from '@testing-library/dom';

const html = readFileSync('./jsdom-regression-repro.html', 'utf-8');

async function testJsdomVersion(jsdomPackage, versionLabel) {
  // Dynamically import the jsdom version
  const { JSDOM } = await import(jsdomPackage);

  // Initialize jsdom
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Simulate the getPickerDay function from the test, with timing breakdown
  function getPickerDayWithTiming(name, picker = 'January 2019') {
    const getByRoleStart = performance.now();
    const grid = getByRole(document.body, 'grid', { name: picker });
    const getByRoleTime = performance.now() - getByRoleStart;

    const withinStart = performance.now();
    const result = within(grid).getByRole('gridcell', { name });
    const withinTime = performance.now() - withinStart;

    return { result, getByRoleTime, withinTime };
  }

  // Warm up (first run is always slower)
  getPickerDayWithTiming('30', 'January 2019');
  getPickerDayWithTiming('19', 'January 2019');

  // Run the actual performance test
  const iterations = 10;
  const timings = [];

  for (let i = 0; i < iterations; i++) {
    const test1 = getPickerDayWithTiming('30', 'January 2019');
    const test2 = getPickerDayWithTiming('19', 'January 2019');
    const test3 = getPickerDayWithTiming('30', 'January 2019');

    timings.push({
      getByRole1: test1.getByRoleTime,
      within1: test1.withinTime,
      total1: test1.getByRoleTime + test1.withinTime,
      getByRole2: test2.getByRoleTime,
      within2: test2.withinTime,
      total2: test2.getByRoleTime + test2.withinTime,
      getByRole3: test3.getByRoleTime,
      within3: test3.withinTime,
      total3: test3.getByRoleTime + test3.withinTime,
    });
  }

  // Calculate averages
  const avgGetByRole1 = timings.reduce((sum, t) => sum + t.getByRole1, 0) / iterations;
  const avgWithin1 = timings.reduce((sum, t) => sum + t.within1, 0) / iterations;
  const avgTotal1 = timings.reduce((sum, t) => sum + t.total1, 0) / iterations;

  const avgGetByRole2 = timings.reduce((sum, t) => sum + t.getByRole2, 0) / iterations;
  const avgWithin2 = timings.reduce((sum, t) => sum + t.within2, 0) / iterations;
  const avgTotal2 = timings.reduce((sum, t) => sum + t.total2, 0) / iterations;

  const avgGetByRole3 = timings.reduce((sum, t) => sum + t.getByRole3, 0) / iterations;
  const avgWithin3 = timings.reduce((sum, t) => sum + t.within3, 0) / iterations;
  const avgTotal3 = timings.reduce((sum, t) => sum + t.total3, 0) / iterations;

  const avgGetByRoleTotal = avgGetByRole1 + avgGetByRole2 + avgGetByRole3;
  const avgWithinTotal = avgWithin1 + avgWithin2 + avgWithin3;
  const avgTotal = avgTotal1 + avgTotal2 + avgTotal3;

  return {
    versionLabel,
    avgGetByRole1,
    avgWithin1,
    avgTotal1,
    avgGetByRole2,
    avgWithin2,
    avgTotal2,
    avgGetByRole3,
    avgWithin3,
    avgTotal3,
    avgGetByRoleTotal,
    avgWithinTotal,
    avgTotal,
    timings,
  };
}

// Run tests for both versions
console.log('jsdom Performance Regression Comparison');
console.log('='.repeat(80));
console.log('');

console.log('Testing jsdom 26.0.0...');
const results26 = await testJsdomVersion('jsdom-26', 'jsdom 26.0.0');

console.log('Testing jsdom 27.1.0...');
const results27 = await testJsdomVersion('jsdom-27', 'jsdom 27.1.0');

console.log('');
console.log('='.repeat(80));
console.log('RESULTS');
console.log('='.repeat(80));
console.log('');

console.log(`${results26.versionLabel}:`);
console.log(`  getPickerDay('30'):`);
console.log(`    getByRole('grid'):       ${results26.avgGetByRole1.toFixed(3)}ms`);
console.log(`    within().getByRole():    ${results26.avgWithin1.toFixed(3)}ms`);
console.log(`    Total:                   ${results26.avgTotal1.toFixed(3)}ms`);
console.log(`  getPickerDay('19'):`);
console.log(`    getByRole('grid'):       ${results26.avgGetByRole2.toFixed(3)}ms`);
console.log(`    within().getByRole():    ${results26.avgWithin2.toFixed(3)}ms`);
console.log(`    Total:                   ${results26.avgTotal2.toFixed(3)}ms`);
console.log(`  getPickerDay('30') again:`);
console.log(`    getByRole('grid'):       ${results26.avgGetByRole3.toFixed(3)}ms`);
console.log(`    within().getByRole():    ${results26.avgWithin3.toFixed(3)}ms`);
console.log(`    Total:                   ${results26.avgTotal3.toFixed(3)}ms`);
console.log(`  TOTALS:`);
console.log(`    All getByRole('grid'):   ${results26.avgGetByRoleTotal.toFixed(3)}ms`);
console.log(`    All within():            ${results26.avgWithinTotal.toFixed(3)}ms`);
console.log(`    Grand Total:             ${results26.avgTotal.toFixed(3)}ms`);
console.log('');

console.log(`${results27.versionLabel}:`);
console.log(`  getPickerDay('30'):`);
console.log(`    getByRole('grid'):       ${results27.avgGetByRole1.toFixed(3)}ms`);
console.log(`    within().getByRole():    ${results27.avgWithin1.toFixed(3)}ms`);
console.log(`    Total:                   ${results27.avgTotal1.toFixed(3)}ms`);
console.log(`  getPickerDay('19'):`);
console.log(`    getByRole('grid'):       ${results27.avgGetByRole2.toFixed(3)}ms`);
console.log(`    within().getByRole():    ${results27.avgWithin2.toFixed(3)}ms`);
console.log(`    Total:                   ${results27.avgTotal2.toFixed(3)}ms`);
console.log(`  getPickerDay('30') again:`);
console.log(`    getByRole('grid'):       ${results27.avgGetByRole3.toFixed(3)}ms`);
console.log(`    within().getByRole():    ${results27.avgWithin3.toFixed(3)}ms`);
console.log(`    Total:                   ${results27.avgTotal3.toFixed(3)}ms`);
console.log(`  TOTALS:`);
console.log(`    All getByRole('grid'):   ${results27.avgGetByRoleTotal.toFixed(3)}ms`);
console.log(`    All within():            ${results27.avgWithinTotal.toFixed(3)}ms`);
console.log(`    Grand Total:             ${results27.avgTotal.toFixed(3)}ms`);
console.log('');

// Calculate regressions
const getByRoleRegressionPercent = ((results27.avgGetByRoleTotal - results26.avgGetByRoleTotal) / results26.avgGetByRoleTotal) * 100;
const getByRoleRegressionMultiplier = results27.avgGetByRoleTotal / results26.avgGetByRoleTotal;

const withinRegressionPercent = ((results27.avgWithinTotal - results26.avgWithinTotal) / results26.avgWithinTotal) * 100;
const withinRegressionMultiplier = results27.avgWithinTotal / results26.avgWithinTotal;

const totalRegressionPercent = ((results27.avgTotal - results26.avgTotal) / results26.avgTotal) * 100;
const totalRegressionMultiplier = results27.avgTotal / results26.avgTotal;

console.log('='.repeat(80));
console.log('REGRESSION ANALYSIS');
console.log('='.repeat(80));
console.log('');
console.log('getByRole(\'grid\') Performance:');
console.log(`  Difference: +${(results27.avgGetByRoleTotal - results26.avgGetByRoleTotal).toFixed(3)}ms`);
console.log(`  Regression: +${getByRoleRegressionPercent.toFixed(1)}%`);
console.log(`  Multiplier: ${getByRoleRegressionMultiplier.toFixed(1)}x slower`);
console.log('');
console.log('within().getByRole(\'gridcell\') Performance:');
console.log(`  Difference: +${(results27.avgWithinTotal - results26.avgWithinTotal).toFixed(3)}ms`);
console.log(`  Regression: +${withinRegressionPercent.toFixed(1)}%`);
console.log(`  Multiplier: ${withinRegressionMultiplier.toFixed(1)}x slower`);
console.log('');
console.log('Total Query Performance:');
console.log(`  Difference: +${(results27.avgTotal - results26.avgTotal).toFixed(3)}ms`);
console.log(`  Regression: +${totalRegressionPercent.toFixed(1)}%`);
console.log(`  Multiplier: ${totalRegressionMultiplier.toFixed(1)}x slower`);
console.log('');

if (totalRegressionPercent > 50) {
  console.log('⚠️  SIGNIFICANT QUERY REGRESSION DETECTED');
  console.log('');
  console.log('jsdom 27.1.0 is significantly slower at performing nested role queries.');
  console.log('This affects @testing-library/dom usage with complex DOM structures.');
  console.log('');
  if (withinRegressionPercent > getByRoleRegressionPercent) {
    console.log('The regression is primarily in within().getByRole() queries.');
  } else {
    console.log('The regression is primarily in getByRole() queries.');
  }
} else if (totalRegressionPercent > 10) {
  console.log('⚠️  Moderate query regression detected');
} else {
  console.log('✓ Query performance difference is within acceptable range');
}
console.log('');
