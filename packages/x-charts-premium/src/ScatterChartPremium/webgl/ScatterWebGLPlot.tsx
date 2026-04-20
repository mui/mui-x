'use client';
import * as React from 'react';
import { useDrawingArea, useScatterSeriesContext } from '@mui/x-charts/hooks';
import { useWebGLResizeObserver } from '../../utils/webgl/useWebGLResizeObserver';
import { useWebGLContext } from '../../ChartsWebGLLayer/ChartsWebGLLayer';
import { ScatterWebGLProgram } from './ScatterWebGLProgram';
import { useScatterWebGLPlotData } from './useScatterWebGLPlotData';

export function ScatterWebGLPlot() {
  const gl = useWebGLContext();
  const seriesData = useScatterSeriesContext();

  const hasVisibleSeries = React.useMemo(() => {
    if (!seriesData) {
      return false;
    }
    return seriesData.seriesOrder.some((id) => !seriesData.series[id].hidden);
  }, [seriesData]);

  React.useEffect(() => {
    if (gl && !hasVisibleSeries) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
  }, [gl, hasVisibleSeries]);

  if (!gl || !hasVisibleSeries) {
    return null;
  }

  return <ScatterWebGLPlotImpl gl={gl} />;
}

function ScatterWebGLPlotImpl({ gl }: { gl: WebGL2RenderingContext }) {
  const drawingArea = useDrawingArea();
  const [program, setProgram] = React.useState<ScatterWebGLProgram | null>(null);
  const renderScheduledRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    const prog = new ScatterWebGLProgram(gl);
    setProgram(prog);

    return () => {
      prog.dispose();
    };
  }, [gl]);

  const plotData = useScatterWebGLPlotData();

  const render = React.useCallback(() => {
    renderScheduledRef.current = false;
    program?.render(plotData);
  }, [program, plotData]);

  const scheduleRender = React.useCallback(() => {
    renderScheduledRef.current = true;
  }, []);

  // On resize render directly to avoid a frame where the canvas is blank.
  useWebGLResizeObserver(render);

  React.useEffect(() => {
    program?.setResolution(drawingArea.width, drawingArea.height);
    scheduleRender();
  }, [drawingArea.height, drawingArea.width, program, scheduleRender]);

  React.useEffect(() => {
    program?.plot(plotData);
    scheduleRender();
  }, [plotData, program, scheduleRender]);

  React.useEffect(() => {
    if (renderScheduledRef.current) {
      render();
    }
  });

  return null;
}
