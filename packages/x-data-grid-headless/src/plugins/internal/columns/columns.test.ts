import { describe, it, expect } from 'vitest';
import { Store } from '@base-ui/utils/store';
import type { ColumnDef, ColumnsState, ColumnVisibilityModel } from './types';
import { createColumnsState, createColumnsApi } from './columnUtils';

type TestRow = { id: number; name: string; age: number; email: string };

const defaultColumns: ColumnDef<TestRow>[] = [
  { id: 'name', field: 'name' },
  { id: 'age', field: 'age' },
  { id: 'email', field: 'email' },
];

function createTestStore(
  columns: ColumnDef<TestRow>[] = defaultColumns,
  columnVisibilityModel: ColumnVisibilityModel = {},
) {
  const state = createColumnsState(columns, columnVisibilityModel);
  const store = new Store<{ columns: ColumnsState }>({ columns: state });
  const api = createColumnsApi(store, { columns, columnVisibilityModel });
  return { store, api, state };
}

describe('Column Visibility', () => {
  describe('createColumnsState', () => {
    it('should create state with empty visibility model by default', () => {
      const state = createColumnsState(defaultColumns);
      expect(state.columnVisibilityModel).toEqual({});
      expect(state.orderedFields).toEqual(['name', 'age', 'email']);
    });

    it('should preserve the provided visibility model', () => {
      const model: ColumnVisibilityModel = { age: 'hidden', email: 'collapsed' };
      const state = createColumnsState(defaultColumns, model);
      expect(state.columnVisibilityModel).toEqual(model);
    });

    it('should merge initialState visibility model over prop model', () => {
      const propModel: ColumnVisibilityModel = { age: 'hidden' };
      const state = createColumnsState(defaultColumns, propModel, {
        columnVisibilityModel: { age: 'collapsed', email: 'hidden' },
      });
      expect(state.columnVisibilityModel).toEqual({ age: 'collapsed', email: 'hidden' });
    });
  });

  describe('getVisible', () => {
    it('should return all columns when no visibility model is set', () => {
      const { api } = createTestStore();
      const visible = api.getVisible();
      expect(visible.map((c) => c.id)).toEqual(['name', 'age', 'email']);
    });

    it('should exclude hidden columns', () => {
      const { api } = createTestStore(defaultColumns, { age: 'hidden' });
      const visible = api.getVisible();
      expect(visible.map((c) => c.id)).toEqual(['name', 'email']);
    });

    it('should include collapsed columns by default (includeCollapsed=true)', () => {
      const { api } = createTestStore(defaultColumns, { age: 'collapsed' });
      const visible = api.getVisible();
      expect(visible.map((c) => c.id)).toEqual(['name', 'age', 'email']);
    });

    it('should exclude collapsed columns when includeCollapsed=false', () => {
      const { api } = createTestStore(defaultColumns, { age: 'collapsed' });
      const visible = api.getVisible(false);
      expect(visible.map((c) => c.id)).toEqual(['name', 'email']);
    });

    it('should handle all three states together', () => {
      const { api } = createTestStore(defaultColumns, {
        name: 'visible',
        age: 'collapsed',
        email: 'hidden',
      });

      // Default: visible + collapsed
      expect(api.getVisible().map((c) => c.id)).toEqual(['name', 'age']);

      // Exclude collapsed: only visible
      expect(api.getVisible(false).map((c) => c.id)).toEqual(['name']);
    });

    it('should treat columns absent from the model as visible', () => {
      const { api } = createTestStore(defaultColumns, { email: 'hidden' });
      const visible = api.getVisible();
      expect(visible.map((c) => c.id)).toEqual(['name', 'age']);
    });
  });

  describe('setVisibility', () => {
    it('should hide a column', () => {
      const { api } = createTestStore();
      api.setVisibility('age', 'hidden');
      expect(api.getVisible().map((c) => c.id)).toEqual(['name', 'email']);
    });

    it('should collapse a column', () => {
      const { api } = createTestStore();
      api.setVisibility('age', 'collapsed');

      // Included by default
      expect(api.getVisible().map((c) => c.id)).toEqual(['name', 'age', 'email']);
      // Excluded when includeCollapsed=false
      expect(api.getVisible(false).map((c) => c.id)).toEqual(['name', 'email']);
    });

    it('should make a hidden column visible again', () => {
      const { api } = createTestStore(defaultColumns, { age: 'hidden' });
      expect(api.getVisible().map((c) => c.id)).toEqual(['name', 'email']);

      api.setVisibility('age', 'visible');
      expect(api.getVisible().map((c) => c.id)).toEqual(['name', 'age', 'email']);
    });

    it('should make a collapsed column visible again', () => {
      const { api } = createTestStore(defaultColumns, { age: 'collapsed' });
      api.setVisibility('age', 'visible');
      expect(api.getVisible(false).map((c) => c.id)).toEqual(['name', 'age', 'email']);
    });

    it('should transition from hidden to collapsed', () => {
      const { api } = createTestStore(defaultColumns, { age: 'hidden' });
      expect(api.getVisible().map((c) => c.id)).toEqual(['name', 'email']);

      api.setVisibility('age', 'collapsed');
      expect(api.getVisible().map((c) => c.id)).toEqual(['name', 'age', 'email']);
      expect(api.getVisible(false).map((c) => c.id)).toEqual(['name', 'email']);
    });

    it('should not update state when setting the same visibility state', () => {
      const { api, store } = createTestStore(defaultColumns, { age: 'hidden' });
      const modelBefore = store.state.columns.columnVisibilityModel;

      api.setVisibility('age', 'hidden');
      expect(store.state.columns.columnVisibilityModel).toBe(modelBefore);
    });
  });

  describe('setVisibilityModel', () => {
    it('should replace the entire visibility model', () => {
      const { api } = createTestStore();
      api.setVisibilityModel({ name: 'hidden', age: 'collapsed' });

      expect(api.getVisible().map((c) => c.id)).toEqual(['age', 'email']);
      expect(api.getVisible(false).map((c) => c.id)).toEqual(['email']);
    });

    it('should not update state when setting the same model reference', () => {
      const { api, store } = createTestStore(defaultColumns, { age: 'hidden' });

      // Get the actual model reference from the store (may differ from the one passed to constructor)
      const currentModel = store.state.columns.columnVisibilityModel;
      const stateBefore = store.state;
      api.setVisibilityModel(currentModel);
      expect(store.state).toBe(stateBefore);
    });
  });

  describe('getAll', () => {
    it('should return all columns regardless of visibility state', () => {
      const { api } = createTestStore(defaultColumns, {
        age: 'hidden',
        email: 'collapsed',
      });
      expect(api.getAll().map((c) => c.id)).toEqual(['name', 'age', 'email']);
    });
  });

  describe('getIndex', () => {
    it('should return index among visible columns (including collapsed) by default', () => {
      const { api } = createTestStore(defaultColumns, { age: 'collapsed' });
      // name=0, age=1 (collapsed but included), email=2
      expect(api.getIndex('email')).toBe(2);
    });

    it('should skip hidden columns in visible index', () => {
      const { api } = createTestStore(defaultColumns, { age: 'hidden' });
      // name=0, email=1 (age is hidden)
      expect(api.getIndex('email')).toBe(1);
    });

    it('should return index among all columns when useVisibleColumns=false', () => {
      const { api } = createTestStore(defaultColumns, { age: 'hidden' });
      expect(api.getIndex('email', false)).toBe(2);
    });
  });
});
