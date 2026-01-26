import { useDrawingArea } from '@mui/x-charts/hooks';

export interface CandlestickPlotProps {}

export function CandlestickPlot() {
  const drawingArea = useDrawingArea();

  return (
    <rect
      x={drawingArea.left}
      y={drawingArea.top}
      width={drawingArea.width}
      height={drawingArea.height}
      fill="#ff00ff"
    />
  );
}
