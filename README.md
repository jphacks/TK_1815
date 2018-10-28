# ファミくろ！

[![Product Name](https://user-images.githubusercontent.com/22272875/47612371-9f880b00-dabc-11e8-8273-cf0288e08f02.png)](https://youtu.be/CVESVPC5gj4)
↑クリックして動画を再生

## 製品概要
### 家族 × コミュニケーション × Tech

### 背景
#### ターゲット
離れて暮らし、忙しくてあまり家族同士のコミュニケーションが取れていない家族

#### 現状・課題
離れて暮らす家族のコミュニケーションが、生活リズムのズレや忙しさによって希薄になっている。
実際自分たち身の回りの大学生や社会人にそのような時間があるかとアンケートをとったところ、
8割以上の人がそう感じると回答した。
また、連絡をとってもタイミングが合わないためにテキストベースのコミュニケーションになってしまい、
家族間に本来あるべきの温かみを感じ取りにくくなってしまっている。

#### ストーリー
地方で暮らす母と都内で一人暮らしをする息子。
日々仕事に励む息子は、早朝に家を出て帰宅も遅くなってしまってなかなか母親と連絡を取れていなく、
少し気がかりになっていた。
一方で母も息子を気にしてlineで近況を聞くが既読が着いてから返信が遅かったり無視をされてしまうことが多々あり、
あまり仕事の邪魔をしないほうがいいのかもしれないと連絡を控えてしまっている。

そんな2人に、今回のサービス「ファミクロ」を使用してもらいたい。

### 製品説明（具体的な製品の説明）
![Imgur](https://i.imgur.com/4ete0GV.png)

### 特長

#### 1. line botからAWSにオーディオファイルを送信

#### 2. line beaconによって帰宅時を判定しpush通知を行う

#### 3. CloverにてAWSからオーディオファイルを取得し再生

### 解決出来ること

日々の忙しさや生活リズムのズレに関わらず、
自分が落ち着いたタイミングで家族との接点を持つことによって
家族とのコミュニケーションのきっかけを作る。

### 今後の展望
- line beaconの判定領域を制御する(帰宅タイミングをより正確に取得する)
- 音声入力をline botのみではなく、マイク搭載のデバイスで送信できるようにする

## 開発内容・開発技術
### 活用した技術
#### API・データ
* Line Messaging API
* Clover
* Clover Skill Extention
* Line Beacon
* AWS

#### フレームワーク・ライブラリ・モジュール
* node.js
* Ruby on Rails
* CEK SDK node.js

#### デバイス
* Line Beacon
* Line Clover

### 独自開発技術（Hack Dayで開発したもの）
#### 2日間に開発した独自の機能・技術
* line botにて、メッセージの送信者と受信者のユーザー情報を入力してもらい、AWSにて登録・グループ化
* line botから音声ファイルとユーザー情報をAWSに送信
* 該当するグループから送信先のユーザー情報に紐づけて音声ファイルと共にAWSに格納
* Clover Skill にて自分のlineのユーザー情報から該当する音声情報を取得、最新のものを再生
* 自宅に設置してあるbeaconが、帰宅時に帰宅したことを判定し自動でAWSサーバーに新着メッセージの有無を確認
* メッセージが存在している時、botにて新着メッセージがあることをプッシュ通知
