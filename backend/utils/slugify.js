const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // Replace spaces & non-alphanumerics with hyphens
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
};

module.exports = slugify;
