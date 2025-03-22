function previewAnnotations(entry = []) {
  return [...entry, require.resolve("../FenControlAddon/dist/preview.js")];
}

function managerEntries(entry = []) {
  return [...entry, require.resolve("../FenControlAddon/dist/manager.js")];
}

module.exports = {
  managerEntries,
  previewAnnotations,
};
