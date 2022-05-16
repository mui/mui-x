import { promises as fs, Stats } from 'fs';
import path from 'path';
import * as yargs from 'yargs';

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

const run = async (argv: yargs.ArgumentsCamelCase<{ path: string }>) => {
  const fullPath = path.join(__dirname, '..', argv.path);

  const children = await fs.readdir(fullPath);

  const nodes: Node[] = [];
  for (let i = 0; i < children.length; i += 1) {
    const childPath = path.join(fullPath, children[i]);

    // eslint-disable-next-line no-await-in-loop
    const childNodes = await getSubTree(childPath);
    nodes.push(...childNodes);
  }

  console.log(JSON.stringify(nodes, null, 2));
};

yargs
  .command({
    command: '$0',
    describe: 'Generate tree data rows from a folder.',
    builder: (command) =>
      command.option('path', {
        describe: 'Root of the hierarchy to generate',
        type: 'string',
      }),
    handler: run,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
