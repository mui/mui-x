import * as React from 'react';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import { AxisTooltipData, ItemTooltipData, TooltipContext } from '../context/TooltipProvider';
import { SeriesContext } from '../context/SeriesContextProvider';
import { SVGContext } from '../context/DrawingProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { isBandScale } from '../hooks/useScale';

function ItemTooltipContent(props: ItemTooltipData) {
  const { seriesId, seriesType, dataIndex } = props;

  const series = React.useContext(SeriesContext)[seriesType].series[seriesId];

  const data = series.data[dataIndex];

  return (
    <p>
      {seriesId}: {data}
    </p>
  );
}
function AxisTooltipContent(props: AxisTooltipData) {
  const { dataIndex } = props;
  const { xAxisIds } = React.useContext(CartesianContext);
  const series = React.useContext(SeriesContext);

  const USED_X_AXIS_ID = xAxisIds[0];

  const seriesConcerned = React.useMemo(() => {
    const rep: { type: string; id: string }[] = [];

    Object.keys(series).forEach((seriesType) => {
      series[seriesType].seriesOrder.forEach((seriesId) => {
        if (series[seriesType].series[seriesId].xAxisKey === USED_X_AXIS_ID) {
          rep.push({ type: seriesType, id: seriesId });
        }
      });
    });
    return rep;
  }, [USED_X_AXIS_ID, series]);
  return (
    <div>
      {seriesConcerned.map(({ type, id }) => (
        <p key={id}>
          {id}: {series[type].series[id].data[dataIndex]}
        </p>
      ))}
    </div>
  );
}

export function Tooltip() {
  const { trigger, data } = React.useContext(TooltipContext);
  const { xAxis, xAxisIds } = React.useContext(CartesianContext);

  const svgRef = React.useContext(SVGContext);

  const [dataIndex, setDataIndex] = React.useState<number | null>(null);

  // Use a ref to avoid rerendering on every mousemove event.
  const mousePosition = React.useRef({
    x: -1,
    y: -1,
  });

  const USED_X_AXIS_ID = xAxisIds[0];

  React.useEffect(() => {
    const chart = svgRef.current;
    if (trigger === 'item' || chart === null) {
      return () => {};
    }

    const { scale, data: axisData } = xAxis[USED_X_AXIS_ID];
    const invert = !isBandScale(scale)
      ? scale.invert
      : (x: number) => Math.floor((x - scale.range()[0]) / scale.step());

    const handleMouseOut = () => {
      mousePosition.current = {
        x: -1,
        y: -1,
      };
    };

    const handleMouseMove = (event) => {
      mousePosition.current = {
        x: event.offsetX,
        y: event.offsetY,
      };

      const newDataIndex = invert(event.offsetX);
      if (newDataIndex < 0 || newDataIndex >= (axisData?.length ?? 0)) {
        setDataIndex(null);
      } else {
        setDataIndex(newDataIndex);
      }
    };

    chart.addEventListener('mousemove', handleMouseMove);
    chart.addEventListener('mouseout', handleMouseOut);

    return () => {
      chart.removeEventListener('mousemove', handleMouseMove);
      chart.removeEventListener('mouseout', handleMouseOut);
    };
  }, [USED_X_AXIS_ID, svgRef, trigger, xAxis]);

  const popperOpen = data !== null || dataIndex !== null;

  return (
    <Popper
      open={popperOpen}
      placement="right-start"
      anchorEl={(data && data.target) || svgRef.current}
      style={{ padding: '16px', pointerEvents: 'none', top: 0, left: 0, width: 200, height: 500 }}
    >
      <Paper>
        {trigger === 'item' ? (
          <ItemTooltipContent {...data} />
        ) : (
          <AxisTooltipContent dataIndex={dataIndex} />
        )}
      </Paper>
    </Popper>
  );
}
