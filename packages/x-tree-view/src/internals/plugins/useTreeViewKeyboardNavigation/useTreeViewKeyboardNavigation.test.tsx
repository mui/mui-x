import * as React from 'react';
import { expect } from 'chai';
import { act, fireEvent } from '@mui-internal/test-utils';
import { describeTreeView } from 'test/utils/tree-view/describeTreeView';
import {
  UseTreeViewItemsSignature,
  UseTreeViewKeyboardNavigationSignature,
} from '@mui/x-tree-view/internals';

describeTreeView<[UseTreeViewKeyboardNavigationSignature, UseTreeViewItemsSignature]>(
  'useTreeViewKeyboardNavigation',
  ({ render, treeViewComponent }) => {
    describe('Type-ahead', () => {
      it('should move the focus to the next item with a name that starts with the typed character', () => {
        const { getFocusedItemId, getItemRoot } = render({
          items: [
            { id: '1', label: 'one' },
            { id: '2', label: 'two' },
            { id: '3', label: 'three' },
            { id: '4', label: 'four' },
          ],
        });

        act(() => {
          getItemRoot('1').focus();
        });
        expect(getFocusedItemId()).to.equal('1');

        fireEvent.keyDown(getItemRoot('1'), { key: 't' });
        expect(getFocusedItemId()).to.equal('2');

        fireEvent.keyDown(getItemRoot('2'), { key: 'f' });
        expect(getFocusedItemId()).to.equal('4');

        fireEvent.keyDown(getItemRoot('4'), { key: 'o' });
        expect(getFocusedItemId()).to.equal('1');
      });

      it('should move to the next item in the displayed order when typing the same starting character', () => {
        const { getFocusedItemId, getItemRoot } = render({
          items: [{ id: 'A1' }, { id: 'B1' }, { id: 'A2' }, { id: 'B3' }, { id: 'B2' }],
        });

        act(() => {
          getItemRoot('A1').focus();
        });
        expect(getFocusedItemId()).to.equal('A1');

        fireEvent.keyDown(getItemRoot('A1'), { key: 'b' });
        expect(getFocusedItemId()).to.equal('B1');

        fireEvent.keyDown(getItemRoot('B1'), { key: 'b' });
        expect(getFocusedItemId()).to.equal('B3');

        fireEvent.keyDown(getItemRoot('B3'), { key: 'b' });
        expect(getFocusedItemId()).to.equal('B2');

        fireEvent.keyDown(getItemRoot('B2'), { key: 'b' });
        expect(getFocusedItemId()).to.equal('B1');
      });

      it('should work with capitalized label', () => {
        const { getFocusedItemId, getItemRoot } = render({
          items: [
            { id: '1', label: 'One' },
            { id: '2', label: 'Two' },
            { id: '3', label: 'Three' },
            { id: '4', label: 'Four' },
          ],
        });

        act(() => {
          getItemRoot('1').focus();
        });
        expect(getFocusedItemId()).to.equal('1');

        fireEvent.keyDown(getItemRoot('1'), { key: 't' });
        expect(getFocusedItemId()).to.equal('2');

        fireEvent.keyDown(getItemRoot('2'), { key: 'f' });
        expect(getFocusedItemId()).to.equal('4');

        fireEvent.keyDown(getItemRoot('4'), { key: 'o' });
        expect(getFocusedItemId()).to.equal('1');
      });

      it('should work with ReactElement label', function test() {
        // Only the SimpleTreeView can have React Element labels.
        if (treeViewComponent !== 'SimpleTreeView') {
          this.skip();
        }

        const { getFocusedItemId, getItemRoot } = render({
          items: [
            { id: '1', label: <span>one</span> },
            { id: '2', label: <span>two</span> },
            { id: '3', label: <span>three</span> },
            { id: '4', label: <span>four</span> },
          ],
        });

        act(() => {
          getItemRoot('1').focus();
        });
        expect(getFocusedItemId()).to.equal('1');

        fireEvent.keyDown(getItemRoot('1'), { key: 't' });
        expect(getFocusedItemId()).to.equal('2');

        fireEvent.keyDown(getItemRoot('2'), { key: 'f' });
        expect(getFocusedItemId()).to.equal('4');

        fireEvent.keyDown(getItemRoot('4'), { key: 'o' });
        expect(getFocusedItemId()).to.equal('1');
      });

      it('should work after adding / removing items', () => {
        const { getFocusedItemId, getItemRoot, setItems } = render({
          items: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
        });

        act(() => {
          getItemRoot('1').focus();
        });

        fireEvent.keyDown(getItemRoot('1'), { key: '4' });
        expect(getFocusedItemId()).to.equal('4');

        setItems([{ id: '1' }, { id: '2' }, { id: '3' }]);
        expect(getFocusedItemId()).to.equal('1');

        fireEvent.keyDown(getItemRoot('1'), { key: '2' });
        expect(getFocusedItemId()).to.equal('2');

        setItems([{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }]);
        expect(getFocusedItemId()).to.equal('2');

        fireEvent.keyDown(getItemRoot('2'), { key: '4' });
        expect(getFocusedItemId()).to.equal('4');
      });

      it('should not move focus when pressing a modifier key and a letter', () => {
        const { getFocusedItemId, getItemRoot } = render({
          items: [
            { id: '1', label: 'one' },
            { id: '2', label: 'two' },
            { id: '3', label: 'three' },
            { id: '4', label: 'four' },
          ],
        });

        act(() => {
          getItemRoot('1').focus();
        });
        expect(getFocusedItemId()).to.equal('1');

        fireEvent.keyDown(getItemRoot('1'), { key: 't', ctrlKey: true });
        expect(getFocusedItemId()).to.equal('1');

        fireEvent.keyDown(getItemRoot('1'), { key: 't', metaKey: true });
        expect(getFocusedItemId()).to.equal('1');

        fireEvent.keyDown(getItemRoot('1'), { key: 't', shiftKey: true });
        expect(getFocusedItemId()).to.equal('1');
      });

      it('should work on disabled item when disabledItemsFocusable={true}', () => {
        const { getFocusedItemId, getItemRoot } = render({
          items: [
            { id: '1', label: 'one', disabled: true },
            { id: '2', label: 'two', disabled: true },
            { id: '3', label: 'three', disabled: true },
            { id: '4', label: 'four', disabled: true },
          ],
          disabledItemsFocusable: true,
        });

        act(() => {
          getItemRoot('1').focus();
        });
        expect(getFocusedItemId()).to.equal('1');

        fireEvent.keyDown(getItemRoot('1'), { key: 't' });
        expect(getFocusedItemId()).to.equal('2');
      });

      it('should not move focus on disabled item when disabledItemsFocusable={false}', () => {
        const { getFocusedItemId, getItemRoot } = render({
          items: [
            { id: '1', label: 'one', disabled: true },
            { id: '2', label: 'two', disabled: true },
            { id: '3', label: 'three', disabled: true },
            { id: '4', label: 'four', disabled: true },
          ],
          disabledItemsFocusable: false,
        });

        act(() => {
          getItemRoot('1').focus();
        });
        expect(getFocusedItemId()).to.equal('1');

        fireEvent.keyDown(getItemRoot('1'), { key: 't' });
        expect(getFocusedItemId()).to.equal('1');
      });
    });
  },
);
