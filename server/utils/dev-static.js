/**
 * 开发环境下的服务端渲染
 */
require("es6-promise").polyfill();
const path = require("path");
const fetch = require("isomorphic-fetch");
const webpack = require("webpack");
const serverConfig = require("./../../config/webpack.config.server.js");
const MemoryFS = require("memory-fs");
const Proxy = require("http-proxy-middleware");
const serverRender = require("./serverRender.js");

process.on("uncaughtException", (error) => {
	console.error(error);
});

// 获取在内存中的 html 模板文件 在 npm run dev:client 之后
// 通过 http 请求的方式请求 webpack-dev-server 拿到 server.ejs
const getTemplate = () => {
	return new Promise((resolve, reject) => {
		fetch("http://localhost:8080/assets/server.ejs")
		.then((response) => {
			if (response.status >= 400) {
				reject(new Error("Bad response from server"));
			}
			resolve(response.text());
		})
		.catch((error) => {
			reject(error);
		});
	});
};

const NativeModule = require("module");
const vm = require("vm");

// bundle 为 webpack 打包后的代码(代码commonjs2规范进行打包 最终以字符串的形式读取出来)
const getModuleFromString = (bundle, filename) => {
	const m = { exports: {} };

	// 对 bundle 内的代码用模块包装器进行包装
	// (function( exports, require, module, __dirname, __filename ) { bundle code })
	const wrapper = NativeModule.wrap(bundle);

	// 对代码进行编译但是不执行代码
	const script = new vm.Script(wrapper, {
		filename: filename,
		displayErrors: true,
	});

	// 在当前 global 对象的上下文中执行编译后的代码 最后返回结果
	// function( exports, require, module, __dirname, __filename ) { compiled code }
	const result = script.runInThisContext();

	// 执行函数
	result.call(m.exports, m.exports, require, m);
	return m;
};

const mfs = new MemoryFS();
let serverBundle = null;

// serverCompiler 将会监听 server-entry 的依赖变化
// serverCompiler 是一个 webpack Compiler 实例
const serverCompiler = webpack(serverConfig);

// 默认情况下 webpack 的读写文件都是在磁盘上进行
// 这里指定 webpack 的读写文件操作在`内存`中进行
serverCompiler.outputFileSystem = mfs;
serverCompiler.watch({}, (error, stats) => {
	if (error) {
		throw error;
	}

	const info = stats.toJson();
	info.errors.forEach((error) => console.error(error));
	info.warnings.forEach((warn) => console.warn(warn));

	const bundlePath = path.join(
		serverConfig.output.path,
		serverConfig.output.filename,
	);

	// 此时输出的 bundle 为字符串 必须转换为模块 才可以使用
	const bundle = mfs.readFileSync(bundlePath, "utf-8");

	const m = getModuleFromString(bundle, "server-entry.js");

	serverBundle = m.exports;
});

const devStatic = (app) => {
	// 将静态资源的访问代理到 webpack-dev-server
	app.use(
		"/assets/",
		Proxy({
			target: "http://localhost:8080",
		}),
	);

	app.get("*", (request, response, next) => {
		if (!serverBundle) {
			return response.send("waiting for serverBundle...");
		}
		getTemplate()
			.then((template) => {
				return serverRender(serverBundle, template, request, response);
			})
			.catch(next);
	});
};

module.exports = devStatic;
