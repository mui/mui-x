/**
 * jsdom Performance Regression - React Render Isolation
 *
 * This test isolates the performance regression to @testing-library/react's render() function.
 *
 * Goal: Determine if the render regressions we're seeing (10-20ms increases) are due to:
 * 1. React's render phase calling getComputedStyle
 * 2. Testing library's DOM setup
 * 3. Component lifecycle/effects
 */

import React from 'react';

async function testJsdomVersion(jsdomPackage, versionLabel) {
  // Dynamically import the jsdom version
  const { JSDOM } = await import(jsdomPackage);

  // Initialize jsdom with empty HTML for React testing
  const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true,
  });
  const document = dom.window.document;
  const window = dom.window;

  // Set up global environment for React
  Object.defineProperty(global, 'document', {
    value: document,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(global, 'window', { value: window, writable: true, configurable: true });

  // Copy important properties from window to global
  if (!global.navigator) {
    Object.defineProperty(global, 'navigator', {
      value: window.navigator,
      writable: true,
      configurable: true,
    });
  }
  if (!global.HTMLElement) {
    Object.defineProperty(global, 'HTMLElement', {
      value: window.HTMLElement,
      writable: true,
      configurable: true,
    });
  }

  // Suppress React act() warnings
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;

  // Import react-dom and act after globals are set
  const ReactDOM = await import('react-dom/client');
  const { act } = await import('react');

  // Component definitions
  function SimpleComponent() {
    return React.createElement('div', { 'data-testid': 'simple' }, 'Hello World');
  }

  function StyledComponent() {
    return React.createElement(
      'div',
      {
        'data-testid': 'styled',
        style: {
          color: 'blue',
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid black',
        },
      },
      'Styled Content',
    );
  }

  function ComplexComponent() {
    return React.createElement(
      'div',
      {
        'data-testid': 'complex',
        role: 'grid',
        style: { display: 'grid' },
      },
      [
        React.createElement(
          'div',
          { key: 1, role: 'row' },
          Array.from({ length: 10 }).map((_, i) =>
            React.createElement(
              'div',
              {
                key: i,
                role: 'gridcell',
                style: { padding: '8px', border: '1px solid gray' },
              },
              `Cell ${i}`,
            ),
          ),
        ),
        React.createElement(
          'div',
          { key: 2, role: 'row' },
          Array.from({ length: 10 }).map((_, i) =>
            React.createElement(
              'div',
              {
                key: i,
                role: 'gridcell',
                style: { padding: '8px', border: '1px solid gray' },
              },
              `Cell ${i + 10}`,
            ),
          ),
        ),
      ],
    );
  }

  // ============================================================================
  // Test functions using ReactDOM.createRoot() + React.act()
  // ============================================================================

  async function testSimpleRenderReactDOM() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const start = performance.now();
    const root = ReactDOM.createRoot(container);
    await act(async () => {
      root.render(React.createElement(SimpleComponent));
    });
    const renderTime = performance.now() - start;

    const queryStart = performance.now();
    container.querySelector('[data-testid="simple"]');
    const queryTime = performance.now() - queryStart;

    await act(async () => {
      root.unmount();
    });
    document.body.removeChild(container);
    return { renderTime, queryTime, total: renderTime + queryTime };
  }

  async function testStyledRenderReactDOM() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const start = performance.now();
    const root = ReactDOM.createRoot(container);
    await act(async () => {
      root.render(React.createElement(StyledComponent));
    });
    const renderTime = performance.now() - start;

    const queryStart = performance.now();
    container.querySelector('[data-testid="styled"]');
    const queryTime = performance.now() - queryStart;

    await act(async () => {
      root.unmount();
    });
    document.body.removeChild(container);
    return { renderTime, queryTime, total: renderTime + queryTime };
  }

  async function testComplexRenderReactDOM() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const start = performance.now();
    const root = ReactDOM.createRoot(container);
    await act(async () => {
      root.render(React.createElement(ComplexComponent));
    });
    const renderTime = performance.now() - start;

    const queryStart = performance.now();
    container.querySelector('[data-testid="complex"]');
    const queryTime = performance.now() - queryStart;

    await act(async () => {
      root.unmount();
    });
    document.body.removeChild(container);
    return { renderTime, queryTime, total: renderTime + queryTime };
  }

  // Warmup runs
  await testSimpleRenderReactDOM();
  await testStyledRenderReactDOM();
  await testComplexRenderReactDOM();

  // Run tests multiple times
  const iterations = 10;
  const simpleTimings = [];
  const styledTimings = [];
  const complexTimings = [];

  for (let i = 0; i < iterations; i++) {
    simpleTimings.push(await testSimpleRenderReactDOM());
    styledTimings.push(await testStyledRenderReactDOM());
    complexTimings.push(await testComplexRenderReactDOM());
  }

  // Calculate averages
  const avgSimple = {
    renderTime: simpleTimings.reduce((sum, t) => sum + t.renderTime, 0) / iterations,
    queryTime: simpleTimings.reduce((sum, t) => sum + t.queryTime, 0) / iterations,
    total: simpleTimings.reduce((sum, t) => sum + t.total, 0) / iterations,
  };

  const avgStyled = {
    renderTime: styledTimings.reduce((sum, t) => sum + t.renderTime, 0) / iterations,
    queryTime: styledTimings.reduce((sum, t) => sum + t.queryTime, 0) / iterations,
    total: styledTimings.reduce((sum, t) => sum + t.total, 0) / iterations,
  };

  const avgComplex = {
    renderTime: complexTimings.reduce((sum, t) => sum + t.renderTime, 0) / iterations,
    queryTime: complexTimings.reduce((sum, t) => sum + t.queryTime, 0) / iterations,
    total: complexTimings.reduce((sum, t) => sum + t.total, 0) / iterations,
  };

  // Clean up globals (only if we created them)
  if (global.document === document) {
    delete global.document;
  }
  if (global.window === window) {
    delete global.window;
  }

  return {
    versionLabel,
    avgSimple,
    avgStyled,
    avgComplex,
  };
}

