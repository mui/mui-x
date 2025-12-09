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
  React.forwardRef(function SlotsWrapper(props: WrapperProps, ref: React.Ref<HTMLDivElement>) {
    return (
      <div ref={ref}>
        <div className="data">{props.data}</div>
        <div className="shouldOmit">{props.shouldOmit ? 'not-omitted' : 'omitted'}</div>
        <div className="classes">{props.classes?.root}</div>
      </div>
    );
  }),
);

describe('consumeSlots', () => {
  const { render } = createRenderer();

  it('should render default props', async () => {
    render(<SlotsWrapper />);

    expect(await screen.findByText('test', { selector: '.data' })).toBeVisible();
  });

  it('should render passed props', async () => {
    render(<SlotsWrapper data="new" />);

    expect(await screen.findByText('new', { selector: '.data' })).toBeVisible();
  });

  it('should render omit props in omitProps', async () => {
    render(<SlotsWrapper shouldOmit />);

    expect(await screen.findByText('omitted', { selector: '.shouldOmit' })).toBeVisible();
  });

  it('should resolve classes', async () => {
    render(<SlotsWrapper shouldOmit />);

    expect(
      await screen.findByText('wrapper-root test shouldOmit', { selector: '.classes' }),
    ).toBeVisible();
  });

  it('should render function component passed as slot', async () => {
    render(
      <SlotsWrapper
        slots={{
          wrapper: () => <div>function component</div>,
        }}
      />,
    );

    expect(await screen.findByText('function component')).toBeVisible();
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

    expect(await screen.findByText('forward ref')).toBeVisible();
  });

  it('should render function with props and ref arguments passed as slot', async () => {
    render(
      <SlotsWrapper
        slots={{
          wrapper: React.forwardRef((_, ref: React.Ref<HTMLDivElement>) => (
            <div ref={ref}>props and ref arguments</div>
          )),
        }}
      />,
    );

    expect(await screen.findByText('props and ref arguments')).toBeVisible();
  });
});
