import { expect } from 'vitest';

/**
 * The scheduler must render the same in apps with and without a global `border-box` reset.
 * Call it once a surface is rendered in the state to check. Browser mode only.
 */
export function expectBoxSizingIndependentLayout() {
  const issues = [...findLayoutChanges(), ...findContentBoxSizes()];
  expect(issues, 'Set `boxSizing: border-box` next to these size constraints').to.deep.equal([]);
}

const INLINE_EDGES = ['padding-left', 'padding-right', 'border-left-width', 'border-right-width'];
const BLOCK_EDGES = ['padding-top', 'padding-bottom', 'border-top-width', 'border-bottom-width'];
const INLINE_SIZES = [
  'width',
  'min-width',
  'max-width',
  'inline-size',
  'min-inline-size',
  'max-inline-size',
];
const BLOCK_SIZES = [
  'height',
  'min-height',
  'max-height',
  'block-size',
  'min-block-size',
  'max-block-size',
];
const NO_CONSTRAINT = /^(auto|none|0|0px|0%|fit-content|min-content|max-content)$/;
const PSEUDO_ELEMENT = /::?(before|after)\s*$/;
const RESET = '*, *::before, *::after { box-sizing: border-box; }';
const TOLERANCE = 0.01;

interface Measurement {
  width: number;
  height: number;
  boxSizing: string;
  edges: number;
}

function sumOf(style: CSSStyleDeclaration, properties: string[]) {
  return properties.reduce(
    (total, property) => total + (parseFloat(style.getPropertyValue(property)) || 0),
    0,
  );
}

function describeElement(element: Element, pseudo = '') {
  const classes = Array.from(element.classList).filter((name) => name.startsWith('Mui'));
  return `${element.tagName.toLowerCase()}${classes.map((name) => `.${name}`).join('')}${pseudo}`;
}

function measureElement(element: Element): Measurement {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  return {
    width: rect.width,
    height: rect.height,
    boxSizing: style.boxSizing,
    edges: sumOf(style, [...INLINE_EDGES, ...BLOCK_EDGES]),
  };
}

function measurePseudo(element: Element, pseudo: string): Measurement | null {
  const style = getComputedStyle(element, pseudo);
  if (style.content === 'none' || style.content === 'normal' || style.display === 'none') {
    return null;
  }
  const width = parseFloat(style.width);
  const height = parseFloat(style.height);
  if (Number.isNaN(width) || Number.isNaN(height)) {
    return null;
  }
  // The computed size of a `content-box` pseudo-element excludes its padding and border.
  const isContentBox = style.boxSizing === 'content-box';
  return {
    width: width + (isContentBox ? sumOf(style, INLINE_EDGES) : 0),
    height: height + (isContentBox ? sumOf(style, BLOCK_EDGES) : 0),
    boxSizing: style.boxSizing,
    edges: sumOf(style, [...INLINE_EDGES, ...BLOCK_EDGES]),
  };
}

function measure(elements: Element[]) {
  return elements.flatMap((element) => [
    { name: describeElement(element), size: measureElement(element), element },
    { name: describeElement(element, '::before'), size: measurePseudo(element, '::before') },
    { name: describeElement(element, '::after'), size: measurePseudo(element, '::after') },
  ]);
}

function hasChanged(a: Measurement | null, b: Measurement | null) {
  if (!a || !b) {
    return a !== b;
  }
  return Math.abs(a.width - b.width) > TOLERANCE || Math.abs(a.height - b.height) > TOLERANCE;
}

function formatChange(name: string, a: Measurement | null, b: Measurement | null) {
  const format = (size: Measurement | null) => (size ? `${size.width}x${size.height}` : 'none');
  return `${name} is ${format(a)} without a reset and ${format(b)} with a border-box reset`;
}

/**
 * Measures every element and pseudo-element with and without a global `border-box` reset.
 * Both measurements run in the same task, so no React render or observer callback runs between them.
 * Reports the changed boxes whose own padding or border causes the change.
 */
