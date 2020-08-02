import * as querystring from 'querystring';
import md5 = require('md5');
import * as https from 'https';
import {appId, secret} from './private';
import {errorMap} from './errorMap';


export const translate = (word: string) => {
  const q = word;
  const salt = Math.random();
  let from, to;
  if (/[a-zA-Z]/.test(word[0])) {
    from = 'en';
    to = 'zh';
  } else {
    from = 'zh';
    to = 'en';
  }
  const query: string = querystring.stringify({
    q: word,
    from: from,
    to: to,
    appid: appId,
    salt: salt,
    sign: md5(appId + q + salt + secret),
  });

  const options = {
    hostname: 'api.fanyi.baidu.com',
    port: 443,
    path: '/api/trans/vip/translate?' + query,
    method: 'GET'
  };
  const request = https.request(options, (response) => {
    const chunks: Buffer[] = [];
    response.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
      // process.stdout.write(d);
    });
    response.on('end', () => {
      const string = Buffer.concat(chunks).toString();
      type baiduResult = {
        error_code?: string,
        error_msg?: string,
        from: string,
        to: string,
        trans_result: {
          src: string,
          dst: string
        }[]
      }
      const obj: baiduResult = JSON.parse(string);
      if (obj.error_code) {
        console.log(errorMap[obj.error_code] || obj.error_msg);
        process.exit(2);
      } else {
        obj.trans_result.map(item => console.log(item['dst']));
        process.exit(0);
      }
    });
  });

  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
};