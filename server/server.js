const express = require("express");
const fs = require("fs");
const path = require("path");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const session = require("express-session");
const chalk = require("chalk");
const Loadable = require("react-loadable");
const serverRender = require("./utils/serverRender.js");
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const env = process.env.NODE_ENV;

const app = express();

// logger
app.use((request, response, next) => {
	console.log(
		"The request type is " +
			chalk.green(request.method) +
			"; request url is " +
			chalk.green(request.originalUrl) +
			"; " +
			chalk.yellow(new Date().toUTCString())
	);
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	session({
		maxAge: 10 * 60 * 1000,
		name: "tid",
		resave: false,
		saveUninitialized: false,
		secret: "react_cnode",
	}),
);

// server-favicon 可能会失效 在 html-webpack-plugin 中配置
app.use(favicon(path.resolve(__dirname, "./../cnode.ico")));

app.use("/api/user", require("./utils/handle-login"));
app.use("/api", require("./utils/proxy"));

// 在非开发环境下 build 目录下才存在服务端要直出的资源（bundle）文件
// 即生产环境下的服务端渲染（npm run build）
if (env === "production") {
	const serverEntry = require("./../build/server-entry");

	const template = fs.readFileSync(
		path.resolve(__dirname, "./../build/server.ejs"),
		"utf8",
	);

	// 生产环境下静态资源目录
	app.use("/assets", express.static(path.resolve(__dirname, "./../build")));

	app.get("*", (request, response, next) => {
		serverRender(serverEntry, template, request, response).catch(next);
	});
}

// 开发环境下的服务端渲染（还没有打包 build 目录还没有生成）
if (env === "development") {
	const devStatic = require("./utils/dev-static.js");
	devStatic(app);
}

// 错误处理（所有中间件、路由抛出的异常都将在这里处理）
app.use((error, request, response) => {
	console.log(chalk.red(error));
	response.status(500).send(error);
});

if (env === "production") {
	Loadable.preloadAll().then(() => {
		const server = app.listen(PORT, HOST, () => {
			let host = server.address().address;
			let port = server.address().port;
			console.log(
				chalk.blue(`The server is listening at http://${host}:${port}`),
			);
		});
	});
} else {
	const server = app.listen(PORT, HOST, () => {
		let host = server.address().address;
		let port = server.address().port;
		console.log(
			chalk.blue(`The server is listening at http://${host}:${port}`),
		);
	});
}
