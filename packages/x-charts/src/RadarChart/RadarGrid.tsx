import * as React from 'react';
import PropTypes from 'prop-types';
import { useDrawingArea, useRadiusScale, useRotationScale } from '../hooks';

export interface RadarGridProps {
  /**
   * The number of division
   * @default 5
   */
  divisionNumber?: number;
}

function RadarGrid(props: RadarGridProps) {
  const { divisionNumber = 5 } = props;
  const rotationScale = useRotationScale<'point'>();
  const radiusScale = useRadiusScale();
  const drawingArea = useDrawingArea();

  const cx = drawingArea.left + drawingArea.width / 2;
  const cy = drawingArea.top + drawingArea.height / 2;

  const divisionValues = Array.from(
    { length: divisionNumber },
    (_, index) => (radiusScale.range()[1] * (index + 1)) / divisionNumber,
  );

  const angles = rotationScale.domain().map((key) => rotationScale(key)!);

  return (
    <g>
      {divisionValues.map((r) => (
        <path
          key={r}
          stroke="gray"
          fill="transparent"
          d={`M ${angles
            .map((angle) => `${cx - r * Math.sin(angle)} ${cy - r * Math.cos(angle)}`)
            .join('L')} Z`}
        />
      ))}
      {angles.map((angle) => {
        const r = radiusScale.range()[0];
        const R = radiusScale.range()[1];
        return (
          <path
            key={angle}
            stroke="gray"
            fill="transparent"
            d={`M ${cx - r * Math.sin(angle)} ${cy - r * Math.cos(angle)} L ${cx - R * Math.sin(angle)} ${cy - R * Math.cos(angle)}`}
          />
        );
      })}
    </g>
  );
}

RadarGrid.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The number of division
   * @default 5
   */
  divisionNumber: PropTypes.number,
} as any;

export { RadarGrid };
