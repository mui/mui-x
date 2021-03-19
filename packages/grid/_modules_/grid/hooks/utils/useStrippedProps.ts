import { GridBaseComponentPropsEnum } from '../../models/params/gridBaseComponentProps';

const isGridBaseComponentProp = (prop: string) => {
  return !!GridBaseComponentPropsEnum[prop];
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
