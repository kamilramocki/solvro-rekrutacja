function createImagePath(name) {
    return `uploads/${name.replaceAll(" ", "_")}`;
}

module.exports = { createImagePath };