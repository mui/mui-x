import { expect } from 'chai';
import { createSelector } from 'reselect';

const cache = {};

function createCachedSelector(...args: any) {
  const selector = (state, id) => {
    if (!cache[id]) {
      cache[id] = {};
    }
    if (cache[id][args]) {
      return cache[id][args](state, id);
    }
    const newSelector = createSelector(...args);
    cache[id][args] = newSelector;
    return newSelector(state, id);
  };
  return selector;
}

const columnFieldsSelector = (state: any) => state.columns.all;

const allColumnFieldsSelector = createCachedSelector(
  columnFieldsSelector,
  (state, id) => id,
  (fields, id) => {
    console.log('called', id);
    return fields.map((field) => field);
  },
);

console.log(cache);

describe('Selectors', () => {
  it.only('test', () => {
    const state1 = { columns: { all: ['foo'], lookup: { foo: {} } } };
    const state2 = { columns: { all: ['foo'], lookup: { foo: {} } } };
    const columns1 = allColumnFieldsSelector(state1, 'abc');
    allColumnFieldsSelector(state2, 'abc2');
    const columns2 = allColumnFieldsSelector({ columns: { ...state1.columns } }, 'abc');
    expect(columns1).to.equal(columns2);
  });
});
