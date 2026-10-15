import { createRenderer, screen } from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDirection } from '@base-ui/react/direction-provider';
import { describe, it, expect } from 'vitest';
import { SchedulerDirectionProvider } from './SchedulerDirectionProvider';

function DirectionReader() {
  return <span data-testid="direction">{useDirection()}</span>;
}

describe('<SchedulerDirectionProvider />', () => {
  const { render } = createRenderer();

  it('should pass the ltr direction by default', () => {
    render(
      <SchedulerDirectionProvider>
        <DirectionReader />
      </SchedulerDirectionProvider>,
    );

    expect(screen.getByTestId('direction')).to.have.text('ltr');
  });

  it('should pass the rtl direction of the theme', () => {
    render(
      <ThemeProvider theme={createTheme({ direction: 'rtl' })}>
        <SchedulerDirectionProvider>
          <DirectionReader />
        </SchedulerDirectionProvider>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('direction')).to.have.text('rtl');
  });
});
