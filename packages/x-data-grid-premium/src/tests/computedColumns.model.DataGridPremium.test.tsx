import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer, act } from '@mui/internal-test-utils';
import {
  DataGridPremium,
  useGridApiRef,
  GridSidebarValue,
  gridComputedColumnsSelector,
  gridComputedColumnsRevisionSelector,
  gridComputedColumnDefinitionSelector,
  gridComputedColumnsPanelOpenSelector,
  gridSidebarStateSelector,
} from '@mui/x-data-grid-premium';
import type {
  DataGridPremiumProps,
  GridApi,
  GridColDef,
  GridComputedColumnDefinition,
  GridComputedColumnsModel,
} from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';
import { unwrapPrivateAPI } from '@mui/x-data-grid/internals';
import { vi, describe, it, expect } from 'vitest';
import type { GridPrivateApiPremium } from '../models/gridApiPremium';

const rows = [
  { id: 0, price: 10, quantity: 2 },
  { id: 1, price: 20, quantity: 3 },
];

const columns: GridColDef[] = [
  { field: 'id', type: 'number' },
  { field: 'price', type: 'number' },
  { field: 'quantity', type: 'number' },
];

const total: GridComputedColumnDefinition = {
  field: 'total',
  headerName: 'Total',
  formula: '=price * quantity',
  type: 'number',
};

const doubled: GridComputedColumnDefinition = {
  field: 'doubled',
  headerName: 'Doubled',
  formula: '=price * 2',
  type: 'number',
};

const MISSING_FEATURE_WARNING = 'MUI X Data Grid: Formula-related props were provided';

/**
 * The bundled half of the computed columns feature: the model, its API and its
 * persistence work without the injectable formula feature.
 */
