import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import renameComponentsSlots from '../../../util/renameComponentsSlots';
import { transformNestedProp } from '../../../util/addComponentsSlots';
import removeProps from '../../../util/removeProps';

const propsToComponentsProps = {
  hideTabs: 'tabs.hidden',
  dateRangeIcon: 'tabs.dateIcon',
  timeIcon: 'tabs.timeIcon',
};

const COMPONENTS = [
  'DateTimePicker',
  'MobileDateTimePicker',
  'DesktopDateTimePicker',
  'StaticDateTimePicker',
];

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  root
    .find(j.JSXElement)
    .filter((path) => {
      return COMPONENTS.includes((path.value.openingElement.name as any).name);
    })
    .forEach((path) => {
      const attributesToTransform = j(path)
        .find(j.JSXAttribute)
        .filter((attribute) =>
          Object.keys(propsToComponentsProps).includes(attribute.value.name.name as string),
        );
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
          path,
          'componentsProps',
          propsToComponentsProps[attributeName],
          value,
          j,
        );
      });
    });

  removeProps({ root, componentNames: COMPONENTS, props: Object.keys(propsToComponentsProps), j });

  return renameComponentsSlots({
    root,
    componentNames: COMPONENTS,
    translation: { dateRangeIcon: 'dateIcon' },
    j,
  }).toSource(printOptions);
}
