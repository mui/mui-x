'use client';
import * as React from 'react';
import { useDrawingArea, useXAxes, useYAxes } from '@mui/x-charts/hooks';
import useEventCallback from '@mui/utils/useEventCallback';
import { useBarPlotData, type ProcessedBarSeriesData } from '@mui/x-charts/internals';
import { useWebGLLayer } from '../../ChartsWebGLLayer/ChartsWebGLContext';
import {
  attachShader,
  bindQuadBuffer,
  compileShader,
  logWebGLErrors,
  uploadQuadBuffer,
} from '../../utils/webgl/utils';
import { barFragmentShaderSource, barVertexShaderSource } from './shaders';
import { useBarWebGLPlotData } from './useBarWebGLPlotData';

export interface BarWebGLPlotProps {
  borderRadius?: number;
}

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

  const [vertexShader] = React.useState<WebGLShader>(() =>
    compileShader(gl, barVertexShaderSource, gl.VERTEX_SHADER),
  );
  const [program] = React.useState<WebGLProgram>(() => {
    const p = gl.createProgram();
    gl.attachShader(p, vertexShader);
    attachShader(gl, p, barFragmentShaderSource, gl.FRAGMENT_SHADER);
    gl.linkProgram(p);

    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#dont_check_shader_compile_status_unless_linking_fails
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.error(`Program linking failed: ${gl.getProgramInfoLog(p)}`);
    }

    return p;
  });
  const [quadBuffer] = React.useState(() => uploadQuadBuffer(gl));

  const plotData = useBarWebGLPlotData(drawingArea, completedData, borderRadius);
  const instanceCount = plotData.count;

  const drawRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    drawRef.current = () => {
      // Not a hook
      // eslint-disable-next-line react-compiler/react-compiler
      gl.useProgram(program);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, instanceCount);
    };
  }, [gl, program, instanceCount]);

  React.useEffect(() => {
    const unregister = registerDraw(drawRef);
    return unregister;
  }, [registerDraw]);

  React.useEffect(() => {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }, [gl]);

  const setupResolutionUniform = React.useCallback(() => {
    // Not a hook
    // eslint-disable-next-line react-compiler/react-compiler
    gl.useProgram(program);
    gl.uniform2f(
      gl.getUniformLocation(program, 'u_resolution'),
      drawingArea.width,
      drawingArea.height,
    );
  }, [drawingArea.height, drawingArea.width, gl, program]);

  const setupAttributes = React.useCallback(() => {
    // Not a hook
    // eslint-disable-next-line react-compiler/react-compiler
    gl.useProgram(program);
    bindQuadBuffer(gl, program, quadBuffer);

    const { centers, halfSizes, colors, saturations, cornerRadii } = plotData;

    const centerBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, centers, gl.STATIC_DRAW);
    const aCenter = gl.getAttribLocation(program, 'a_center');
    gl.enableVertexAttribArray(aCenter);
    gl.vertexAttribPointer(aCenter, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(aCenter, 1);

    const halfSizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, halfSizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, halfSizes, gl.STATIC_DRAW);
    const aHalfSize = gl.getAttribLocation(program, 'a_halfSize');
    gl.enableVertexAttribArray(aHalfSize);
    gl.vertexAttribPointer(aHalfSize, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(aHalfSize, 1);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    const aColor = gl.getAttribLocation(program, 'a_color');
    gl.enableVertexAttribArray(aColor);
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(aColor, 1);

    const saturationBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, saturationBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, saturations, gl.STATIC_DRAW);
    const aSaturation = gl.getAttribLocation(program, 'a_saturation');
    gl.enableVertexAttribArray(aSaturation);
    gl.vertexAttribPointer(aSaturation, 1, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(aSaturation, 1);

    const cornerRadiiBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerRadiiBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cornerRadii, gl.STATIC_DRAW);
    const aCornerRadii = gl.getAttribLocation(program, 'a_cornerRadii');
    gl.enableVertexAttribArray(aCornerRadii);
    gl.vertexAttribPointer(aCornerRadii, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(aCornerRadii, 1);

    logWebGLErrors(gl);
  }, [gl, plotData, program, quadBuffer]);

  const setupAttributesEvent = useEventCallback(() => setupAttributes());

  React.useEffect(() => {
    setupResolutionUniform();
    setupAttributesEvent();
    requestRender();
  }, [setupResolutionUniform, setupAttributesEvent, requestRender]);

  React.useEffect(() => {
    setupAttributes();
    requestRender();
  }, [requestRender, setupAttributes]);

  return null;
}
