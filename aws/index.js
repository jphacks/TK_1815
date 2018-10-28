'use strict';

const line = require('@line/bot-sdk');
const crypto = require('crypto');
const client = new line.Client({channelAccessToken: process.env.ACCESSTOKEN});
const C = require('const/const.js');
const MESSAGE = require('const/message.js');
const aws = require('aws-sdk');



aws.config.update({
  region: "us-east-1",
  accessKeyId: process.env.DYNAMO_API_ACCESS_KEY,
  secretAccessKey: process.env.DYNAMO_USER_SECRET_ACCESS_KEY
});

var docClient = new aws.DynamoDB.DocumentClient();

// const dynamo = new AWS.DynamoDB({
//     region: 'us-east-1',
//     apiVersion: '2012-08-10',
//     accessKeyId: process.env.DYNAMO_API_ACCESS_KEY,
//     secretAccessKey: process.env.DYNAMO_USER_SECRET_ACCESS_KEY
// });

exports.handler = function (event, context) {
  let signature = crypto.createHmac('sha256', process.env.CHANNELSECRET).update(event.body).digest('base64');
  let checkHeader = (event.headers || {})['X-Line-Signature'];
  let body = JSON.parse(event.body);
  console.log(body.events[0].message);
  if (signature === checkHeader) {
    if (body.events[0].replyToken === '00000000000000000000000000000000') { //接続確認エラー回避
      let lambdaResponse = {
        statusCode: 200,
        headers: { "X-Line-Status" : "OK"},
        body: '{"result":"connect check"}'
      };
      context.succeed(lambdaResponse);
    } else {
      if(body.events[0].message.type == 'audio'){
        var AWS = require('aws-sdk');
        var s3 = new AWS.S3();
        const C = require('const/const.js');
        client.getMessageContent(body.events[0].message.id)
        .then((stream) => {
          var content = [];
          stream.on('data', (chunk) => {
            console.log('data');
            console.log(chunk);
            content.push(new Buffer(chunk));
          }).on('error', (err) => {
            console.log(err);
          }).on('end', function(){
            console.log('end');
            console.log(content);
            var params = {
              Body: Buffer.concat(content),
              Bucket: C.BUCKET_NAME,
              Key: body.events[0].message.id + '.m4a'
            };
            s3.putObject(params, function(err, data) {
              if (err) console.log(err, err.stack);
              else console.log(data);
            });

            var reciver_id = docClient.get(params, function(err, data) {
              if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
              } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
              }
            });
            reciver_id = body.events[0].source.userId;

            client.getProfile(body.events[0].source.userId).then((profileData) => {
              const displayName = profileData.displayName;
              const db_params = {
                TableName: "audio",
                Item: {
                  "_audio_url": "https://s3.amazonaws.com/line-voice-backet/" + body.events[0].message.id + '.m4a',
                  "reciver_id": reciver_id,
                  "sender_name": displayName
                }
              };
              docClient.put(db_params, function(err, data) {
                if (err){
                  console.log(err);
                } else {
                  console.log("clear");
                }
              });
            });

            const message = {
              'type': 'text',
              'text': 'メッセージが保存されました。'
            };
            client.replyMessage(body.events[0].replyToken, message).then((response) => {
              let lambdaResponse = {
                statusCode: 200,
                headers: { "X-Line-Status" : "OK"},
                body: '{"result":"completed"}'
              };
              context.succeed(lambdaResponse);
            }).catch((err) => console.log(err));
          });
        });



      } else {
        let text = body.events[0].message.text;
        const message = {
          'type': 'text',
          'text': text
        };
        client.replyMessage(body.events[0].replyToken, message)
        .then((response) => {
          let lambdaResponse = {
            statusCode: 200,
            headers: { "X-Line-Status" : "OK"},
            body: '{"result":"completed"}'
          };
          context.succeed(lambdaResponse);
        }).catch((err) => console.log(err));
      }
    }
  }else{
    console.log('署名認証エラー');
  }
};
