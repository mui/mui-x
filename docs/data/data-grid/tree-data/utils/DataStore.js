const STORAGE_KEY = 'mui-tree-data-store';

export class DataStore {
  constructor() {
    // Try to load from localStorage first
    const stored = this.loadFromLocalStorage();

    if (stored) {
      // Load from localStorage
      this.rowLookup = stored.rowLookup;
      this.tree = new Map();
      stored.tree.forEach((node) => {
        this.tree.set(node.id, node);
      });
    } else {
      // Use initial data
      this.rowLookup = { ...initialRowLookup };
      this.tree = new Map();
      initialTree.forEach((node) => {
        this.tree.set(node.id, {
          ...node,
          children: node.children ? [...node.children] : undefined,
        });
      });
    }

    this.subscribers = new Set();
    this.snapshot = {
      rows: [],
      loading: true,
    };

    // Trigger initial load
    this.loadInitialRows();
  }

  subscribe = (callback) => {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  };

  getSnapshot = () => {
    return this.snapshot;
  };

  notify() {
    this.subscribers.forEach((callback) => {
      callback();
    });
  }

  saveToLocalStorage() {
    try {
      // Convert tree Map to array for JSON serialization
      const treeArray = [];
      this.tree.forEach((node) => {
        treeArray.push(node);
      });

      const dataToStore = {
        rowLookup: this.rowLookup,
        tree: treeArray,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      // Handle localStorage errors (quota exceeded, private browsing, etc.)
      console.warn('Failed to save to localStorage:', error);
    }
  }

  loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return null;
      }

      const parsed = JSON.parse(stored);

      // Basic validation
      if (!parsed.rowLookup || !parsed.tree || !Array.isArray(parsed.tree)) {
        return null;
      }

      return parsed;
    } catch (error) {
      // Handle parse errors or localStorage unavailable
      console.warn('Failed to load from localStorage:', error);
      return null;
    }
  }

  reset() {
    try {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }

    // Reinitialize with initial data
    this.rowLookup = { ...initialRowLookup };
    this.tree = new Map();
    initialTree.forEach((node) => {
      this.tree.set(node.id, {
        ...node,
        children: node.children ? [...node.children] : undefined,
      });
    });

    // Set loading state and reload
    this.snapshot = { ...this.snapshot, loading: true };
    this.notify();
    this.loadInitialRows();
  }

  // Generate rows with paths as expected by the DataGrid's tree data feature
  computeRowsWithPaths() {
    const result = [];

    const traverse = (nodeId, parentPath) => {
      const node = this.tree.get(nodeId);
      if (!node) {
        return;
      }

      const rowData = this.rowLookup[nodeId];
      let currentPath = parentPath;

      if (nodeId !== 'virtual-root-node' && rowData) {
        currentPath = [...parentPath, rowData.name];
        result.push({ ...rowData, path: currentPath });
      }

      if (node.children) {
        for (const childId of node.children) {
          traverse(childId, currentPath);
        }
      }
    };

    traverse('virtual-root-node', []);
    return result;
  }

  // Load initial rows asynchronously
  async loadInitialRows() {
    await new Promise((resolve) => {
      setTimeout(resolve, 300);
    });
    const rows = this.computeRowsWithPaths();
    this.snapshot = { rows, loading: false };
    this.notify();
  }

  handleRowOrderChange = (params) => {
    // Set loading state
    this.snapshot = { ...this.snapshot, loading: true };
    this.notify();

    // Apply updates asynchronously
    setTimeout(() => {
      // Update tree structure
      const rowId = params.row.id;
      const oldParentId = params.oldParent ?? 'virtual-root-node';
      const newParentId = params.newParent ?? 'virtual-root-node';

      // Remove from old parent
      const oldParentNode = this.tree.get(oldParentId);
      if (oldParentNode?.children) {
        oldParentNode.children = oldParentNode.children.filter((id) => id !== rowId);
      }

      // Add to new parent at target index
      const newParentNode = this.tree.get(newParentId);
      if (newParentNode) {
        if (!newParentNode.children) {
          newParentNode.children = [rowId];
        } else {
          newParentNode.children.splice(params.targetIndex, 0, rowId);
        }
      }

      // Regenerate rows with new paths
      const updatedRows = this.computeRowsWithPaths();
      this.snapshot = { rows: updatedRows, loading: false };

      // Save to localStorage after successful update
      this.saveToLocalStorage();

      this.notify();
    }, 300);
  };

  processRowUpdate = (updatedRow, _, params) => {
    // Set loading state
    this.snapshot = { ...this.snapshot, loading: true };
    this.notify();

    return new Promise((resolve) => {
      setTimeout(() => {
        this.rowLookup[params.rowId] = updatedRow;
        this.snapshot = { ...this.snapshot, loading: false };
        this.saveToLocalStorage();
        this.notify();
        resolve(updatedRow);
      }, 300);
    });
  };
}

