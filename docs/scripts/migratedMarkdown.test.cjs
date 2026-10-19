const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { createRequire } = require('node:module');
const { test } = require('node:test');
const React = require('react');
const { renderToString } = require('react-dom/server');
const nextWebpack = require('next/dist/compiled/webpack/webpack');

const webpack = nextWebpack.webpack;
const coreDirectory = path.dirname(require.resolve('@mui/internal-core-docs/package.json'));
const rendererPath = path.join(coreDirectory, 'MarkdownDocs/RichMarkdownElement.js');
const loaderPath = path.join(__dirname, 'loadMigratedMarkdown.cjs');

// Check the real bundle graph and SSR output, including tabbed code blocks.
test('keeps migrated markdown SSR without bundling legacy demos', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'mui-markdown-renderer-'));
  const entry = path.join(directory, 'entry.js');
  await fs.writeFile(
    entry,
    `export { RichMarkdownElement } from ${JSON.stringify(rendererPath)};\nexport { ThemeProvider } from '@mui/material/styles';\nexport { brandingLightTheme } from ${JSON.stringify(path.join(coreDirectory, 'branding/brandingTheme.js'))};\n`,
  );

  async function build(mode) {
    const outputPath = path.join(directory, mode, 'renderer.cjs');
    const compiler = webpack({
      mode: 'development',
      target: 'node',
      entry,
      resolve: { modules: [path.join(__dirname, '../node_modules'), 'node_modules'] },
      output: {
        path: path.dirname(outputPath),
        filename: 'renderer.cjs',
        library: { type: 'commonjs2' },
      },
      externals: [
        ({ context, request }, callback) => {
          if (
            request === 'react' ||
            request.startsWith('react/') ||
            request.startsWith('react-dom') ||
            request.startsWith('next/')
          ) {
            callback(null, `commonjs ${require.resolve(request, { paths: [context, __dirname] })}`);
            return;
          }
          callback();
        },
      ],
      module: {
        rules:
          mode === 'candidate'
            ? [{ test: /MarkdownDocs[/\\]RichMarkdownElement\.js$/, use: [loaderPath] }]
            : [],
      },
      optimization: { minimize: false },
      devtool: false,
    });
    let stats;

    try {
      stats = await new Promise((resolve, reject) => {
        compiler.run((error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        });
      });
      assert.equal(stats.hasErrors(), false, stats.toString({ all: false, errors: true }));
    } finally {
      await new Promise((resolve) => {
        compiler.close(resolve);
      });
    }

    const { RichMarkdownElement, ThemeProvider, brandingLightTheme } =
      createRequire(outputPath)(outputPath);
    const cases = [
      { renderedMarkdownOrDemo: '<p>Markdown text</p>' },
      {
        renderedMarkdownOrDemo: { component: 'demo', label: 'Demo text' },
        srcComponents: { demo: ({ label }) => React.createElement('span', null, label) },
      },
      {
        renderedMarkdownOrDemo: {
          type: 'codeblock',
          data: [{ tab: 'JS', code: 'const value = 1;', language: 'js' }],
        },
      },
    ];
    const html = cases.map((props) =>
      renderToString(
        React.createElement(
          ThemeProvider,
          { theme: brandingLightTheme },
          React.createElement(RichMarkdownElement, props),
        ),
      ),
    );
    assert.ok(html[0].includes('<p>Markdown text</p>'));
    assert.equal(html[1], '<span>Demo text</span>');
    assert.ok(html[2].includes('role="tab"'));
    assert.ok(html[2].includes('const'));
    const resources = [...stats.compilation.modules].map((module) => module.resource || '');
    return { html, resources };
  }

  try {
    const baseline = await build('baseline');
    const candidate = await build('candidate');
    assert.deepEqual(candidate.html, baseline.html);
    assert.equal(
      candidate.resources.some((resource) => /[/\\]Demo[/\\]Demo(?:Toolbar)?\.js$/.test(resource)),
      false,
      'legacy demo modules stay out of migrated bundles',
    );
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});
