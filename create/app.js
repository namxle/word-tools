var crawler = require('crawler');
const rimraf = require('rimraf');
const fs = require('fs');
const download = require('download-file');
const axios = require('axios');
const options = {
  encoding: 'utf8',
  flag: 'w',
};
var readlineSync = require('readline-sync');
var excel = require('excel4node');

var words = '../words/';
if (!fs.existsSync(words)) {
  fs.mkdirSync(words);
}
var flag = true;
console.log('\n\n============ Welcome to words tool v1.1.1 =============\n');
console.log('    ------------ Written by namle ------------\n\n\n');
while (flag) {
  var words_file = readlineSync.question(
    'Input name of the file (example: words.txt)\nInput: '
  );
  if (words_file == undefined) {
    console.log('\nFile do not exist!');
  } else if (fs.existsSync(words + words_file)) {
    flag = false;
  } else {
    console.log(words + words_file);
    console.log('\nFile do not exist !');
  }
}

console.log('\nStarting ...\n');
console.log(
  '=====================================================================\n'
);

// Start input file and convert into an array
var file = fs.readFileSync(words + words_file, { encoding: 'utf8' }); // data to String.
file = file.replace(/(?:\r\n|\r|\n)/g, '\n');
var arr = file.split('\n'); // an array of every string in file.
// Finish input file

// Checking dependencies
var DOWNLOAD_DIR = '../audio/' + words_file + '/';
var fetching = '../fetching';
var result = '../result';

// Check if download dir is exist

if (!fs.existsSync(fetching)) {
  fs.mkdirSync(fetching);
}

if (!fs.existsSync(result)) {
  fs.mkdirSync(result);
}

if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
} else {
  rimraf.sync(DOWNLOAD_DIR);
  fs.mkdirSync(DOWNLOAD_DIR);
}

var arrayV = [];
var arrayE = [];
var arrayRes = [];
var counting = 0;
var countingE = 0;

var c = new crawler({
  maxConnections: 5,
  // This will be called for each crawled page
  callback: function (error, res, done) {
    if (error) {
      console.log(error);
      console.log('false');
    } else {
      counting++;
      var $ = res.$;

      var title = $('#page-content .entry-body .hw .tb').first().text();
      var type = $(
        '#page-content .entry-body div:first-child span:first-of-type .pos'
      )
        .first()
        .text();
      var meaning = $(
        '#page-content .entry-body .dictionary .dlink .di .normal-entry-body .pos-body .dsense-noh .sense-body .def-block .def-body .trans'
      )
        .first()
        .text();

      var result = res.options.id + '\t' + title + '\t' + type + '\t' + meaning;

      arrayV.push(result);
      // console.log(arrayV)

      switch (counting) {
        case parseInt(arr.length / 100):
          console.log('Fetching ...\n');
          break;
        case parseInt(arr.length / 3):
          console.log('\n2/3 left ...\n');
          break;
        case parseInt((arr.length * 2) / 3):
          console.log('\n1/3 left ...\n');
          break;
        case parseInt((arr.length * 4) / 5):
          console.log('\nAlmost Done ...\n');
          break;
      }

      var new_file = arrayV.join('\n');

      fs.writeFileSync('../fetching/result.txt', new_file, options, (err) => {
        if (err) console.log(err);
      }); //write file
    }
    done();
  },
});

var c1 = new crawler({
  maxConnections: 5,
  // This will be called for each crawled page
  callback: function (error, res, done) {
    if (error) {
      console.log(error);
      console.log('false');
    } else {
      countingE++;
      var $ = res.$;
      var title = $('#page-content h1:first-of-type .tb').text();

      var pron = $(
        '#page-content .page div:first-child div:first-child .link .superentry .di-body .entry .entry-body div:first-child .pos-header .us .pron .ipa'
      ).text();
      if (pron == '') {
        pron = $(
          '#page-content .page div:first-child div:first-child .link .superentry .di-body .entry .entry-body div:first-child .pos-header .uk .pron .ipa'
        ).text();
      }

      var resultE = res.options.id + '\t' + title + '\t(' + pron + ')\t';
      arrayE.push(resultE);
      // console.log(resultE);

      var new_file_E = arrayE.join('\n');
      fs.writeFileSync(
        '../fetching/resultE.txt',
        new_file_E,
        options,
        (err) => {
          if (err) console.log(err);
        }
      ); //write file
    }
    done();
  },
});

// Add c and c1 to queue
var count = 0;
var rsId;
for (var i = 0; i < arr.length; i++) {
  count++;
  rsId = arr[i].toLowerCase();
  c.queue({
    uri:
      'https://dictionary.cambridge.org/vi/dictionary/english-vietnamese/' +
      arr[i].toLowerCase(),
    id: rsId,
  });
  c1.queue({
    uri:
      'https://dictionary.cambridge.org/vi/dictionary/english/' +
      arr[i].toLowerCase(),
    id: rsId,
  });
}
// Finish add c and c1 to queue

// When c and c1 is empty
var checkCDone = false;
var checkC1Done = false;

c.on('drain', async () => {
  checkCDone = true;

  if (checkC1Done) {
    await allDone();
  }
});

