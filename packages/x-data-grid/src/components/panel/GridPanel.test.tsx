import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import {
  GridPanel,
  gridPanelClasses as classes,
  useGridApiRef,
  GridApiContext,
} from '@mui/x-data-grid';
import { GridRootPropsContext } from '@mui/x-data-grid/context/GridRootPropsContext';
import Popper from '@mui/material/Popper';
import { describeConformance } from 'test/utils/describeConformance';

describe('<GridPanel />', () => {
  const { render } = createRenderer();

  function Wrapper(props: { children: React.ReactNode }) {
    // mock rootProps
    const rootProps = React.useMemo(() => ({}), []);
    const apiRef = useGridApiRef();
    apiRef.current.rootElementRef = {
      // @ts-ignore
      current: document.body,
    };

    return (
      <GridRootPropsContext.Provider value={rootProps}>
        <GridApiContext.Provider value={apiRef} {...props} />
      </GridRootPropsContext.Provider>
    );
  }

  describeConformance(<GridPanel disablePortal open />, () => ({
    classes: classes as any,
    inheritComponent: Popper,
    muiName: 'MuiGridPanel',
    render: (node: React.ReactElement) =>
      render(
        <Wrapper>
          <div data-id="gridPanelAnchor" />
          {node}
        </Wrapper>,
      ),
    refInstanceof: window.HTMLDivElement,
    only: ['mergeClassName', 'propsSpread', 'refForwarding', 'rootClass'],
  }));
});
