import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import NoSsr from '@mui/core/NoSsr';
import Typography from '@mui/material/Typography';
import ChartContext from '../ChartContext';
import { findObjects, isInRange } from '../utils';
import useTicks from '../hooks/useTicks';

function Tooltip(props) {
  const {
    data,
    dimensions: { boundedHeight },
    mousePosition,
    seriesLabels,
    xKey,
    xScale,
    yKey,
  } = useContext(ChartContext);

  const { stroke = 'rgba(200, 200, 200, 0.8)', strokeDasharray = '0', strokeWidth = 1 } = props;
  const [strokeElement, setStrokeElement] = React.useState(null);
  const updateStrokeRef = (element) => {
    setStrokeElement(element);
  };

  // Flatten the data
  // eslint-disable-next-line prefer-spread
  const flatX = [].concat.apply([], data).map((d) => d[xKey]);
  // An array of x-offset values matching the data
  const xOffsets = [...new Set(flatX.map((d) => xScale(d)))].sort(d3.ascending);
  // Find the closest x-offset to the mouse position
  // TODO: Currently assumes that data points are equally spaced
  const offset = xOffsets.find((d) =>
    isInRange(mousePosition.x, d, (xOffsets[1] - xOffsets[0]) / 2),
  );
  // The data that matches the mouse position
  let highlightedData =
    offset !== undefined ? findObjects(data, xKey, xScale.invert(offset)) : null;
  // Add the series labels
  highlightedData =
    highlightedData && highlightedData.map((d, i) => ({ label: seriesLabels[i], ...d }));
  // TODO: Make this work when the data is not equally spaced along the x-axis
  const label = useTicks({ maxTicks: xOffsets.length, scale: xScale }).find(
    (d) => d.offset === offset,
  );

  return (
    <React.Fragment>
      <NoSsr>
        {strokeElement && (
          <Popper
            open={strokeElement !== null}
            placement="right-start"
            anchorEl={strokeElement}
            style={{ padding: '16px', pointerEvents: 'none' }}
          >
            <Paper style={{ padding: '8px' }}>
              <Typography gutterBottom>{label && label.value}</Typography>
              {highlightedData &&
                highlightedData
                  .sort((a, b) => d3.descending(a[yKey], b[yKey]))
                  .map((d, index) => (
                    <Typography variant="body2" key={index}>
                      {d.label}
                      {d.label ? ':' : null} {d[yKey]}
                    </Typography>
                  ))}
            </Paper>
          </Popper>
        )}
        <g transform={`translate(0, ${boundedHeight})`} style={{ pointerEvents: 'none' }}>
          {offset !== undefined && (
            <g transform={`translate(${offset}, 0)`}>
              <line
                ref={updateStrokeRef}
                y2={-boundedHeight}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                shapeRendering="crispEdges"
              />
            </g>
          )}
        </g>
      </NoSsr>
    </React.Fragment>
  );
}

Tooltip.propTypes /* remove-proptypes */ = {
  /**
   * The stroke color of the marker line.
   */
  stroke: PropTypes.string,
  /**
   * The stroke pattern of the marker line.
   */
  strokeDasharray: PropTypes.string,
  /**
   * The stroke width of the marker line.
   */
  strokeWidth: PropTypes.number,
};

export default Tooltip;
