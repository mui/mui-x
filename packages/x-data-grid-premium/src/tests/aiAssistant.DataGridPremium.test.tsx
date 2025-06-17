import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { act, createRenderer, screen } from '@mui/internal-test-utils';
import { spy, stub } from 'sinon';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridAiAssistantPanel,
  GridApi,
  GridRowsProp,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { isJSDOM } from 'test/utils/skipIf';

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
      examples: [10, 20, 30, 40, 50],
    },
    {
      field: 'category1',
      examples: ['ExampleA', 'ExampleB', 'ExampleC'],
    },
    {
      field: 'category2',
      examples: ['Example1', 'Example2', 'Example3'],
    },
  ],
};

describe('<DataGridPremium /> - Prompt', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;
  const promptSpy = stub().resolves({});

  function Test(props: Partial<DataGridPremiumProps & { allowAiAssistantDataSampling: boolean }>) {
    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPremium
          {...baselineProps}
          apiRef={apiRef}
          aiAssistant
          showToolbar
          slots={{
            aiAssistantPanel: GridAiAssistantPanel,
          }}
          onPrompt={promptSpy}
          {...props}
        />
      </div>
    );
  }

  beforeEach(() => {
    promptSpy.reset();
  });

  describe.skipIf(isJSDOM)('data sampling', () => {
    it('should not show AI Assistant button in the Toolbarif the feature is disabled', () => {
      render(<Test aiAssistant={false} />);
      expect(screen.queryByTestId('AssistantIcon')).to.equal(null);
    });

    it('should use `examples` to generate the prompt context', async () => {
      const { user } = render(<Test />);

      const aiAssistantToolbarButton = screen.getByTestId('AssistantIcon');
      await user.click(aiAssistantToolbarButton);

      const input = screen.queryAllByPlaceholderText('Type or record a prompt…')[0];
      await user.type(input, 'Do something with the data');
      await user.keyboard('{Enter}');

      expect(promptSpy.callCount).to.equal(1);
      expect(promptSpy.firstCall.args[1]).contains('Example1');
      expect(promptSpy.firstCall.args[1]).not.contains('CatA');
    });

    it('should sample rows to generate the prompt context', async () => {
      const { user } = render(<Test allowAiAssistantDataSampling />);

      const aiAssistantToolbarButton = screen.getByTestId('AssistantIcon');
      await user.click(aiAssistantToolbarButton);

      const input = screen.queryAllByPlaceholderText('Type or record a prompt…')[0];
      await user.type(input, 'Do something with the data');
      await user.keyboard('{Enter}');

      expect(promptSpy.callCount).to.equal(1);
      expect(promptSpy.firstCall.args[1]).not.contains('Example1');
      expect(promptSpy.firstCall.args[1]).contains('CatA');
    });
  });

  describe('API', () => {
    it('should not do anything if the feature is disabled', async () => {
      const sortChangeSpy = spy();

      promptSpy.resolves({
        select: -1,
        filters: [],
        aggregation: {},
        sorting: [
          {
            column: 'id',
            direction: 'desc',
          },
        ],
        grouping: [],
        pivoting: {},
      });

      render(<Test aiAssistant={false} onSortModelChange={sortChangeSpy} />);

      await act(() => apiRef.current?.aiAssistant.processPrompt('Do something with the data'));

      expect(sortChangeSpy.callCount).to.equal(0);
    });

    it('should apply the prompt result', async () => {
      const sortChangeSpy = spy();
      const filterChangeSpy = spy();
      const aggregationChangeSpy = spy();
      const rowSelectionChangeSpy = spy();
      const rowGroupingChangeSpy = spy();

      promptSpy.resolves({
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
        pivoting: {},
      });

      render(
        <Test
          onSortModelChange={sortChangeSpy}
          onFilterModelChange={filterChangeSpy}
          onAggregationModelChange={aggregationChangeSpy}
          onRowSelectionModelChange={rowSelectionChangeSpy}
          onRowGroupingModelChange={rowGroupingChangeSpy}
        />,
      );

      await act(() => apiRef.current?.aiAssistant.processPrompt('Do something with the data'));

      expect(sortChangeSpy.callCount).to.equal(1);
      expect(filterChangeSpy.callCount).to.equal(1);
      expect(aggregationChangeSpy.callCount).to.equal(1);
      expect(rowSelectionChangeSpy.callCount).to.equal(1);
      expect(rowGroupingChangeSpy.callCount).to.equal(1);
    });

    it('should return the prompt processing error', async () => {
      const errorMsg = 'Prompt processing error';
      promptSpy.rejects(new Error(errorMsg));

      render(<Test />);
      const response = (await act(() =>
        apiRef.current?.aiAssistant.processPrompt('Do something with the data'),
      )) as Error;

      expect(response.message).to.equal(errorMsg);
    });
  });
});
