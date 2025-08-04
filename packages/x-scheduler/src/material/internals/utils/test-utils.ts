import { screen } from '@mui/internal-test-utils';

export async function openSettingsMenu(user) {
  const button = await screen.findByRole('button', { name: /settings/i });
  await user.click(button);
  await screen.findByRole('menu');
  return button;
}

export async function toggleHideWeekends(user) {
  const menuItem = await screen.findByRole('menuitemcheckbox', { name: /hide weekends/i });
  await user.click(menuItem);
}
