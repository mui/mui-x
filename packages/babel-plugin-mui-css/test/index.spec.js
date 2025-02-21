import { expect } from 'chai';
import { resolve, join, relative, basename, dirname } from 'path';
import { readFileSync } from 'fs';
import gulpUtil from 'gulp-util';
import rimraf from 'rimraf';

describe('babel-plugin-mui-css', () => {
  function transform(path, configuration = {}) {
    // remove css modules transform plugin (simulates clean processes)
    delete require.cache[resolve(__dirname, '../src/index.js')];
    const babel = require('babel-core');
    if (configuration && !('devMode' in configuration)) configuration.devMode = true;

    return babel.transformFileSync(resolve(__dirname, path), {
      babelrc: false,
      // presets: [['env', { targets: { node: '6.12' } }]],
      plugins: ['transform-object-rest-spread', ['@babel/../../src/index.js', configuration]],
    });
  }

  function createBabelStream(configuration = {}) {
    // remove css modules transform plugin (simulates clean processes)
    delete require.cache[resolve(__dirname, '../src/index.js')];
    const gulpBabel = require('gulp-babel');
    // set css-modules-require-hook in dev to clear cache
    if (configuration && !('devMode' in configuration)) configuration.devMode = true;

    console.log(configuration)
    return gulpBabel({
      presets: [['env', { targets: { node: '6.12' } }]],
      plugins: ['transform-object-rest-spread', ['@babel/../../src/index.js', configuration]],
    });
  }

  function readExpected(path) {
    let file = path;

    if (process.env.BABEL_7 && /\.js$/.test(file)) {
      // we load fixture for babel 7, they changed few things so we need to use different fixture
      file = join(dirname(file), `./${basename(file, '.js')}.babel7.js`);
    }
    // We trim the contents of the file so that we don't have
    // to deal with newline issues, since some text editors
    // automatically inserts them. It's easier to do this than to
    // configure the editors to avoid inserting newlines for these
    // particular files.
    return readFileSync(resolve(__dirname, file), 'utf8').trim();
  }

  beforeEach((done) => {
    rimraf(`${__dirname}/output/`, done);
  });

  after((done) => {
    rimraf(`${__dirname}/output/`, done);
  });

  it('should ignore files', () => {
    // run this as first case because css-modules-require-hook will be cached with given options
    expect(
      transform('fixtures/require.js', {
        ignore: /\.css$/,
      }).code,
    ).to.be.equal(readExpected('fixtures/require.ignored.expected.js'));
  });

  it('should not throw if we are requiring css module to module scope', () => {
    expect(() => transform('fixtures/global.require.js')).to.not.throw();

    expect(() => transform('fixtures/global.import.js')).to.not.throw();
  });

  it('should replace require call with hash of class name => css class name', () => {
    expect(transform('fixtures/require.js').code).to.be.equal(
      readExpected('fixtures/require.expected.js'),
    );
    expect(transform('fixtures/import.js').code).to.be.equal(
      readExpected('fixtures/import.expected.js'),
    );
  });

  it('should replace require call with hash of class name => css class name via gulp', (cb) => {
    const stream = createBabelStream({});

    stream.on('data', (file) => {
      expect(file.contents.toString()).to.be.equal(readExpected('fixtures/import.expected.js'));
    });

    stream.on('end', cb);

    stream.write(
      new gulpUtil.File({
        cwd: __dirname,
        base: join(__dirname, 'fixtures'),
        path: join(__dirname, 'fixtures/import.js'),
        contents: readFileSync(join(__dirname, 'fixtures/import.js')),
      }),
    );

    stream.end();
  });

  it('should accept file extensions as an array', () => {
    expect(
      transform('fixtures/extensions.js', {
        extensions: ['.scss', '.css'],
      }).code,
    ).to.be.equal(readExpected('fixtures/extensions.expected.js'));
  });

  it('should write a multiple css files using import', () => {
    expect(
      transform(`${__dirname}/fixtures/import.js`, {
        extractCss: {
          dir: `${__dirname}/output/`,
          filename: '[path]/[name].css',
          relativeRoot: __dirname,
        },
        extensions: ['.scss', '.css'],
      }).code,
    ).to.be.equal(readExpected('fixtures/import.expected.js'));

    expect(readExpected(`${__dirname}/output/parent.css`)).to.be.equal(
      readExpected('fixtures/extractcss.parent.expected.css'),
    );
    expect(readExpected(`${__dirname}/output/styles.css`)).to.be.equal(
      readExpected('fixtures/extractcss.styles.expected.css'),
    );
  });

  it('should write a multiple css files using import preserving directory structure', () => {
    expect(
      transform('fixtures/import.js', {
        extractCss: {
          dir: `${__dirname}/output/`,
          filename: '[path]/[name].css',
          relativeRoot: `${__dirname}`,
        },
      }).code,
    ).to.be.equal(readExpected('fixtures/import.expected.js'));

    expect(readExpected(`${__dirname}/output/parent.css`)).to.be.equal(
      readExpected('fixtures/extractcss.parent.expected.css'),
    );
    expect(readExpected(`${__dirname}/output/styles.css`)).to.be.equal(
      readExpected('fixtures/extractcss.styles.expected.css'),
    );
    expect(readExpected(`${__dirname}/output/css/child.css`)).to.be.equal(
      readExpected('fixtures/extractcss.css.child.expected.css'),
    );
  });

  it('should write a multiple css files using require', () => {
    expect(
      transform('fixtures/require.js', {
        extractCss: {
          dir: `${__dirname}/output/`,
          filename: '[name].css',
          relativeRoot: `${__dirname}`,
        },
      }).code,
    ).to.be.equal(readExpected('fixtures/require.expected.js'));

    expect(readExpected(`${__dirname}/output/parent.css`)).to.be.equal(
      readExpected('fixtures/extractcss.parent.expected.css'),
    );
    expect(readExpected(`${__dirname}/output/styles.css`)).to.be.equal(
      readExpected('fixtures/extractcss.styles.expected.css'),
    );
  });

  it('should write a single css file using import', () => {
    expect(
      transform('fixtures/import.js', {
        extractCss: `${__dirname}/output/combined.css`,
      }).code,
    ).to.be.equal(readExpected('fixtures/import.expected.js'));

    expect(readExpected(`${__dirname}/output/combined.css`)).to.be.equal(
      readExpected('fixtures/extractcss.combined.expected.css'),
    );
  });

  it('should write a single css file using require', () => {
    expect(
      transform('fixtures/require.js', {
        extractCss: `${__dirname}/output/combined.css`,
      }).code,
    ).to.be.equal(readExpected('fixtures/require.expected.js'));

    expect(readExpected(`${__dirname}/output/combined.css`)).to.be.equal(
      readExpected('fixtures/extractcss.combined.expected.css'),
    );
  });

  it('should extract styles with a single input file via gulp', (cb) => {
    const stream = createBabelStream({
      extractCss: `${__dirname}/output/combined.css`,
    });

    stream.on('data', (file) => {
      expect(file.contents.toString()).to.be.equal(
        readExpected('fixtures/exctractcss.main.expected.js'),
      );
    });

    stream.on('end', (err) => {
      if (err) return cb(err);
      expect(readExpected(`${__dirname}/output/combined.css`)).to.be.equal(
        readExpected('fixtures/extractcss.parent-combined.expected.css'),
      );

      return cb();
    });

    stream.write(
      new gulpUtil.File({
        cwd: __dirname,
        base: join(__dirname, 'fixtures'),
        path: join(__dirname, 'fixtures/exctractcss.main.js'),
        contents: readFileSync(join(__dirname, 'fixtures/exctractcss.main.js')),
      }),
    );

    stream.end();
  });

  it('should extract multiple files via gulp', (cb) => {
    const stream = createBabelStream({
      extractCss: {
        dir: `${__dirname}/output/`,
        filename: '[name].css',
        relativeRoot: `${__dirname}`,
      },
    });

    // it seems that a data function is required
    stream.on('data', () => {});

    stream.on('end', (err) => {
      if (err) return cb(err);

      expect(readExpected(`${__dirname}/output/parent.css`)).to.be.equal(
        readExpected('fixtures/extractcss.parent.expected.css'),
      );
      expect(readExpected(`${__dirname}/output/styles.css`)).to.be.equal(
        readExpected('fixtures/extractcss.styles.expected.css'),
      );

      return cb();
    });

    stream.write(
      new gulpUtil.File({
        cwd: __dirname,
        base: join(__dirname, 'fixtures'),
        path: join(__dirname, 'fixtures/exctractcss.main.js'),
        contents: readFileSync(join(__dirname, 'fixtures/exctractcss.main.js')),
      }),
    );

    stream.write(
      new gulpUtil.File({
        cwd: __dirname,
        base: join(__dirname, 'fixtures'),
        path: join(__dirname, 'fixtures/exctractcss.include.js'),
        contents: readFileSync(join(__dirname, 'fixtures/exctractcss.include.js')),
      }),
    );

    stream.end();
  });

  it('should extract combined files via gulp', (cb) => {
    const stream = createBabelStream({
      extractCss: `${__dirname}/output/combined.css`,
    });

    // it seems that a data function is required
    stream.on('data', () => {});

    stream.on('end', (err) => {
      if (err) return cb(err);

      expect(readExpected(`${__dirname}/output/combined.css`)).to.be.equal(
        readExpected('fixtures/extractcss.combined.expected.css'),
      );
      return cb();
    });

    stream.write(
      new gulpUtil.File({
        cwd: __dirname,
        base: join(__dirname, 'fixtures'),
        path: join(__dirname, 'fixtures/exctractcss.main.js'),
        contents: readFileSync(join(__dirname, 'fixtures/exctractcss.main.js')),
      }),
    );

    stream.write(
      new gulpUtil.File({
        cwd: __dirname,
        base: join(__dirname, 'fixtures'),
        path: join(__dirname, 'fixtures/exctractcss.include.js'),
        contents: readFileSync(join(__dirname, 'fixtures/exctractcss.include.js')),
      }),
    );

    stream.end();
  });

  it('should call custom preprocess', () => {
    const called = [];
    expect(
      transform('fixtures/require.js', {
        extractCss: `${__dirname}/output/combined.css`,
        processCss(css, filename) {
          called.push(relative(__dirname, filename));
          return css;
        },
      }).code,
    ).to.be.equal(readExpected('fixtures/require.expected.js'));
    expect(called).to.be.deep.equal(['css/child.css', 'parent.css', 'styles.css']);
  });

  describe('keepImport option', () => {
    it('keeps requires/imports', () => {
      expect(
        transform('fixtures/keepImport.js', {
          keepImport: true,
          extensions: ['.scss', '.css'],
        }).code,
      ).to.be.equal(readExpected('fixtures/keepImport.expected.js'));
    });
  });

  describe('calling without options', () => {
    it('keeps requires/imports', () => {
      delete require.cache[resolve(__dirname, '../src/index.js')];
      const babel = require('babel-core');
      const result = babel.transformFileSync(resolve(__dirname, 'fixtures/import.js'), {
        babelrc: false,
        presets: [['env', { targets: { node: '6.12' } }]],
        plugins: ['transform-object-rest-spread', '@babel/../../src/index.js'],
      });

      expect(result.code).to.be.equal(readExpected('fixtures/import.expected.js'));
    });
  });
});
