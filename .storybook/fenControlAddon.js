function managerEntries(entry = []) {
  return [...entry, require.resolve("../FenControlAddon/dist/manager.js")];
}

module.exports = {
  managerEntries,
};
