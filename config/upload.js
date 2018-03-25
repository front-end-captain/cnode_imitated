const qiniu = require('qiniu');
const fs = require('fs');
const path = require('path');

const cdnConfig = require('./../config').cdn;
const excludeFiles = ['index.html', 'server.ejs', 'server-entry.js'];

const {
	ak,
	sk,
	bucket,
} = cdnConfig;


const mac = new qiniu.auth.digest.Mac(ak, sk);

const config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z0;


const doUpload = (key, file) => {
	const options = {
		scope: bucket + ":" + key,
	};

	const fromUploader = new qiniu.form_up.FormUploader(config);

	const putExtra = new qiniu.form_up.PutExtra();
	const putPolicy = new qiniu.rs.PutPolicy(options);

	const uploaderToken = putPolicy.uploadToken(mac);

	return new Promise((resolve, reject) => {
		fromUploader.putFile(uploaderToken, key, file, putExtra, (error, body, info) => {
			if (error) {
				return reject(error);
			}
			if (info.statusCode === 200) {
				resolve(body);
			} else {
				resolve(info);
			}
		})
	});
};


const files = fs.readdirSync(path.join(__dirname, './../build'));
const uploads = files.map((file) => {
	if (excludeFiles.indexOf(file) === -1) {
		return doUpload(file, path.join(__dirname, './../build', file));
	} else {
		return Promise.resolve(`${file} did not to upload`);
	}
});

Promise.all(uploads).then((res) => {
	console.log('upload success', res);
})
.catch((error) => {
	console.log('upload fail', error);
	process.exit(0);
});
