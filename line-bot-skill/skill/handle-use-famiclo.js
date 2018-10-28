'use strict';

module.exports = class HandleFamiclo {

    constructor() {
        this.required_parameter = {
            send_user: {
                message_to_confirm: {
                    type: "template",
                    altText: "送信する方は下のボタンを押してください",
                    template: {
                        type: "buttons",
                        text: "送信する方は下のボタンを押してください",
                        actions: [
                            {type:"postback",label:"メッセージを送信する",data: "送信する"}
                        ]
                    }
                }
            },
            receive_user: {
              message_to_confirm: {
                  type: "template",
                  altText: "メッセージを受信する方は下のボタンを押してください",
                  template: {
                      type: "buttons",
                      text: "メッセージを受信する方は下のボタンを押してください",
                      actions: [
                          {type:"postback",label:"メッセージを受信する",data: "受信する"}
                      ]
                  }
              }
            }
        };
    }

    // パラメーターが全部揃ったら実行する処理を記述します。
    async finish(bot, event, context){
        let message = {
            text: `${context.confirmed.send_user}です`
        };

        await bot.reply(message);
    }
};
