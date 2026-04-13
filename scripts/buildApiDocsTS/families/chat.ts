import type { ProductFamily } from '../config';

export const chatFamily: ProductFamily = {
  section: 'chat',
  packages: ['x-chat-headless', 'x-chat'],
  includeUnstable: true,
};
