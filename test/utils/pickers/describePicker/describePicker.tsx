/* eslint-env mocha */
import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen, fireEvent, createDescribe } from '@mui/internal-test-utils';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { testSkipIf } from 'test/utils/skipIf';
import { DescribePickerOptions } from './describePicker.types';

function innerDescribePicker(ElementToTest: React.ElementType, options: DescribePickerOptions) {
  const { render, fieldType, hasNoView, variant } = options;

  const propsToOpen = variant === 'static' ? {} : { open: true };

  testSkipIf(fieldType === 'multi-input' || variant === 'static')(
    'should forward the `inputRef` prop to the text field (<input /> textfield DOM structure only)',
    () => {
      const inputRef = React.createRef<HTMLInputElement>();
      render(<ElementToTest inputRef={inputRef} enableAccessibleFieldDOMStructure={false} />);

      expect(inputRef.current).to.have.tagName('input');
    },
  );

  describe('Localization', () => {
    testSkipIf(Boolean(hasNoView))('should respect the `localeText` prop', () => {
      render(
        <ElementToTest
          {...propsToOpen}
          localeText={{ cancelButtonLabel: 'Custom cancel' }}
          slotProps={{ actionBar: { actions: ['cancel'] } }}
        />,
      );

      expect(screen.queryByText('Custom cancel')).not.to.equal(null);
    });
  });

  describe('Component slot: OpenPickerIcon', () => {
    testSkipIf(variant === 'static' || fieldType === 'multi-input')(
      'should render custom component',
      () => {
        function HomeIcon(props: SvgIconProps) {
          return (
            <SvgIcon data-testid="component-test" {...props}>
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </SvgIcon>
          );
        }

        const { queryAllByTestId } = render(
          <ElementToTest
            slots={{
              openPickerIcon: HomeIcon,
            }}
          />,
        );

        const shouldRenderOpenPickerIcon = !hasNoView && variant !== 'mobile';

        expect(queryAllByTestId('component-test')).to.have.length(
          shouldRenderOpenPickerIcon ? 1 : 0,
        );
      },
    );
  });

  describe('Component slot: DesktopPaper', () => {
    testSkipIf(hasNoView || variant !== 'desktop')(
      'should forward onClick and onTouchStart',
      () => {
        const handleClick = spy();
        const handleTouchStart = spy();
        render(
          <ElementToTest
            {...propsToOpen}
            slotProps={{
              desktopPaper: {
                onClick: handleClick,
                onTouchStart: handleTouchStart,
                'data-testid': 'paper',
              },
            }}
          />,
        );
        const paper = screen.getByTestId('paper');

        fireEvent.click(paper);
        fireEvent.touchStart(paper);

        expect(handleClick.callCount).to.equal(1);
        expect(handleTouchStart.callCount).to.equal(1);
      },
    );
  });

  describe('Component slot: Popper', () => {
    testSkipIf(hasNoView || variant !== 'desktop')(
      'should forward onClick and onTouchStart',
      () => {
        const handleClick = spy();
        const handleTouchStart = spy();
        render(
          <ElementToTest
            {...propsToOpen}
            slotProps={{
              popper: {
                onClick: handleClick,
                onTouchStart: handleTouchStart,
                'data-testid': 'popper',
              },
            }}
          />,
        );
        const popper = screen.getByTestId('popper');

        fireEvent.click(popper);
        fireEvent.touchStart(popper);

        expect(handleClick.callCount).to.equal(1);
        expect(handleTouchStart.callCount).to.equal(1);
      },
    );
  });

  describe('Component slot: Toolbar', () => {
    testSkipIf(Boolean(hasNoView))(
      'should render toolbar on mobile but not on desktop when `hidden` is not defined',
      () => {
        render(
          <ElementToTest
            {...propsToOpen}
            slotProps={{ toolbar: { 'data-testid': 'pickers-toolbar' } }}
          />,
        );

        if (variant === 'desktop') {
          expect(screen.queryByTestId('pickers-toolbar')).to.equal(null);
        } else {
          expect(screen.getByTestId('pickers-toolbar')).toBeVisible();
        }
      },
    );

    testSkipIf(Boolean(hasNoView))('should render toolbar when `hidden` is `false`', () => {
      render(
        <ElementToTest
          {...propsToOpen}
          slotProps={{ toolbar: { hidden: false, 'data-testid': 'pickers-toolbar' } }}
        />,
      );

      expect(screen.getByTestId('pickers-toolbar')).toBeVisible();
    });

    testSkipIf(Boolean(hasNoView))('should not render toolbar when `hidden` is `true`', () => {
      render(
        <ElementToTest
          {...propsToOpen}
          slotProps={{ toolbar: { hidden: true, 'data-testid': 'pickers-toolbar' } }}
        />,
      );

      expect(screen.queryByTestId('pickers-toolbar')).to.equal(null);
    });
  });

  describe('prop: disableOpenPicker', () => {
    testSkipIf(variant === 'static')(
      'should not render the open picker button, but still render the picker if its open',
      () => {
        render(
          <ElementToTest
            disableOpenPicker
            {...propsToOpen}
            slotProps={{
              layout: {
                classes: {
                  contentWrapper: 'test-pickers-content-wrapper',
                },
              },
            }}
          />,
        );

        expect(screen.queryByRole('button', { name: /Choose/ })).to.equal(null);
        // check if anything has been rendered inside the layout content wrapper
        expect(document.querySelector('.test-pickers-content-wrapper')?.hasChildNodes()).to.equal(
          true,
        );
      },
    );
  });
}

/**
 * Test behaviors shared across all pickers.
 */
export const describePicker = createDescribe('Pickers shared APIs', innerDescribePicker);
