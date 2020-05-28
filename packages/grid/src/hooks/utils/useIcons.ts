import { useContext } from 'react';
import { OptionsContext } from '../../components/options-context';
import { IconsOptions } from '../../models';

export const useIcons = (): IconsOptions => {
  const options = useContext(OptionsContext);
  const icons = options?.icons;
  if (!icons) {
    throw new Error('Missing set of icons in grid options');
  }
  if (!icons.columnSortedAscending || !icons.columnSortedDescending || !icons.columnResize) {
    throw new Error('Missing icons in options or default options.');
  }
  return icons;
};
