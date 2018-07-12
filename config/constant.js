const path = require("path");

const ROOT_PATH = process.cwd();

const SRC_PATH = path.join(ROOT_PATH, "/src");

const BUILD_PATH = path.join(ROOT_PATH, "/build");

const DLL_PATH = path.join(ROOT_PATH, "/dll");

const ASSETS_PATH = "/assets/";

module.exports = { ROOT_PATH, SRC_PATH, BUILD_PATH, ASSETS_PATH, DLL_PATH };
