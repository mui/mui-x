export function routeToFileName(route: string) {
  return route.replace(/\//g, '-').replace(/^-/, '');
}
