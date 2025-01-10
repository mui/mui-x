import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { consumeSlots } from './consumeSlots';

type WrapperProps = {
  data?: string;
  shouldOmit?: boolean;
  classes?: Record<'root', string>;
  slots?: {
    wrapper?:
      | React.ElementType<Omit<WrapperProps, 'slots'>>
      | React.ForwardRefRenderFunction<HTMLDivElement, Omit<WrapperProps, 'slots'>>;
  };
};

const SlotsWrapper = consumeSlots(
  'MuiSlotsWrapper',
  'wrapper',
  {
    defaultProps: { data: 'test' },
    omitProps: ['shouldOmit'],
    classesResolver: (props: WrapperProps) => ({
      root: ['wrapper-root', props.data, props.shouldOmit ? 'shouldOmit' : ''].join(' '),
    }),
  },
  function SlotsWrapper(props: WrapperProps, ref: React.Ref<HTMLDivElement>) {
    return (
      <div ref={ref}>
        <div className="data">{props.data}</div>
        <div className="shouldOmit">{props.shouldOmit ? 'not-omitted' : 'omitted'}</div>
        <div className="classes">{props.classes?.root}</div>
      </div>
    );
  },
);

describe('consumeSlots', () => {
  const { render } = createRenderer();

  it('should render default props', async () => {
    render(<SlotsWrapper />);

    await screen.findByText('test', { selector: '.data' });
  });

  it('should render passed props', async () => {
    render(<SlotsWrapper data="new" />);

    await screen.findByText('new', { selector: '.data' });
  });

  it('should render omit props in omitProps', async () => {
    render(<SlotsWrapper shouldOmit />);

    await screen.findByText('omitted', { selector: '.shouldOmit' });
  });

  it('should resolve classes', async () => {
    render(<SlotsWrapper shouldOmit />);

    await screen.findByText('wrapper-root test shouldOmit', { selector: '.classes' });
  });

  it('should render function component passed as slot', async () => {
    render(
      <SlotsWrapper
        slots={{
          wrapper: () => <div>function component</div>,
        }}
      />,
    );

    await screen.findByText('function component');
  });

  it('should render forward ref function passed as slot', async () => {
    render(
      <SlotsWrapper
        slots={{
          wrapper: React.forwardRef((_, ref: React.Ref<HTMLDivElement>) => (
            <div ref={ref}>forward ref</div>
          )),
        }}
      />,
    );

    await screen.findByText('forward ref');
  });

  it('should render function with props and ref arguments passed as slot', async () => {
    render(
      <SlotsWrapper
        slots={{
          wrapper: (_, ref: React.Ref<HTMLDivElement>) => (
            <div ref={ref}>props and ref arguments</div>
          ),
        }}
      />,
    );

    await screen.findByText('props and ref arguments');
  });
});
