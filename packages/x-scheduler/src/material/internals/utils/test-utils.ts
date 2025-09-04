import { screen } from '@mui/internal-test-utils';

export function getPreferencesMenu() {
  return screen.queryByRole('button', { name: /settings/i });
}

export async function openPreferencesMenu(user) {
  const button = getPreferencesMenu();
  await user.click(button);
  await screen.findByRole('menu');
  return button;
}

export async function toggleHideWeekends(user) {
  const menuItem = await screen.findByRole('menuitemcheckbox', { name: /hide weekends/i });
  await user.click(menuItem);
}
