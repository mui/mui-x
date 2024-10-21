const { run: jscodeshift } = require('jscodeshift/src/Runner');
/**
 * Add `components` props to <DemoContainer /> in typescript files,
 * and `component` props to <DemoItem /> if necessary (multi input pickers)
 */

/**
 * List of demos to ignore
 * Example: "app-bar/BottomAppBar.tsx"
 */
const ignoreList = ['/pages.ts'];

const fse = require('fs-extra');
const path = require('path');
const yargs = require('yargs');

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

async function main() {
  const paths = await getFiles(path.join(workspaceRoot, 'docs/data'));
  const transformPath = path.resolve('scripts/addDemoItemsAttributes.js');

  // Format pickers demos such that `DemoContainer` and `DemoItem` gets correct `components` prop
  await jscodeshift(transformPath, paths, {
    extensions: 'tsx',
    parser: 'tsx',
    verbose: 2,
    quote: 'single',
    trailingComma: true,
    wrapColumn: 85,
    printWidth: 100,
  });
}

yargs
  .command({
    command: '$0',
    description: 'populate `components` prop for <DemoContainer />',
    handler: main,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
