'use strict'

const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.REGION || 'ap-southeast-2'
});

const s3 = new AWS.S3();

const deleteObject = async (params) => {
    console.log('deleteObject called: ', params);

    return new Promise((resolve, reject) => {
        s3.deleteObject(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject(err);
            } else {
                console.log(data); // successful response 
                resolve(data);
            }
        });
    });
};

const getSignedUrl = async (operation, params) => {
    console.log('getSignedUrl called: ', params);

    return new Promise((resolve, reject) => {
        s3.getSignedUrl(operation, params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject(err);
            } else {
                console.log(data); // successful response 
                resolve(data);
            }
        });
    });
};

module.exports = {
    getSignedUrl,
    deleteObject
};