import * as React from 'react';

import {
  TreeItemNext,
  TreeItemNextLabel,
} from '@mui/x-tree-view/internals/TreeItemNext';

import { RichTreeView } from '@mui/x-tree-view';

function CustomLabel(props) {
  const { children, onChange, ...other } = props;

  const [isEditing, setIsEditing] = React.useState(false);
  const [value, setValue] = React.useState('');
  const editingLabelRef = React.useRef(null);

  const handleLabelDoubleClick = (event) => {
    event.stopPropagation();
    setIsEditing(true);
    setValue(children);
  };

  const handleEditingLabelChange = (event) => {
    setValue(event.target.value);
  };

  const handleEditingLabelKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.stopPropagation();
      setIsEditing(false);
      onChange(value);
    }
  };

  React.useEffect(() => {
    if (isEditing) {
      editingLabelRef.current?.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <input
        value={value}
        onChange={handleEditingLabelChange}
        onKeyDown={handleEditingLabelKeyDown}
        ref={editingLabelRef}
      />
    );
  }

  return (
    <TreeItemNextLabel {...other} onDoubleClick={handleLabelDoubleClick}>
      {children}
    </TreeItemNextLabel>
  );
}

const TreeItemContext = React.createContext({ onLabelValueChange: () => {} });

const CustomTreeItem = React.forwardRef((props, ref) => {
  const { onLabelValueChange } = React.useContext(TreeItemContext);

  const handleLabelValueChange = (newLabel) => {
    onLabelValueChange(props.nodeId, newLabel);
  };

  return (
    <TreeItemNext
      ref={ref}
      {...props}
      slots={{
        label: CustomLabel,
      }}
      slotProps={{
        label: {
          onChange: handleLabelValueChange,
        },
      }}
    />
  );
});

const DEFAULT_MUI_X_PRODUCTS = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
];

const DEFAULT_EXPANDED_NODES = ['pickers'];

export default function LabelSlots() {
  const [products, setProducts] = React.useState(DEFAULT_MUI_X_PRODUCTS);

  const context = React.useMemo(
    () => ({
      onLabelValueChange: (nodeId, label) =>
        setProducts((prev) => {
          const walkTree = (item) => {
            if (item.id === nodeId) {
              return { ...item, label };
            } else if (item.children) {
              return { ...item, children: item.children.map(walkTree) };
            }

            return item;
          };

          return prev.map(walkTree);
        }),
    }),
    [],
  );

  return (
    <TreeItemContext.Provider value={context}>
      <RichTreeView
        items={products}
        aria-label="customized"
        defaultExpandedNodes={DEFAULT_EXPANDED_NODES}
        sx={{ overflowX: 'hidden', minHeight: 224, flexGrow: 1, maxWidth: 300 }}
        slots={{ item: CustomTreeItem }}
      />
    </TreeItemContext.Provider>
  );
}
