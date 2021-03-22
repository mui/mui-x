import { GridBaseComponentPropsEnum } from '../../models/params/gridBaseComponentProps';

const isGridBaseComponentProp = (prop: string) => {
  return !!GridBaseComponentPropsEnum[prop];
};

export function useGridStripBaseComponentsProps(props) {
  const strippedProps = {};

  Object.keys(props).forEach((prop) => {
    if (!isGridBaseComponentProp(prop)) {
      strippedProps[prop] = props[prop];
    }
  });

  return strippedProps;
}
