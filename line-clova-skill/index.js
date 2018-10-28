const clova = require('@line/clova-cek-sdk-nodejs');
const express = require('express');
const bodyParser = require('body-parser');

const clovaSkillHandler = clova.Client
    .configureSkill()
    //起動時に喋る
    .onLaunchRequest(responseHelper => {
        responseHelper.setSimpleSpeech({
            lang: 'ja',
            type: 'PlainText',
            value: 'テストを始めます',
        });
    })

    //ユーザーからの発話が来たら反応する箇所
    .onIntentRequest(async responseHelper => {
        const intent = responseHelper.getIntentName();
        const sessionId = responseHelper.getSessionId();
        const userId = responseHelper.getUser().userId;
        console.log(userId);

        if (intent === 'testIntent') {
          // ここにurlと送ってきたひとの名前をとってくるapiを記入。
          //
          var url = 'https://s3.amazonaws.com/line-voice-backet/8779831446579.m4a'
          var sendUserName = "おばあちゃん"
          var sound = clova.SpeechBuilder.createSpeechUrl(url)
          var initialSpeech = {
              lang: 'ja',
              type: 'PlainText',
              value: `${sendUserName}さんからのmessageをどうぞ`,
          }
          responseHelper.setSpeechList([initialSpeech, sound]);
        }
    })

    //終了時
    .onSessionEndedRequest(responseHelper => {
    })
    .handle();


const app = new express();
const port = process.env.PORT || 3000;

//リクエストの検証を行う場合。環境変数APPLICATION_ID(値はClova Developer Center上で入力したExtension ID)が必須
const clovaMiddleware = clova.Middleware({applicationId: process.env.APPLICATION_ID });
app.post('/clova', clovaMiddleware, clovaSkillHandler);

app.listen(port, () => console.log(`Server running on ${port}`));
