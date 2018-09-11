if (process.env.NODE_ENV === "production") {
	module.exports = require("./route.prod.jsx");
} else {
	module.exports = require("./route.dev.jsx");
}
