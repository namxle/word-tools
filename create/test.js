const download = require('download-file')
const https = require('https'); // or 'https' for https:// URLs
const fs = require('fs');
const axios = require('axios')

let file_url = "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=comparision&tl=en&total=1&idx=0&textlen=11";

// const request = https.get(file_url, function (response) {
// 	response.pipe(file);
// });


// axios.get(file_url)
// 	.then(function (response) {
// 		// handle success
// 		let data = response.data;
		
// 	})
// 	.catch(function (error) {
// 		// handle error
// 		console.log(error);
// 	})


// download(file_url, options, function (err) {
// 	if (err) console.log(err)
// })

downloadFile(file_url, 'test.mp3')

async function downloadFile(fileUrl, outputLocationPath) {
	const writer = fs.createWriteStream(outputLocationPath);

	return axios({
		method: 'get',
		url: fileUrl,
		responseType: 'stream',
	}).then(response => {

		//ensure that the user can call `then()` only when the file has
		//been downloaded entirely.

		return new Promise((resolve, reject) => {
			response.data.pipe(writer);
			let error = null;
			writer.on('error', err => {
				error = err;
				writer.close();
				reject(err);
			});
			writer.on('close', () => {
				if (!error) {
					resolve(true);
				}
				//no need to call the reject here, as it will have been called in the
				//'error' stream;
			});
		});
	});
}