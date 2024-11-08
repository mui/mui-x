import * as React from 'react';
import NoSsr from '@mui/material/NoSsr';
import Popper, { PopperProps } from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useAxisTooltip } from '@mui/x-charts/ChartsTooltip';
import { useSvgRef } from '@mui/x-charts/hooks';

type PointerState = {
  isActive: boolean;
  isMousePointer: boolean;
  pointerHeight: number;
};

function usePointer(): PointerState & Pick<PopperProps, 'popperRef' | 'anchorEl'> {
  const svgRef = useSvgRef();
  const popperRef: PopperProps['popperRef'] = React.useRef(null);
  const positionRef = React.useRef({ x: 0, y: 0 });

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
      positionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
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

  return {
    ...pointer,
    popperRef,
    anchorEl: {
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
    },
  };
}

export function CustomAxisTooltip() {
  const tooltipData = useAxisTooltip();
  const { isActive, isMousePointer, pointerHeight, popperRef, anchorEl } =
    usePointer();

  if (!tooltipData || !isActive) {
    // No data to display
    return null;
  }

  // The pointer type can be used to have different behavior based on pointer type.
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
            border: 'solid',
            borderWidth: 2,
            borderColor: 'divider',
            table: { borderSpacing: 0 },
            thead: {
              td: {
                px: 1.5,
                py: 0.75,
                borderBottom: 'solid',
                borderWidth: 2,
                borderColor: 'divider',
              },
            },
            tbody: {
              'tr:first-child': { td: { paddingTop: 1.5 } },
              'tr:last-child': { td: { paddingBottom: 1.5 } },
              tr: {
                'td:first-child': { paddingLeft: 1.5 },
                'td:last-child': { paddingRight: 1.5 },
                td: {
                  paddingRight: '7px',
                  paddingBottom: '10px',
                },
              },
            },
          }}
        >
          <table>
            <thead>
              <tr>
                <td colSpan={3}>
                  <Typography>{tooltipData.axisFormattedValue}</Typography>
                </td>
              </tr>
            </thead>
            <tbody>
              {tooltipData.seriesItems.map((seriesItem) => (
                <tr key={seriesItem.seriesId}>
                  <td aria-label={`${seriesItem.formattedLabel}-series-color`}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        backgroundColor: seriesItem.color,
                      }}
                    />
                  </td>
                  <td>
                    <Typography fontWeight="light">
                      {seriesItem.formattedLabel}
                    </Typography>
                  </td>
                  <td>
                    <Typography>{seriesItem.formattedValue}</Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>
      </Popper>
    </NoSsr>
  );
}
