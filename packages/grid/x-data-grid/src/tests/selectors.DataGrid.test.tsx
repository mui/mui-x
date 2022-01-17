import { expect } from 'chai';
import { createSelector } from 'reselect';

const columnFieldssSelector = (state) => state.columns.all;

const columnLookupSelector = (state) => state.columns.lookup;

const allColumnFieldsSelector = createSelector(
  columnFieldssSelector,
  columnLookupSelector,
  (fields, lookup) => fields.map((field) => lookup[field]),
);

describe('Selectors', () => {
  it.only('test', () => {
    const state1 = { columns: { all: ['foo'], lookup: { foo: {} } } };
    const state2 = { columns: { all: ['foo'], lookup: { foo: {} } } };
    const columns1 = allColumnFieldsSelector(state1);
    allColumnFieldsSelector(state2);
    const columns2 = allColumnFieldsSelector(state1);
    expect(columns1).to.equal(columns2);
  });
});
