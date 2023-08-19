import * as React from 'react';
import { arc as d3Arc, PieArcDatum as D3PieArcDatum } from 'd3-shape';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { InteractionContext } from '../context/InteractionProvider';
import { getIsFaded, getIsHighlighted } from '../hooks/useInteractionItemProps';
import { HighlightScope } from '../context/HighlightProvider';
import { PieSeriesType } from '../models/seriesType/pie';

export interface PieArcLabelClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when higlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
}

export type PieArcLabelClassKey = keyof PieArcLabelClasses;

export interface PieArcLabelOwnerState {
  id: string;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<PieArcLabelClasses>;
}

export function getPieArcLabelUtilityClass(slot: string) {
  return generateUtilityClass('MuiPieArcLabel', slot);
}

export const pieArcLabelClasses: PieArcLabelClasses = generateUtilityClasses('MuiPieArcLabel', [
  'root',
  'highlighted',
  'faded',
]);

const useUtilityClasses = (ownerState: PieArcLabelOwnerState) => {
  const { classes, id, isFaded, isHighlighted } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded'],
  };

  return composeClasses(slots, getPieArcLabelUtilityClass, classes);
};

const PieArcLabelRoot = styled('text', {
  name: 'MuiPieArcLabel',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
}));

export type PieArcLabelProps = Omit<PieArcLabelOwnerState, 'isFaded' | 'isHighlighted'> &
  React.ComponentPropsWithoutRef<'path'> &
  D3PieArcDatum<any> & {
    highlightScope?: Partial<HighlightScope>;
    innerRadius: PieSeriesType['innerRadius'];
    outerRadius: number;
    cornerRadius: PieSeriesType['cornerRadius'];
  } & {
    formattedArcLabel?: string | null;
  };

export default function PieArcLabel(props: PieArcLabelProps) {
  const {
    id,
    dataIndex,
    classes: innerClasses,
    color,
    highlightScope,
    innerRadius = 0,
    outerRadius,
    cornerRadius = 0,
    formattedArcLabel,
    ...other
  } = props;

  const { item } = React.useContext(InteractionContext);

  const isHighlighted = getIsHighlighted(
    item,
    { type: 'pie', seriesId: id, dataIndex },
    highlightScope,
  );

  const isFaded =
    !isHighlighted && getIsFaded(item, { type: 'pie', seriesId: id, dataIndex }, highlightScope);

  const ownerState = {
    id,
    dataIndex,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
  };
  const classes = useUtilityClasses(ownerState);

  const arcLabelPosition = formattedArcLabel
    ? d3Arc()
        .cornerRadius(cornerRadius)
        .centroid({ ...other, innerRadius, outerRadius })
    : [0, 0];
  return (
    <PieArcLabelRoot className={classes.root} x={arcLabelPosition[0]} y={arcLabelPosition[1]}>
      {formattedArcLabel}
    </PieArcLabelRoot>
  );
}

PieArcLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  cornerRadius: PropTypes.number,
  dataIndex: PropTypes.number.isRequired,
  highlightScope: PropTypes.shape({
    faded: PropTypes.oneOf(['global', 'none', 'series']),
    highlighted: PropTypes.oneOf(['item', 'none', 'series']),
  }),
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number.isRequired,
} as any;
