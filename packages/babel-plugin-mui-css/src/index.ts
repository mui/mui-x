import * as vm from 'node:vm';
import { writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { mkdirp } from 'mkdirp';
import * as CSS from '@mui/x-internals/css';

const PLUGIN_NAME = 'mui-css'

export default function transformCSS({ types: t }) {
  let cssRules = []
  let cssOutput = 'index.css'

  return {
    name: PLUGIN_NAME,

    pre(file) {
      const opts = findSelf(file.opts.plugins).options
      cssRules = [];
      cssOutput = opts?.cssOutput ?? 'index.css'
    },

    post() {
      mkdirp.sync(dirname(cssOutput))
      writeFileSync(cssOutput, cssRules.join('\n'));
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
          throw new Error(`Invalid CSS prefix: ${formatLocation(file, path.node)}`)
        }
        if (!t.isObjectExpression(args[1])) {
          throw new Error(`Invalid CSS styles: ${formatLocation(file, path.node)}`)
        }

        const [prefixNode, classesNode] = args;

        const prefix = prefixNode.extra.rawValue;

        const context = {
          source: file.code.slice(
            classesNode.start,
            classesNode.end,
          ),
          result: null,
        }
        vm.createContext(context)
        vm.runInContext(`
          result = eval('(' + source + ')')
        `, context);

        const classes = context.result;

        // const requiringFile = file.opts.filename;

        path.replaceWith(buildClassesNode(prefix, classes));
      },
    },
  };

  function buildClassesNode(prefix: string, classes: Record<string, object>) {
    return t.ObjectExpression(
      Object.keys(classes).map((className) => {

        const identifier = className;
        const cssClassName = generateClassName(prefix, className);
        const cssStyles = classes[className];

        const generatedCSS =
          CSS.stylesToString('.' + cssClassName, cssStyles as any).map(c => c.trim()).join('\n')

        cssRules.push(generatedCSS)

        return t.ObjectProperty(
          t.StringLiteral(identifier),
          t.StringLiteral(cssClassName)
        )
      }),
    );
  }
}

function findSelf(plugins) {
  return plugins.find(p => p.key === PLUGIN_NAME)
}

function generateClassName(prefix: string, className: string) {
  if (className === 'root') { return prefix }
  return `${prefix}--${className}`
}

function formatLocation(file, node) {
  return `FILE_TODO:${node.loc.start.line}:${node.loc.start.column}`
}
