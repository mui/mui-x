import { createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import { vi, describe, it, expect } from 'vitest';
import * as React from 'react';
import { isJSDOM } from 'test/utils/skipIf';
import { ChartsDataProvider } from '../ChartsDataProvider';
import { MarkElement } from './MarkElement';
import { CircleMarkElement } from './CircleMarkElement';
import { lineClasses } from './lineClasses';

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
    expect(mark.classList.contains(lineClasses.mark)).to.equal(true);
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

describe('MarkElement positioning', () => {
  const { render } = createRenderer();

  it('positions the mark with the SVG `transform` attribute instead of a CSS transform', () => {
    render(
      <TestWrapper>
        <MarkElement
          seriesId="s1"
          dataIndex={0}
          x={10}
          y={20}
          color="red"
          shape="diamond"
          data-testid="mark"
        />
      </TestWrapper>,
    );

    const mark = screen.getByTestId('mark');
    // The `transform` attribute keeps the mark aligned in Safari under browser zoom.
    // A CSS `px` transform puts it in the wrong place, see https://github.com/mui/mui-x/issues/23377
    expect(mark.getAttribute('transform')).to.equal('translate(10 20)');
    expect(mark.style.transform).to.equal('');
  });

  function PositionedMark(props: { x: number; y: number; skipAnimation?: boolean }) {
    return (
      <TestWrapper>
        <MarkElement
          seriesId="s1"
          dataIndex={0}
          color="red"
          shape="diamond"
          data-testid="mark"
          {...props}
        />
      </TestWrapper>
    );
  }

  it('animates the `transform` attribute in JavaScript so the animation also runs in Safari', async () => {
    const { setProps } = render(<PositionedMark x={10} y={20} />);

    const mark = screen.getByTestId('mark');
    expect(mark.getAttribute('transform')).to.equal('translate(10 20)');

    setProps({ x: 60, y: 70 });

    // The position is not applied synchronously, it is interpolated over the animation frames.
    expect(mark.getAttribute('transform')).to.equal('translate(10 20)');
    await waitFor(() => {
      expect(mark.getAttribute('transform')).to.equal('translate(60 70)');
    });
  });

  it('does not animate when `skipAnimation` is true', () => {
    const { setProps } = render(<PositionedMark x={10} y={20} skipAnimation />);

    const mark = screen.getByTestId('mark');

    setProps({ x: 60, y: 70 });

    expect(mark.getAttribute('transform')).to.equal('translate(60 70)');
  });
});
