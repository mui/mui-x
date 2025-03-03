import type { GridRowId } from './gridRows';
import type { GridRowSelectionModel } from './gridRowSelectionModel';

export interface RowSelectionManager {
  data: Set<GridRowId>;
  has(id: GridRowId): boolean;
  select(id: GridRowId): void;
  unselect(id: GridRowId): void;
}

class IncludeManager implements RowSelectionManager {
  data: RowSelectionManager['data'];

  constructor(model: GridRowSelectionModel) {
    this.data = model.ids;
  }

  has(id: GridRowId) {
    return this.data.has(id);
  }

  select(id: GridRowId) {
    this.data.add(id);
  }

  unselect(id: GridRowId) {
    this.data.delete(id);
  }
}

class ExcludeManager implements RowSelectionManager {
  data: RowSelectionManager['data'];

  constructor(model: GridRowSelectionModel) {
    this.data = model.ids;
  }

  has(id: GridRowId) {
    return !this.data.has(id);
  }

  select(id: GridRowId) {
    this.data.delete(id);
  }

  unselect(id: GridRowId) {
    this.data.add(id);
  }
}

export const createRowSelectionManager = (model: GridRowSelectionModel): RowSelectionManager => {
  if (model.type === 'include') {
    return new IncludeManager(model);
  }
  return new ExcludeManager(model);
};
