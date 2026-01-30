/**
 * jsdom Performance Regression - Pure DOM Style Operations
 */

async function testJsdomVersion(jsdomPackage, versionLabel) {
  // Dynamically import the jsdom version
  const { JSDOM } = await import(jsdomPackage);

  // Initialize jsdom with empty HTML
  const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true,
  });
  const document = dom.window.document;

  // Test 1: innerHTML with simple elements (no styles)
  function testInnerHTMLSimple() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const start = performance.now();
    container.innerHTML = '<div>Hello</div>'.repeat(20);
    const duration = performance.now() - start;

    document.body.removeChild(container);
    return duration;
  }

  // Test 2: innerHTML with inline styles
  function testInnerHTMLStyled() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const start = performance.now();
    container.innerHTML =
      '<div style="color: blue; background-color: white; padding: 10px; border: 1px solid black;">Cell</div>'.repeat(
        20,
      );
    const duration = performance.now() - start;

    document.body.removeChild(container);
    return duration;
  }

  // Test 3: createElement + style property setting
  function testCreateElementWithStyles() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const start = performance.now();
    for (let i = 0; i < 20; i++) {
      const div = document.createElement('div');
      div.style.color = 'blue';
      div.style.backgroundColor = 'white';
      div.style.padding = '10px';
      div.style.border = '1px solid black';
      div.textContent = `Cell ${i}`;
      container.appendChild(div);
    }
    const duration = performance.now() - start;

    document.body.removeChild(container);
    return duration;
  }

  // Test 4: createElement + setAttribute('style')
  function testCreateElementWithStyleAttribute() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const start = performance.now();
    for (let i = 0; i < 20; i++) {
      const div = document.createElement('div');
      div.setAttribute(
        'style',
        'color: blue; background-color: white; padding: 10px; border: 1px solid black;',
      );
      div.textContent = `Cell ${i}`;
      container.appendChild(div);
    }
    const duration = performance.now() - start;

    document.body.removeChild(container);
    return duration;
  }

  // Test 5: createElement + style.cssText
  function testCreateElementWithCssText() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const start = performance.now();
    for (let i = 0; i < 20; i++) {
      const div = document.createElement('div');
      div.style.cssText =
        'color: blue; background-color: white; padding: 10px; border: 1px solid black;';
      div.textContent = `Cell ${i}`;
      container.appendChild(div);
    }
    const duration = performance.now() - start;

    document.body.removeChild(container);
    return duration;
  }

  // Warmup runs
  for (let i = 0; i < 5; i++) {
    testInnerHTMLSimple();
    testInnerHTMLStyled();
    testCreateElementWithStyles();
    testCreateElementWithStyleAttribute();
    testCreateElementWithCssText();
  }

  // Run tests multiple times
  const iterations = 10;
  const results = {
    innerHTMLSimple: [],
    innerHTMLStyled: [],
    createElementWithStyles: [],
    createElementWithStyleAttribute: [],
    createElementWithCssText: [],
  };

  for (let i = 0; i < iterations; i++) {
    results.innerHTMLSimple.push(testInnerHTMLSimple());
    results.innerHTMLStyled.push(testInnerHTMLStyled());
    results.createElementWithStyles.push(testCreateElementWithStyles());
    results.createElementWithStyleAttribute.push(testCreateElementWithStyleAttribute());
    results.createElementWithCssText.push(testCreateElementWithCssText());
  }

  // Calculate averages
  const avg = {
    innerHTMLSimple: results.innerHTMLSimple.reduce((a, b) => a + b, 0) / iterations,
    innerHTMLStyled: results.innerHTMLStyled.reduce((a, b) => a + b, 0) / iterations,
    createElementWithStyles:
      results.createElementWithStyles.reduce((a, b) => a + b, 0) / iterations,
    createElementWithStyleAttribute:
      results.createElementWithStyleAttribute.reduce((a, b) => a + b, 0) / iterations,
    createElementWithCssText:
      results.createElementWithCssText.reduce((a, b) => a + b, 0) / iterations,
  };

  return {
    versionLabel,
    avg,
  };
}

// Run tests for both versions
console.log('jsdom Performance Regression - Pure DOM Style Operations');
console.log('='.repeat(80));
console.log('Test: Raw DOM operations with inline styles (no React, no libraries)');
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
  console.log(
    `  innerHTML (20 simple divs, no styles):     ${results.avg.innerHTMLSimple.toFixed(3)}ms`,
  );
  console.log(
    `  innerHTML (20 divs with inline styles):    ${results.avg.innerHTMLStyled.toFixed(3)}ms`,
  );
  console.log(
    `  createElement + style.property (20 divs):  ${results.avg.createElementWithStyles.toFixed(
      3,
    )}ms`,
  );
  console.log(
    `  createElement + style.cssText (20 divs):   ${results.avg.createElementWithCssText.toFixed(
      3,
    )}ms`,
  );
  console.log(
    `  createElement + setAttribute (20 divs):    ${results.avg.createElementWithStyleAttribute.toFixed(
      3,
    )}ms`,
  );
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
  const diff = regression - baseline;
  const percent = (diff / baseline) * 100;
  const multiplier = regression / baseline;

  console.log(`${label}:`);
  console.log(`  Difference: ${diff > 0 ? '+' : ''}${diff.toFixed(3)}ms`);
  console.log(`  Change: ${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`);
  console.log(`  Multiplier: ${multiplier.toFixed(2)}x`);
  console.log('');

  return percent;
}

analyzeRegression(
  'innerHTML (simple, no styles)',
  results26.avg.innerHTMLSimple,
  results27.avg.innerHTMLSimple,
);

analyzeRegression(
  'innerHTML (with inline styles)',
  results26.avg.innerHTMLStyled,
  results27.avg.innerHTMLStyled,
);

analyzeRegression(
  'createElement + style.property',
  results26.avg.createElementWithStyles,
  results27.avg.createElementWithStyles,
);

analyzeRegression(
  'createElement + style.cssText',
  results26.avg.createElementWithCssText,
  results27.avg.createElementWithCssText,
);

analyzeRegression(
  'createElement + setAttribute',
  results26.avg.createElementWithStyleAttribute,
  results27.avg.createElementWithStyleAttribute,
);
