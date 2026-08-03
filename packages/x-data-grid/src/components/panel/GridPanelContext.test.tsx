import * as React from 'react';
import { createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import { GridPanelContextProvider, useGridPanelContext } from './GridPanelContext';

function PanelTargetReader() {
  const { triggers } = useGridPanelContext();

  return <span data-testid="panel-target">{triggers.columnsPanel.element?.textContent}</span>;
}

function ColumnsPanelTrigger() {
  const { triggers } = useGridPanelContext();

  return <button ref={triggers.columnsPanel.setRef}>Columns</button>;
}

describe('<GridPanelContextProvider />', () => {
  const { render } = createRenderer();

  it('should rerender consumers when a panel trigger ref is attached', async () => {
    render(
      <GridPanelContextProvider>
        <PanelTargetReader />
        <ColumnsPanelTrigger />
      </GridPanelContextProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('panel-target')).to.have.text('Columns');
    });
  });
});
