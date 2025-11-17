import { createRenderer, screen, act } from '@mui/internal-test-utils';
import { LineChart } from '@mui/x-charts/LineChart';
import { Toolbar, ToolbarButton } from '@mui/x-charts/Toolbar';

declare module '@mui/x-charts' {
  interface ChartsToolbarProps {
    items?: string[];
  }
}

function CustomToolbar({ items = ['Item 1', 'Item 2', 'Item 3'] }: { items?: string[] }) {
  return (
    <Toolbar>
      {items.map((item) => (
        <ToolbarButton key={item}>{item}</ToolbarButton>
      ))}
    </Toolbar>
  );
}

describe('Charts Toolbar', () => {
  const { render } = createRenderer();

  const baselineProps = {
    height: 300,
    xAxis: [{ data: [1, 2] }],
    series: [{ data: [2, 4] }],
  };

  describe('Accessibility', () => {
    it('should move focus to the next item when pressing ArrowRight', async () => {
      const { user } = render(
        <LineChart {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar />,
      );

      await act(async () => screen.getByRole('button', { name: 'Item 1' }).focus());
      expect(screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('button', { name: 'Item 2' })).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
    });

    it('should move focus to the previous item when pressing ArrowLeft', async () => {
      const { user } = render(
        <LineChart {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar />,
      );

      await act(async () => screen.getByRole('button', { name: 'Item 3' }).focus());
      expect(screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('button', { name: 'Item 2' })).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
    });

    it('should focus on the first item when pressing Home key', async () => {
      const { user } = render(
        <LineChart {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar />,
      );

      await act(async () => screen.getByRole('button', { name: 'Item 1' }).focus());
      await user.keyboard('{Home}');
      expect(screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
    });

    it('should focus on the last item when pressing End key', async () => {
      const { user } = render(
        <LineChart {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar />,
      );

      await act(async () => screen.getByRole('button', { name: 'Item 3' }).focus());
      await user.keyboard('{End}');
      expect(screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
    });

    it('should wrap to first item when pressing ArrowRight on last item', async () => {
      const { user } = render(
        <LineChart {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar />,
      );

      await act(async () => screen.getByRole('button', { name: 'Item 3' }).focus());
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
    });

    it('should wrap to last item when pressing ArrowLeft on first item', async () => {
      const { user } = render(
        <LineChart {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar />,
      );

      await act(async () => screen.getByRole('button', { name: 'Item 1' }).focus());
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
    });

    it('should maintain focus position when an item is removed', async () => {
      const { setProps } = render(
        <LineChart {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar />,
      );

      await act(async () => screen.getByRole('button', { name: 'Item 2' }).focus());
      await act(async () =>
        setProps({
          slotProps: {
            toolbar: { items: ['Item 1', 'Item 3'] },
          },
        }),
      );
      expect(screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
    });

    it('should maintain focus on the last item when the last item is removed', async () => {
      const { setProps } = render(
        <LineChart {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar />,
      );

      await act(async () => screen.getByRole('button', { name: 'Item 3' }).focus());
      await act(async () =>
        setProps({
          slotProps: {
            toolbar: { items: ['Item 1', 'Item 2'] },
          },
        }),
      );
      expect(screen.getByRole('button', { name: 'Item 2' })).toHaveFocus();
    });

    it('should preserve arrow key navigation after item removal', async () => {
      const { user, setProps } = render(
        <LineChart {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar />,
      );

      await act(async () => screen.getByRole('button', { name: 'Item 1' }).focus());
      await act(async () =>
        setProps({
          slotProps: {
            toolbar: { items: ['Item 1', 'Item 3'] },
          },
        }),
      );
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
    });
  });
});
