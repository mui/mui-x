import { createRenderer, screen } from '@mui/internal-test-utils';
import { vi } from 'vitest';
import * as React from 'react';
import { isJSDOM } from 'test/utils/skipIf';
import { ChartsDataProvider } from '../ChartsDataProvider';
import { MarkElement } from './MarkElement';
import { CircleMarkElement } from './CircleMarkElement';

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ChartsDataProvider
      series={[{ type: 'line', data: [1, 2, 3], id: 's1' }]}
      width={100}
      height={100}
      xAxis={[{ scaleType: 'point', data: ['A', 'B', 'C'] }]}
    >
      <svg>{children}</svg>
    </ChartsDataProvider>
  );
}

describe.for([
  ['MarkElement', MarkElement],
  ['CircleMarkElement', CircleMarkElement],
])('%s data attributes', ([_, MarkElementComponent]) => {
  const { render } = createRenderer();

  it('should have data-series attribute', () => {
    render(
      <TestWrapper>
        <MarkElementComponent
          seriesId="s1"
          dataIndex={0}
          x={10}
          y={10}
          color="red"
          shape="circle"
          data-testid="mark"
        />
      </TestWrapper>,
    );

    const mark = screen.getByTestId('mark');
    expect(mark.getAttribute('data-series')).to.equal('s1');
  });

  it('should have data-index attribute', () => {
    render(
      <TestWrapper>
        <MarkElementComponent
          seriesId="s1"
          dataIndex={2}
          x={10}
          y={10}
          color="red"
          shape="circle"
          data-testid="mark"
        />
      </TestWrapper>,
    );

    const mark = screen.getByTestId('mark');
    expect(mark.getAttribute('data-index')).to.equal('2');
  });

  it('should have both new and deprecated classes', () => {
    render(
      <TestWrapper>
        <MarkElementComponent
          seriesId="s1"
          dataIndex={0}
          x={10}
          y={10}
          color="red"
          shape="circle"
          data-testid="mark"
        />
      </TestWrapper>,
    );

    const mark = screen.getByTestId('mark');
    expect(mark.classList.contains('MuiLineChart-mark')).to.equal(true);
    expect(mark.classList.contains('MuiMarkElement-root')).to.equal(true);
  });

  it('should apply custom classes passed via the classes prop', () => {
    render(
      <TestWrapper>
        <MarkElementComponent
          seriesId="s1"
          dataIndex={0}
          x={10}
          y={10}
          color="red"
          shape="circle"
          classes={{ mark: 'my-custom-mark' }}
          data-testid="mark"
        />
      </TestWrapper>,
    );

    const mark = screen.getByTestId('mark');
    expect(mark.classList.contains('my-custom-mark')).to.equal(true);
    expect(mark.classList.contains('MuiLineChart-mark')).to.equal(true);
  });
});

describe.for([
  ['MarkElement', MarkElement],
  ['CircleMarkElement', CircleMarkElement],
])('%s click behavior', ([_, MarkElementComponent]) => {
  const { render } = createRenderer();

  it.skipIf(isJSDOM)('should not be clickable when hidden', async () => {
    const onClick = vi.fn();
    const { user } = render(
      <TestWrapper>
        <MarkElementComponent
          seriesId="s1"
          dataIndex={0}
          x={10}
          y={10}
          color="red"
          shape="circle"
          hidden
          onClick={onClick}
          data-testid="mark"
        />
      </TestWrapper>,
    );

    const mark = screen.getByTestId('mark');
    expect(mark.getAttribute('pointer-events')).to.equal('none');
    expect(mark.getAttribute('opacity')).to.equal('0');

    // It throws because `click` event cannot be fired on an element with `pointer-events: none`
    await expect(async () => user.click(mark)).rejects.toThrow();
    expect(onClick).not.toHaveBeenCalled();
  });

  it.skipIf(isJSDOM)('should be clickable when visible', async () => {
    const onClick = vi.fn();
    const { user } = render(
      <TestWrapper>
        <CircleMarkElement
          seriesId="s1"
          dataIndex={0}
          x={10}
          y={10}
          color="red"
          onClick={onClick}
          data-testid="mark"
        />
      </TestWrapper>,
    );

    const mark = screen.getByTestId('mark');
    expect(mark.getAttribute('pointer-events')).to.not.equal('none');
    expect(mark.getAttribute('opacity')).to.equal('1');

    await user.click(mark);
    expect(onClick).toHaveBeenCalled();
  });
});
