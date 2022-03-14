import * as React from 'react';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, describeConformance } from '@mui/monorepo/test/utils';
import {
  GridPanel,
  gridPanelClasses as classes,
  useGridApiRef,
  GridApiContext,
} from '@mui/x-data-grid';
import Popper from '@mui/material/Popper';

describe('<GridPanel />', () => {
  const { render } = createRenderer();

  function Wrapper(props: { children: React.ReactNode }) {
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
    render: (node: React.ReactNode) => render(<Wrapper>{node}</Wrapper>),
    wrapMount:
      (baseMount: (node: React.ReactNode) => import('enzyme').ReactWrapper) =>
      (node: React.ReactNode) => {
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
