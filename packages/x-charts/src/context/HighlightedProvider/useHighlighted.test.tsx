import * as React from 'react';
import { expect } from 'chai';
import { ErrorBoundary, createRenderer } from '@mui/internal-test-utils';
import { useHighlighted } from './useHighlighted';
import { HighlightedProvider } from './HighlightedProvider';
import { SeriesContextProvider } from '../SeriesContextProvider';

function UseHighlighted() {
  const { highlightedItem } = useHighlighted();
  return <div>{highlightedItem?.seriesId}</div>;
}

describe('useHighlighted', () => {
  const { render } = createRenderer();

  it('should throw an error when parent context not present', () => {
    expect(() =>
      render(
        <ErrorBoundary>
          <UseHighlighted />
        </ErrorBoundary>,
      ),
    ).toErrorDev([
      'MUI X: Could not find the highlighted ref context.',
      'It looks like you rendered your component outside of a ChartsContainer parent component.',
      'The above error occurred in the <UseHighlighted> component:',
    ]);
  });

  it('should not throw an error when parent context is present', () => {
    const { getByText } = render(
      <SeriesContextProvider series={[]}>
        <HighlightedProvider highlightedItem={{ seriesId: 'test-id' }}>
          <UseHighlighted />
        </HighlightedProvider>
      </SeriesContextProvider>,
    );

    expect(getByText('test-id')).toBeVisible();
  });
});