c1.on('drain', async () => {
  checkC1Done = true;

  if (checkCDone) {
    await allDone();
  }
});
// End when c and c1 is empty

// Function to download media
let download_media = async (arrRes) => {
  console.log('Start download media. this could take a while...');
  console.log();
  for (var i = 0; i < arrRes.length; i++) {
    var file_name;
    if (arrRes[i].charAt(arrRes[i].indexOf('\t') - 1) == ' ') {
      file_name = arrRes[i].substring(0, arrRes[i].indexOf('\t') - 1);
    } else {
      file_name = arrRes[i].substring(0, arrRes[i].indexOf('\t'));
    }
    var file_url =
      'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=' +
      file_name +
      '&tl=en&total=1&idx=0&textlen=' +
      file_name.length;
    console.log(
      `Donwload (${i + 1}/${arrRes.length}): '${file_name}' in url: ${file_url}`
    );
    if (file_name != '' && file_url != '') {
      file_to_Check = DOWNLOAD_DIR + file_name + '.mp3';
      file_name = file_name + '.mp3';
      if (!fs.existsSync(file_to_Check)) {
        // Sleep 3 seconds
        await sleep(3000);
        try {
          await downloadFile(file_url, file_to_Check);
        } catch (error) {
          console.log(
            `Error download: ${file_name} in url: ${file_url}. Paused for 10s.`
          );
          await sleep(10000);
        }
      }
    }
  }
};
// End function to download media

async function downloadFile(fileUrl, outputLocationPath) {
  const writer = fs.createWriteStream(outputLocationPath);

  return axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  }).then((response) => {
    //ensure that the user can call `then()` only when the file has
    //been downloaded entirely.

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on('error', (err) => {
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

// Start to connect file resultE and result
async function allDone() {
  // English
  var resultE = fs.readFileSync('../fetching/resultE.txt', {
    encoding: 'utf8',
  }); // data to String.
  resultE = resultE.replace(/(?:\r\n|\r|\n)/g, '\n');
  var arrE = resultE.split('\n'); // an array of every string in file.
  var arrEid = [];
  for (var i = 0; i < arrE.length; i++) {
    arrEid[i] = arrE[i].substring(0, arrE[i].indexOf('\t'));
  }

  //Vietnamese
  var resultV = fs.readFileSync('../fetching/result.txt', { encoding: 'utf8' }); // data to String.
  resultV = resultV.replace(/(?:\r\n|\r|\n)/g, '\n');
  var arrV = resultV.split('\n'); // an array of every string in file.
  var arrVid = [];
  for (var i = 0; i < arrV.length; i++) {
    arrVid[i] = arrV[i].substring(0, arrV[i].indexOf('\t'));
  }

  // Final Result
  var arrRes = [];
  for (var i = 0; i < arrEid.length; i++) {
    for (var j = 0; j < arrVid.length; j++) {
      if (arrEid[i] == arrVid[j]) {
        arrRes[i] = arrV[j] + arrE[i].substring(arrE[i].indexOf('\t('));
      }
    }
  }

  var res_file = arrRes.join('\n');
  fs.writeFileSync('../fetching/data.txt', res_file, options, (err) => {
    if (err) console.log(err);
  }); //write file
  await download_media(arrRes);
  create_excel();
  setTimeout(function () {
    console.log('\nClosing ...\n');
  }, 1500);
  setTimeout(function () {}, 3000);
}

// Finish connect file resultE and result

function create_excel() {
  // Start add to Excel

  // Create a new instance of a Workbook class
  var workbook = new excel.Workbook();

  // Add Worksheets to the workbook
  var worksheet = workbook.addWorksheet('Sheet 1');

  // Create a reusable style
  var style = workbook.createStyle({
    font: {
      size: 12,
    },
  });

  var final = fs.readFileSync('../fetching/data.txt', { encoding: 'utf8' }); // data to String.
  final = final.replace(/(?:\r\n|\r|\n)/g, '\n');
  var array_final = final.split('\n'); // an array of every string in file.

  // Start Create new 2D array
  var arrResult = [];
  var col = 6;
  for (var i = 0; i < array_final.length; i++) {
    arrResult[i] = [];
  }
  var search = '\t';
  var indexNow = 0;
  var next = 0;
  for (var i = 0; i < array_final.length; i++) {
    for (var j = 0; j < col; j++) {
      if (j == 5) {
        next = array_final[i].length;
        arrResult[i][j] = array_final[i].substring(indexNow, next);
      } else {
        next = array_final[i].indexOf(search, indexNow);
        arrResult[i][j] = array_final[i].substring(indexNow, next);
        indexNow = next + 1;
      }
    }
    indexNow = 0;
    next = 0;
  }
  // Finish create new 2D array

  // Add array into worksheet
  for (var i = 0; i < array_final.length; i++) {
    for (var j = 0; j < col; j++) {
      worksheet
        .cell(i + 1, j + 1)
        .string(arrResult[i][j])
        .style(style);
    }
  }

  console.log('\nExporting ...');

  workbook.write(
    '../result/' + words_file.substring(0, words_file.indexOf('.')) + '.xlsx'
  );

  setTimeout(() => {
    console.log(
      '\n============================= Done ^_^ ==============================\n'
    );
  }, 500);

  // Finish add to Excel
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
