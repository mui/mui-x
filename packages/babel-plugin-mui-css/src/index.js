import { extractCssFile } from './utils/index.js';

const defaultOptions = {
  generateScopedName: '[name]__[local]___[hash:base64:5]',
};

export default function transformCssModules({ types: t }) {

  // is css modules require hook initialized?
  let initialized = false;
  // are we requiring a module for preprocessCss, processCss, etc?
  // we don't want them to be transformed using this plugin
  // because it will cause circular dependency in babel-node and babel-register process
  let inProcessingFunction = false;

  function matcher(extensions = ['.css']) {
    const extensionsPattern = extensions.join('|').replace(/\./g, '\\\.');
    return new RegExp(`(${extensionsPattern})$`, 'i');
  }

  const cssMap = new Map();
  let thisPluginOptions = null;

  const pluginApi = {
    manipulateOptions(options) {
      if (initialized || inProcessingFunction) {
        return options;
      }

      // find options for this plugin
      // we have to use this hack because plugin.key does not have to be 'css-modules-transform'
      // so we will identify it by comparing manipulateOptions
      if (Array.isArray(options.plugins[0])) {
        // babel 6
        thisPluginOptions = options.plugins.filter(
          ([plugin]) => plugin.manipulateOptions === pluginApi.manipulateOptions,
        )[0][1];
      } else {
        // babel 7
        thisPluginOptions = options.plugins.filter(
          (plugin) => plugin.manipulateOptions === pluginApi.manipulateOptions,
        )[0].options;
      }

      const currentConfig = { ...defaultOptions, ...thisPluginOptions };
      // this is not a css-require-ook config
      delete currentConfig.extractCss;
      delete currentConfig.keepImport;
      delete currentConfig.importPathFormatter;

      const pushStylesCreator = (toWrap) => (css, filepath) => {
        let processed;

        if (typeof toWrap === 'function') {
          processed = toWrap(css, filepath);
        }

        if (typeof processed !== 'string') processed = css;

        // set css content only if is new
        if (!cssMap.has(filepath) || cssMap.get(filepath) !== processed) {
          cssMap.set(filepath, processed);
        }

        return processed;
      };

      // resolve options
      // Object.keys(requireHooksOptions).forEach((key) => {
      //   // skip undefined options
      //   if (currentConfig[key] === undefined) {
      //     if (key === 'importPathFormatter' && thisPluginOptions && thisPluginOptions[key]) {
      //       thisPluginOptions[key] = requireHooksOptions[key](thisPluginOptions[key]);
      //     }
      //     return;
      //   }
      //
      //   inProcessingFunction = true;
      //   currentConfig[key] = requireHooksOptions[key](currentConfig[key], currentConfig);
      //   inProcessingFunction = false;
      // });

      // wrap or define processCss function that collect generated css
      currentConfig.processCss = pushStylesCreator(currentConfig.processCss);

      initialized = true;

      return options;
    },
    post() {
      // extract css only if is this option set
      if (thisPluginOptions?.extractCss) {
        // always rewrite file :-/
        extractCssFile(process.cwd(), cssMap, thisPluginOptions.extractCss);
      }
    },
    visitor: {
      // const styles = css({ options: true }, {
      //   root: { ... },
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
        // XXX: security
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
