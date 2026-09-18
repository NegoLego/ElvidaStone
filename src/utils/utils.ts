export function getSlug(title: string): string {
  return title.toLowerCase().replace(' ', '-');
}
