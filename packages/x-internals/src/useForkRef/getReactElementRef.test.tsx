/* Adapted from https://github.com/mui/base-ui/blob/c52a6ab0c5982263e10028756a8792234eeadf42/packages/react/src/utils/getReactElementRef.test.tsx */

import * as React from 'react';
import { expect } from 'chai';
import { getReactElementRef } from './getReactElementRef';

describe('getReactElementRef', () => {
  it('should return undefined when not used correctly', () => {
    // @ts-expect-error
    expect(getReactElementRef(false)).to.equal(null);
    // @ts-expect-error
    expect(getReactElementRef()).to.equal(null);
    // @ts-expect-error
    expect(getReactElementRef(1)).to.equal(null);

    const children = [<div key="1" />, <div key="2" />];
    // @ts-expect-error
    expect(getReactElementRef(children)).to.equal(null);
  });

  it('should return the ref of a React element', () => {
    const ref = React.createRef<HTMLDivElement>();
    const element = <div ref={ref} />;
    expect(getReactElementRef(element)).to.equal(ref);
  });

  it('should return null for a fragment', () => {
    const element = (
      <React.Fragment>
        <p>Hello</p>
        <p>Hello</p>
      </React.Fragment>
    );
    expect(getReactElementRef(element)).to.equal(null);
  });

  it('should return null for element with no ref', () => {
    const element = <div />;
    expect(getReactElementRef(element)).to.equal(null);
  });
});
