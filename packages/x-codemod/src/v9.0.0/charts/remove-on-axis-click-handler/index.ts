import { JSXAttribute, JSXElement } from 'jscodeshift';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

/**
 * @param {import('jscodeshift').FileInfo} file
 * @param {import('jscodeshift').API} api
 */
export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;

  const printOptions = options.printOptions;

  const root = j(file.source);

  // Move the handler to the container
  root
    .findJSXElements()
    .filter(
      (path) =>
        Boolean(path.node.openingElement) &&
        path.node.openingElement.name.type === 'JSXIdentifier' &&
        path.node.openingElement.name.name.includes('ChartContainer'),
    )
    .forEach((path) => {
      // We find the <ChartsOnAxisClickHandler /> node
      const clickHandler = path.node.children?.find((child): child is JSXElement => {
        if (child.type !== 'JSXElement') {
          return false;
        }
        if (child.openingElement.name.type !== 'JSXIdentifier') {
          return false;
        }
        return child.openingElement.name.name === 'ChartsOnAxisClickHandler';
      });

      if (!clickHandler) {
        return;
      }

      const clickCallback = clickHandler.openingElement.attributes?.find(
        (attr): attr is JSXAttribute =>
          attr.type === 'JSXAttribute' && attr.name.name === 'onAxisClick',
      );

      if (!clickCallback) {
        return;
      }

      // Move the callback to the container
      path.node.openingElement.attributes?.push(clickCallback);

      // Remove the children
      path.node.children = path.node.children?.filter((child) => {
        if (child.type !== 'JSXElement') {
          return true;
        }
        if (child.openingElement.name.type !== 'JSXIdentifier') {
          return true;
        }
        return child.openingElement.name.name !== 'ChartsOnAxisClickHandler';
      });
    });

  // Remove nested import
  root
    .find(j.ImportDeclaration, { source: { value: '@mui/x-charts/ChartsOnAxisClickHandler' } })
    .remove();

  // Remove global import
  root.find(j.ImportDeclaration).forEach((path) => {
    if (typeof path.node.source.value !== 'string') {
      return;
    }
    if (!path.node.source.value.includes('@mui/x-charts')) {
      return;
    }

    path.node.specifiers = path.node.specifiers?.filter((specifier) => {
      if (specifier.type !== 'ImportSpecifier') {
        return true;
      }

      return specifier.imported.name !== 'ChartsOnAxisClickHandler';
    });
  });

  return root.toSource(printOptions);
}
