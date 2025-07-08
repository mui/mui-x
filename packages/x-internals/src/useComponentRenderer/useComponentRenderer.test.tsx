import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { RenderProp, useComponentRenderer } from './useComponentRenderer';

describe('useComponentRenderer', () => {
  const { render } = createRenderer();

  function TestComponent(
    props: React.ComponentPropsWithoutRef<'button'> & {
      render?: RenderProp<React.ComponentPropsWithoutRef<'button'>, { someState: string }>;
    },
  ) {
    const { render: renderProp, ...other } = props;
    return useComponentRenderer('button', renderProp, other, { someState: 'state value' });
  }

  it('should render intrinsic element type as default element', () => {
    render(<TestComponent data-testid="rendered-element">children</TestComponent>);
    expect(screen.getByTestId('rendered-element')).to.be.instanceOf(window.HTMLButtonElement);
    expect(screen.getByTestId('rendered-element')).to.have.text('children');
  });

  it('should render component type as default element', () => {
    function CustomButton(props: React.ComponentPropsWithoutRef<'button'>) {
      return <button {...props} />;
    }
    function TestComponentWithCustomButton(props: React.ComponentPropsWithoutRef<'button'>) {
      return useComponentRenderer(CustomButton, undefined, props);
    }
    render(
      <TestComponentWithCustomButton data-testid="rendered-element">
        children
      </TestComponentWithCustomButton>,
    );
    expect(screen.getByTestId('rendered-element')).to.be.instanceOf(window.HTMLButtonElement);
    expect(screen.getByTestId('rendered-element')).to.have.text('children');
  });

  it('should allow default element to be overridden by render prop set to a children', () => {
    render(<TestComponent data-testid="rendered-element" render={<div>children</div>} />);
    expect(screen.getByTestId('rendered-element')).to.be.instanceOf(window.HTMLDivElement);
    expect(screen.getByTestId('rendered-element')).to.have.text('children');
  });

  it('should allow default element to be overridden by render prop set to a function', () => {
    render(
      <TestComponent
        data-testid="rendered-element"
        render={(props) => (
          <div {...(props as React.ComponentPropsWithoutRef<'div'>)}>children</div>
        )}
      />,
    );
    expect(screen.getByTestId('rendered-element')).to.be.instanceOf(window.HTMLDivElement);
    expect(screen.getByTestId('rendered-element')).to.have.text('children');
  });

  it('should pass state to render prop', () => {
    render(
      <TestComponent
        data-testid="rendered-element"
        render={(props, state) => (
          <div {...(props as React.ComponentPropsWithoutRef<'div'>)}>{state.someState}</div>
        )}
      />,
    );
    expect(screen.getByTestId('rendered-element')).to.be.instanceOf(window.HTMLDivElement);
    expect(screen.getByTestId('rendered-element')).to.have.text('state value');
  });

  it('should merge className props', () => {
    render(
      <TestComponent
        data-testid="rendered-element"
        className="test-class-1"
        render={<div className="test-class-2" />}
      />,
    );
    expect(screen.getByTestId('rendered-element')).to.have.class('test-class-1');
    expect(screen.getByTestId('rendered-element')).to.have.class('test-class-2');
  });

  it('should merge style props', () => {
    render(
      <TestComponent
        data-testid="rendered-element"
        style={{ color: 'blue', outline: '1px solid red' }}
        render={<div style={{ backgroundColor: 'blue', outline: 'blue solid 1px' }} />}
      />,
    );
    expect(screen.getByTestId('rendered-element')).to.have.attribute(
      'style',
      'color: blue; outline: blue solid 1px; background-color: blue;',
    );
  });
});
