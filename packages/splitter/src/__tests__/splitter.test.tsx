import React from 'react';
import { shallow } from 'enzyme';
import { Splitter } from '../splitter';

describe('Splitter', () => {
  it('should take only 2 children', () => {
    const errorMessage = 'The Splitter component needs exactly 2 children react node to split panels properly';
    expect(() => shallow(<Splitter />)).toThrow(errorMessage);

    expect(() =>
      shallow(
        <Splitter>
          <div className={'one-child'}></div>
        </Splitter>,
      ),
    ).toThrow(errorMessage);

    expect(() =>
      shallow(
        <Splitter>
          <div className={'one-child'}></div>
          <div className={'two-child'}></div>
          <div className={'three-child'}></div>
        </Splitter>,
      ),
    ).toThrow(errorMessage);

    expect(() =>
      shallow(
        <Splitter>
          <div className={'one-child'}></div>
          <div className={'two-child'}></div>
        </Splitter>,
      ),
    ).not.toThrow();
  });

  it('should take only valid react elements as children', () => {
    expect(() =>
      shallow(
        <Splitter>
          {' '}
          <div className={'two-child'}></div>
        </Splitter>,
      ),
    ).toThrow('Invalid child element');
  });
});
