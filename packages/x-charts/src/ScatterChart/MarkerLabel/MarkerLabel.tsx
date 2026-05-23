'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, useThemeProps } from '@mui/material/styles';
import { type SeriesId } from '../../models/seriesType/common';
import { type ScatterClasses } from '../scatterClasses';

export interface MarkerLabelOwnerState {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<ScatterClasses>;
}

export const MarkerLabelComponent = styled('text', {
  name: 'MuiMarkerLabel',
  slot: 'Root',
})(({ theme }) => ({
  ...theme?.typography?.body2,
  stroke: 'none',
  fill: (theme.vars || theme)?.palette?.text?.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  pointerEvents: 'none',
}));

export type MarkerLabelProps = Omit<React.SVGProps<SVGTextElement>, 'ref' | 'id' | 'x' | 'y'> &
  MarkerLabelOwnerState & {
    x: number;
    y: number;
  };

function MarkerLabel(inProps: MarkerLabelProps): React.JSX.Element {
  const props = useThemeProps({ props: inProps, name: 'MuiMarkerLabel' });
  const { seriesId, dataIndex, color, isFaded, isHighlighted, classes, ...otherProps } = props;

  return <MarkerLabelComponent opacity={isFaded ? 0.3 : 1} {...otherProps} />;
}

MarkerLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  dataIndex: PropTypes.number.isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  seriesId: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
} as any;

export { MarkerLabel };
