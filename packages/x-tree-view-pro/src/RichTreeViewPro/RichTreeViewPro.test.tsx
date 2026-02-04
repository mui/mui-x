import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import {
  RichTreeViewPro,
  richTreeViewProClasses as classes,
} from '@mui/x-tree-view-pro/RichTreeViewPro';
import { describeConformance } from 'test/utils/describeConformance';

describe('<RichTreeViewPro />', () => {
  const { render } = createRenderer();

  describeConformance(<RichTreeViewPro items={[]} />, () => ({
    classes,
    inheritComponent: 'ul',
    render,
    refInstanceof: window.HTMLUListElement,
    muiName: 'MuiRichTreeViewPro',
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
  }));

  it('should pass the id prop to the root element', () => {
    render(<RichTreeViewPro id="test-id" items={[{ id: '1', label: 'Item 1' }]} />);

    expect(screen.getByRole('tree')).to.have.attribute('id', 'test-id');
  });
});
