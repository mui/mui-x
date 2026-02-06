/**
 * jsdom Performance Regression Reproduction
 *
 * This script reproduces a performance regression in jsdom when using
 * @testing-library/dom's getByRole with nested role queries.
 *
 * The issue: Querying for gridcells within a grid has become ~10-20x slower
 * in jsdom 27.1.0 compared to 25.0.1.
 *
 * Test case from MUI X DateRangeCalendar component tests.
 */

import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { getByRole, within } from '@testing-library/dom';

// Read the HTML file
const html = readFileSync('./jsdom-regression-repro.html', 'utf-8');

// Initialize jsdom
const dom = new JSDOM(html);
global.document = dom.window.document;
global.window = dom.window;

console.log('jsdom Performance Regression Test');
console.log('='.repeat(80));
console.log(`jsdom version: ${JSDOM.version || 'unknown'}`);
console.log('');

// Simulate the getPickerDay function from the test
function getPickerDay(name, picker = 'January 2019') {
  const grid = getByRole(document.body, 'grid', { name: picker });
  return within(grid).getByRole('gridcell', { name });
}

// Warm up (first run is always slower)
console.log('Warming up...');
getPickerDay('30', 'January 2019');
getPickerDay('19', 'January 2019');
console.log('');

// Run the actual performance test
console.log('Running performance test (10 iterations)...');
console.log('');

const iterations = 10;
const timings = [];

for (let i = 0; i < iterations; i++) {
  const start1 = performance.now();
  const day30 = getPickerDay('30', 'January 2019');
  const time1 = performance.now() - start1;

  const start2 = performance.now();
  const day19 = getPickerDay('19', 'January 2019');
  const time2 = performance.now() - start2;

  const start3 = performance.now();
  const day30Again = getPickerDay('30', 'January 2019');
  const time3 = performance.now() - start3;

  const totalTime = time1 + time2 + time3;
  timings.push({ time1, time2, time3, totalTime });

  console.log(`Iteration ${i + 1}:`);
  console.log(`  getPickerDay('30'): ${time1.toFixed(3)}ms`);
  console.log(`  getPickerDay('19'): ${time2.toFixed(3)}ms`);
  console.log(`  getPickerDay('30') again: ${time3.toFixed(3)}ms`);
  console.log(`  Total: ${totalTime.toFixed(3)}ms`);
  console.log('');
}

// Calculate averages
const avgTime1 = timings.reduce((sum, t) => sum + t.time1, 0) / iterations;
const avgTime2 = timings.reduce((sum, t) => sum + t.time2, 0) / iterations;
const avgTime3 = timings.reduce((sum, t) => sum + t.time3, 0) / iterations;
const avgTotal = timings.reduce((sum, t) => sum + t.totalTime, 0) / iterations;

console.log('='.repeat(80));
console.log('Average Timings:');
console.log(`  getPickerDay('30'): ${avgTime1.toFixed(3)}ms`);
console.log(`  getPickerDay('19'): ${avgTime2.toFixed(3)}ms`);
console.log(`  getPickerDay('30') again: ${avgTime3.toFixed(3)}ms`);
console.log(`  Total: ${avgTotal.toFixed(3)}ms`);
console.log('');

// Expected baseline (jsdom 25.0.1):
// - getPickerDay('30'): ~25-65ms
// - getPickerDay('19'): ~25ms
// - getPickerDay('30') again: ~28ms
// - Total: ~78-118ms

// Expected regression (jsdom 27.1.0):
// - getPickerDay('30'): ~450-570ms
// - getPickerDay('19'): ~450ms
// - getPickerDay('30') again: ~450ms
// - Total: ~1350-1470ms

console.log('Expected baseline (jsdom 25.0.1): ~78-118ms total');
console.log('Expected regression (jsdom 27.1.0): ~1350-1470ms total');
console.log('');

if (avgTotal > 300) {
  console.log('⚠️  REGRESSION DETECTED: Query performance is significantly degraded');
} else {
  console.log('✓ Performance appears normal');
}
