import * as React from 'react';
import { act, createRenderer } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';
import { Unstable_ChartsRadialDataProvider as ChartsRadialDataProvider } from '@mui/x-charts/ChartsRadialDataProvider';
import { useChartsContext } from '../../../../context/ChartsProvider/useChartsContext';
import type { UseChartInteractionInstance } from '../useChartInteraction/useChartInteraction.types';
import {
  selectorChartsInteractionRadiusAxisIndexes,
  selectorChartsInteractionRotationAxisIndexes,
} from './useChartPolarInteraction.selectors';

type ChartsContextValue = ReturnType<typeof useChartsContext>;

function ContextListener({ onContext }: { onContext: (context: ChartsContextValue) => void }) {
  const context = useChartsContext();
  React.useEffect(() => onContext(context));
  return null;
}

describe('useChartPolarInteraction selectors', () => {
  const { render } = createRenderer();

  function getStateWithPointerOnLeft() {
    let context: ChartsContextValue | null = null;
    render(
      <ChartsRadialDataProvider
        width={200}
        height={200}
        margin={0}
        // The axes split the circle in a different number of bands, so a single angle falls in a
        // different band of each.
        rotationAxis={[
          { id: 'halves', scaleType: 'band', data: ['H1', 'H2'] },
          { id: 'quarters', scaleType: 'band', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
        ]}
        radiusAxis={[{ id: 'radius-1' }, { id: 'radius-2' }]}
      >
        <ContextListener
          onContext={(value) => {
            context = value;
          }}
        />
      </ChartsRadialDataProvider>,
    );

    // Left of the center, between 180 and 270 degrees clockwise from the top: the second half and
    // the third quarter.
    act(() => {
      (context!.instance as unknown as UseChartInteractionInstance).setPointerCoordinate({
        x: 20,
        y: 110,
      });
    });

    return context!.store.getSnapshot();
  }

  it('should compute the rotation index of the requested axes only', () => {
    const state = getStateWithPointerOnLeft();

    expect(selectorChartsInteractionRotationAxisIndexes(state, undefined)).to.deep.equal([1, 2]);
    expect(selectorChartsInteractionRotationAxisIndexes(state, ['quarters'])).to.deep.equal([2]);
  });

  it('should compute the radius index of the requested axes only', () => {
    const state = getStateWithPointerOnLeft();

    expect(selectorChartsInteractionRadiusAxisIndexes(state, undefined)).to.have.length(2);
    expect(selectorChartsInteractionRadiusAxisIndexes(state, ['radius-2'])).to.have.length(1);
  });

  it('should keep the same indexes while the state and the requested axes do not change', () => {
    const state = getStateWithPointerOnLeft();
    const ids = ['quarters'];

    expect(selectorChartsInteractionRotationAxisIndexes(state, ids)).to.equal(
      selectorChartsInteractionRotationAxisIndexes(state, ids),
    );
  });
});
