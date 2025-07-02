import { createRenderer, screen } from '@mui/internal-test-utils';
import * as React from 'react';
import { sleep } from 'test/utils/helperFn';
import UseGridSelectorTest from './useGridSelectorTest';

describe('useGridSelectorTest', () => {
  const { render } = createRenderer();

  it('should work', async () => {
    const { user } = render(<UseGridSelectorTest />);

    await sleep(2000);

    expect(screen.getByTestId('useGridSelectorTest').textContent).toEqual('undefined');

    user.click(screen.getByText('Toggle'));

    await sleep(1000);

    expect(screen.getByTestId('useGridSelectorTest').textContent).toEqual('1');
  });
});
