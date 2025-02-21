import { expect } from 'chai';
import outdent from 'outdent';
import rimraf from 'rimraf';
import babel from '@babel/core';

const __dirname = import.meta.dirname

describe('babel-plugin-mui-css', () => {
  function transform({ filename, source, js, css }, configuration = {}) {
    // remove css modules transform plugin (simulates clean processes)
    // delete require.cache[resolve(__dirname, '../src/index.js')];
    if (configuration && !('devMode' in configuration)) configuration.devMode = true;

    const result = babel.transformSync(outdent.string(source), {
      babelrc: false,
      plugins: [
        ['@babel/../../src/index.js', configuration]
      ],
      generatorOpts: { filename },
    });

    console.log(result)

    expect(result.code).to.be.equal(outdent.string(js))
  }

  beforeEach((done) => {
    rimraf(`${__dirname}/output/`, done);
  });

  after((done) => {
    rimraf(`${__dirname}/output/`, done);
  });

  it.only('works', () => {
    transform({
      filename: 'source.ts',
      source: `
        const styles = css('MuiDataGrid-panel', {
          root: {
            border: '1px solid black',
          },
          focused: {
            border: '1px solid blue',
          },
        })
      `,
      js: `
        const styles = {
          "root": "MuiDataGrid-panel",
          "focused": "MuiDataGrid-panel--focused"
        };
      `,
    })
  });
});
