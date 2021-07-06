import * as React from 'react';
import {
  createClientRenderStrictMode,
  // @ts-expect-error JS
  createMount,
  // @ts-expect-error JS
  getClasses,
  // @ts-expect-error JS
  describeConformance,
} from 'test/utils';
import { GridPanel, useGridApiRef, GridApiContext } from '@material-ui/data-grid';
import { Popper } from '@material-ui/core';

describe('<GridPanel />', () => {
  const mount = createMount();
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  let classes;

  function Wrapper(props) {
    const apiRef = useGridApiRef();
    apiRef.current.columnHeadersContainerElementRef = {
      // @ts-ignore
      current: document.body,
    };

    return <GridApiContext.Provider value={apiRef} {...props} />;
  }

  before(() => {
    classes = getClasses(<GridPanel open={false} />);
  });

  describeConformance(<GridPanel disablePortal open />, () => ({
    classes,
    inheritComponent: Popper,
    render: (node) => render(<Wrapper>{node}</Wrapper>),
    mount: (node) => {
      const wrapper = mount(
        <Wrapper>
          <span>{node}</span>
        </Wrapper>,
      );
      return wrapper.find('span').childAt(0);
    },
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'reactTestRenderer'],
  }));
});
