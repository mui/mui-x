import * as React from 'react';
import { expect } from 'chai';
import createDescribe from '@mui/internal-test-utils/createDescribe';
import { MuiRenderResult } from '@mui/internal-test-utils/createRenderer';

interface DescribeSlotsConformanceParams {
  getElement: (params: { slotName: string; props: any }) => React.ReactElement<any>;
  render: (node: React.ReactElement) => MuiRenderResult;
  slots: { [slotName: string]: { className: string } };
}

export function innerDescribeSlotsConformance(params: DescribeSlotsConformanceParams) {
  const { getElement, render, slots } = params;

  Object.keys(slots).forEach((slotName) => {
    describe(`Slot: ${slotName}`, () => {
      it('should replace the default slot when defined', () => {
        const slotConfig = slots[slotName];
        const response = render(
          getElement({
            slotName,
            props: {
              slots: {
                [slotName]: React.forwardRef((props, ref: React.Ref<HTMLDivElement>) => (
                  <div ref={ref} data-testid="custom-slot" />
                )),
              },
            },
          }),
        );

        // Check if the default slot is being rendered
        expect(response.container.querySelector(`.${slotConfig.className}`)).to.equal(null);

        // Check if the custom slot is being rendered
        expect(response.getByTestId('custom-slot')).not.to.equal(null);
      });

      it('should pass props to the default slot', () => {
        const slotConfig = slots[slotName];
        const response = render(
          getElement({
            slotName,
            props: {
              slotProps: {
                [slotName]: { 'data-testid': 'default-slot', className: 'default-slot' },
              },
            },
          }),
        );

        const slotElement = response.container.querySelector(`.${slotConfig.className}`);

        // Check if the default slot is being rendered
        expect(slotElement).not.to.equal(null);

        // Check if the default slot receives the `data-testid`
        expect(slotElement).to.have.attribute('data-testid', 'default-slot');

        // Check if the custom class is being applied
        expect(slotElement).to.have.class('default-slot');

        // Make sure that the default class has not been removed
        expect(slotElement).to.have.class(slotConfig.className);
      });
    });
  });
}

/**
 * Test the slots of the component.
 */
export const describeSlotsConformance = createDescribe(
  'Slots conformance',
  innerDescribeSlotsConformance,
);
