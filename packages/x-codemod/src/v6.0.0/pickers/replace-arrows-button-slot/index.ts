import renameComponentsSlots from '../../../util/renameComponentsSlots';

export default function transformer(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  const componentNames = new Set<string>();
  root
    .find(j.ImportDeclaration)
    .filter(({ node }) => {
      return node.source.value.startsWith('@mui/x-date-pickers');
    })

    .forEach((path) => {
      path.node.specifiers.forEach((node) => {
        // Process only date-pickers components
        root.findJSXElements(node.local.name).forEach((elementPath) => {
          if (elementPath.node.type !== 'JSXElement') {
            return;
          }
          componentNames.add(node.local.name);
        });
      });
    });

  return renameComponentsSlots({
    root,
    componentNames: Array.from(componentNames),
    translation: {
      LeftArrowButton: 'PreviousIconButton',
      RightArrowButton: 'NextIconButton',
    },
    j,
  }).toSource(printOptions);
}
