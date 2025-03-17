import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { act, createRenderer, screen } from '@mui/internal-test-utils';
import { spy, stub } from 'sinon';
import { expect } from 'chai';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridApi,
  GridRowsProp,
  Toolbar,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { describeSkipIf, isJSDOM } from 'test/utils/skipIf';
import {
  GridToolbarPromptControl,
  GridToolbarPromptControlProps,
} from '../components/promptControl/GridToolbarPromptControl';

interface BaselineProps extends DataGridPremiumProps {
  rows: GridRowsProp;
}

const rows: GridRowsProp = [
  { id: 0, category1: 'CatA', category2: 'Cat1' },
  { id: 1, category1: 'CatA', category2: 'Cat2' },
  { id: 2, category1: 'CatA', category2: 'Cat2' },
  { id: 3, category1: 'CatB', category2: 'Cat2' },
  { id: 4, category1: 'CatB', category2: 'Cat1' },
];

const baselineProps: BaselineProps = {
  rows,
  columns: [
    {
      field: 'id',
      type: 'number',
      unstable_examples: [10, 20, 30, 40, 50],
    },
    {
      field: 'category1',
      unstable_examples: ['ExampleA', 'ExampleB', 'ExampleC'],
    },
    {
      field: 'category2',
      unstable_examples: ['Example1', 'Example2', 'Example3'],
    },
  ],
};

describe('<DataGridPremium /> - Prompt', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;
  const promptSpy = stub().resolves({});

  function ToolbarWithPromptInput(props: GridToolbarPromptControlProps) {
    return (
      <Toolbar>
        <GridToolbarPromptControl {...props} onPrompt={promptSpy} />
      </Toolbar>
    );
  }

  function Test(props: Partial<DataGridPremiumProps & { allowDataSampling: boolean }>) {
    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPremium
          {...baselineProps}
          apiRef={apiRef}
          slots={{
            toolbar: ToolbarWithPromptInput as any,
          }}
          slotProps={{
            toolbar: {
              allowDataSampling: props.allowDataSampling,
            } as any,
          }}
          showToolbar
          {...props}
        />
      </div>
    );
  }

  beforeEach(() => {
    promptSpy.resetHistory();
  });

  describeSkipIf(isJSDOM)('data sampling', () => {
    it('should use unstable_examples to generate the prompt context', async () => {
      const { user } = render(<Test />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Do something with the data');

      const sendButton = screen.getByRole('button', { name: /send/i });
      await user.click(sendButton);

      expect(promptSpy.callCount).to.equal(1);
      expect(promptSpy.firstCall.args[1]).contains('Example1');
      expect(promptSpy.firstCall.args[1]).not.contains('CatA');
    });

    it('should sample rows to generate the prompt context', async () => {
      const { user } = render(<Test allowDataSampling />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Do something with the data');

      const sendButton = screen.getByRole('button', { name: /send/i });
      await user.click(sendButton);

      expect(promptSpy.callCount).to.equal(1);
      expect(promptSpy.firstCall.args[1]).not.contains('Example1');
      expect(promptSpy.firstCall.args[1]).contains('CatA');
    });
  });

  describe('API', () => {
    it('should allow building the context', () => {
      render(<Test />);

      const contextWithColumnExamples = apiRef.current?.unstable_getPromptContext();
      expect(contextWithColumnExamples).contains('Example');
      expect(contextWithColumnExamples).not.contains('Cat');

      const contextWithDataSamples = apiRef.current?.unstable_getPromptContext(true);
      expect(contextWithDataSamples).not.contains('Example');
      expect(contextWithDataSamples).contains('Cat');
    });

    it('should apply the prompt result', () => {
      const sortChangeSpy = spy();
      const filterChangeSpy = spy();
      const aggregationChangeSpy = spy();
      const rowSelectionChangeSpy = spy();
      const rowGroupingChangeSpy = spy();

      render(
        <Test
          onSortModelChange={sortChangeSpy}
          onFilterModelChange={filterChangeSpy}
          onAggregationModelChange={aggregationChangeSpy}
          onRowSelectionModelChange={rowSelectionChangeSpy}
          onRowGroupingModelChange={rowGroupingChangeSpy}
        />,
      );

      act(() =>
        apiRef.current?.unstable_applyPromptResult({
          select: 1,
          filters: [
            {
              column: 'id',
              operator: '>=',
              value: 0,
            },
          ],
          aggregation: {
            id: 'size',
          },
          sorting: [
            {
              column: 'id',
              direction: 'desc',
            },
          ],
          grouping: [
            {
              column: 'category1',
            },
          ],
          error: null,
        }),
      );

      expect(sortChangeSpy.callCount).to.equal(1);
      expect(filterChangeSpy.callCount).to.equal(1);
      expect(aggregationChangeSpy.callCount).to.equal(1);
      expect(rowSelectionChangeSpy.callCount).to.equal(1);
      expect(rowGroupingChangeSpy.callCount).to.equal(1);
    });
  });
});
