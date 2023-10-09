import ChartsXReferenceLine, { ChartsXReferenceLineProps } from './ChartsXReferenceLine';
import ChartsYReferenceLine, { ChartsYReferenceLineProps } from './ChartsYReferenceLine';
import { XOR } from '../internals/utils';

type ChartsReferenceLineProps<TValue extends string | number | Date = string | number | Date> = XOR<
  ChartsXReferenceLineProps<TValue>,
  ChartsYReferenceLineProps<TValue>
>;

export const ChartsReferenceLine = (props: ChartsReferenceLineProps) => {
  if (props.x !== undefined && props.y !== undefined) {
    throw new Error('MUI-X: The ChartsReferenceLine can not have both `x` and `y` props set.');
  }

  if (props.x === undefined && props.y === undefined) {
    throw new Error('MUI-X: The ChartsReferenceLine should have a value in `x` or `y` prop.');
  }

  if (props.x !== undefined) {
    return <ChartsXReferenceLine {...props} />;
  }
  return <ChartsYReferenceLine {...props} />;
};
