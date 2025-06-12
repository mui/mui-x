import * as React from 'react';
import { expect } from 'chai';
import type {
  ConformantComponentProps,
  SchedulerPrimitivesConformanceTestsOptions,
} from '../describeConformance';
import { throwMissingPropError } from './utils';

async function verifyRef(
  element: React.ReactElement<ConformantComponentProps>,
  render: SchedulerPrimitivesConformanceTestsOptions['render'],
  onRef: (instance: unknown, element: HTMLElement | null) => void,
) {
  if (!render) {
    throwMissingPropError('render');
  }

  const ref = React.createRef();

  const { container } = await render(
    <React.Fragment>{React.cloneElement(element, { ref })}</React.Fragment>,
  );

  onRef(ref.current, container);
}

export function testRefForwarding(
  element: React.ReactElement<ConformantComponentProps>,
  getOptions: () => SchedulerPrimitivesConformanceTestsOptions,
) {
  describe('ref', () => {
    it(`attaches the ref`, async () => {
      const { render, refInstanceof } = getOptions();

      await verifyRef(element, render, (instance) => {
        expect(instance).to.be.instanceof(refInstanceof);
      });
    });
  });
}
