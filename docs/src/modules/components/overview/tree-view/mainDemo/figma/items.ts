import { TreeViewBaseItem } from '@mui/x-tree-view/models';

export type ItemType =
  | 'horizontal_center'
  | 'bottom'
  | 'top'
  | 'vertical_center'
  | 'right'
  | 'left'
  | 'image'
  | 'text'
  | 'component'
  | 'frame';

export type IdType =
  | 'paper'
  | 'header'
  | 'avatar'
  | 'avatar_initial'
  | 'header_title'
  | 'header_caption'
  | 'action_button'
  | 'media'
  | 'content'
  | 'text_content'
  | 'actions'
  | 'favorite'
  | 'share';

export type ExtendedTreeItemProps = {
  itemType: ItemType;
  id: IdType;
  label: string;
};

export const ITEMS: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
  {
    id: 'paper',
    label: 'Paper',
    itemType: 'vertical_center',
    children: [
      {
        id: 'header',
        label: 'Header container',
        itemType: 'vertical_center',
        children: [
          {
            id: 'avatar',
            label: 'Avatar',
            itemType: 'frame',
            children: [{ id: 'avatar_initial', label: 'Text Content', itemType: 'text' }],
          },

          { id: 'header_title', label: 'Header Title', itemType: 'text' },
          { id: 'header_caption', label: 'Header Caption', itemType: 'text' },
          { id: 'action_button', label: 'Action Button', itemType: 'frame' },
        ],
      },
      {
        id: 'media',
        label: 'Image',
        itemType: 'image',
      },
      {
        id: 'content',
        label: 'Content',
        itemType: 'frame',
        children: [{ id: 'text_content', label: 'Text Content', itemType: 'text' }],
      },
      {
        id: 'actions',
        label: 'Action Bar',
        itemType: 'bottom',
        children: [
          { id: 'favorite', label: 'Icon Button', itemType: 'component' },
          { id: 'share', label: 'Icon Button', itemType: 'component' },
        ],
      },
    ],
  },
];
