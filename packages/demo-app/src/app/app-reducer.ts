export function appReducer(state, action) {
  switch (action.type) {
    case 'open-drawer':
      return { isOpen: true };
    case 'close-drawer':
      return { isOpen: false };
    default:
      throw new Error();
  }
}
