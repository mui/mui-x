import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { consumeThemeProps } from './consumeThemeProps';

type WrapperProps = {
  data?: string;
  shouldOmit?: boolean;
  classes?: Record<'root', string>;
  slots?: {
    wrapper?: React.ElementType<Omit<WrapperProps, 'slots'>>;
  };
};

const SlotsWrapper = consumeThemeProps(
  'MuiSlotsWrapper',
  {
    defaultProps: { data: 'test' },
    classesResolver: (props: WrapperProps) => ({
      root: ['wrapper-root', props.data, props.shouldOmit ? 'shouldOmit' : ''].join(' '),
    }),
  },
  function SlotsWrapper(props: WrapperProps, ref: React.Ref<HTMLDivElement>) {
    return (
      <div ref={ref}>
        <div className="data">{props.data}</div>
        <div className="classes">{props.classes?.root}</div>
      </div>
    );
  },
);

describe('consumeThemeProps', () => {
  const { render } = createRenderer();

  it('should render default props', async function test() {
    render(<SlotsWrapper />);

    await screen.findByText('test', { selector: '.data' });
  });

  it('should render passed props', async function test() {
    render(<SlotsWrapper data="new" />);

    await screen.findByText('new', { selector: '.data' });
  });

  it('should resolve classes', async () => {
    render(<SlotsWrapper shouldOmit />);

    await screen.findByText('wrapper-root test shouldOmit', { selector: '.classes' });
  });
});
