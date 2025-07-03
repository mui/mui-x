import * as React from 'react';
import type {
  ConformantComponentProps,
  SchedulerPrimitivesConformanceTestsOptions,
} from '../describeConformance';
import { throwMissingPropError } from './utils';

export function testClassName(
  element: React.ReactElement<ConformantComponentProps>,
  getOptions: () => SchedulerPrimitivesConformanceTestsOptions,
) {
  describe('prop: className', () => {
    const { render } = getOptions();

    if (!render) {
      throwMissingPropError('render');
    }

    it('should apply the className when passed as a string', async () => {
      await render(React.cloneElement(element, { className: 'test-class' }));
      expect(document.querySelector('.test-class')).not.to.equal(null);
    });
  });
}
