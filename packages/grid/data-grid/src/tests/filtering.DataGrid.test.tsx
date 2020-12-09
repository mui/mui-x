import * as React from 'react';
import {
  createClientRenderStrictMode,
} from 'test/utils/index';
import { expect } from 'chai';
import { DataGrid } from '@material-ui/data-grid';
import { getColumnValues, raf, sleep } from 'test/utils/helperFn';

describe('<DataGrid />', () => {
  // TODO v5: replace with createClientRender
  const baselineProps = {
    rows: [
      {
        id: 0,
        brand: 'Nike',
      },
      {
        id: 1,
        brand: 'Adidas',
      },
      {
        id: 2,
        brand: 'Puma',
      },
    ],
    columns: [{field: 'brand'}],
  };

  describe('filter', () => {
    let setProps: any;

    before(function beforeHook() {
      if (/jsdom/.test(window.navigator.userAgent)) {
        // Need layouting
        this.skip();
      }
    });

    const TestCase = (props: {  operator?: string, value?: string }) => {
      const {operator, value} = props;
      return (
        <div style={{width: 300, height: 300}}>
          <DataGrid
            {...baselineProps}
            filterModel={{
              items: [{
                columnField: 'brand', value, operatorValue: operator
              }]
            }}
            disableColumnFilter={false}
          />
        </div>
      );
    };
    beforeEach(()=> {
      const render = createClientRenderStrictMode();
      const renderResult = render(<TestCase value={'a'} operator={'contains'}/>);
      setProps = renderResult.setProps;
    })

    it('should apply the filterModel prop correctly', () => {
      expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
    });
    it('should apply the filterModel prop correctly when row changes', () => {
      setProps({
        rows: [
          {
            id: 3,
            brand: 'Asics',
          },
          {
            id: 4,
            brand: 'RedBull',
          },
          {
            id: 5,
            brand: 'Hugo',
          },
        ],
      });
      expect(getColumnValues()).to.deep.equal(['Asics']);
    });

    it.only('should allow operator startsWith', async () => {
      // const renderResult = render(<TestCase value={'a'} operator={'startsWith'}/>);
      setProps({
        operator: 'startsWith'
      });
      await sleep(100);
      expect(getColumnValues()).to.deep.equal(['Adidas']);
    });
    it('should allow operator endsWith', () => {
      setProps({
        operator: 'endsWith'
      });
      expect(getColumnValues()).to.deep.equal(['Puma']);
    });
    it('should allow operator equal', () => {
      setProps({
        operator: 'equals',
        value: 'nike'
      });
      expect(getColumnValues()).to.deep.equal(['Nike']);
    });
  });
});
