import { createRenderer, screen } from '@mui/internal-test-utils';
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

describe('useChartGradientId', () => {
  const { render } = createRenderer();

  it('should properly generate a correct id', () => {
    render(
      <ChartsDataProvider series={[]} height={100} width={100}>
        <UseGradientId />
      </ChartsDataProvider>,
    );

    expect(screen.getByText(/[«|:|_]\w+[»|:|_]-gradient-test-id/)).toBeVisible();
  });

  describe('useChartGradientIdObjectBound', () => {
    it('should properly generate a correct id', () => {
      render(
        <ChartsDataProvider series={[]} height={100} width={100}>
          <UseGradientIdObjectBound />
        </ChartsDataProvider>,
      );

      expect(screen.getByText(/[«|:|_]\w+[»|:|_]-gradient-test-id-object-bound/)).toBeVisible();
    });
  });
});
