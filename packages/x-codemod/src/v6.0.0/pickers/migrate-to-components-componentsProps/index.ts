import { transformNestedProp } from '../../../util/addComponentsSlots';
import removeProps from '../../../util/removeProps';
import renameComponentsSlots from '../../../util/renameComponentsSlots';

const propsToSlots = {
  // components
  TransitionComponent: { prop: 'components', path: 'DesktopTransition' },

  // componentsProps
  PopperProps: { prop: 'componentsProps', path: 'popper' },
  DialogProps: { prop: 'componentsProps', path: 'dialog' },
  PaperProps: { prop: 'componentsProps', path: 'desktopPaper' },
  TrapFocusProps: { prop: 'componentsProps', path: 'desktopTrapFocus' },
  InputProps: { prop: 'componentsProps', path: 'textField.InputProps' },
  InputAdornmentProps: { prop: 'componentsProps', path: 'inputAdornment' },
  OpenPickerButtonProps: { prop: 'componentsProps', path: 'openPickerButton' },
};

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

          const attributesToTransform = j(elementPath)
            .find(j.JSXAttribute)
            .filter((attribute) => {
              const attributeParent = attribute.parentPath.parentPath;
              if (
                attribute.parentPath.parentPath.value.type !== 'JSXOpeningElement' ||
                attributeParent.value.name.name !== node.local.name
              ) {
                return false;
              }
              return Object.keys(propsToSlots).includes(attribute.value.name.name as string);
            });

          attributesToTransform.forEach((attribute) => {
            const attributeName = attribute.value.name.name as string;

            // Get the value in case it's:
            // - prop={value}
            // - prop="value"
            // - prop (which means true)
            const value =
              attribute.value.value?.type === 'JSXExpressionContainer'
                ? attribute.value.value.expression
                : attribute.value.value || j.booleanLiteral(true);
            transformNestedProp(
              elementPath,
              propsToSlots[attributeName].prop,
              propsToSlots[attributeName].path,
              value,
              j,
            );
          });
        });
        removeProps({
          root,
          componentNames: [node.local.name],
          props: Object.keys(propsToSlots),
          j,
        });
      });
    });

  return renameComponentsSlots({
    root,
    componentNames: Array.from(componentNames),
    translation: {
      input: 'textField',
    },
    j,
  }).toSource(printOptions);
}
