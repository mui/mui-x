/**
 * jsdom Performance Regression - getComputedStyle Isolation
 *
 * This test isolates the performance regression to window.getComputedStyle().
 *
 * Root cause: jsdom 27's new CSS selector engine (@asamuzakjp/dom-selector)
 * has made getComputedStyle() ~5x slower.
 */

import { readFile } from 'fs/promises';

async function testJsdomVersion(jsdomPackage, versionLabel) {
  const html = await readFile('./jsdom-regression-repro.html', 'utf-8');

  // Dynamically import the jsdom version
  const { JSDOM } = await import(jsdomPackage);

  // Initialize jsdom for testing
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const window = dom.window;

  // Get all elements with roles for testing
  const allRoleElements = document.querySelectorAll('[role]');
  console.log(`  Found ${allRoleElements.length} elements with role attributes`);

  // Test: getComputedStyle performance
  function testGetComputedStyle() {
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      for (const element of allRoleElements) {
        window.getComputedStyle(element);
      }
    }
    return performance.now() - start;
  }

  // Warmup test runs
  testGetComputedStyle();
  testGetComputedStyle();

  // Run test multiple times
  const iterations = 10;
  const timings = [];

  for (let i = 0; i < iterations; i++) {
    timings.push(testGetComputedStyle());
  }

  // Calculate average
  const avgTime = timings.reduce((a, b) => a + b, 0) / iterations;

  return {
    versionLabel,
    elementCount: allRoleElements.length,
    avgTime,
    timings,
  };
}

// Run tests for all versions
console.log('jsdom Performance Regression - getComputedStyle');
console.log('='.repeat(80));
console.log('Test: Call window.getComputedStyle() on 65 elements, 100 times (6,500 calls)');
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

const allResults = [results26, results27];

for (const result of allResults) {
  console.log(`${result.versionLabel}:`);
  console.log(`  Average time: ${result.avgTime.toFixed(3)}ms`);
  console.log('');
}

// Calculate regressions relative to version 26
console.log('='.repeat(80));
console.log('REGRESSION ANALYSIS (relative to jsdom 26.0.0)');
console.log('='.repeat(80));
console.log('');

const baseline = results26.avgTime;

for (const result of allResults) {
  const diff = result.avgTime - baseline;
  const regression = (diff / baseline) * 100;
  const multiplier = result.avgTime / baseline;

  console.log(`${result.versionLabel}:`);
  console.log(`  Difference: ${diff > 0 ? '+' : ''}${diff.toFixed(3)}ms`);
  console.log(`  Change: ${regression > 0 ? '+' : ''}${regression.toFixed(1)}%`);
  console.log(`  Multiplier: ${multiplier.toFixed(2)}x`);
  console.log('');
}
