const LEGACY_IMPORTS = [
  'import { Demo } from "../Demo/Demo.js";',
  'import { DemoToolbar } from "../Demo/DemoToolbar.js";',
];
const LEGACY_BRANCH = '  const name = renderedMarkdownOrDemo.demo;';
const LEGACY_END = '    demoToolbarSlot: DemoToolbar\n  });\n}';

// X has no legacy demo directives; exclude their UI from every markdown page.
function migratedMarkdown(source) {
  const start = source.indexOf(LEGACY_BRANCH);
  if (
    start === -1 ||
    !source.trimEnd().endsWith(LEGACY_END) ||
    LEGACY_IMPORTS.some((statement) => !source.includes(statement))
  ) {
    throw new Error('The core-docs markdown renderer changed. Update loadMigratedMarkdown.');
  }

  let rendered = `${source.slice(0, start)}  throw new Error("MUI X docs: Legacy demo directives are unsupported. Use a file:// component directive.");\n}\n`;
  for (const statement of LEGACY_IMPORTS) {
    rendered = rendered.replace(statement, '');
  }
  return rendered;
}

module.exports = migratedMarkdown;
