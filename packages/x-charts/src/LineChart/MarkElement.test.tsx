import { createRenderer, screen } from '@mui/internal-test-utils';
import { vi } from 'vitest';
import * as React from 'react';
import { isJSDOM } from 'test/utils/skipIf';
import { ChartDataProvider } from '../ChartDataProvider';
import { MarkElement } from './MarkElement';
import { CircleMarkElement } from './CircleMarkElement';

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ChartDataProvider
      series={[{ type: 'line', data: [1, 2, 3], id: 's1' }]}
      width={100}
      height={100}
      xAxis={[{ scaleType: 'point', data: ['A', 'B', 'C'] }]}
    >
      <svg>{children}</svg>
    </ChartDataProvider>
  );
}

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
          id="s1"
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
    await expect(user.click(mark)).rejects.toThrow();
    expect(onClick).not.toHaveBeenCalled();
  });

  it.skipIf(isJSDOM)('should be clickable when visible', async () => {
    const onClick = vi.fn();
    const { user } = render(
      <TestWrapper>
        <CircleMarkElement
          id="s1"
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
