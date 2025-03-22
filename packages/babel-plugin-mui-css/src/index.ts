import * as vm from 'node:vm';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join as joinPath } from 'node:path';
import { mkdirp } from 'mkdirp';
import { transform as lightning } from 'lightningcss';
import IG from 'import-graph';
import { packageDirectorySync } from 'pkg-dir';
import * as Babel from '@babel/core';
import * as CSS from '@mui/x-internals/css';

type BabelT = typeof Babel;

const PLUGIN_NAME = 'mui-css';

export default function transformCSS({ types: t }: BabelT) {
  const state = {
    cssMinify: true,
    cssRules: [] as { filepath: string; content: string }[],
    cssOutput: 'index.css',
    cssVariables: '',
    indexByPath: undefined as Record<string, number> | undefined,
  };

  process.on('beforeExit', async () => {
    const { indexByPath } = state;
    state.cssRules.sort((a, b) => {
      if (a.filepath in indexByPath && b.filepath in indexByPath) {
        return indexByPath[a.filepath] - indexByPath[b.filepath];
      }
      if (a.filepath in indexByPath) {
        return -1;
      }
      if (b.filepath in indexByPath) {
        return +1;
      }
      return a.filepath.localeCompare(b.filepath);
    });

    let cssContent = '';

    cssContent = state.cssRules.map((r) => r.content).join('\n');

    if (state.cssMinify) {
      const { code: cssMinified } = lightning({
        filename: 'index.css',
        code: Buffer.from(cssContent),
        minify: true,
      });
      cssContent = cssMinified as any;
    }

    const outputPath = joinPath(process.env.MUI_CSS_OUTPUT_DIR ?? '', state.cssOutput);

    mkdirp.sync(dirname(outputPath));
    writeFileSync(outputPath, cssContent);
  });

  return {
    name: PLUGIN_NAME,

    manipulateOptions(options: any) {
      const plugin = findSelf(options.plugins);
      let content: string | undefined;
      try {
        content = readFileSync('mui-css.config.json').toString();
      } catch (error) {
        // ignore
      }
      if (content) {
        const newOptions = JSON.parse(content);
        plugin.options = { ...plugin.options, ...newOptions };
      }
      return options;
    },

    pre(file) {
      const opts = findSelf(file.opts.plugins).options;

      if (!state.cssVariables) {
        state.cssVariables = getCSSVariablesCode(opts?.cssVariables);
      }

      state.cssMinify = opts.cssMinify ?? true;
      state.cssOutput = opts.cssOutput ?? 'index.css';
    },

    async post(file) {
      if (!state.indexByPath) {
        const configPath = packageDirectorySync({ cwd: dirname(file.opts.filename) });
        const mainPath = JSON.parse(
          readFileSync(joinPath(configPath, 'package.json')).toString(),
        ).main;
        state.indexByPath = await createImportMap(joinPath(configPath, mainPath));
      }
    },

    visitor: {
      // const styles = css('prefix', {
      //   class1: { ... },
      // });
      CallExpression(path, { file }) {
        const {
          callee: { name: calleeName },
          arguments: args,
        } = path.node;

        if (calleeName !== 'css') {
          return;
        }
        if (!t.isStringLiteral(args[0])) {
          throw new Error(`Invalid CSS prefix: ${formatLocation(file, path.node)}`);
        }
        if (!t.isObjectExpression(args[1])) {
          throw new Error(`Invalid CSS styles: ${formatLocation(file, path.node)}`);
        }

        const [prefixNode, classesNode] = args;

        const prefix = prefixNode.extra.rawValue;

        const source = file.code.slice(classesNode.start, classesNode.end);
        const result = vm.runInContext(
          `
          ${state.cssVariables};
          const result = ${source};
          result;
        `,
          vm.createContext({}),
        );

        const classes = result;

        path.replaceWith(buildClassesNode(file.opts.filename, prefix, classes));
      },
    },
  };

  function buildClassesNode(filepath: string, prefix: string, classes: Record<string, object>) {
    return t.objectExpression(
      Object.keys(classes).map((className) => {
        const identifier = className;
        const cssClassName = CSS.generateClassName(prefix, className);
        const cssStyles = classes[className];

        const generatedCSS = CSS.stylesToString(`.${cssClassName}`, cssStyles as any)
          .map((c) => c.trim())
          .join('\n');

        state.cssRules.push({
          filepath: filepath ?? 'unknown',
          content: generatedCSS,
        });

        return t.objectProperty(t.stringLiteral(identifier), t.stringLiteral(cssClassName));
      }),
    );
  }
}

function findSelf(plugins) {
  return plugins.find((p) => p.key === PLUGIN_NAME);
}

function formatLocation(file: Babel.BabelFile, node: Babel.Node) {
  return `${file.opts.filename}:${node.loc.start.line}:${node.loc.start.column}`;
}

function getCSSVariablesCode(filepath: string | undefined) {
  if (filepath === undefined) {
    return '';
  }
  process.argv = [];
  const r = Babel.transformSync(readFileSync(filepath).toString(), {
    babelrc: false,
    presets: ['@babel/preset-typescript'],
    plugins: ['babel-plugin-remove-import-export'],
    filename: filepath,
  }).code as string;
  return r;
}

async function createImportMap(rootPath: string) {
  const graph = await IG.createGraph(rootPath, {
    extensions: ['ts', 'tsx', 'js', 'jsx'],
  });

  const firstPath = Array.from(graph.graph.keys())[0];
  const sortedPaths = [firstPath] as string[];

  graph.visitDescendants(firstPath, (filepath: string) => {
    sortedPaths.push(filepath);
  });

  let i = 0;
  const indexByPath = sortedPaths.reduce(
    (acc, filepath) => {
      acc[filepath] = i;
      i += 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return indexByPath;
}
