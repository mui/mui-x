import { describe, expect, it } from 'vitest';
import {
  selectorChartsInteractionRotationAxisIndexes,
  selectorChartsInteractionRadiusAxisIndexes,
  selectorChartsInteractionTooltipRotationAxes,
  selectorChartsInteractionTooltipRadiusAxes,
} from './useChartPolarInteraction.selectors';

const createState = () =>
  ({
    dimensions: { width: 200, height: 200, margin: { top: 0, bottom: 0, left: 0, right: 0 } },
    series: { defaultizedSeries: {} },
    seriesConfig: { config: {} },
    interaction: { pointer: { x: 150, y: 100 } },
    polarAxis: {
      rotation: [
        { id: 'rotation-a', scaleType: 'band', data: ['a0', 'a1'] },
        { id: 'rotation-b', scaleType: 'band', data: ['b0', 'b1', 'b2', 'b3'] },
      ],
      radius: [
        { id: 'radius-a', scaleType: 'band', data: ['a0', 'a1'] },
        { id: 'radius-b', scaleType: 'band', data: ['b0', 'b1', 'b2', 'b3'] },
      ],
    },
  }) as unknown as Parameters<typeof selectorChartsInteractionRotationAxisIndexes>[0];

describe.each([
  {
    direction: 'rotation',
    selectIndexes: selectorChartsInteractionRotationAxisIndexes,
    selectTooltipAxes: selectorChartsInteractionTooltipRotationAxes,
    indexes: [0, 1],
    movedIndexes: [0, 0],
  },
  {
    direction: 'radius',
    selectIndexes: selectorChartsInteractionRadiusAxisIndexes,
    selectTooltipAxes: selectorChartsInteractionTooltipRadiusAxes,
    indexes: [1, 2],
    movedIndexes: [1, 3],
  },
])(
  '$direction axis interaction selectors',
  ({ direction, selectIndexes, selectTooltipAxes, indexes, movedIndexes }) => {
    const axisIds = [`${direction}-a`, `${direction}-b`];

    it('returns indexes for all axes when no IDs are provided', () => {
      expect(selectIndexes(createState(), undefined)).to.deep.equal(indexes);
    });

    it('returns indexes for the requested subset of axes', () => {
      const state = createState();

      expect(selectIndexes(state, [axisIds[0]])).to.deep.equal([indexes[0]]);
      expect(selectIndexes(state, [axisIds[1]])).to.deep.equal([indexes[1]]);
      expect(selectIndexes(state, [axisIds[0]])).to.deep.equal([indexes[0]]);
    });

    it('preserves the requested axis order', () => {
      expect(selectIndexes(createState(), [axisIds[1], axisIds[0]])).to.deep.equal([
        indexes[1],
        indexes[0],
      ]);
    });

    it('returns no indexes for an empty axis list', () => {
      expect(selectIndexes(createState(), [])).to.deep.equal([]);
    });

    it('preserves the result reference when the inputs do not change', () => {
      const state = createState();
      const ids = [axisIds[1]];
      const result = selectIndexes(state, ids);

      expect(selectIndexes(state, ids)).to.equal(result);
      expect(selectIndexes({ ...state }, ids)).to.equal(result);
    });

    it('updates the indexes when the pointer moves', () => {
      const state = createState();
      selectIndexes(state, undefined);

      expect(
        selectIndexes(
          { ...state, interaction: { ...state.interaction!, pointer: { x: 100, y: 25 } } },
          undefined,
        ),
      ).to.deep.equal(movedIndexes);
    });

    it('returns null when the pointer leaves the chart', () => {
      const state = createState();
      selectIndexes(state, undefined);

      expect(
        selectIndexes(
          { ...state, interaction: { ...state.interaction!, pointer: null } },
          undefined,
        ),
      ).to.equal(null);
    });

    it('provides stable inputs to the tooltip selector', () => {
      expect(selectTooltipAxes(createState())).to.deep.equal([]);
    });
  },
);
