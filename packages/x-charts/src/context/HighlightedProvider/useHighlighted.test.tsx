import * as React from 'react';
import { expect } from 'chai';
import { ErrorBoundary, createRenderer, screen, reactMajor } from '@mui/internal-test-utils';
import { testSkipIf, isJSDOM } from 'test/utils/skipIf';
import { useHighlighted } from './useHighlighted';
import { HighlightedProvider } from './HighlightedProvider';
import { SeriesProvider } from '../SeriesProvider';
import { PluginProvider } from '../PluginProvider';

function UseHighlighted() {
  const { highlightedItem } = useHighlighted();
  return <div>{highlightedItem?.seriesId}</div>;
}

describe('useHighlighted', () => {
  const { render } = createRenderer();

  // can't catch render errors in the browser for unknown reason
  // tried try-catch + error boundary + window onError preventDefault
  testSkipIf(!isJSDOM)('should throw an error when parent context not present', () => {
    const errorRef = React.createRef<any>();

    const errorMessage1 = 'MUI X: Could not find the highlighted ref context.';
    const errorMessage2 =
      'It looks like you rendered your component outside of a ChartsContainer parent component.';
    const errorMessage3 = 'The above error occurred in the <UseHighlighted> component:';
    const expextedError =
      reactMajor < 19
        ? [errorMessage1, errorMessage2, errorMessage3]
        : `${errorMessage1}\n${errorMessage2}`;

    expect(() =>
      render(
        <ErrorBoundary ref={errorRef}>
          <UseHighlighted />
        </ErrorBoundary>,
      ),
    ).toErrorDev(expextedError);

    expect((errorRef.current as any).errors).to.have.length(1);
    expect((errorRef.current as any).errors[0].toString()).to.include(
      'MUI X: Could not find the highlighted ref context.',
    );
  });

  it('should not throw an error when parent context is present', () => {
    render(
      <PluginProvider>
        <SeriesProvider series={[]}>
          <HighlightedProvider highlightedItem={{ seriesId: 'test-id' }}>
            <UseHighlighted />
          </HighlightedProvider>
        </SeriesProvider>
      </PluginProvider>,
    );

    expect(screen.getByText('test-id')).toBeVisible();
  });
});
