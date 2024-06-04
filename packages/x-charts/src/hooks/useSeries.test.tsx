import * as React from 'react';
import { expect } from 'chai';
import { ErrorBoundary, createRenderer } from '@mui/internal-test-utils';
import { useSeries } from './useSeries';
import { SeriesContextProvider } from '../context/SeriesContextProvider';

function UseSeries() {
  const { bar } = useSeries();
  return <div>{bar?.series['test-id']?.id}</div>;
}

describe('useSeries', () => {
  const { render } = createRenderer();

  it('should throw an error when parent context not present', () => {
    expect(() =>
      render(
        <ErrorBoundary>
          <UseSeries />
        </ErrorBoundary>,
      ),
    ).toErrorDev([
      'MUI X: Could not find the series ref context.',
      'It looks like you rendered your component outside of a ChartsContainer parent component.',
      'The above error occurred in the <UseSeries> component:',
    ]);
  });

  it('should not throw an error when parent context is present', () => {
    const { getByText } = render(
      <SeriesContextProvider series={[{ type: 'bar', id: 'test-id', data: [1, 2] }]}>
        <UseSeries />
      </SeriesContextProvider>,
    );

    expect(getByText('test-id')).toBeVisible();
  });
});
