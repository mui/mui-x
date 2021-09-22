import NoSsr from '@mui/core/NoSsr';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import ChartContext from '../ChartContext';
import useTicks from '../hooks/useTicks';
import { findObjects, isInRange } from '../utils';

function getSymbol(shape, series = 0) {
  const symbolNames = 'circle cross diamond square star triangle wye'.split(/ /);
  if (shape === 'auto') {
    return series % symbolNames.length;
  }
  return symbolNames.indexOf(shape) || 0;
}

function Tooltip(props) {
  const {
    data,
    dimensions: { boundedHeight },
    mousePosition,
    markers,
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
  // Add the information of markers
  highlightedData =
    highlightedData &&
    highlightedData.map((d, i) => ({
      label: markers[i].label,
      series: markers[i].series,
      markerShape: markers[i].markerShape,
      markerColor: markers[i].markerColor,
      markerSize: markers[i].markerSize,
      ...d,
    }));
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
                  .map((d, i) => (
                    <Typography
                      variant="body2"
                      key={i}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <svg width={d.markerSize} height={d.markerSize}>
                        <path
                          d={d3.symbol(
                            d3.symbols[getSymbol(d.markerShape, d.series)],
                            d.markerSize,
                          )()}
                          transform={`translate(${d.markerSize / 2}, ${d.markerSize / 2})`}
                          fill={d.markerColor}
                        />
                      </svg>
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
