import { fireEvent, screen } from '@mui/internal-test-utils';

export function getPreferencesMenu() {
  return screen.queryByRole('button', { name: /settings/i });
}

export async function openPreferencesMenu(user) {
  const button = getPreferencesMenu();
  await user.click(button);
  await screen.findByRole('menu');
  return button;
}

export async function toggleShowWeekends(user) {
  const menuItem = await screen.findByRole('menuitemcheckbox', { name: /show weekends/i });
  await user.click(menuItem);
}

export async function toggleShowWeekNumber(user) {
  const menuItem = await screen.findByRole('menuitemcheckbox', { name: /show week number/i });
  await user.click(menuItem);
}

async function openTimeFormatSubmenu() {
  const trigger = await screen.findByRole('menuitem', { name: /Time format/i });
  fireEvent.click(trigger);
  await screen.findByRole('group', { name: /Time format/i });
}

export async function changeTo24HoursFormat(user) {
  await openTimeFormatSubmenu();

  const h24Radio = screen.getByRole('menuitemradio', {
    name: /24-hour \(13:00\)/i,
  });

  await user.click(h24Radio);
}

export async function changeTo12HoursFormat(user) {
  await openTimeFormatSubmenu();

  const h12Radio = screen.getByRole('menuitemradio', {
    name: /12-hour \(1:00PM\)/i,
  });

  await user.click(h12Radio);
}
