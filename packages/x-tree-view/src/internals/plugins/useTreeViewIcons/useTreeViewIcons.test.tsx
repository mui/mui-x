import * as React from 'react';
import { expect } from 'chai';
import {
  describeTreeView,
  DescribeTreeViewRendererReturnValue,
} from 'test/utils/tree-view/describeTreeView';
import {
  UseTreeViewExpansionSignature,
  UseTreeViewIconsSignature,
} from '@mui/x-tree-view/internals';

describeTreeView<[UseTreeViewIconsSignature, UseTreeViewExpansionSignature]>(
  'useTreeViewIcons plugin',
  ({ render }) => {
    describe('slots (expandIcon, collapseIcon, endIcon, icon)', () => {
      const getIconTestId = (view: DescribeTreeViewRendererReturnValue<any>, itemId: string) =>
        view.getItemIconContainer(itemId).querySelector(`div`)?.dataset.testid;

      it('should render the expandIcon slot defined on the tree if no icon slot is defined on the item and the item is collapsed', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          slots: {
            expandIcon: () => <div data-testid="treeExpandIcon" />,
            collapseIcon: () => <div data-testid="treeCollapseIcon" />,
            endIcon: () => <div data-testid="treeEndIcon" />,
          },
        });

        expect(getIconTestId(view, '1')).to.equal('treeExpandIcon');
      });

      it('should render the collapseIcon slot defined on the tree if no icon is defined on the item and the item is expanded', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          slots: {
            expandIcon: () => <div data-testid="treeExpandIcon" />,
            collapseIcon: () => <div data-testid="treeCollapseIcon" />,
            endIcon: () => <div data-testid="treeEndIcon" />,
          },
          defaultExpandedItems: ['1'],
        });

        expect(getIconTestId(view, '1')).to.equal('treeCollapseIcon');
      });

      it('should render the endIcon slot defined on the tree if no icon is defined on the item and the item has no children', () => {
        const view = render({
          items: [{ id: '1' }],
          slots: {
            expandIcon: () => <div data-testid="treeExpandIcon" />,
            collapseIcon: () => <div data-testid="treeCollapseIcon" />,
            endIcon: () => <div data-testid="treeEndIcon" />,
          },
        });

        expect(getIconTestId(view, '1')).to.equal('treeEndIcon');
      });

      it('should render the expandIcon slot defined on the item if the item is collapsed', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          slots: {
            expandIcon: () => <div data-testid="treeExpandIcon" />,
            collapseIcon: () => <div data-testid="treeCollapseIcon" />,
            endIcon: () => <div data-testid="treeEndIcon" />,
          },
          slotProps: {
            item: {
              slots: {
                expandIcon: () => <div data-testid="itemExpandIcon" />,
                collapseIcon: () => <div data-testid="itemCollapseIcon" />,
                endIcon: () => <div data-testid="itemEndIcon" />,
              },
            },
          },
        });

        expect(getIconTestId(view, '1')).to.equal('itemExpandIcon');
      });

      it('should render the collapseIcon slot defined on the item if the item is expanded', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          slots: {
            expandIcon: () => <div data-testid="treeExpandIcon" />,
            collapseIcon: () => <div data-testid="treeCollapseIcon" />,
            endIcon: () => <div data-testid="treeEndIcon" />,
          },
          slotProps: {
            item: {
              slots: {
                expandIcon: () => <div data-testid="itemExpandIcon" />,
                collapseIcon: () => <div data-testid="itemCollapseIcon" />,
                endIcon: () => <div data-testid="itemEndIcon" />,
              },
            },
          },
          defaultExpandedItems: ['1'],
        });

        expect(getIconTestId(view, '1')).to.equal('itemCollapseIcon');
      });

      it('should render the endIcon slot defined on the tree if the item has no children', () => {
        const view = render({
          items: [{ id: '1' }],
          slots: {
            expandIcon: () => <div data-testid="treeExpandIcon" />,
            collapseIcon: () => <div data-testid="treeCollapseIcon" />,
            endIcon: () => <div data-testid="treeEndIcon" />,
          },
          slotProps: {
            item: {
              slots: {
                expandIcon: () => <div data-testid="itemExpandIcon" />,
                collapseIcon: () => <div data-testid="itemCollapseIcon" />,
                endIcon: () => <div data-testid="itemEndIcon" />,
              },
            },
          },
        });

        expect(getIconTestId(view, '1')).to.equal('itemEndIcon');
      });

      it('should render the icon slot defined on the item if the item is collapsed', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          slots: {
            expandIcon: () => <div data-testid="treeExpandIcon" />,
            collapseIcon: () => <div data-testid="treeCollapseIcon" />,
            endIcon: () => <div data-testid="treeEndIcon" />,
          },
          slotProps: {
            item: {
              slots: {
                expandIcon: () => <div data-testid="itemExpandIcon" />,
                collapseIcon: () => <div data-testid="itemCollapseIcon" />,
                endIcon: () => <div data-testid="itemEndIcon" />,
                icon: () => <div data-testid="itemIcon" />,
              },
            },
          },
        });

        expect(getIconTestId(view, '1')).to.equal('itemIcon');
      });

      it('should render the icon slot defined on the item if the item is expanded', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          slots: {
            expandIcon: () => <div data-testid="treeExpandIcon" />,
            collapseIcon: () => <div data-testid="treeCollapseIcon" />,
            endIcon: () => <div data-testid="treeEndIcon" />,
          },
          slotProps: {
            item: {
              slots: {
                expandIcon: () => <div data-testid="itemExpandIcon" />,
                collapseIcon: () => <div data-testid="itemCollapseIcon" />,
                endIcon: () => <div data-testid="itemEndIcon" />,
                icon: () => <div data-testid="itemIcon" />,
              },
            },
          },
          defaultExpandedItems: ['1'],
        });

        expect(getIconTestId(view, '1')).to.equal('itemIcon');
      });

      it('should render the icon slot defined on the item if the item has no children', () => {
        const view = render({
          items: [{ id: '1' }],
          slots: {
            expandIcon: () => <div data-testid="treeExpandIcon" />,
            collapseIcon: () => <div data-testid="treeCollapseIcon" />,
            endIcon: () => <div data-testid="treeEndIcon" />,
          },
          slotProps: {
            item: {
              slots: {
                expandIcon: () => <div data-testid="itemExpandIcon" />,
                collapseIcon: () => <div data-testid="itemCollapseIcon" />,
                endIcon: () => <div data-testid="itemEndIcon" />,
                icon: () => <div data-testid="itemIcon" />,
              },
            },
          },
        });

        expect(getIconTestId(view, '1')).to.equal('itemIcon');
      });
    });
  },
);
