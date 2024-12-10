import { GridRowId } from './gridRows';

export type GridRowSelectionPropagation = {
  descendants?: boolean;
  parents?: boolean;
};

export type GridRowSelectionModel = { type: 'include' | 'exclude'; ids: Set<GridRowId> };

interface SelectionManager {
  data: Set<GridRowId>;
  has(id: GridRowId): boolean;
  select(id: GridRowId): void;
  unselect(id: GridRowId): void;
  size(): number;
}
class IncludeManager implements SelectionManager {
  data: SelectionManager['data'];

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

  size() {
    return this.data.size;
  }
}
class ExcludeManager implements SelectionManager {
  data: SelectionManager['data'];

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

  size() {
    return this.data.size;
  }
}

export const createSelectionManager = (model: GridRowSelectionModel): SelectionManager => {
  if (model.type === 'include') {
    return new IncludeManager(model);
  }
  return new ExcludeManager(model);
};
