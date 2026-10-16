/**
 * Keep the pinned preview's SSR toolbar compact while preserving its 47px
 * desktop row (42px content, 4px padding, 1px border). The live toolbar still
 * renders all controls after hydration. Its inert SSR copy otherwise adds
 * about 6KB of markup per demo and eagerly renders the toolbar's Emotion CSS.
 */
function compactDemoToolbar(source) {
  const importStatement = 'import { DemoToolbar } from "./DemoToolbar.js";';
  // The preview uses `_jsx` without whitespace after the PURE annotation.
  const start = '  const toolbar = /*#__PURE__*/_jsx(DemoToolbar, {';
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf('\n  });', startIndex);
  if (!source.includes(importStatement) || startIndex === -1 || endIndex === -1) {
    throw new Error(
      'The core-docs preview toolbar changed. Update or remove loadCompactDemoToolbar.',
    );
  }
  return `${source.slice(
    0,
    startIndex,
  )}  const toolbar = _jsx("div", { "aria-hidden": true, style: { height: 42, width: "100%" } });${source.slice(
    endIndex + '\n  });'.length,
  )}`
    .replace(importStatement, '')
    .replace('const noop = () => {};\nconst noopAsync = async () => {};', '');
}

module.exports = compactDemoToolbar;
