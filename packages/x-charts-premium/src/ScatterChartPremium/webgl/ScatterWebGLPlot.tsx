'use client';
import * as React from 'react';
import { useDrawingArea, useScatterSeriesContext } from '@mui/x-charts/hooks';
import { useWebGLLayer } from '../../ChartsWebGLLayer/ChartsWebGLContext';
import { ScatterWebGLProgram } from './ScatterWebGLProgram';
import { useScatterWebGLPlotData } from './useScatterWebGLPlotData';

/**
 * @ignore - Internal component used for rendering the scatter plot using WebGL. Not exported from the package.
 */
export function ScatterWebGLPlot() {
  const layer = useWebGLLayer();
  const seriesData = useScatterSeriesContext();

  const hasVisibleSeries = React.useMemo(() => {
    if (!seriesData) {
      return false;
    }
    return seriesData.seriesOrder.some((id) => !seriesData.series[id].hidden);
  }, [seriesData]);

  if (!layer || !hasVisibleSeries) {
    return null;
  }

  return (
    <ScatterWebGLPlotImpl
      gl={layer.gl}
      registerDraw={layer.registerDraw}
      requestRender={layer.requestRender}
    />
  );
}

function ScatterWebGLPlotImpl(props: {
  gl: WebGL2RenderingContext;
  registerDraw: (drawRef: React.RefObject<(() => void) | null>) => () => void;
  requestRender: () => void;
}) {
  const { gl, registerDraw, requestRender } = props;
  const drawingArea = useDrawingArea();
  const [program, setProgram] = React.useState<ScatterWebGLProgram | null>(null);

  React.useEffect(() => {
    const prog = new ScatterWebGLProgram(gl);
    setProgram(prog);

    return () => {
      prog.dispose();
    };
  }, [gl]);

  const plotData = useScatterWebGLPlotData();

  const drawRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    drawRef.current = () => {
      program?.render(plotData);
    };
  }, [program, plotData]);

  React.useEffect(() => {
    return registerDraw(drawRef);
  }, [registerDraw]);

  React.useEffect(() => {
    program?.setResolution(drawingArea.width, drawingArea.height);
    requestRender();
  }, [drawingArea.height, drawingArea.width, program, requestRender]);

  React.useEffect(() => {
    program?.plot(plotData);
    requestRender();
  }, [plotData, program, requestRender]);

  return null;
}
