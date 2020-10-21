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