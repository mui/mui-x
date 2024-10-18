import * as React from 'react';
import NoSsr from '@mui/material/NoSsr';
import Popper from '@mui/material/Popper';
import { useItemTooltip } from '@mui/x-charts/ChartsTooltip';
import { useSvgRef } from '@mui/x-charts/hooks';
import { CustomItemTooltipContent } from './CustomItemTooltipContent';
import { generateVirtualElement } from './generateVirtualElement';

function usePointer() {
  const svgRef = useSvgRef();
  const popperRef = React.useRef(null);
  const virtualElement = React.useRef(generateVirtualElement({ x: 0, y: 0 }));

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

    const handleMove = (event) => {
      virtualElement.current = generateVirtualElement({
        x: event.clientX,
        y: event.clientY,
      });
      popperRef.current?.update();
    };

    element.addEventListener('pointerenter', handleEnter);
    element.addEventListener('pointerup', handleOut);
    element.addEventListener('pointermove', handleMove);

    return () => {
      element.removeEventListener('pointerenter', handleEnter);
      element.removeEventListener('pointerup', handleOut);
      element.removeEventListener('pointermove', handleMove);
    };
  }, [svgRef]);

  return { ...pointer, popperRef, anchorEl: virtualElement.current };
}

export function ItemTooltip() {
  const tooltipData = useItemTooltip();
  const { isActive, isMousePointer, pointerHeight, popperRef, anchorEl } =
    usePointer();

  if (!tooltipData || !isActive) {
    // No data to display
    return null;
  }

  // Adapt the tooltip offset to the size of the pointer.
  const yOffset = isMousePointer ? 0 : 40 - pointerHeight;

  return (
    <NoSsr>
      <Popper
        sx={{
          pointerEvents: 'none',
          zIndex: (theme) => theme.zIndex.modal,
        }}
        open
        placement={isMousePointer ? 'top-end' : 'top'}
        anchorEl={anchorEl}
        popperRef={popperRef}
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, yOffset],
            },
          },
        ]}
      >
        <CustomItemTooltipContent {...tooltipData} />
      </Popper>
    </NoSsr>
  );
}
