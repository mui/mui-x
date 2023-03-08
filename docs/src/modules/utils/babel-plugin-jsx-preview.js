const fs = require('fs');

const pluginName = 'babel-plugin-jsx-preview';

const wrapperTypes = ['div', 'Box', 'Stack', 'LocalizationProvider', 'DemoContainer', 'DemoItem'];

/**
 * @returns {import('@babel/core').PluginObj}
 */
module.exports = function babelPluginJsxPreview() {
  /**
   * @type {import('@babel/core').types.JSXElement[]}
   */
  let previewNodes = [];

  return {
    name: pluginName,
    visitor: {
      ExportDefaultDeclaration(path) {
        const { declaration } = path.node;
        if (declaration.type !== 'FunctionDeclaration') {
          return;
        }
        const { body } = declaration.body;
        /**
         * @type {import('@babel/core').types.ReturnStatement[]}
         */
        const [lastReturn] = body
          .filter((statement) => {
            return statement.type === 'ReturnStatement';
          })
          .reverse();

        const returnedJSX = lastReturn.argument;
        if (returnedJSX.type === 'JSXElement') {
          previewNodes = [returnedJSX];

          let shouldTestWrapper = true;

          while (
            shouldTestWrapper &&
            previewNodes.length === 1 &&
            previewNodes[0].children.length > 0 &&
            wrapperTypes.includes(previewNodes[0].openingElement.name.name)
          ) {
            // Trim blank JSXText to normalize
            // return (
            //   <div />
            // )
            // and
            // return (
            //   <Stack>
            //     <div />
            // ^^^^ Blank JSXText including newline
            //   </Stack>
            // )

            const wrapperName = previewNodes[0].openingElement.name.name;

            previewNodes = previewNodes[0]?.children.filter((child, index, children) => {
              const isSurroundingBlankJSXText =
                (index === 0 || index === children.length - 1) &&
                child.type === 'JSXText' &&
                !/[^\s]+/.test(child.value);
              return !isSurroundingBlankJSXText;
            });

            // If the current wrapper is `LocalizationProvider`, we also want to remove nested wrappers.
            shouldTestWrapper = wrapperName === 'LocalizationProvider';
          }
        }
      },
    },
    post(state) {
      const { maxLines, outputFilename } = state.opts.plugins.find((plugin) => {
        return plugin.key === pluginName;
      }).options;

      let hasPreview = false;
      if (previewNodes.length > 0) {
        const startNode = previewNodes[0];
        const endNode = previewNodes.slice(-1)[0];
        const preview = state.code.slice(startNode.start, endNode.end);

        const previewLines = preview.split(/\n/);
        // The first line is already trimmed either due to trimmed blank JSXText or because it's a single node which babel already trims.
        // The last line is therefore the meassure for indentation
        const indentation = previewLines.slice(-1)[0].match(/^\s*/)[0].length;
        const deindentedPreviewLines = preview.split(/\n/).map((line, index) => {
          if (index === 0) {
            return line;
          }
          return line.slice(indentation);
        });

        if (deindentedPreviewLines.length <= maxLines) {
          fs.writeFileSync(outputFilename, deindentedPreviewLines.join('\n'));
          hasPreview = true;
        }
      }

      if (!hasPreview) {
        try {
          fs.unlinkSync(outputFilename);
        } catch (error) {
          // Would throw if the file doesn't exist.
          // But we do want to ensure that the file doesn't exist so the error is fine.
        }
      }
    },
  };
};
