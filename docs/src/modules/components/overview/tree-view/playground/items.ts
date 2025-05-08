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
  secondaryLabel: string;
  id: IdType;
  label: string;
};

export const ITEMS: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
  {
    id: 'paper',
    label: 'Paper',
    secondaryLabel: 'Main container',
    children: [
      {
        id: 'header',
        label: 'Header container',
        secondaryLabel: 'Top section',
        children: [
          {
            id: 'avatar',
            label: 'Avatar',
            secondaryLabel: 'User profile image',
            children: [
              {
                id: 'avatar_initial',
                label: 'Text Content',
                secondaryLabel: 'User initials',
              },
            ],
          },

          {
            id: 'header_title',
            label: 'Header Title',
            secondaryLabel: 'Main heading',
          },
          {
            id: 'header_caption',
            label: 'Header Caption',
            secondaryLabel: 'Subtitle text',
          },
          {
            id: 'action_button',
            label: 'Action Button',
            secondaryLabel: 'Interactive element',
          },
        ],
      },
      {
        id: 'media',
        label: 'Image',
        secondaryLabel: 'Visual content',
      },
      {
        id: 'content',
        label: 'Content',
        secondaryLabel: 'Main body',
        children: [
          {
            id: 'text_content',
            label: 'Text Content',
            secondaryLabel: 'Article body',
          },
        ],
      },
      {
        id: 'actions',
        label: 'Action Bar',
        secondaryLabel: 'Interactive controls',
        children: [
          {
            id: 'favorite',
            label: 'Icon Button',
            secondaryLabel: 'Like/favorite function',
          },
          {
            id: 'share',
            label: 'Icon Button',
            secondaryLabel: 'Share function',
          },
        ],
      },
    ],
  },
];
