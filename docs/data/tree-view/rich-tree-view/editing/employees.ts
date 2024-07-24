import { TreeViewBaseItem } from '@mui/x-tree-view/models';

export type Employee = {
  editable?: boolean;
  id: string;
  firstName: string;
  lastName: string;
};

export const EMPLOYEES: TreeViewBaseItem<Employee>[] = [
  {
    id: '1',
    firstName: 'Jane',
    lastName: 'Doe',
    editable: true,
    children: [
      { id: '1.1', firstName: 'Elena', lastName: 'Kim', editable: true },
      { id: '1.2', firstName: 'Noah', lastName: 'Rodriguez', editable: true },
      { id: '1.3', firstName: 'Maya', lastName: 'Patel', editable: true },
    ],
  },
  {
    id: '2',
    firstName: 'Liam',
    lastName: 'Clarke',
    editable: true,
    children: [
      {
        id: '2.1',
        firstName: 'Ethan',
        lastName: 'Lee',
        editable: true,
      },
      { id: '2.2', firstName: 'Ava', lastName: 'Jones', editable: true },
    ],
  },
];
