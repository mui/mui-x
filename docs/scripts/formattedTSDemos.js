/* eslint-disable no-console */
/**
 * Transpiles TypeScript demos to formatted JavaScript.
 * Can be used to verify that JS and TS demos are equivalent. No introduced change
 * would indicate equivalence.
 */

/**
 * List of demos to ignore when transpiling
 * Example: "app-bar/BottomAppBar.tsx"
 */
const ignoreList = ['/pages.ts', 'styling.ts', 'styling.tsx'];

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const babel = require('@babel/core');
const prettier = require('prettier');
const yargs = require('yargs');
const ts = require('typescript');
const { fixBabelGeneratorIssues, fixLineEndings } = require('./helpers');

const DOCS_ROOT = path.resolve(__dirname, '..');
const tsConfigPath = path.resolve(DOCS_ROOT, './tsconfig.json');
const tsConfigFile = ts.readConfigFile(tsConfigPath, (filePath) =>
  fs.readFileSync(filePath).toString(),
);

const tsConfigFileContent = ts.parseJsonConfigFileContent(
  tsConfigFile.config,
  ts.sys,
  path.dirname(tsConfigPath),
);

const babelConfig = {
  presets: ['@babel/preset-typescript'],
  plugins: [],
  generatorOpts: { retainLines: true },
  babelrc: false,
  configFile: false,
};

const workspaceRoot = path.join(__dirname, '../../');

async function getFiles(root) {
  const files = [];

  try {
    await Promise.all(
      (await fse.readdir(root)).map(async (name) => {
        const filePath = path.join(root, name);
        const stat = await fse.stat(filePath);

        if (stat.isDirectory()) {
          files.push(...(await getFiles(filePath)));
        } else if (
          stat.isFile() &&
          filePath.endsWith('.tsx') &&
          !ignoreList.some((ignorePath) => filePath.endsWith(path.normalize(ignorePath)))
        ) {
          files.push(filePath);
        }
      }),
    );
  } catch (error) {
    if (error.message?.includes('no such file or directory')) {
      return [];
    }
    throw error;
  }

  return files;
}

const TranspileResult = {
  Success: 0,
  Skipped: 1,
  Failed: 2,
};

async function transpileFile(tsxPath, program, ignoreCache = false) {
  const jsPath = tsxPath.replace('.tsx', '.js');
  try {
    if (!ignoreCache && (await fse.exists(jsPath))) {
      const [jsStat, tsxStat] = await Promise.all([fse.stat(jsPath), fse.stat(tsxPath)]);
      if (jsStat.mtimeMs > tsxStat.mtimeMs) {
        // JavaScript version is newer, skip transpiling
        return TranspileResult.Skipped;
      }
    }

    const source = await fse.readFile(tsxPath, 'utf8');

    const transformOptions = { ...babelConfig, filename: tsxPath };
    const enableJSXPreview = !tsxPath.includes(path.join('pages', 'premium-themes'));
    if (enableJSXPreview) {
      transformOptions.plugins = transformOptions.plugins.concat([
        [
          path.resolve(DOCS_ROOT, './src/modules/utils/babel-plugin-jsx-preview'),
          { maxLines: 16, outputFilename: `${tsxPath}.preview` },
        ],
      ]);
    }
    const { code } = await babel.transformAsync(source, transformOptions);

    const prettierConfig = await prettier.resolveConfig(jsPath, {
      config: path.join(workspaceRoot, 'prettier.config.js'),
    });
    const prettierFormat = async (jsSource) =>
      prettier.format(jsSource, { ...prettierConfig, filepath: jsPath });

    const prettified = await prettierFormat(code);
    const formatted = fixBabelGeneratorIssues(prettified);
    const correctedLineEndings = fixLineEndings(source, formatted);

    // removed blank lines change potential formatting
    await fse.writeFile(jsPath, await prettierFormat(correctedLineEndings));
    return TranspileResult.Success;
  } catch (err) {
    console.error('Something went wrong transpiling %s\n%s\n', tsxPath, err);
    return TranspileResult.Failed;
  }
}

async function main(argv) {
  const { watch: watchMode, disableCache: cacheDisabled } = argv;

  const tsxFiles = [
    ...(await getFiles(path.join(workspaceRoot, 'docs/src/pages'))), // old structure
    ...(await getFiles(path.join(workspaceRoot, 'docs/data'))), // new structure
  ];

  const program = ts.createProgram({
    rootNames: tsxFiles,
    options: tsConfigFileContent.options,
  });

  let successful = 0;
  let failed = 0;
  let skipped = 0;
  (await Promise.all(tsxFiles.map((file) => transpileFile(file, program, cacheDisabled)))).forEach(
    (result) => {
      switch (result) {
        case TranspileResult.Success: {
          successful += 1;
          break;
        }
        case TranspileResult.Failed: {
          failed += 1;
          break;
        }
        case TranspileResult.Skipped: {
          skipped += 1;
          break;
        }
        default: {
          throw new Error(`No handler for ${result}`);
        }
      }
    },
  );

  console.log(
    [
      '------ Summary ------',
      '%i demo(s) were successfully transpiled',
      '%i demo(s) were skipped',
      '%i demo(s) were unsuccessful',
    ].join('\n'),
    successful,
    skipped,
    failed,
  );

  if (!watchMode) {
    if (failed > 0) {
      process.exit(1);
    }
    return;
  }

  tsxFiles.forEach((filePath) => {
    fse.watchFile(filePath, { interval: 500 }, async () => {
      if ((await transpileFile(filePath, program, true)) === 0) {
        console.log('Success - %s', filePath);
      }
    });
  });

  console.log('\nWatching for file changes...');
}

yargs
  .command({
    command: '$0',
    description: 'transpile TypeScript demos',
    builder: (command) => {
      return command
        .option('watch', {
          default: false,
          description: 'Transpile demos as soon as they change',
          type: 'boolean',
        })
        .option('disable-cache', {
          default: false,
          description: "Transpile all demos even if they didn't change",
          type: 'boolean',
        });
    },
    handler: main,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
