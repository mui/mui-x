import { createRenderer, reactMajor, screen } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';
import { useChartGradientId, useChartGradientIdObjectBound } from './useChartGradientId';
import { ChartsDataProvider } from '../ChartsDataProvider';

function UseGradientId() {
  const id = useChartGradientId('test-id');
  return <div>{id}</div>;
}

function UseGradientIdObjectBound() {
  const id = useChartGradientIdObjectBound('test-id');
  return <div>{id}</div>;
}

// React 17 has no `useId`, so the fallback generates `mui-<number>` ids.
const ID_PREFIX = reactMajor >= 18 ? '[«|:|_]\\w+[»|:|_]' : 'mui-\\d+';

describe('useChartGradientId', () => {
  const { render } = createRenderer();

  it('should properly generate a correct id', () => {
    render(
      <ChartsDataProvider series={[]} height={100} width={100}>
        <UseGradientId />
      </ChartsDataProvider>,
    );

    expect(screen.getByText(new RegExp(`${ID_PREFIX}-gradient-test-id`))).toBeVisible();
  });

  describe('useChartGradientIdObjectBound', () => {
    it('should properly generate a correct id', () => {
      render(
        <ChartsDataProvider series={[]} height={100} width={100}>
          <UseGradientIdObjectBound />
        </ChartsDataProvider>,
      );

      expect(
        screen.getByText(new RegExp(`${ID_PREFIX}-gradient-test-id-object-bound`)),
      ).toBeVisible();
    });
  });
});
