export default function transformCssModules({ types: t }) {
  // is css modules require hook initialized?
  let initialized = false;
  // are we requiring a module for preprocessCss, processCss, etc?
  // we don't want them to be transformed using this plugin
  // because it will cause circular dependency in babel-node and babel-register process
  let inProcessingFunction = false;

  const pluginApi = {
    manipulateOptions(options) {
      if (initialized || inProcessingFunction) {
        return options;
      }

      // TODO: options?

      initialized = true;

      return options;
    },

    post() {
      // TODO: output CSS file
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

        if (args.length !== 2) {
          console.log(file)
          throw new Error(`Missing arguments: ${formatLocation('TODO', path.node)}`)
        }

        if (!t.isStringLiteral(args[0])) {
          console.log(file)
          throw new Error(`Invalid CSS prefix: ${formatLocation('TODO', path.node)}`)
        }

        if (!t.isObjectExpression(args[1])) {
          console.log(file)
          throw new Error(`Invalid CSS styles: ${formatLocation('TODO', path.node)}`)
        }

        const [prefixNode, classesNode] = args;

        const prefix = prefixNode.extra.rawValue;


        // XXX: security, need to parse it properly

        const classes = eval('(' + file.code.slice(
          classesNode.start,
          classesNode.end,
        ) + ')');

        console.log({ prefix, classes })

        // const requiringFile = file.opts.filename;

        path.replaceWith(buildClassesNode(prefix, classes));
      },
    },
  };

  function buildClassesNode(prefix, classes) {
    return t.ObjectExpression(
      Object.keys(classes).map((className) => {
        return t.ObjectProperty(
          t.StringLiteral(className),
          t.StringLiteral(generateClassName(prefix, className))
        )
      }),
    );
  }

  return pluginApi;
}

function generateClassName(prefix, className) {
  if (!prefix) { return className }
  if (className === 'root') { return prefix }
  return `${prefix}--${className}`
}

function formatLocation(filename, node) {
  return `${node.loc.start.line}:${node.loc.start.column}`
}
