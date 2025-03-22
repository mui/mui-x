import { join as joinPath, dirname } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { expect } from 'chai';
import outdent from 'outdent';
import { mkdirp } from 'mkdirp';
import rimraf from 'rimraf';

const RUNTIME_DIR = joinPath(import.meta.dirname, './runtime');
const INPUT_PACK = joinPath(RUNTIME_DIR, './package.json');
const INPUT_CONF = joinPath(RUNTIME_DIR, './babel-config.json');
const INPUT_VARS = joinPath(RUNTIME_DIR, './vars.ts');
const OUTPUT_DIR = joinPath(RUNTIME_DIR, './output');
const OUTPUT_CSS = joinPath(RUNTIME_DIR, './output/index.css');

// prettier-ignore
describe('babel-plugin-mui-css', () => {
  // opts: { source, config, js, css, vars }
  function transform(opts) {
    writeFileSync(INPUT_PACK, JSON.stringify({
      name: 'test',
      version: '0.0.0',
      private: true,
      main: './src/index.js'
    }));
    writeFileSync(INPUT_VARS, opts.vars ?? '');

    const sources = typeof opts.source === 'string' ?
      [{ path: 'index.js', content: opts.source }] :
      opts.source;

    const outputs = typeof opts.js === 'string' ?
      [opts.js] :
      opts.js

    sources.forEach(file => {
      writeFileSync(joinPath(RUNTIME_DIR, 'src', file.path), outdent.string(file.content));
    })

    writeFileSync(INPUT_CONF, JSON.stringify({
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
    }));

    const args = [
      '--verbose',
      '--extensions', '".js"',
      joinPath(RUNTIME_DIR, 'src'),
      '--config-file', INPUT_CONF,
      '--out-dir', OUTPUT_DIR,
      '--ignore', '*.ts',
    ];

    const command = `cd "${RUNTIME_DIR}" && pnpm exec babel ${args.join(' ')}`;

    execSync(command, { env: { ...process.env, ...opts.env } });

    sources.forEach((file, i) => {
      const output = readFileSync(joinPath(OUTPUT_DIR, file.path)).toString()

      expect(output).to.be.equal(outdent.string(outputs[i]));
    })

    if (opts.css) {
      const resultCSS = readFileSync(OUTPUT_CSS).toString();
      expect(resultCSS).to.be.equal(outdent.string(opts.css));
    }
  }

  beforeEach(() => {
    rimraf.sync(RUNTIME_DIR);
    mkdirp.sync(joinPath(RUNTIME_DIR, 'src'));
    mkdirp.sync(joinPath(RUNTIME_DIR, 'output'));
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

  it('supports MUI_CSS_OUTPUT_DIR', () => {
    transform({
      env: {
        MUI_CSS_OUTPUT_DIR: dirname(OUTPUT_CSS),
      },
      config: {
        cssOutput: 'index.css',
      },
      source: js`
        const styles = css('MuiDataGrid-panel', {
          root: {
            border: '1px solid black',
          },
        })
      `,
      js: js`
        const styles = {
          "root": "MuiDataGrid-panel"
        };
      `,
      css: css`
        .MuiDataGrid-panel { border:1px solid black; }
      `,
    });
  });

  it('transforms nested selectors', () => {
    transform({
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
      vars: ts`
        export const vars = {
          color: {
            primary: 'var(--color-primary)',
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
        .MuiDataGrid-panel { color:var(--color-primary); }
      `,
    });
  });

  it('supports minification', () => {
    transform({
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

  it('orders calls correctly', () => {
    transform({
      source: [
        {
          path: 'index.js',
          content: js`
            import { aStyles } from './a.js'

            const indexStyles = css('Styles-index', {
              root: {
                color: 'indigo',
              }
            })
          `
        },
        {
          path: 'a.js',
          content: js`
            import { bStyles } from './b.js'

            export const aStyles = css('Styles-a', {
              root: {
                color: 'almond',
              }
            })
          `
        },
        {
          path: 'b.js',
          content: js`
            export const bStyles = css('Styles-b', {
              root: {
                color: 'beet',
              }
            })
          `
        },
      ],
      js: [
        js`
          import { aStyles } from './a.js';
          const indexStyles = {
            "root": "Styles-index"
          };
        `,
        js`
          import { bStyles } from './b.js';
          export const aStyles = {
            "root": "Styles-a"
          };
        `,
        js`
          export const bStyles = {
            "root": "Styles-b"
          };
        `,
      ],
      css: css`
        .Styles-index { color:indigo; }
        .Styles-a { color:almond; }
        .Styles-b { color:beet; }
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
