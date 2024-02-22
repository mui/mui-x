import * as React from 'react';
import {
  TreeItemNext,
  TreeItemNextLabel,
  TreeItemNextProps,
} from '@mui/x-tree-view/internals/TreeItemNext';
import { RichTreeView, TreeViewBaseItem } from '@mui/x-tree-view';

interface CustomLabelProps {
  children: string;
  className: string;
  onChange: (value: string) => void;
}

function CustomLabel(props: CustomLabelProps) {
  const { children, onChange, ...other } = props;

  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [value, setValue] = React.useState('');
  const editingLabelRef = React.useRef<HTMLInputElement>(null);

  const handleLabelDoubleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsEditing(true);
    setValue(children);
  };

  const handleEditingLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleEditingLabelKeyDown = (event: React.KeyboardEvent) => {
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

const TreeItemContext = React.createContext<{
  onLabelValueChange: (nodeId: string, label: string) => void;
}>({ onLabelValueChange: () => {} });

const CustomTreeItem = React.forwardRef(
  (props: TreeItemNextProps, ref: React.Ref<HTMLLIElement>) => {
    const { onLabelValueChange } = React.useContext(TreeItemContext);

    const handleLabelValueChange = (newLabel: string) => {
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
          } as any,
        }}
      />
    );
  },
);

const DEFAULT_MUI_X_PRODUCTS: TreeViewBaseItem[] = [
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
      onLabelValueChange: (nodeId: string, label: string) =>
        setProducts((prev) => {
          const walkTree = (item: TreeViewBaseItem): TreeViewBaseItem => {
            if (item.id === nodeId) {
              return { ...item, label };
            }
            if (item.children) {
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
