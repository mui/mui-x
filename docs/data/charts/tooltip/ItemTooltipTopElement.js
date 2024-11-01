import * as React from 'react';

import NoSsr from '@mui/material/NoSsr';
import Popper from '@mui/material/Popper';
import { useItemTooltip } from '@mui/x-charts/ChartsTooltip';
import { useSvgRef, useXAxis, useXScale, useYScale } from '@mui/x-charts/hooks';
import { CustomItemTooltipContent } from './CustomItemTooltipContent';

function usePointer() {
  const svgRef = useSvgRef();

  // Use a ref to avoid rerendering on every mousemove event.
  const [pointer, setPointer] = React.useState({
    isActive: false,
    isMousePointer: false,
    pointerHeight: 0,
  });

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const handleOut = (event) => {
      if (event.pointerType !== 'mouse') {
        setPointer((prev) => ({
          ...prev,
          isActive: false,
        }));
      }
    };

    const handleEnter = (event) => {
      setPointer({
        isActive: true,
        isMousePointer: event.pointerType === 'mouse',
        pointerHeight: event.height,
      });
    };

    element.addEventListener('pointerenter', handleEnter);
    element.addEventListener('pointerup', handleOut);

    return () => {
      element.removeEventListener('pointerenter', handleEnter);
      element.removeEventListener('pointerup', handleOut);
    };
  }, [svgRef]);

  return pointer;
}

export function ItemTooltipTopElement() {
  const tooltipData = useItemTooltip();
  const { isActive } = usePointer();
  // Get xAxis config to access its data array.
  const xAxis = useXAxis();
  // Get the scale which map values to SVG coordinates.
  // Pass the axis id to this hook if you use multiple one.
  const xScale = useXScale();
  // Get the scale which map values to SVG coordinates.
  // Pass the axis id to this hook if you use multiple one.
  const yScale = useYScale();
  // Get the ref of the <svg/> component.
  const svgRef = useSvgRef();

  if (!tooltipData || !isActive || !xAxis.data) {
    // No data to display
    return null;
  }

  if (
    tooltipData.identifier.type !== 'bar' ||
    tooltipData.identifier.dataIndex === undefined ||
    tooltipData.value === null
  ) {
    // This demo is only about bar charts
    return null;
  }

  const xValue = xAxis.data[tooltipData.identifier.dataIndex];

  const svgYPosition = yScale(tooltipData.value) ?? 0;
  const svgXPosition = xScale(xValue) ?? 0;

  const tooltipPosition = {
    // Add half of `yScale.step()` to be in the middle of the band.
    x:
      svgRef.current.getBoundingClientRect().left + svgXPosition + xScale.step() / 2,
    // Add the coordinate of the <svg/> to the to position inside the <svg/>.
    y: svgRef.current.getBoundingClientRect().top + svgYPosition,
  };

  return (
    <NoSsr>
      <Popper
        sx={{
          pointerEvents: 'none',
          zIndex: (theme) => theme.zIndex.modal,
        }}
        open
        placement="top"
        anchorEl={{
          getBoundingClientRect: () => ({
            x: tooltipPosition.x,
            y: tooltipPosition.y,
            top: tooltipPosition.y,
            left: tooltipPosition.x,
            right: tooltipPosition.x,
            bottom: tooltipPosition.y,
            width: 0,
            height: 0,
            toJSON: () => '',
          }),
        }}
      >
        <CustomItemTooltipContent {...tooltipData} />
      </Popper>
    </NoSsr>
  );
}
