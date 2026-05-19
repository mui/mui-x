'use client';
import * as React from 'react';
import { useDrawingArea, useXAxes, useYAxes } from '@mui/x-charts/hooks';
import { useBarPlotData, type ProcessedBarSeriesData } from '@mui/x-charts/internals';
import { useWebGLLayer } from '../../ChartsWebGLLayer/ChartsWebGLContext';
import { BarWebGLProgram } from './BarWebGLProgram';
import { useBarWebGLPlotData } from './useBarWebGLPlotData';

export interface BarWebGLPlotProps {
  borderRadius?: number;
}

/**
 * @ignore - Internal component used for rendering the bar plot using WebGL. Not exported from the package.
 */
export function BarWebGLPlot({ borderRadius = 0 }: BarWebGLPlotProps): React.JSX.Element | null {
  const layer = useWebGLLayer();
  const drawingArea = useDrawingArea();
  const { xAxis: xAxes } = useXAxes();
  const { yAxis: yAxes } = useYAxes();
  const { completedData } = useBarPlotData(drawingArea, xAxes, yAxes);

  if (!layer) {
    return null;
  }

  return (
    <BarWebGLPlotImpl
      gl={layer.gl}
      registerDraw={layer.registerDraw}
      requestRender={layer.requestRender}
      borderRadius={borderRadius}
      completedData={completedData}
    />
  );
}

function BarWebGLPlotImpl(props: {
  gl: WebGL2RenderingContext;
  registerDraw: (drawRef: React.RefObject<(() => void) | null>) => () => void;
  requestRender: () => void;
  borderRadius: number;
  completedData: ProcessedBarSeriesData[];
}) {
  const { gl, registerDraw, requestRender, borderRadius, completedData } = props;

  const drawingArea = useDrawingArea();
  const plotData = useBarWebGLPlotData(drawingArea, completedData, borderRadius);

  const [program, setProgram] = React.useState<BarWebGLProgram | null>(null);
  const drawRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    const prog = new BarWebGLProgram(gl);
    setProgram(prog);
    return () => {
      prog.dispose();
    };
  }, [gl]);

  React.useEffect(() => {
    drawRef.current = () => {
      program?.render(plotData.count);
    };
  }, [program, plotData.count]);

  React.useEffect(() => {
    const unregister = registerDraw(drawRef);
    return unregister;
  }, [registerDraw]);

  React.useEffect(() => {
    program?.setResolution(drawingArea.width, drawingArea.height);
    requestRender();
  }, [drawingArea.width, drawingArea.height, program, requestRender]);

  React.useEffect(() => {
    program?.plot(plotData);
    requestRender();
  }, [program, plotData, requestRender]);

  return null;
}
