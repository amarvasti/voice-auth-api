'use strict'

const uuidv4 = require('uuid/v4');
const {
  saveToDynamoDB
} = require('../lib/dynamodb');
const {
  getSignedUrl
} = require('../lib/s3Bucket.js');

const uploadBucket = process.env.uploadBucket;
const userTableName = process.env.userTableName;
const sessionTableName = process.env.sessionTableName;
const audioType = process.env.audioType;

exports.handler = async (event) => {
  console.log('Started:', event)
  if (!event.pathParameters) return;
  if (!event.pathParameters.userid) return;
  // use the mode from pathParameters if available else default to 'enroll'
  const mode = 'enroll';
  const status = 'init';
  const type = 'VoicePrint';
  const userId = event.pathParameters.userid;
  const uniqueId = uuidv4();

  const result = await getUploadURL(mode, uniqueId);
  var currDateTime = new Date().toISOString();
  try {
    await saveToDynamoDB({
      TableName: userTableName,
      Item: {
        userId: userId,
        createdDateTime: currDateTime,
        updatedDateTime: currDateTime
      },
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ConditionExpression: 'attribute_not_exists(#userId)',
    });
  } catch (err) {        
    if (err.code === 'ConditionalCheckFailedException') {
      console.log('conditional exception: ', err);
    } else {
      throw err;
    }
  }

  console.log('ddbResult: ', await saveToDynamoDB({
    TableName: sessionTableName,
    Item: {
      sessionId: uniqueId,
      userId: userId,
      info: {
        'auth_type': type,
        'auth_status': status
      },
      createdDateTime: currDateTime,
      updatedDateTime: currDateTime
    }
  }));

  console.log('Result: ', result)
  return result
}

const getUploadURL = async function (mode, uniqueId) {
  console.log('getUploadURL started: ', mode);
  var audioName = `${uniqueId}.${audioType}`;

  const s3Params = {
    Bucket: uploadBucket,
    Key: `${mode}/${audioName}`,
    Expires: 60,
    ACL: 'public-read'
  };

  // Get signed URL
  var uploadURL = await getSignedUrl('putObject', s3Params);

  return new Promise((resolve, reject) => {
    console.log(uploadURL);
    resolve({
      statusCode: 200,
      isBase64Encoded: false,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        uploadURL: uploadURL,
        audioFilename: audioName,
        sessionId: uniqueId
      })
    });
  });
}