describe('<DataGridPremium /> - Computed columns model', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  function Test(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 500, height: 300 }}>
        <DataGridPremium apiRef={apiRef} rows={rows} columns={columns} {...props} />
      </div>
    );
  }

  const getModel = () => gridComputedColumnsSelector(apiRef as RefObject<GridApi>);
  const getEditorRequest = () =>
    unwrapPrivateAPI<GridPrivateApiPremium, GridApi>(apiRef.current!).caches.computedColumns
      .editorRequest;

  describe('state', () => {
    it('should default to an empty model', () => {
      render(<Test />);
      expect(apiRef.current!.state.computedColumns).to.deep.equal({ model: [], revision: 0 });
      expect(gridComputedColumnsRevisionSelector(apiRef as RefObject<GridApi>)).to.equal(0);
    });

    it('should seed the model from `initialState.computedColumns.model`', () => {
      const model = [total];
      expect(() => {
        render(<Test initialState={{ computedColumns: { model } }} />);
      }).toWarnDev([MISSING_FEATURE_WARNING]);
      expect(getModel()).to.equal(model);
      expect(gridComputedColumnDefinitionSelector(apiRef as RefObject<GridApi>, 'total')).to.equal(
        total,
      );
      expect(gridComputedColumnDefinitionSelector(apiRef as RefObject<GridApi>, 'price')).to.equal(
        null,
      );
    });

    it('should give the `computedColumns` prop precedence over the initial state', () => {
      const model = [total];
      render(
        <Test
          featureDependencies={{ formula: formulaFeature }}
          computedColumns={model}
          initialState={{ computedColumns: { model: [doubled] } }}
        />,
      );
      expect(getModel()).to.equal(model);
    });

    it('should keep the first definition of a duplicated field in the initial model and warn', () => {
      expect(() => {
        render(
          <Test
            featureDependencies={{ formula: formulaFeature }}
            initialState={{
              computedColumns: { model: [total, { ...total, headerName: 'Other' }] },
            }}
          />,
        );
      }).toWarnDev(['MUI X Data Grid: The computed columns model contains several definitions']);
      expect(getModel()).to.deep.equal([total]);
    });
  });

  describe('control state', () => {
    it('should call `onComputedColumnsChange` once per change and not update a controlled model by itself', () => {
      const onComputedColumnsChange = vi.fn();
      const model: GridComputedColumnsModel = [];
      render(
        <Test
          featureDependencies={{ formula: formulaFeature }}
          computedColumns={model}
          onComputedColumnsChange={onComputedColumnsChange}
        />,
      );
      expect(onComputedColumnsChange).toHaveBeenCalledTimes(0);

      act(() => apiRef.current!.addComputedColumn(total));
      expect(onComputedColumnsChange).toHaveBeenCalledTimes(1);
      expect(onComputedColumnsChange.mock.lastCall![0]).to.deep.equal([total]);
      // The parent has not applied the new model.
      expect(getModel()).to.equal(model);
    });

    it('should apply the controlled model when the prop changes', () => {
      const onComputedColumnsChange = vi.fn();
      const computedColumnsChange = vi.fn();
      const { setProps } = render(
        <Test
          featureDependencies={{ formula: formulaFeature }}
          computedColumns={[]}
          onComputedColumnsChange={onComputedColumnsChange}
        />,
      );
      apiRef.current!.subscribeEvent('computedColumnsChange', computedColumnsChange);

      const nextModel = [total];
      setProps({ computedColumns: nextModel });
      expect(getModel()).to.equal(nextModel);
      expect(onComputedColumnsChange).toHaveBeenCalledTimes(0);
      expect(computedColumnsChange).toHaveBeenCalledTimes(1);
      expect(computedColumnsChange.mock.lastCall![0]).to.equal(nextModel);
    });

    it('should work as a controlled model echoed by the parent', () => {
      function Controlled() {
        const [model, setModel] = React.useState<GridComputedColumnsModel>([]);
        return (
          <Test
            featureDependencies={{ formula: formulaFeature }}
            computedColumns={model}
            onComputedColumnsChange={setModel}
          />
        );
      }
      render(<Controlled />);
      act(() => apiRef.current!.addComputedColumn(total));
      expect(getModel()).to.deep.equal([total]);
      act(() => apiRef.current!.updateComputedColumn('total', { headerName: 'Sum' }));
      expect(getModel()).to.deep.equal([{ ...total, headerName: 'Sum' }]);
    });

    it('should publish `computedColumnsChange` once per change of an uncontrolled model', () => {
      const onComputedColumnsChange = vi.fn();
      render(
        <Test
          featureDependencies={{ formula: formulaFeature }}
          onComputedColumnsChange={onComputedColumnsChange}
        />,
      );
      act(() => apiRef.current!.addComputedColumn(total));
      expect(onComputedColumnsChange).toHaveBeenCalledTimes(1);
      expect(onComputedColumnsChange.mock.lastCall![0]).to.deep.equal([total]);
      act(() => apiRef.current!.setComputedColumns((prev) => prev));
      expect(onComputedColumnsChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('apiRef', () => {
    it('`setComputedColumns` should accept a model and an updater', () => {
      render(<Test />);
      const model = [total];
      act(() => apiRef.current!.setComputedColumns(model));
      expect(getModel()).to.equal(model);
      act(() => apiRef.current!.setComputedColumns((prev) => [...prev, doubled]));
      expect(getModel()).to.deep.equal([total, doubled]);
    });

    it('`setComputedColumns` should drop duplicated fields and warn', () => {
      render(<Test />);
      expect(() => {
        act(() =>
          apiRef.current!.setComputedColumns([total, doubled, { ...total, formula: '=1' }]),
        );
      }).toWarnDev(['MUI X Data Grid: The computed columns model contains several definitions']);
      expect(getModel()).to.deep.equal([total, doubled]);
    });

    it('`addComputedColumn` should append the definition', () => {
      render(<Test />);
      act(() => apiRef.current!.addComputedColumn(total));
      act(() => apiRef.current!.addComputedColumn(doubled, { columnIndex: 1 }));
      expect(getModel()).to.deep.equal([total, doubled]);
    });

    it('`addComputedColumn` should keep the requested index until the column is inserted', () => {
      render(<Test />);
      const getPendingIndexes = () =>
        unwrapPrivateAPI<GridPrivateApiPremium, GridApi>(apiRef.current!).caches.computedColumns
          .pendingColumnIndexes;
      act(() => apiRef.current!.addComputedColumn(total, { columnIndex: 1 }));
      expect(Array.from(getPendingIndexes())).to.deep.equal([['total', 1]]);

      act(() => apiRef.current!.removeComputedColumn('total'));
      expect(getPendingIndexes().size).to.equal(0);
    });

    it('`addComputedColumn` should ignore a definition whose field is already computed and warn', () => {
      render(<Test />);
      act(() => apiRef.current!.addComputedColumn(total));
      expect(() => {
        act(() => apiRef.current!.addComputedColumn({ ...total, formula: '=1' }));
      }).toWarnDev(['MUI X Data Grid: The computed columns model contains several definitions']);
      expect(getModel()).to.deep.equal([total]);
    });

    it('`updateComputedColumn` should merge the changes and keep the field', () => {
      render(<Test />);
      act(() => apiRef.current!.setComputedColumns([total, doubled]));
      act(() =>
        apiRef.current!.updateComputedColumn('total', {
          formula: '=price + quantity',
          // @ts-expect-error the field cannot be changed
          field: 'renamed',
        }),
      );
      expect(getModel()).to.deep.equal([{ ...total, formula: '=price + quantity' }, doubled]);
      // Untouched definitions keep their identity.
      expect(getModel()[1]).to.equal(doubled);
    });

    it('`updateComputedColumn` and `removeComputedColumn` should ignore unknown fields', () => {
      const onComputedColumnsChange = vi.fn();
      render(<Test onComputedColumnsChange={onComputedColumnsChange} />);
      act(() => apiRef.current!.setComputedColumns([total]));
      const model = getModel();
      act(() => apiRef.current!.updateComputedColumn('unknown', { headerName: 'Nope' }));
      act(() => apiRef.current!.removeComputedColumn('unknown'));
      expect(getModel()).to.equal(model);
      expect(onComputedColumnsChange).toHaveBeenCalledTimes(1);
    });

    it('`removeComputedColumn` should remove the definition', () => {
      render(<Test />);
      act(() => apiRef.current!.setComputedColumns([total, doubled]));
      act(() => apiRef.current!.removeComputedColumn('total'));
      expect(getModel()).to.deep.equal([doubled]);
    });

    it('`validateComputedColumn` should report `featureMissing` without the formula feature', () => {
      render(<Test />);
      const result = apiRef.current!.validateComputedColumn(total);
      expect(result.valid).to.equal(false);
      expect(result.issues).to.have.length(1);
      expect(result.issues[0].code).to.equal('featureMissing');
      expect(result.issues[0].message).to.be.a('string').and.not.equal('');
    });
  });

  describe('editor', () => {
    it('`showComputedColumnEditor` should open the sidebar and leave a request for the panel', () => {
      render(<Test featureDependencies={{ formula: formulaFeature }} />);
      expect(gridComputedColumnsPanelOpenSelector(apiRef as RefObject<GridApi>)).to.equal(false);

      act(() =>
        apiRef.current!.showComputedColumnEditor('total', { sampleRowId: 1, columnIndex: 2 }),
      );
      const sidebar = gridSidebarStateSelector(apiRef as RefObject<GridApi>);
      expect(sidebar.open).to.equal(true);
      expect(sidebar.value).to.equal(GridSidebarValue.ComputedColumns);
      expect(gridComputedColumnsPanelOpenSelector(apiRef as RefObject<GridApi>)).to.equal(true);
      expect(getEditorRequest()).to.deep.equal({
        field: 'total',
        sampleRowId: 1,
        columnIndex: 2,
      });
    });

    it('`showComputedColumnEditor` should request a new column when called without a field', () => {
      render(<Test featureDependencies={{ formula: formulaFeature }} />);
      act(() => apiRef.current!.showComputedColumnEditor());
      expect(getEditorRequest()).to.deep.equal({
        field: null,
        sampleRowId: undefined,
        columnIndex: undefined,
      });
    });

    it('`hideComputedColumnEditor` should close the sidebar only when it shows the computed columns panel', () => {
      render(<Test featureDependencies={{ formula: formulaFeature }} />);
      act(() => apiRef.current!.showSidebar(GridSidebarValue.Pivot));
      act(() => apiRef.current!.hideComputedColumnEditor());
      expect(gridSidebarStateSelector(apiRef as RefObject<GridApi>).open).to.equal(true);

      act(() => apiRef.current!.showComputedColumnEditor(null));
      act(() => apiRef.current!.hideComputedColumnEditor());
      expect(gridSidebarStateSelector(apiRef as RefObject<GridApi>).open).to.equal(false);
      expect(getEditorRequest()).to.equal(null);
    });

    it('`showComputedColumnEditor` should do nothing and warn without the formula feature', () => {
      render(<Test />);
      expect(() => {
        act(() => apiRef.current!.showComputedColumnEditor());
      }).toWarnDev(['MUI X Data Grid: `showComputedColumnEditor()` was called']);
      expect(gridSidebarStateSelector(apiRef as RefObject<GridApi>).open).to.equal(false);
      expect(getEditorRequest()).to.equal(null);
    });

    it('`showComputedColumnEditor` should do nothing and warn when `disableComputedColumns` is set', () => {
      render(<Test featureDependencies={{ formula: formulaFeature }} disableComputedColumns />);
      expect(() => {
        act(() => apiRef.current!.showComputedColumnEditor());
      }).toWarnDev(['MUI X Data Grid: `showComputedColumnEditor()` was called']);
      expect(gridSidebarStateSelector(apiRef as RefObject<GridApi>).open).to.equal(false);
    });
  });

  describe('state persistence', () => {
    it('should not export an untouched model with `exportOnlyDirtyModels`', () => {
      render(<Test />);
      expect(apiRef.current!.exportState({ exportOnlyDirtyModels: true })).not.to.have.property(
        'computedColumns',
      );
      expect(apiRef.current!.exportState().computedColumns).to.deep.equal({ model: [] });
    });

    it('should export a non-empty model with `exportOnlyDirtyModels`', () => {
      render(<Test />);
      act(() => apiRef.current!.addComputedColumn(total));
      expect(
        apiRef.current!.exportState({ exportOnlyDirtyModels: true }).computedColumns,
      ).to.deep.equal({ model: [total] });
    });

    it('should export an initialized or controlled model with `exportOnlyDirtyModels`, even when empty', () => {
      const { unmount } = render(
        <Test
          featureDependencies={{ formula: formulaFeature }}
          initialState={{ computedColumns: { model: [] } }}
        />,
      );
      expect(
        apiRef.current!.exportState({ exportOnlyDirtyModels: true }).computedColumns,
      ).to.deep.equal({ model: [] });
      unmount();

      render(<Test featureDependencies={{ formula: formulaFeature }} computedColumns={[]} />);
      expect(
        apiRef.current!.exportState({ exportOnlyDirtyModels: true }).computedColumns,
      ).to.deep.equal({ model: [] });
    });

    it('should restore the exported model', () => {
      const { unmount } = render(<Test />);
      act(() => apiRef.current!.setComputedColumns([total, doubled]));
      const exportedState = apiRef.current!.exportState();
      unmount();

      render(<Test />);
      expect(getModel()).to.deep.equal([]);
      act(() => apiRef.current!.restoreState(exportedState));
      expect(getModel()).to.deep.equal([total, doubled]);
    });

    it('should leave the model untouched when the restored state has no computed columns', () => {
      render(<Test />);
      act(() => apiRef.current!.setComputedColumns([total]));
      act(() => apiRef.current!.restoreState({}));
      expect(getModel()).to.deep.equal([total]);
    });
  });
});
