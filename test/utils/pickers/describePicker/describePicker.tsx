import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen, fireEvent, createDescribe } from '@mui/internal-test-utils';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { DescribePickerOptions } from './describePicker.types';

function innerDescribePicker(ElementToTest: React.ElementType, options: DescribePickerOptions) {
  const { render, fieldType, hasNoView, variant } = options;

  const propsToOpen = variant === 'static' ? {} : { open: true };

  it.skipIf(fieldType === 'multi-input' || variant === 'static')(
    'should forward the `inputRef` prop to the text field (<input /> textfield DOM structure only)',
    () => {
      const inputRef = React.createRef<HTMLInputElement>();
      render(<ElementToTest inputRef={inputRef} enableAccessibleFieldDOMStructure={false} />);

      expect(inputRef.current).to.have.tagName('input');
    },
  );

  describe('Localization', () => {
    it.skipIf(Boolean(hasNoView))('should respect the `localeText` prop', () => {
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
    it.skipIf(variant === 'static' || fieldType === 'multi-input')(
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

        expect(queryAllByTestId('component-test')).to.have.length(hasNoView ? 0 : 1);
      },
    );
  });

  describe('Component slot: DesktopPaper', () => {
    it.skipIf(hasNoView || variant !== 'desktop')('should forward onClick and onTouchStart', () => {
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
    });
  });

  describe('Component slot: Popper', () => {
    it.skipIf(hasNoView || variant !== 'desktop')('should forward onClick and onTouchStart', () => {
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
    });
  });

  describe('Component slot: Toolbar', () => {
    it.skipIf(Boolean(hasNoView))(
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

    it.skipIf(Boolean(hasNoView))('should render toolbar when `hidden` is `false`', () => {
      render(
        <ElementToTest
          {...propsToOpen}
          slotProps={{ toolbar: { hidden: false, 'data-testid': 'pickers-toolbar' } }}
        />,
      );

      expect(screen.getByTestId('pickers-toolbar')).toBeVisible();
    });

    it.skipIf(Boolean(hasNoView))('should not render toolbar when `hidden` is `true`', () => {
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
    it.skipIf(variant === 'static')(
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

  it.skipIf(variant === 'static' || fieldType === 'multi-input')(
    'should bring the focus back to the open button when the picker is closed',
    async () => {
      const { user } = render(<ElementToTest />);

      const openButton = screen.getByRole('button', { name: /Choose/ });
      // open Picker
      await user.click(openButton);

      // close Picker
      await user.keyboard('[Escape]');

      expect(openButton).to.toHaveFocus();
      expect(document.activeElement).to.equal(openButton);
    },
  );
}

/**
 * Test behaviors shared across all pickers.
 */
export const describePicker = createDescribe('Pickers shared APIs', innerDescribePicker);
