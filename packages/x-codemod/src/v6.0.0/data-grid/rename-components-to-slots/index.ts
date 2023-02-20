import { checkPreRequisitesSatisfied } from '../../../util/renameIdentifiers';

const preRequisites = {
  components: ['DataGrid', 'DataGridPro', 'DataGridPremium'],
  packageRegex: /@mui\/x-data-grid(-pro|-premium)?/,
};

function transformComponentsProp(attributeNode) {
  attributeNode.value.name.name = 'slots';

  const valueExpression = attributeNode.value.value.expression;
  if (!valueExpression || valueExpression.type !== 'ObjectExpression') {
    return;
  }

  valueExpression.properties.forEach((property) => {
    property.key.name = property.key.name[0].toLowerCase() + property.key.name.slice(1);

    if (property.shorthand) {
      property.shorthand = false;
    }
  });
}

function transformComponentsPropsProp(attributeNode) {
  attributeNode.value.name.name = 'slotProps';
}

/**
 * @param {import('jscodeshift').FileInfo} file
 * @param {import('jscodeshift').API} api
 */
export default function transformer(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  const isGridUsed = checkPreRequisitesSatisfied(j, root, preRequisites);

  if (isGridUsed) {
    root
      .find(j.JSXElement)
      .filter((path) => {
        return preRequisites.components.includes((path.value.openingElement.name as any).name);
      })
      .find(j.JSXAttribute)
      .forEach((attribute) => {
        // Only remove props from components in componentNames. Not nested ones.
        if (!preRequisites.components.includes(attribute.parent.value.name.name)) {
          return;
        }
        if (attribute.value.name.name === 'components') {
          transformComponentsProp(attribute);
        } else if (attribute.value.name.name === 'componentsProps') {
          transformComponentsPropsProp(attribute);
        }
      });
  }

  return root.toSource(printOptions);
}
