// Funcție pentru a converti stringurile de dată în obiecte Date
export function parseDate(dateStr) {
  let parts = dateStr.split(".");
  // Notă: luna este 0-indexată în JavaScript
  return new Date(parts[2], parts[1] - 1, parts[0]);
}

export const toUrlSlug = (string) => {
  return string
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
};
