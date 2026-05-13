import { screen } from '@mui/internal-test-utils';

export function getPreferencesMenu() {
  return screen.queryByRole('button', { name: /settings/i });
}

export async function findPreferencesMenu() {
  return screen.findByRole('button', { name: /settings/i });
}

export async function openPreferencesMenu(user) {
  const button = await findPreferencesMenu();
  await user.click(button);
  // MUI Menu doesn't easily expose aria-label, just wait for the menu to appear
  await screen.findByRole('menu');
}

export async function toggleShowWeekends(user) {
  const menuItem = await screen.findByRole('menuitemcheckbox', { name: /show weekends/i });
  await user.click(menuItem);
}

export async function toggleShowWeekNumber(user) {
  const menuItem = await screen.findByRole('menuitemcheckbox', { name: /show week number/i });
  await user.click(menuItem);
}

export async function toggleShowEmptyDaysInAgenda(user) {
  const menuItem = await screen.findByRole('menuitemcheckbox', { name: /show empty days/i });
  await user.click(menuItem);
}

export async function changeTo24HoursFormat(user) {
  const h24Option = await screen.findByRole('menuitemradio', { name: /24-hour \(13:00\)/i });
  await user.click(h24Option);
}

export async function changeTo12HoursFormat(user) {
  const h12Option = await screen.findByRole('menuitemradio', { name: /12-hour \(1:00PM\)/i });
  await user.click(h12Option);
}
