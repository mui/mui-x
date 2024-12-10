import * as React from 'react';
import NoSsr from '@mui/material/NoSsr';
import Popper, { PopperProps } from '@mui/material/Popper';
import { useItemTooltip } from '@mui/x-charts/ChartsTooltip';
import { useDrawingArea, useSvgRef } from '@mui/x-charts/hooks';

type PointerState = {
  isActive: boolean;
  isMousePointer: boolean;
  pointerHeight: number;
};

function usePointer(): PointerState {
  const svgRef = useSvgRef();

  // Use a ref to avoid rerendering on every mousemove event.
  const [pointer, setPointer] = React.useState<PointerState>({
    isActive: false,
    isMousePointer: false,
    pointerHeight: 0,
  });

  React.useEffect(() => {
    const element = svgRef.current;
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
  }, [svgRef]);

  return pointer;
}

export function ItemTooltipFixedY({ children }: React.PropsWithChildren) {
  const tooltipData = useItemTooltip();
  const { isActive } = usePointer();

  const popperRef: PopperProps['popperRef'] = React.useRef(null);
  const positionRef = React.useRef({ x: 0, y: 0 });
  const svgRef = useSvgRef(); // Get the ref of the <svg/> component.
  const drawingArea = useDrawingArea(); // Get the dimensions of the chart inside the <svg/>.

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const handleMove = (event: PointerEvent) => {
      positionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
      popperRef.current?.update();
    };

    element.addEventListener('pointermove', handleMove);

    return () => {
      element.removeEventListener('pointermove', handleMove);
    };
  }, [svgRef, drawingArea.top]);

  if (!tooltipData || !isActive) {
    // No data to display
    return null;
  }

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
            x: positionRef.current.x,
            y: positionRef.current.y,
            top: positionRef.current.y,
            left: positionRef.current.x,
            right: positionRef.current.x,
            bottom: positionRef.current.y,
            width: 0,
            height: 0,
            toJSON: () => '',
          }),
        }}
        popperRef={popperRef}
      >
        {children}
      </Popper>
    </NoSsr>
  );
}
