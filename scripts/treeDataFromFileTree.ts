import { promises as fs, Stats } from 'fs';
import path from 'path';
import yargs, { ArgumentsCamelCase } from 'yargs';
import { hideBin } from 'yargs/helpers';

interface Node {
  hierarchy: string[];
  size: number;
  updatedAt: string;
}

const getFileNode = (filePath: string, parentHierarchy: string[], stats: Stats): Node => {
  const basename = path.basename(filePath);

  return {
    hierarchy: [...parentHierarchy, basename],
    size: stats.size,
    updatedAt: stats.mtime.toISOString(),
  };
};

const getSubTree = async (nodePath: string, parentHierarchy: string[] = []) => {
  const nodes: Node[] = [];
  const stats = await fs.lstat(nodePath);

  if (stats.isDirectory()) {
    if (
      ['node_modules', 'build', '.idea', '.vscode', 'coverage'].includes(path.basename(nodePath))
    ) {
      return nodes;
    }

    const children = await fs.readdir(nodePath);
    const directory = path.basename(nodePath);

    for (let i = 0; i < children.length; i += 1) {
      const childPath = path.join(nodePath, children[i]);

      // eslint-disable-next-line no-await-in-loop
      const childNodes = await getSubTree(childPath, [...parentHierarchy, directory]);
      nodes.push(...childNodes);
    }
  }

  if (stats.isFile()) {
    const fileNode = await getFileNode(nodePath, parentHierarchy, stats);
    nodes.push(fileNode);
  }

  return nodes;
};

const run = async (argv: ArgumentsCamelCase<{ path: string }>) => {
  const children = await fs.readdir(argv.path);

  const nodes: Node[] = [];
  for (let i = 0; i < children.length; i += 1) {
    const childPath = path.join(argv.path, children[i]);

    // eslint-disable-next-line no-await-in-loop
    const childNodes = await getSubTree(childPath);
    nodes.push(...childNodes);
  }

  return fs.writeFile(
    path.join(__dirname, '../treeDataFromFileTreeResponse.json'),
    JSON.stringify(nodes, null, 2),
    'utf-8',
  );
};

yargs(hideBin(process.argv))
  .command({
    command: '$0',
    describe: 'Generate tree data rows from a folder.',
    builder: (command) =>
      command.option('path', {
        describe: 'Folder from which we want to extract the tree',
        type: 'string',
        default: process.cwd(),
      }),
    handler: run,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