const initialTree = [
  {
    id: 'virtual-root-node',
    children: [5, 35, 1, 2, 3, 4],
  },
  {
    id: 5,
    children: [9, 16, 21, 25, 28, 32, 6, 7, 8],
  },
  {
    id: 9,
    children: [10, 11, 12, 13, 14, 15],
  },
  {
    id: 16,
    children: [17, 18, 19, 20],
  },
  {
    id: 21,
    children: [22, 23, 24],
  },
  {
    id: 25,
    children: [26, 27],
  },
  {
    id: 28,
    children: [29, 30, 31],
  },
  {
    id: 32,
    children: [33, 34],
  },
  {
    id: 35,
    children: [36, 37, 38],
  },
  // Leafs have no `children` property:
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 10 },
  { id: 11 },
  { id: 12 },
  { id: 13 },
  { id: 14 },
  { id: 15 },
  { id: 17 },
  { id: 18 },
  { id: 19 },
  { id: 20 },
  { id: 22 },
  { id: 23 },
  { id: 24 },
  { id: 26 },
  { id: 27 },
  { id: 29 },
  { id: 30 },
  { id: 31 },
  { id: 33 },
  { id: 34 },
  { id: 36 },
  { id: 37 },
  { id: 38 },
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
];

const initialRowLookup = {
  1: {
    id: 1,
    name: 'package.json',
    type: 'json',
    size: '2.1 KB',
    modified: '2025-01-15',
  },
  2: {
    id: 2,
    name: 'tsconfig.json',
    type: 'json',
    size: '856 B',
    modified: '2025-01-10',
  },
  3: {
    id: 3,
    name: 'README.md',
    type: 'md',
    size: '4.2 KB',
    modified: '2025-01-20',
  },
  4: {
    id: 4,
    name: '.gitignore',
    type: 'txt',
    size: '428 B',
    modified: '2025-01-08',
  },
  5: { id: 5, name: 'src', type: 'folder', size: '', modified: '2025-01-22' },
  6: {
    id: 6,
    name: 'index.tsx',
    type: 'tsx',
    size: '1.8 KB',
    modified: '2025-01-18',
  },
  7: {
    id: 7,
    name: 'App.tsx',
    type: 'tsx',
    size: '3.4 KB',
    modified: '2025-01-22',
  },
  8: {
    id: 8,
    name: 'App.css',
    type: 'css',
    size: '1.2 KB',
    modified: '2025-01-21',
  },
  9: { id: 9, name: 'components', type: 'folder', size: '', modified: '2025-01-21' },
  10: {
    id: 10,
    name: 'Button.tsx',
    type: 'tsx',
    size: '2.4 KB',
    modified: '2025-01-19',
  },
  11: {
    id: 11,
    name: 'Drawer.tsx',
    type: 'tsx',
    size: '5.8 KB',
    modified: '2025-01-20',
  },
  12: {
    id: 12,
    name: 'Navbar.tsx',
    type: 'tsx',
    size: '4.2 KB',
    modified: '2025-01-21',
  },
  13: {
    id: 13,
    name: 'TreeView.tsx',
    type: 'tsx',
    size: '6.7 KB',
    modified: '2025-01-18',
  },
  14: {
    id: 14,
    name: 'Modal.tsx',
    type: 'tsx',
    size: '3.1 KB',
    modified: '2025-01-17',
  },
  15: {
    id: 15,
    name: 'index.ts',
    type: 'ts',
    size: '842 B',
    modified: '2025-01-21',
  },
  16: { id: 16, name: 'hooks', type: 'folder', size: '', modified: '2025-01-19' },
  17: {
    id: 17,
    name: 'useAuth.ts',
    type: 'ts',
    size: '2.8 KB',
    modified: '2025-01-16',
  },
  18: {
    id: 18,
    name: 'useLocalStorage.ts',
    type: 'ts',
    size: '1.5 KB',
    modified: '2025-01-14',
  },
  19: {
    id: 19,
    name: 'useDebounce.ts',
    type: 'ts',
    size: '948 B',
    modified: '2025-01-12',
  },
  20: {
    id: 20,
    name: 'index.ts',
    type: 'ts',
    size: '456 B',
    modified: '2025-01-19',
  },
  21: { id: 21, name: 'utils', type: 'folder', size: '', modified: '2025-01-18' },
  22: {
    id: 22,
    name: 'formatters.ts',
    type: 'ts',
    size: '3.2 KB',
    modified: '2025-01-15',
  },
  23: {
    id: 23,
    name: 'validators.ts',
    type: 'ts',
    size: '2.1 KB',
    modified: '2025-01-13',
  },
  24: {
    id: 24,
    name: 'api.ts',
    type: 'ts',
    size: '4.8 KB',
    modified: '2025-01-18',
  },
  25: { id: 25, name: 'types', type: 'folder', size: '', modified: '2025-01-17' },
  26: {
    id: 26,
    name: 'user.ts',
    type: 'ts',
    size: '1.6 KB',
    modified: '2025-01-17',
  },
  27: {
    id: 27,
    name: 'api.ts',
    type: 'ts',
    size: '2.3 KB',
    modified: '2025-01-16',
  },
  28: { id: 28, name: 'pages', type: 'folder', size: '', modified: '2025-01-20' },
  29: {
    id: 29,
    name: 'Home.tsx',
    type: 'tsx',
    size: '5.4 KB',
    modified: '2025-01-20',
  },
  30: {
    id: 30,
    name: 'Dashboard.tsx',
    type: 'tsx',
    size: '7.9 KB',
    modified: '2025-01-19',
  },
  31: {
    id: 31,
    name: 'Settings.tsx',
    type: 'tsx',
    size: '4.6 KB',
    modified: '2025-01-18',
  },
  32: { id: 32, name: 'assets', type: 'folder', size: '', modified: '2025-01-15' },
  33: {
    id: 33,
    name: 'logo.svg',
    type: 'svg',
    size: '2.8 KB',
    modified: '2025-01-10',
  },
  34: {
    id: 34,
    name: 'icon.png',
    type: 'png',
    size: '14.2 KB',
    modified: '2025-01-10',
  },
  35: { id: 35, name: 'public', type: 'folder', size: '', modified: '2025-01-15' },
  36: {
    id: 36,
    name: 'index.html',
    type: 'txt',
    size: '1.8 KB',
    modified: '2025-01-15',
  },
  37: {
    id: 37,
    name: 'favicon.ico',
    type: 'png',
    size: '4.2 KB',
    modified: '2025-01-08',
  },
  38: {
    id: 38,
    name: 'robots.txt',
    type: 'txt',
    size: '234 B',
    modified: '2025-01-08',
  },
};
