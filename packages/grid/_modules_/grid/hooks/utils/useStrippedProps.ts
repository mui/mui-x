const gridBaseComponentProps = [
  'api',
  'columns',
  'options',
  'rootElement',
  'rows',
  'state',
] as const;

type GridBaseComponentPropsKeys = typeof gridBaseComponentProps[number];

const isGridBaseComponentProp = (prop: any): prop is GridBaseComponentPropsKeys => {
  return gridBaseComponentProps.includes(prop);
};

export function useStrippedProps(props) {
  const strippedProps = {};

  Object.keys(props).forEach((prop) => {
    if (!isGridBaseComponentProp(prop)) {
      strippedProps[prop] = props[prop];
    }
  });

  return strippedProps;
}
