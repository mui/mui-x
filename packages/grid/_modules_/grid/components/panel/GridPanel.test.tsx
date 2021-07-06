import * as React from 'react';
import { createClientRenderStrictMode } from 'test/utils';
import { expect } from 'chai';
import { GridApiContext } from '../GridApiContext';
import { useGridApiRef } from '../../hooks/features/useGridApiRef'
import { GridPanel, GridPanelProps } from './GridPanel';

// util to retrive the opened grid panel
const getGridPanel = () => {
  const gridPanel = document.querySelector('.MuiGridPanel-root');

  if (gridPanel === null) {
    throw new Error('GridPanel not found');
  }

  return gridPanel as HTMLDivElement;
};

describe('<GridPanel />', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const TestCase = (props: {
    hidePreferences?: () => void;
  } & Partial<GridPanelProps>) => {
    const {
      open = false,
      hidePreferences = () => {},
      ...other
    } = props;

    const apiRef = useGridApiRef();

    const columnHeadersContainerElementRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
      apiRef.current.hidePreferences = hidePreferences;
      apiRef.current.columnHeadersContainerElementRef = columnHeadersContainerElementRef;
    });

    return (
      <GridApiContext.Provider value={apiRef}>
        <GridPanel open={open} {...other} />
        <div ref={columnHeadersContainerElementRef} />
      </GridApiContext.Provider>
    );
  }

  it('should render no GridPanel when not open', () => {
    render(<TestCase />);

    expect(() => getGridPanel()).to.throw();
  });

  it('should render the GridPanel with content when open', () => {
    const text = 'Panel Content';

    const { setProps } = render(
      <TestCase>{
        <div>{text}</div>}
      </TestCase>
    );

    setProps({ open: true });

    expect(getGridPanel().firstChild?.firstChild).to.have.text(text);
  });

  describe('Apply the `classes` prop', () => {
    it("should apply the `root` rule name's value as a class to the root panel component", () => {
      const classes = {
        root: 'test_class',
      };

      const { setProps } = render(<TestCase classes={{ root: classes.root }}/>);

      setProps({ open: true });

      expect(getGridPanel()).to.have.class(classes.root);
    });

    it("should apply the `paper` rule name's value as a class to the paper panel component", () => {
      const classes = {
        paper: 'test_class',
      };

      const { setProps } = render(<TestCase classes={{ paper: classes.paper }}/>);

      setProps({ open: true });

      expect(getGridPanel().firstChild).to.have.class(classes.paper);
    });
  });
});