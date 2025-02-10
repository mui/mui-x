import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { GridPanel, gridPanelClasses as classes, GridApiContext } from '@mui/x-data-grid';
import { GridRootPropsContext } from '@mui/x-data-grid/context/GridRootPropsContext';
import Popper from '@mui/material/Popper';
import { describeConformance } from 'test/utils/describeConformance';

describe('<GridPanel />', () => {
  const { render } = createRenderer();

  function Wrapper(props: { children: React.ReactNode }) {
    // mock rootProps
    const rootProps = React.useMemo(() => ({}), []);
    const apiRef = React.useRef({} as GridApiCommunity);
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
    render: (node: React.ReactElement<any>) =>
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
