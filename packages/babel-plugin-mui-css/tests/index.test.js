import { join as joinPath } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { expect } from 'chai';
import outdent from 'outdent';
import { mkdirp } from 'mkdirp';
import rimraf from 'rimraf';
import babel from '@babel/core';

const RUNTIME_DIR = joinPath(import.meta.dirname, './runtime');
const INPUT_VARS = joinPath(RUNTIME_DIR, './vars.ts');
const OUTPUT_CSS = joinPath(RUNTIME_DIR, './output.css');

// prettier-ignore
describe('babel-plugin-mui-css', () => {
  // opts: { source, config, js, css, vars }
  function transform(opts) {
    writeFileSync(INPUT_VARS, opts.vars ?? '');

    const result = babel.transformSync(outdent.string(opts.source), {
      babelrc: false,
      plugins: [
        [
          joinPath(import.meta.dirname, '../build/index.js'),
          {
            cssMinify: false,
            cssOutput: OUTPUT_CSS,
            cssVariables: INPUT_VARS,
            ...opts.config,
          },
        ],
      ],
      generatorOpts: { filename: 'source.js' },
    });

    expect(result.code).to.be.equal(outdent.string(opts.js));

    if (opts.css) {
      const resultCSS = readFileSync(OUTPUT_CSS).toString();
      expect(resultCSS).to.be.equal(outdent.string(opts.css));
    }
  }

  beforeEach(() => {
    rimraf.sync(RUNTIME_DIR);
    mkdirp.sync(RUNTIME_DIR);
  });

  after(() => {
    rimraf.sync(RUNTIME_DIR);
  });

  it('works', () => {
    transform({
      source: js`
        const styles = css('MuiDataGrid-panel', {
          root: {
            border: '1px solid black',
          },
          focused: {
            border: '1px solid blue',
          },
        })
      `,
      js: js`
        const styles = {
          "root": "MuiDataGrid-panel",
          "focused": "MuiDataGrid-panel--focused"
        };
      `,
      css: css`
        .MuiDataGrid-panel { border:1px solid black; }
        .MuiDataGrid-panel--focused { border:1px solid blue; }
      `,
    });
  });

  it('transforms nested selectors', () => {
    transform({
      filename: 'source.ts',
      source: js`
        const styles = css('MuiDataGrid-panel', {
          root: {
            '#id': {
              color: 'black',
            },
            '.class-a': {
              color: 'black',
            },
            '&.class-b': {
              color: 'black',
            },
            '> input': {
              color: 'black',
            },
          }
        })
      `,
      js: js`
        const styles = {
          "root": "MuiDataGrid-panel"
        };
      `,
      css: css`
        .MuiDataGrid-panel {  }
        .MuiDataGrid-panel #id { color:black; }
        .MuiDataGrid-panel .class-a { color:black; }
        .MuiDataGrid-panel.class-b { color:black; }
        .MuiDataGrid-panel > input { color:black; }
      `,
    });
  });

  it('supports CSS variables', () => {
    transform({
      filename: 'source.ts',
      vars: ts`
        export const vars = {
          color: {
            primary: '#599eff',
          },
        } as const;
      `,
      source: js`
        const styles = css('MuiDataGrid-panel', {
          root: {
            color: vars.color.primary,
          },
        })
      `,
      js: js`
        const styles = {
          "root": "MuiDataGrid-panel"
        };
      `,
      css: css`
        .MuiDataGrid-panel { color:#599eff; }
      `,
    });
  });

  it('supports minification', () => {
    transform({
      filename: 'source.ts',
      config: { cssMinify: true },
      source: js`
        const styles = css('MuiDataGrid-panel', {
          root: {
            '#id': {
              color: 'black',
            },
            '.class-a': {
              color: 'black',
            },
            '&.class-b': {
              color: 'black',
            },
            '> input': {
              color: 'black',
            },
          }
        })
      `,
      js: js`
        const styles = {
          "root": "MuiDataGrid-panel"
        };
      `,
      css: css`
        .MuiDataGrid-panel #id,.MuiDataGrid-panel .class-a,.MuiDataGrid-panel.class-b,.MuiDataGrid-panel>input{color:#000}
      `,
    });
  });
});

function js(strings) {
  return strings[0];
}
function ts(strings) {
  return strings[0];
}
function css(strings) {
  return strings[0];
}