function findLayoutChanges() {
  const elements = Array.from(document.body.querySelectorAll('*')).filter(
    (element) => !['SCRIPT', 'STYLE', 'LINK'].includes(element.tagName),
  );
  const before = measure(elements);
  const reset = document.createElement('style');
  reset.textContent = RESET;
  document.head.appendChild(reset);
  const after = measure(elements);
  reset.remove();

  const changes = before
    .map((entry, index) => ({ ...entry, after: after[index].size }))
    .filter((entry) => hasChanged(entry.size, entry.after));
  const causes = changes.filter(
    (entry) =>
      entry.size !== null &&
      entry.size.edges > 0 &&
      entry.size.boxSizing !== entry.after?.boxSizing,
  );
  // Never hide a change: without a cause among the measured boxes, report the outermost changes.
  const reported =
    causes.length > 0
      ? causes
      : changes.filter(
          (entry) =>
            !entry.element?.parentElement ||
            !changes.some((other) => other.element === entry.element?.parentElement),
        );
  return Array.from(
    new Set(reported.map((entry) => formatChange(entry.name, entry.size, entry.after))),
  );
}

function* getAppliedStyleRules(rules: CSSRuleList): Generator<CSSStyleRule> {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSStyleRule) {
      yield rule;
    } else if (rule instanceof CSSMediaRule) {
      if (window.matchMedia(rule.media.mediaText).matches) {
        yield* getAppliedStyleRules(rule.cssRules);
      }
    } else if (rule instanceof CSSSupportsRule) {
      if (CSS.supports(rule.conditionText)) {
        yield* getAppliedStyleRules(rule.cssRules);
      }
    } else if (rule instanceof CSSGroupingRule) {
      yield* getAppliedStyleRules(rule.cssRules);
    }
  }
}

function splitSelectorList(selectorText: string) {
  const selectors: string[] = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < selectorText.length; index += 1) {
    const char = selectorText[index];
    if (char === '(' || char === '[') {
      depth += 1;
    } else if (char === ')' || char === ']') {
      depth -= 1;
    } else if (char === ',' && depth === 0) {
      selectors.push(selectorText.slice(start, index).trim());
      start = index + 1;
    }
  }
  selectors.push(selectorText.slice(start).trim());
  return selectors;
}

function getStyleRules() {
  return Array.from(document.styleSheets).flatMap((sheet) => {
    try {
      return Array.from(getAppliedStyleRules(sheet.cssRules));
    } catch {
      // A cross-origin sheet does not expose its rules.
      return [];
    }
  });
}

/**
 * Finds the scheduler rules that set a size on a rendered `content-box` element with padding or a
 * border on the same axis. This also finds a constraint that the current state does not reach,
 * for example a `maxWidth` on an element with short content.
 */
function findContentBoxSizes() {
  const issues = new Set<string>();
  for (const rule of getStyleRules()) {
    // Only rules from the scheduler styled components and their nested selectors.
    if (!rule.selectorText.includes('MuiEvent')) {
      continue;
    }
    const axes = [
      { sizes: INLINE_SIZES, edges: INLINE_EDGES },
      { sizes: BLOCK_SIZES, edges: BLOCK_EDGES },
    ]
      .map(({ sizes, edges }) => ({
        edges,
        constraints: sizes.filter((property) => {
          const value = rule.style.getPropertyValue(property).trim();
          return value !== '' && !NO_CONSTRAINT.test(value);
        }),
      }))
      .filter(({ constraints }) => constraints.length > 0);
    if (axes.length === 0) {
      continue;
    }

    for (const selector of splitSelectorList(rule.selectorText)) {
      const pseudo = selector.match(PSEUDO_ELEMENT)?.[0].replace(/^:+/, '::').trim() ?? '';
      let elements: Element[];
      try {
        elements = Array.from(document.querySelectorAll(selector.replace(PSEUDO_ELEMENT, '')));
      } catch {
        continue;
      }
      for (const element of elements) {
        const style = getComputedStyle(element, pseudo || null);
        if (
          style.boxSizing === 'border-box' ||
          ['none', 'contents', 'inline'].includes(style.display)
        ) {
          continue;
        }
        for (const { edges, constraints } of axes) {
          const extra = sumOf(style, edges);
          if (extra > 0) {
            const declarations = constraints
              .map((property) => `${property}: ${rule.style.getPropertyValue(property).trim()}`)
              .join('; ');
            issues.add(
              `${describeElement(element, pseudo)} is content-box with ${declarations} and ${extra}px of padding and border on the same axis`,
            );
          }
        }
      }
    }
  }
  return Array.from(issues);
}
