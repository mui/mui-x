import * as React from 'react';
import NoSsr from '@mui/material/NoSsr';
import Popper, { PopperProps } from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useItemTooltip } from '@mui/x-charts/ChartsTooltip';
import { useSvgRef } from '@mui/x-charts/hooks';
import { generateVirtualElement } from './generateVirtualElement';

type PointerState = {
  isActive: boolean;
  isMousePointer: boolean;
  pointerHeight: number;
};

function usePointer(): PointerState & Pick<PopperProps, 'popperRef' | 'anchorEl'> {
  const svgRef = useSvgRef();
  const popperRef: PopperProps['popperRef'] = React.useRef(null);
  const virtualElement = React.useRef(generateVirtualElement({ x: 0, y: 0 }));

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

    const handleMove = (event: PointerEvent) => {
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

export function CustomItemTooltip() {
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
        <Paper
          elevation={0}
          sx={{
            m: 1,
            p: 1.5,
            border: 'solid',
            borderWidth: 2,
            borderColor: 'divider',
          }}
        >
          <Stack direction="row" alignItems="center">
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: '50%',
                backgroundColor: tooltipData.color,
              }}
            />
            <Typography sx={{ ml: 2 }} fontWeight="light">
              {tooltipData.label}
            </Typography>
            <Typography sx={{ ml: 2 }}>{tooltipData.formattedValue}</Typography>
          </Stack>
        </Paper>
      </Popper>
    </NoSsr>
  );
}
