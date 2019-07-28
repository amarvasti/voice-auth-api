'use strict'

const AWS = require('aws-sdk');
AWS.config.update({
    region: process.env.REGION || 'ap-southeast-2'
});
const ddb = new AWS.DynamoDB.DocumentClient();

const saveToDynamoDB = async (params) => {
    console.log('saveToDynamoDB called: ', params)
    return new Promise((resolve, reject) => {
        ddb.put(params, function (err, data) {
            if (err) {
                console.error('saveToDynamoDB', err);
                reject(err);
            } else {
                console.log('saveToDynamoDB: ', data);
                resolve(data);
            }
        });
    });
};

const updateToDynamoDB = async (params) => {
    console.log('updateToDynamoDB called: ', params)
    return new Promise((resolve, reject) => {
        ddb.update(params, function (err, data) {
            if (err) {
                console.error('updateToDynamoDB', err);
                reject(err);
            } else {
                console.log('updateToDynamoDB: ', data);
                resolve(data);
            }
        });
    });
};

const getDynamoDB = async (params) => {
    console.log('getToDynamoDB called: ', params)
    return new Promise((resolve, reject) => {
        ddb.get(params, function (err, data) {
            if (err) {
                console.error('searchToDynamoDB', err);
                reject(err);
            } else {
                console.log('searchToDynamoDB: ', data);
                resolve(data);
            }
        });
    });
};

module.exports = {
    saveToDynamoDB,
    getDynamoDB,
    updateToDynamoDB
};