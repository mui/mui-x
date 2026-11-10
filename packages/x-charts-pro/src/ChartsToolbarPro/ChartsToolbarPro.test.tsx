import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';
import { BarChartPro } from '../BarChartPro';

describe('<ChartsToolbarPro />', () => {
  const { render } = createRenderer();

  const baselineProps = {
    series: [{ data: [10, 20, 30, 40] }],
    xAxis: [{ scaleType: 'band', data: ['A', 'B', 'C', 'D'] }],
    width: 200,
    height: 130,
    showToolbar: true,
  } as const;

  describe('export menu', () => {
    it('should not use role="tooltip" on the export menu popper', async () => {
      const { user } = render(<BarChartPro {...baselineProps} />);

      await user.click(screen.getByRole('button', { name: 'Export' }));

      expect(screen.getByRole('menu')).not.to.equal(null);
      expect(screen.queryByRole('tooltip')).to.equal(null);
    });
  });
});
