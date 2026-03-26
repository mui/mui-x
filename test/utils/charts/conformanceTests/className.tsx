import * as React from 'react';
import type {
  ConformantComponentProps,
  ChartsSingleComponentConformanceTestsOptions,
} from '../describeConformance';
import { throwMissingPropError } from './utils';

export function testClassName(
  element: React.ReactElement<ConformantComponentProps>,
  getOptions: () => ChartsSingleComponentConformanceTestsOptions,
) {
  describe('prop: className', () => {
    const { render } = getOptions();

    if (!render) {
      throwMissingPropError('render');
    }

    it('should apply the className when passed as a string', async () => {
      const ref = React.createRef<HTMLElement>();
      await render(React.cloneElement(element, { className: 'test-class', ref }));

      expect(document.querySelector('.test-class')).not.to.equal(null);

      expect(ref.current).not.to.equal(null);
      expect(ref.current?.classList.contains('test-class')).to.equal(true);
    });
  });
}
