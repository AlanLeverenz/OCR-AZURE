import axios from 'axios';

const keys = require('./cv_keys');

const async = require('async');
const fs = require('fs');
const https = require('https');
const path = require("path");
const createReadStream = require('fs').createReadStream
const sleep = require('util').promisify(setTimeout);
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

/**
 * AUTHENTICATE
 * This single client is used for all examples.
 */
const key = process.env['COMPUTER_VISION_SUBSCRIPTION_KEY'];
const endpoint = process.env['COMPUTER_VISION_ENDPOINT']
if (!key) { throw new Error('Set your environment variables for your subscription key in COMPUTER_VISION_SUBSCRIPTION_KEY and endpoint in COMPUTER_VISION_ENDPOINT.'); }
// </snippet_vars>

// <snippet_client>
const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);
// </snippet_client>
/**
 * END - Authenticate
 **/


// <snippet_functiondef_begin>
function computerVision() {

    /**
     * READ PRINTED & HANDWRITTEN TEXT
     * Recognizes text from images using OCR (optical character recognition).
     * Recognition is shown for both printed and handwritten text.
     * Read 3.0 supports the following language: en (English), de (German), es (Spanish), fr (French), it (Italian), nl (Dutch) and pt (Portuguese).
     */
    console.log('-------------------------------------------------');
    console.log('READ PRINTED, HANDWRITTEN TEXT AND PDF');
    console.log();


    async.series([
      async function () {

      // <snippet_read_images>
      // URL images containing printed and/or handwritten text. 
      // The URL can point to image files (.jpg/.png/.bmp) or multi-page files (.pdf, .tiff).
      const printedTextSampleURL = 'https://moderatorsampleimages.blob.core.windows.net/samples/sample2.jpg';
      const multiLingualTextURL = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/MultiLingual.png';
      const mixedMultiPagePDFURL = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/MultiPageHandwrittenForm.pdf';
      // </snippet_read_images>

      // <snippet_read_call>
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
      // </snippet_read_call>

      // <snippet_read_helper>
      // Perform read and await the result from URL
      async function readTextFromURL(client, url) {
        // To recognize text in a local image, replace client.read() with readTextInStream() as shown:
        let result = await client.read(url);
        // Operation ID is last path segment of operationLocation (a URL)
        let operation = result.operationLocation.split('/').slice(-1)[0];

        // Wait for read recognition to complete
        // result.status is initially undefined, since it's the result of read
        while (result.status !== STATUS_SUCCEEDED) { await sleep(1000); result = await client.getReadResult(operation); }
        return result.analyzeResult.readResults; // Return the first page of result. Replace [0] with the desired page if this is a multi-page file such as .pdf or .tiff.
      }

      // Perform read and await the result from local file
      async function readTextFromFile(client, localImagePath) {
        // To recognize text in a local image, replace client.read() with readTextInStream() as shown:
        let result = await client.readInStream(() => createReadStream(localImagePath));
        // Operation ID is last path segment of operationLocation (a URL)
        let operation = result.operationLocation.split('/').slice(-1)[0];

        // Wait for read recognition to complete
        // result.status is initially undefined, since it's the result of read
        while (result.status !== STATUS_SUCCEEDED) { await sleep(1000); result = await client.getReadResult(operation); }
        return result.analyzeResult.readResults; // Return the first page of result. Replace [0] with the desired page if this is a multi-page file such as .pdf or .tiff.
      }
      // </snippet_read_helper>

      // <snippet_read_print>
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
      // </snippet_read_print>

      // <snippet_read_download>
      /**
       * 
       * Download the specified file in the URL to the current local folder
       * 
       */
      function downloadFilesToLocal(url, localFileName) {
        return new Promise((resolve, reject) => {
          console.log('--- Downloading file to local directory from: ' + url);
          const request = https.request(url, (res) => {
            if (res.statusCode !== 200) {
              console.log(`Download sample file failed. Status code: ${res.statusCode}, Message: ${res.statusMessage}`);
              reject();
            }
            var data = [];
            res.on('data', (chunk) => {
              data.push(chunk);
            });
            res.on('end', () => {
              console.log('   ... Downloaded successfully');
              fs.writeFileSync(localFileName, Buffer.concat(data));
              resolve();
            });
          });
          request.on('error', function (e) {
            console.log(e.message);
            reject();
          });
          request.end();
        });
      }
      // </snippet_read_download>

      /**
       * END - Recognize Printed & Handwritten Text
       */

      console.log();
      console.log('-------------------------------------------------');
      console.log('End of quickstart.');
      // <snippet_functiondef_end>

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
// </snippet_functiondef_end>