import * as vm from 'node:vm';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { mkdirp } from 'mkdirp';
import { transform as lightning } from 'lightningcss';
import * as Babel from '@babel/core';
import * as CSS from '@mui/x-internals/css';

type BabelT = typeof Babel;

const PLUGIN_NAME = 'mui-css';

export default function transformCSS({ types: t }: BabelT) {
  let state = {
    cssMinify: true,
    cssRules: [],
    cssOutput: 'index.css',
    cssVariables: '',
    cssConcat: [], // FIXME: check if needed
  };

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

    pre(file: Babel.BabelFile) {
      const opts = findSelf(file.opts.plugins).options;
      state = {
        cssRules: [],
        cssMinify: opts?.cssMinify ?? true,
        cssOutput: opts?.cssOutput ?? 'index.css',
        cssVariables: getCSSVariablesCode(opts?.cssVariables),
        cssConcat: opts?.cssConcat ?? [],
      };
    },

    post() {
      let cssOutput = (state.cssConcat
        .map((filepath) => readFileSync(filepath).toString())
        .join('\n') + state.cssRules.join('\n')) as string | Uint8Array;

      if (state.cssMinify) {
        const { code: cssMinified } = lightning({
          filename: 'index.css',
          code: Buffer.from(cssOutput),
          minify: true,
        });
        cssOutput = cssMinified;
      }

      mkdirp.sync(dirname(state.cssOutput));
      writeFileSync(state.cssOutput, cssOutput);
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

        /* eslint-disable no-underscore-dangle */
        const context = {
          __source: file.code.slice(classesNode.start, classesNode.end),
          __result: null,
        };
        vm.createContext(context);
        vm.runInContext(
          `
          ${state.cssVariables};
          __result = eval('(' + __source + ')')
        `,
          context,
        );

        const classes = context.__result;
        /* eslint-enable no-underscore-dangle */

        path.replaceWith(buildClassesNode(prefix, classes));
      },
    },
  };

  function buildClassesNode(prefix: string, classes: Record<string, object>) {
    return t.objectExpression(
      Object.keys(classes).map((className) => {
        const identifier = className;
        const cssClassName = generateClassName(prefix, className);
        const cssStyles = classes[className];

        const generatedCSS = CSS.stylesToString(`.${cssClassName}`, cssStyles as any)
          .map((c) => c.trim())
          .join('\n');

        state.cssRules.push(generatedCSS);

        return t.objectProperty(t.stringLiteral(identifier), t.stringLiteral(cssClassName));
      }),
    );
  }
}

function findSelf(plugins) {
  return plugins.find((p) => p.key === PLUGIN_NAME);
}

function generateClassName(prefix: string, className: string) {
  if (className === 'root') {
    return prefix;
  }
  return `${prefix}--${className}`;
}

function formatLocation(file: Babel.BabelFile, node: Babel.Node) {
  return `${file.opts.filename}:${node.loc.start.line}:${node.loc.start.column}`;
}

function getCSSVariablesCode(filepath: string | undefined) {
  if (filepath === undefined) {
    return '';
  }
  return Babel.transformSync(readFileSync(filepath).toString(), {
    presets: ['@babel/preset-typescript'],
    plugins: ['babel-plugin-remove-import-export'],
    filename: filepath,
  }).code as string;
}
