import { createRenderer } from '@mui/internal-test-utils';
import { ChartsDataProvider } from '@mui/x-charts/ChartsDataProvider';
import { type UseChartPolarAxisSignature } from './useChartPolarAxis.types';
import { useChartPolarAxis } from './useChartPolarAxis';

describe('useChartPolarAxis', () => {
  const { render } = createRenderer();

  it('should throw an error when axis have duplicate ids', () => {
    const expectedError = [
      'MUI X Charts: The following axis ids are duplicated: qwerty.',
      'Please make sure that each axis has a unique id.',
    ].join('\n');

    expect(() =>
      render(
        <ChartsDataProvider<'radar', [UseChartPolarAxisSignature]>
          rotationAxis={[
            { scaleType: 'band', id: 'qwerty', data: ['a', 'b', 'c'] },
            { scaleType: 'band', id: 'qwerty', data: ['a', 'b', 'c'] },
          ]}
          height={100}
          width={100}
          plugins={[useChartPolarAxis]}
        />,
      ),
    ).toErrorDev(expectedError);
  });

  it('should throw an error when axis have duplicate ids across different directions (radius, rotation)', () => {
    const expectedError = [
      'MUI X Charts: The following axis ids are duplicated: qwerty.',
      'Please make sure that each axis has a unique id.',
    ].join('\n');

    expect(() =>
      render(
        <ChartsDataProvider<'radar', [UseChartPolarAxisSignature]>
          rotationAxis={[{ scaleType: 'band', id: 'qwerty', data: ['a', 'b', 'c'] }]}
          radiusAxis={[{ id: 'qwerty' }]}
          height={100}
          width={100}
          plugins={[useChartPolarAxis]}
        />,
      ),
    ).toErrorDev(expectedError);
  });
});
