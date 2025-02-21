import { join as joinPath } from 'node:path';
import { readFileSync } from 'node:fs';
import { expect } from 'chai';
import outdent from 'outdent';
import rimraf from 'rimraf';
import babel from '@babel/core';

const OUTPUT_DIR = joinPath(import.meta.dirname, './output')
const OUTPUT_CSS = joinPath(OUTPUT_DIR, './index.css')

describe('babel-plugin-mui-css', () => {
  // opts.source
  // opts.js
  // opts.css
  function transform(opts, configuration = {}) {
    const result = babel.transformSync(outdent.string(opts.source), {
      babelrc: false,
      plugins: [
        ['@babel/../../src/index.ts', {
          cssOutput: OUTPUT_CSS,
          ...configuration
        }]
      ],
      generatorOpts: { filename: 'source.js' },
    });

    expect(result.code).to.be.equal(outdent.string(opts.js))

    if (opts.css) {
      const resultCSS = readFileSync(OUTPUT_CSS).toString()
      expect(resultCSS).to.be.equal(outdent.string(opts.css))
    }
  }

  beforeEach((done) => {
    rimraf(OUTPUT_DIR, done);
  });

  after((done) => {
    rimraf(OUTPUT_DIR, done);
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
      `
    })
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
      `
    })
  });
});

function js(strings) { return strings[0] }
function css(strings) { return strings[0] }
