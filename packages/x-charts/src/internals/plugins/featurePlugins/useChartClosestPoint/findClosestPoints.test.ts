import { describe } from 'vitest';
import { scaleLinear, scaleLog } from '@mui/x-charts-vendor/d3-scale';
import { Flatbush } from '../../../Flatbush';
import { findClosestPoints } from './findClosestPoints';
import { type D3Scale } from '../../../../models/axis';
import { zoomScaleRange } from '../useChartCartesianAxis/zoom';
import { type ScatterValueType } from '../../../../models/seriesType/scatter';

function prepareFlatbush(seriesData: ScatterValueType[], xScale: D3Scale, yScale: D3Scale) {
  const flatbush = new Flatbush(seriesData.length);
  const normalizedXScale = xScale.copy();
  const normalizedYScale = yScale.copy();
  normalizedXScale.range([0, 1]);
  normalizedYScale.range([0, 1]);

  seriesData.forEach((point) => flatbush.add(normalizedXScale(point.x), normalizedYScale(point.y)));
  flatbush.finish();

  return flatbush;
}

const noZoom = { start: 0, end: 1 };
const drawingArea = { left: 0, top: 0, width: 1000, height: 1000 };
const infiniteMaxRadius = Infinity;
const returnAllResults = Infinity;

describe('findClosestPoints', () => {
  it('finds the closest points without zoom and using two linear scales', () => {
    const seriesData = [
      { x: 30, y: 30 },
      { x: 60, y: 60 },
    ];
    const xScale = scaleLinear()
      .domain([0, 100])
      .range([drawingArea.left, drawingArea.left + drawingArea.width]);
    const yScale = scaleLinear()
      .domain([0, 100])
      .range([drawingArea.top, drawingArea.top + drawingArea.height]);
    const flatbush = prepareFlatbush(seriesData, xScale, yScale);
    const svgPoint = { x: 500, y: 500 };

    const closestPoint = findClosestPoints(
      flatbush,
      seriesData,
      xScale,
      yScale,
      noZoom.start, // x
      noZoom.end, // x
      noZoom.start, // y
      noZoom.end, // y
      svgPoint.x,
      svgPoint.y,
      infiniteMaxRadius,
      returnAllResults,
    );

    expect(closestPoint).to.deep.eq([1, 0]);
  });

  describe('linear and log scales', () => {
    const svgPoint = { x: 500, y: 500 };

    it('finds the closest point without zoom', () => {
      const seriesData = [
        { x: 40, y: 10 },
        { x: 40, y: 999 },
      ];
      const xScale = scaleLinear()
        .domain([0, 100])
        .range([drawingArea.left, drawingArea.left + drawingArea.width]);
      const yScale = scaleLog()
        .domain([1, 10_000])
        .range([drawingArea.top, drawingArea.top + drawingArea.height]);
      const flatbush = prepareFlatbush(seriesData, xScale, yScale);

      const closestPoint = findClosestPoints(
        flatbush,
        seriesData,
        xScale,
        yScale,
        noZoom.start, // x
        noZoom.end, // x
        noZoom.start, // y
        noZoom.end, // y
        svgPoint.x,
        svgPoint.y,
      );

      expect(closestPoint).to.deep.eq([1]);
    });

    describe('with zoom', () => {
      const xZoom = { start: 0.4, end: 0.6 }; // The x scale's "visible domain" should be [40, 60]
      const yZoom = { start: 0.25, end: 0.75 }; // The y scale's "visible domain" should be [10, 1000].
      const xScale = scaleLinear()
        .domain([0, 100])
        .range(
          zoomScaleRange(
            [drawingArea.left, drawingArea.left + drawingArea.width],
            [xZoom.start * 100, xZoom.end * 100],
          ),
        );
      const yScale = scaleLog()
        .domain([1, 10_000])
        .range(
          zoomScaleRange(
            [drawingArea.top, drawingArea.top + drawingArea.height],
            [yZoom.start * 100, yZoom.end * 100],
          ),
        );

      it('finds the closest points', () => {
        const seriesData = [
          { x: 40, y: 11 },
          { x: 60, y: 1000 },
        ];
        const flatbush = prepareFlatbush(seriesData, xScale, yScale);

        expect(
          findClosestPoints(
            flatbush,
            seriesData,
            xScale,
            yScale,
            xZoom.start,
            xZoom.end,
            yZoom.start,
            yZoom.end,
            svgPoint.x,
            svgPoint.y,
          ),
        ).to.deep.eq([0]);
      });

      it('finds the closest points with max radius', () => {
        const seriesData = [
          { x: 48, y: 100 },
          { x: 48.01, y: 100 },
          { x: 52, y: 100 },
          { x: 51.99, y: 100 },
          { x: 50, y: 64 },
          { x: 50, y: 158 },
        ];
        const maxRadius = 100;
        const flatbush = prepareFlatbush(seriesData, xScale, yScale);

        expect(
          findClosestPoints(
            flatbush,
            seriesData,
            xScale,
            yScale,
            xZoom.start,
            xZoom.end,
            yZoom.start,
            yZoom.end,
            // The point (500, 500) in SVG coordinates corresponds to (50, 100) in the data coordinates.
            svgPoint.x,
            svgPoint.y,
            maxRadius,
            returnAllResults,
          ),
        ).to.deep.eq([4, 5, 1, 3]);
      });

      it("finds no point when it's outside max radius", () => {
        const seriesData = [
          { x: -5, y: 1000 }, // This point is outside the x scale's domain, so it should not be considered.
          { x: 100, y: 100_000 }, // This point is outside the y scale's domain, so it should not be considered.
          // These other points are within the domain, but they are outside the max radius.
          { x: 47, y: 100 },
          { x: 53, y: 100 },
          { x: 50, y: 63 },
          { x: 50, y: 159 },
        ];
        const maxRadius = 100;
        const flatbush = prepareFlatbush(seriesData, xScale, yScale);

        // The point (500, 500) in SVG coordinates corresponds to (50, 100) in the data coordinates.
        // This means that a point at (48, 100)

        expect(
          findClosestPoints(
            flatbush,
            seriesData,
            xScale,
            yScale,
            xZoom.start,
            xZoom.end,
            yZoom.start,
            yZoom.end,
            // The point (500, 500) in SVG coordinates corresponds to (50, 100) in the data coordinates.
            svgPoint.x,
            svgPoint.y,
            maxRadius,
            returnAllResults,
          ),
        ).to.deep.eq([]);
      });
    });
  });

  describe('reversed axes', () => {
    it('finds the closest point', () => {
      const svgPoint = { x: 400, y: 500 };
      const seriesData = [
        { x: 40, y: 10 },
        { x: 60, y: 999 },
      ];
      const xScale = scaleLinear()
        .domain([0, 100])
        .range([drawingArea.left, drawingArea.left + drawingArea.width].reverse());
      const yScale = scaleLog()
        .domain([1, 10_000])
        .range([drawingArea.top, drawingArea.top + drawingArea.height].reverse());
      const flatbush = prepareFlatbush(seriesData, xScale, yScale);

      const closestPoint = findClosestPoints(
        flatbush,
        seriesData,
        xScale,
        yScale,
        noZoom.start, // x
        noZoom.end, // x
        noZoom.start, // y
        noZoom.end, // y
        svgPoint.x,
        svgPoint.y,
      );

      expect(closestPoint).to.deep.eq([1]);
    });
  });
});
