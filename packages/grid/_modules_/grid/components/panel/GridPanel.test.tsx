import * as React from 'react';
import { createRenderer, describeConformance } from '@material-ui/monorepo/test/utils';
import {
  GridPanel,
  gridPanelClasses as classes,
  useGridApiRef,
  GridApiContext,
} from '@mui/x-data-grid';
import Popper from '@mui/material/Popper';

describe('<GridPanel />', () => {
  const { render } = createRenderer();

  function Wrapper(props) {
    const apiRef = useGridApiRef();
    apiRef.current.columnHeadersContainerElementRef = {
      // @ts-ignore
      current: document.body,
    };

    return <GridApiContext.Provider value={apiRef} {...props} />;
  }

  describeConformance(<GridPanel disablePortal open />, () => ({
    classes,
    inheritComponent: Popper,
    render: (node) => render(<Wrapper>{node}</Wrapper>),
    wrapMount: (baseMount) => (node) => {
      const wrapper = baseMount(
        <Wrapper>
          <span>{node}</span>
        </Wrapper>,
      );
      return wrapper.find('span').childAt(0);
    },
    refInstanceof: window.HTMLDivElement,
    only: ['mergeClassName', 'propsSpread', 'refForwarding', 'rootClass'],
  }));
});
