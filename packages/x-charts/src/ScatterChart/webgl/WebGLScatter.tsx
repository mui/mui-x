'use client';
import * as React from 'react';
import { useDrawingArea } from '../../hooks/useDrawingArea';
import {
  type DefaultizedScatterSeriesType,
  type ScatterItemIdentifier,
} from '../../models/seriesType/scatter';
import { type D3Scale } from '../../models/axis';
import { type ColorGetter } from '../../internals/plugins/models/seriesConfig';
import { useScatterPlotData } from '../useScatterPlotData';
import { useChartContext } from '../../context/ChartProvider';
import { type UseChartTooltipSignature } from '../../internals/plugins/featurePlugins/useChartTooltip';
import { type UseChartInteractionSignature } from '../../internals/plugins/featurePlugins/useChartInteraction';
import { type UseChartHighlightSignature } from '../../internals/plugins/featurePlugins/useChartHighlight';
import { useWebGLContext } from './WebGLContext';

export interface ScatterProps {
  series: DefaultizedScatterSeriesType;
  xScale: D3Scale;
  yScale: D3Scale;
  /**
   * Function to get the color of a scatter item given its data index.
   * The data index argument is optional. If not provided, the color for the entire series is returned.
   * If provided, the color for the specific scatter item is returned.
   */
  colorGetter: ColorGetter<'scatter'>;
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
   */
  // eslint-disable-next-line react/no-unused-prop-types
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    scatterItemIdentifier: ScatterItemIdentifier,
  ) => void;
}

const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec2 a_center;
    attribute float a_radius;
    attribute vec3 a_color;
    
    varying vec3 v_color;
    varying vec2 v_pos;
    
    uniform vec2 u_resolution;
    
    void main() {
      // Convert from pixels to clip space (-1 to 1)
      vec2 position = a_center + a_position * a_radius;
      vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;
      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
      
      v_color = a_color;
      v_pos = a_position;
    }
  `;

const fragmentShaderSource = `
    precision mediump float;
    varying vec3 v_color;
    varying vec2 v_pos;
    
    void main() {
      // Draw circle with anti-aliasing
      float dist = length(v_pos);
      float alpha = 1.0 - smoothstep(0.9, 1.0, dist);
      if (alpha < 0.01) discard;
      gl_FragColor = vec4(v_color, alpha);
    }
  `;

/**
 * Demos:
 *
 * - [Scatter](https://mui.com/x/react-charts/scatter/)
 * - [Scatter demonstration](https://mui.com/x/react-charts/scatter-demo/)
 *
 * API:
 *
 * - [Scatter API](https://mui.com/x/api/charts/scatter/)
 */
function WebGLScatter(props: ScatterProps) {
  const { series, xScale, yScale, colorGetter } = props;
  const drawingArea = useDrawingArea();
  const [renderKey, rerender] = React.useReducer((s) => s + 1, 0);

  const { instance } =
    useChartContext<
      [UseChartInteractionSignature, UseChartHighlightSignature, UseChartTooltipSignature]
    >();

  const scatterPlotData = useScatterPlotData(series, xScale, yScale, instance.isPointInside);
  const gl = useWebGLContext();
  const vertexShaderRef = React.useRef<WebGLShader | null>(null);
  const fragmentShaderRef = React.useRef<WebGLShader | null>(null);
  const programRef = React.useRef<WebGLProgram | null>(null);

  React.useEffect(() => {
    const canvas = gl?.canvas;

    if (!(canvas instanceof HTMLCanvasElement)) {
      return;
    }

    // FIXME: This is broken in Safari, need to find a cross-browser way to handle this

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width =
          entry.devicePixelContentBoxSize?.[0].inlineSize ||
          entry.contentBoxSize[0].inlineSize * devicePixelRatio;
        const height =
          entry.devicePixelContentBoxSize?.[0].blockSize ||
          entry.contentBoxSize[0].blockSize * devicePixelRatio;

        canvas.width = width;
        canvas.height = height;

        // Update WebGL viewport
        gl?.viewport(0, 0, width, height);

        rerender();
      }
    });

    try {
      // Throws in Safari
      observer.observe(canvas, { box: 'device-pixel-content-box' });
    } catch {
      observer.observe(canvas, { box: 'content-box' });
    }
  }, [gl, gl?.canvas]);

  React.useEffect(() => {
    if (!gl) {
      return;
    }

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    vertexShaderRef.current = vertexShader;

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    fragmentShaderRef.current = fragmentShader;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // eslint-disable-next-line react-compiler/react-compiler
    gl.useProgram(program);

    const quadVertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Setup resolution uniform
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    gl.uniform2f(uResolution, drawingArea.width, drawingArea.height);

    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    programRef.current = program;
  }, [drawingArea.height, drawingArea.width, gl]);

  React.useEffect(() => {
    const program = programRef.current;

    if (!gl || !program) {
      return;
    }

    const centers = new Float32Array(scatterPlotData.length * 2);
    const radii = new Float32Array(scatterPlotData.length);
    const colors = new Float32Array(scatterPlotData.length * 3);

    for (let i = 0; i < scatterPlotData.length; i += 1) {
      const dataPoint = scatterPlotData[i];
      centers[i * 2] = dataPoint.x - drawingArea.left;
      centers[i * 2 + 1] = dataPoint.y - drawingArea.top;
      radii[i] = series.markerSize;
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0;
      colors[i * 3 + 2] = 1;
    }

    // Upload circle centers
    const centerBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, centers, gl.STATIC_DRAW);

    const aCenter = gl.getAttribLocation(program, 'a_center');
    gl.enableVertexAttribArray(aCenter);
    gl.vertexAttribPointer(aCenter, 2, gl.FLOAT, false, 0, 0);

    // This makes the attribute instanced (one value per circle, not per vertex)
    gl.vertexAttribDivisor(aCenter, 1);

    // Upload radii
    const radiusBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, radiusBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, radii, gl.STATIC_DRAW);

    const aRadius = gl.getAttribLocation(program, 'a_radius');
    gl.enableVertexAttribArray(aRadius);
    gl.vertexAttribPointer(aRadius, 1, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(aRadius, 1);

    // Upload colors
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    const aColor = gl.getAttribLocation(program, 'a_color');
    gl.enableVertexAttribArray(aColor);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(aColor, 1);

    // Clear and draw
    gl.clearColor(1, 1, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw all circles with one instanced draw call
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, scatterPlotData.length);
  }, [renderKey, gl, scatterPlotData, drawingArea.left, drawingArea.top, series.markerSize]);

  return null;
}

export { WebGLScatter };
