'use strict';

const keys = require('./cv_keys');

const async = require('async');
const fs = require('fs');
const https = require('https');
const path = require("path");
const createReadStream = require('fs').createReadStream
const sleep = require('util').promisify(setTimeout);
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

// URL images containing printed and/or handwritten text. 
// The URL can point to image files (.jpg/.png/.bmp) or multi-page files (.pdf, .tiff).
const printedTextSampleURL = 'https://moderatorsampleimages.blob.core.windows.net/samples/sample2.jpg';
const multiLingualTextURL = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/MultiLingual.png';
const mixedMultiPagePDFURL = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/MultiPageHandwrittenForm.pdf';

// Call the Read API
// Recognize text in printed image from a URL
console.log('Read printed text from URL...', printedTextSampleURL.split('/').pop());
const printedResult = await readTextFromURL(computerVisionClient, printedTextSampleURL);
printRecText(printedResult);

// Recognize text in handwritten image from a local file

const handwrittenImageLocalPath = __dirname + '\\handwritten_text.jpg';
console.log('\nRead handwritten text from local file...', handwrittenImageLocalPath);
const handwritingResult = await readTextFromFile(computerVisionClient, handwrittenImageLocalPath);
printRecText(handwritingResult);

// Recognize multi-lingual text in a PNG from a URL
console.log('\nRead printed multi-lingual text in a PNG from URL...', multiLingualTextURL.split('/').pop());
const multiLingualResult = await readTextFromURL(computerVisionClient, multiLingualTextURL);
printRecText(multiLingualResult);

// Recognize printed text and handwritten text in a PDF from a URL
console.log('\nRead printed and handwritten text from a PDF from URL...', mixedMultiPagePDFURL.split('/').pop());
const mixedPdfResult = await readTextFromURL(computerVisionClient, mixedMultiPagePDFURL);
printRecText(mixedPdfResult);

// Prints all text from Read result
function printRecText(readResults) {
    console.log('Recognized text:');
    for (const page in readResults) {
      if (readResults.length > 1) {
        console.log(`==== Page: ${page}`);
      }
      const result = readResults[page];
      if (result.lines.length) {
        for (const line of result.lines) {
          console.log(line.words.map(w => w.text).join(' '));
        }
      }
      else { console.log('No recognized text.'); }
    }
  }
  
// function to return results
function computerVision() {
    async.series([
      async function () {
          // quickstart code goes here
        },
        function () {
          return new Promise((resolve) => {
            resolve();
          })
        }
      ], (err) => {
        throw (err);
      });
    }
    
    computerVision(); 