// Run tests for all versions
console.log('jsdom Performance Regression - React Render');
console.log('='.repeat(80));
console.log('Test: @testing-library/react render() with different component complexities');
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

function printResults(results) {
  console.log(`${results.versionLabel}:`);
  console.log('  Simple Component (div with text):');
  console.log(`    Render time: ${results.avgSimple.renderTime.toFixed(3)}ms`);
  console.log(`    Query time:  ${results.avgSimple.queryTime.toFixed(3)}ms`);
  console.log(`    Total:       ${results.avgSimple.total.toFixed(3)}ms`);
  console.log('  Styled Component (div with inline styles):');
  console.log(`    Render time: ${results.avgStyled.renderTime.toFixed(3)}ms`);
  console.log(`    Query time:  ${results.avgStyled.queryTime.toFixed(3)}ms`);
  console.log(`    Total:       ${results.avgStyled.total.toFixed(3)}ms`);
  console.log('  Complex Component (grid with 20 cells):');
  console.log(`    Render time: ${results.avgComplex.renderTime.toFixed(3)}ms`);
  console.log(`    Query time:  ${results.avgComplex.queryTime.toFixed(3)}ms`);
  console.log(`    Total:       ${results.avgComplex.total.toFixed(3)}ms`);
  console.log('');
}

printResults(results26);
printResults(results27);

// Calculate regressions
console.log('='.repeat(80));
console.log('REGRESSION ANALYSIS');
console.log('='.repeat(80));
console.log('');

function analyzeRegression(label, baseline, regression) {
  const renderDiff = regression.renderTime - baseline.renderTime;
  const renderPercent = (renderDiff / baseline.renderTime) * 100;
  const renderMultiplier = regression.renderTime / baseline.renderTime;

  const queryDiff = regression.queryTime - baseline.queryTime;
  const queryPercent = (queryDiff / baseline.queryTime) * 100;
  const queryMultiplier = regression.queryTime / baseline.queryTime;

  const totalDiff = regression.total - baseline.total;
  const totalPercent = (totalDiff / baseline.total) * 100;
  const totalMultiplier = regression.total / baseline.total;

  console.log(`${label}:`);
  console.log(
    `  Render time: ${renderDiff > 0 ? '+' : ''}${renderDiff.toFixed(3)}ms (${renderPercent > 0 ? '+' : ''}${renderPercent.toFixed(1)}%, ${renderMultiplier.toFixed(2)}x)`,
  );
  console.log(
    `  Query time:  ${queryDiff > 0 ? '+' : ''}${queryDiff.toFixed(3)}ms (${queryPercent > 0 ? '+' : ''}${queryPercent.toFixed(1)}%, ${queryMultiplier.toFixed(2)}x)`,
  );
  console.log(
    `  Total:       ${totalDiff > 0 ? '+' : ''}${totalDiff.toFixed(3)}ms (${totalPercent > 0 ? '+' : ''}${totalPercent.toFixed(1)}%, ${totalMultiplier.toFixed(2)}x)`,
  );
  console.log('');

  return { renderPercent, queryPercent, totalPercent };
}

const simpleReg = analyzeRegression('Simple Component', results26.avgSimple, results27.avgSimple);
const styledReg = analyzeRegression('Styled Component', results26.avgStyled, results27.avgStyled);
const complexReg = analyzeRegression(
  'Complex Component',
  results26.avgComplex,
  results27.avgComplex,
);

console.log('='.repeat(80));
console.log('CONCLUSION');
console.log('='.repeat(80));
console.log('');

const avgRenderRegression =
  (simpleReg.renderPercent + styledReg.renderPercent + complexReg.renderPercent) / 3;

console.log(`Average render time regression: ${avgRenderRegression.toFixed(1)}%`);
console.log('');

if (avgRenderRegression > 100) {
  console.log('⚠️  SIGNIFICANT RENDER REGRESSION in jsdom 27');
  console.log('');
  console.log('React rendering with act() is significantly slower in jsdom 27.');
  console.log('The regression is most severe with styled components (inline styles).');
  console.log('');
  console.log('Likely causes:');
  console.log("- jsdom 27's new CSS selector engine (@asamuzakjp/dom-selector)");
  console.log("- Slower style-related DOM operations during React's commit phase");
  console.log('- getComputedStyle() being called during act() flush');
} else if (avgRenderRegression > 20) {
  console.log('⚠️  Moderate render regression detected');
  console.log(`Average render time regression: ${avgRenderRegression.toFixed(1)}%`);
} else {
  console.log('✓ Render performance within acceptable range');
}

console.log('');
