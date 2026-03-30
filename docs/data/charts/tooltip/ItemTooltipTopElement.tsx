import * as React from 'react';
import { ScaleBand } from '@mui/x-charts-vendor/d3-scale';
import NoSsr from '@mui/material/NoSsr';
import Popper from '@mui/material/Popper';
import { useItemTooltip } from '@mui/x-charts/ChartsTooltip';
import {
  useChartsLayerContainerRef,
  useXAxis,
  useXScale,
  useYScale,
} from '@mui/x-charts/hooks';

type PointerState = {
  isActive: boolean;
  isMousePointer: boolean;
  pointerHeight: number;
};

function usePointer(): PointerState {
  const chartsLayerContainerRef = useChartsLayerContainerRef();

  // Use a ref to avoid rerendering on every mousemove event.
  const [pointer, setPointer] = React.useState<PointerState>({
    isActive: false,
    isMousePointer: false,
    pointerHeight: 0,
  });

  React.useEffect(() => {
    const element = chartsLayerContainerRef.current;
    if (element === null) {
      return () => {};
    }

    const handleOut = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        setPointer((prev) => ({
          ...prev,
          isActive: false,
        }));
      }
    };

    const handleEnter = (event: PointerEvent) => {
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
  }, [chartsLayerContainerRef]);

  return pointer;
}

export function ItemTooltipTopElement({ children }: React.PropsWithChildren) {
  const tooltipData = useItemTooltip<'bar'>();
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
  const chartsLayerContainerRef = useChartsLayerContainerRef();

  if (!tooltipData || !isActive || !xAxis.data) {
    // No data to display
    return null;
  }

  if (
    tooltipData.identifier.type !== 'bar' ||
    tooltipData.identifier.dataIndex === undefined ||
    tooltipData.value === null ||
    chartsLayerContainerRef.current === null
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
      chartsLayerContainerRef.current.getBoundingClientRect().left +
      svgXPosition +
      (xScale as ScaleBand<any>).step() / 2,
    // Add the coordinate of the <svg/> to the to position inside the <svg/>.
    y: chartsLayerContainerRef.current.getBoundingClientRect().top + svgYPosition,
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
        {children}
      </Popper>
    </NoSsr>
  );
}
