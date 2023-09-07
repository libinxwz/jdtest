/*
杭州
 */
const $ = new Env('test');
const fs = require('fs');
const CryptoJS=require('crypto-js');

 
let cookies=[

	//李斌
	"sessionId=64df8f96bb5a4c000184527f&accountId=64df7a1c34b95700015e88f3&mobile=18012225989",//
	"sessionId=64df828a6f50ed00011f6ee7&accountId=64df828a6f50ed00011f6ee6&mobile=18651306657",//
	
	"sessionId=64df959c34b95700015e8a77&accountId=64df8e0d4a5f69000166c23b&mobile=13584640176",
	"sessionId=64df907c34b95700015e8a4d&accountId=64df907c34b95700015e8a4c&mobile=13382348802",//
	"sessionId=64df91654a5f69000166c26e&accountId=64df91654a5f69000166c26d&mobile=13382341414",//
	
	"sessionId=64df943d6f50ed00011f6fba&accountId=64df943d6f50ed00011f6fb9&mobile=18068603568",//
	"sessionId=64e8c61072be3400017f7db8&accountId=64e8c61072be3400017f7db7&mobile=18068603469",//
	"sessionId=64e8c755cde8ff000105abb5&accountId=64e8c755cde8ff000105abb4&mobile=13814742156",//
	"sessionId=64df9513f5d598000160ce09&accountId=64df9513f5d598000160ce08&mobile=17802595869",//
	
	//李晶
	"sessionId=64e611eae44edb00019679a2&accountId=64e611eae44edb00019679a1&mobile=13914467362",//
	"sessionId=64e8b0eba3c9de000133335d&accountId=64e8b0eba3c9de000133335c&mobile=13914469324",//
	
	"sessionId=64eb4244cde8ff000105e08b&accountId=64eb4244cde8ff000105e08a&mobile=18360007968",
	"sessionId=64eb434855c1e300012de682&accountId=64eb434855c1e300012de681&mobile=13218237976",
	"sessionId=64eb4434a3c9de0001336995&accountId=64eb4434a3c9de0001336994&mobile=18533225140",
	
	//圈圈
	"sessionId=64f1eed50aa84700012d7678&accountId=5e3e28f23791f10001e4496d&mobile=15061019998",
	"sessionId=64e8b84868f9480001bdb5f7&accountId=64e8b723a3c9de00013333b0&mobile=13815962198",//
	"sessionId=64e8b9c055c1e300012db069&accountId=64e56405cde8ff0001052ed3&mobile=18952612430",//
	"sessionId=64e8bb09a0911c0001daeeb6&accountId=5e3e2a5abe8739000193a76d&mobile=18952612439",//
	"sessionId=64e8bc24cde8ff000105ab26&accountId=64e8b064cb87460001408528&mobile=13775660776",//
	"sessionId=64f1ef2329c0d500014ea457&accountId=64e5f80b72be3400017f16da&mobile=13912196077",
	"sessionId=64f1fbcdcb38b10001cc445f&accountId=64f1fbcccb38b10001cc445e&mobile=15262755662",
	
	//蔡
	"sessionId=64f437e5436315000175b4e9&accountId=64f437e5436315000175b4e8&mobile=17798536287",
	
	//学生
	"sessionId=64f93a9e1fc3e80001442284&accountId=5e3278f0b4b13f000156a621&mobile=13382626202",
	"sessionId=64f93addd43bd900013cdc86&accountId=5e33cd960ecabc00011691aa&mobile=15152888756",
	"sessionId=64f93b448bd7f20001ad3a17&accountId=64f93b448bd7f20001ad3a16&mobile=17712549656",
	"sessionId=64f93b7f48426d00015ccf3b&accountId=64f93b7f48426d00015ccf3a&mobile=13921840358",
	"sessionId=64f93bd4d43bd900013cdca3&accountId=63e315d551e9ec2780db8ae8&mobile=15895174202",
	"sessionId=64f93c1c1c4f8f0001e6b222&accountId=63e315d551e9ec2780db8ae7&mobile=18962099551",
	



]


let dailyPersonalAnswerNum=0;
let answerObjList=[];
!(async () => {
	console.log("开始时间："+new Date().toLocaleTimeString());
	let radomTime=1000+Math.floor(Math.random()*10000);
	//获取当前时间
	var now=new Date();
	var d=now.getDate();
	//不是最后一天，判断距离凌晨的时间差，开始等待
	var hour=now.getHours();
	var mins=now.getMinutes();
	var seconds=now.getSeconds();
	var ms=now.getMilliseconds();//毫秒
	if(hour==23&&mins==59){
		var temp=60000-(seconds*1000+ms);
		console.log("距离第二天凌晨还差："+temp+"毫秒")
		await $.wait(temp+200);
	}
	//把cookies顺序打乱
	console.log("开始----随机账号顺序");
	cookies=cookies.sort(()=>Math.random()-0.5);
	
	do{
		console.log("时间："+new Date().toLocaleTimeString());
		answerObjList=[];//置空
		for(var i=0;i<cookies.length;i++){
			//console.log("第"+(i+1)+"个账号："+cookies[i].split("&")[2].split("=")[1]);
			if(dailyPersonalAnswerNum==0||i==0){
				await intGame(cookies[i]);
				console.log("次数"+dailyPersonalAnswerNum);
			}
			if(dailyPersonalAnswerNum>0){
				//获取题目，并且塞入answerObjList
				getQuestion(cookies[i]);
				await $.wait(50);
				console.log("时间："+new Date().toLocaleTimeString());
			}
		}
		await $.wait(2000);//先等待2s，让请求跑完后判断数组及时间
		if(answerObjList.length>0){
			//11346---14-15s
			var time=12500-100*answerObjList.length+Math.floor(Math.random()*2000);
			var now3=new Date();
			var d3=now3.getDate();
			if(d3==31||d3==7||d3==14){
				
			}else{
				time=time+2000;
				console.log("不是最后一天答题时间+2S");
			}
			console.log("随机延迟"+time+"毫秒");
			await $.wait(time);
		}
		console.log("答题数组长度："+answerObjList.length);
		console.log("时间："+new Date().toLocaleTimeString());
		for(var i=0;i<answerObjList.length;i++){
			submitAnswer(answerObjList[i]);
			await $.wait(50);
			console.log("时间："+new Date().toLocaleTimeString());
		}
	}while(answerObjList.length>0)
	

})().catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
}).finally(() => {
    $.done();
})
  
  
function intGame(cookie){
	return new Promise((resolve, reject) => {
		let option = taskurlInt(cookie,"https://qy.zjol.com.cn/tmmobile/api/asianGamesAnswer/init?");
		//console.log(option);
		$.get(option, (err, resp, data) => {
			try {
				if (err) {
					console.log(` API请求失败，请检查网路\n${JSON.stringify(err)}`)
				} else {
					console.log(data);
					data = JSON.parse(data);
					//console.log(data)
					if (data.code==200) {//成功
						dailyPersonalAnswerNum=data.data.dailyPersonalAnswerNum;
					} else {
						console.log("💩 获得列表失败:"+JSON.stringify(data));
					}
				}
			} catch (e) {
				reject(`API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
			} finally {
				resolve()
			}
		})
	})
}

function getQuestion(cookie){
	return new Promise((resolve, reject) => {
		let option = taskurlInt(cookie,"https://qy.zjol.com.cn/tmmobile/api/asianGamesAnswer/join?");
		//console.log(option);
		$.get(option, (err, resp, data) => {
			try {
				if (err) {
					console.log(` API请求失败，请检查网路\n${JSON.stringify(err)}`)
				} else {
					//console.log(data);
					data = JSON.parse(data);
					//console.log(data)
					if (data.code==200) {//成功
						console.log("😊 获取题目成功:"+cookie.split("&")[2].split("=")[1]);
						ques=data.data;
						var answerObj={};
						answerObj["cookie"]=cookie;
						answerObj["ques"]=ques;
						answerObjList.push(answerObj);
					} else {
						console.log("💩 获得列表失败:"+JSON.stringify(data));
					}
				}
			} catch (e) {
				reject(`API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
			} finally {
				resolve()
			}
		})
	})
}


function submitAnswer(answerObj){
	let cookie=answerObj["cookie"];
	let ques=answerObj["ques"];
	let resultList=[];
	for(var i=0;i<ques.questionList.length;i++){
		let obj={
			"id":ques.questionList[i].id,
			"rs":1,
			"as":ques.questionList[i].answer.split(",")
		}
		resultList.push(obj);
	}
	let jsonObj={
		"answerKey":ques.answerKey,
		"resultList":JSON.stringify(resultList)
	}
	console.log("😊 开始答题:"+cookie.split("&")[2].split("=")[1]);
	const myRequest = getPostRequest(cookie,"https://qy.zjol.com.cn/tmmobile/api/asianGamesAnswer/saveAsianAnswerResult", JSON.stringify(jsonObj));
	return new Promise(resolve => {
		$.post(myRequest, (err, resp, data) => {
		  try {
			if (err) {
					console.log(` API请求失败，请检查网路\n${JSON.stringify(err)}`)
			} else {
				data = JSON.parse(data)
				console.log(data)
				if (data.code==200) {//成功
	
				} else {
					console.log("💩 失败:"+JSON.stringify(data));
				}
			}
		  } catch (e) {
			$.logErr(e, resp)
		  } finally {
			resolve();
		  }
		})
    })
}






function getNowScore(){
	var now=new Date();
	var startTime=new Date($.startTimeStr);
	$.nowGrade=Math.floor((now.getTime()-startTime.getTime())/1000)*100;
	console.log(getNowFormatDate()+"目前第"+(mc+1)+"名成绩："+$.firstScore+"分,当前游戏分数："+$.nowGrade);
}
function sleep(time) {
    var startTime = new Date().getTime() + parseInt(time, 10);
    while(new Date().getTime() < startTime) {}
};
function blockcurSc(score) {
	var t = yyyymmdd(),
	e = getMonthDays(),
	i = $.key ? $.key.length: 0,
	o = "00000000" + parseInt(t * e / i),
	n = String(score),
	r = CryptoJS.enc.Utf8.parse(o),
	a = CryptoJS.enc.Utf8.parse(o),
	s = CryptoJS.AES.encrypt(n, r, {
		iv: a,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.ZeroPadding
	}),
	c = CryptoJS.enc.Base64.stringify(s.ciphertext);
	$.grade=c;
	console.log("\u52a0\u5bc6" + c);
	var h = CryptoJS.enc.Base64.parse(c),
	l = CryptoJS.enc.Base64.stringify(h),
	u = CryptoJS.AES.decrypt(l, r, {
		iv: a,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.ZeroPadding
	}).toString(CryptoJS.enc.Utf8);
	return console.log("\u89e3\u5bc6" + u),
	c
}
function yyyymmdd() {
	var t = new Date,
	e = t.getFullYear().toString(),
	i = (t.getMonth() + 1).toString(),
	o = t.getDate().toString();
	return e + (i[1] ? i: "0" + i[0]) + (o[1] ? o: "0" + o[0])
}
function getMonthDays() {
	var t = new Date,
	e = t.getFullYear(),
	i = t.getMonth() + 1;
	return new Date(e, i, 0).getDate()
}
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
	var hours=date.getHours();
	var minutes=date.getMinutes();
	var seconds=date.getSeconds();
	if (hours >= 0 && hours <= 9) {
        hours = "0" + hours;
    }
	if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
    }
	if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
    }
	
	var milliseconds=date.getMilliseconds();

	if (milliseconds >= 0 && milliseconds <= 9) {
        milliseconds = "00" + milliseconds;
    }
	if (milliseconds >= 10 && milliseconds <= 99) {
        milliseconds = "0" + milliseconds;
    }
	
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hours + seperator2 + minutes
            + seperator2 + seconds+"."+milliseconds;
    return currentdate;
}

function taskurlInt(cookie,url) {
	return {
		'url': url,
		'headers': {
			'Host': 'qy.zjol.com.cn',
			'sessionId': cookie.split("&")[0].split("=")[1],
			'Origin': 'https://activity.tianmunews.com',
			'mobile': cookie.split("&")[2].split("=")[1],
			'Accept-Encoding': 'gzip, deflate, br',
			'Connection': 'keep-alive',
			'Accept': 'application/json, text/plain, */*',
			'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;zjolapp; 5.4.0; 1081BAEA-444B-4345-B975-FD457158A9C6; iPhone11,2; iOS; 16.3.1; zh; appstore',
			'Referer': 'https://activity.tianmunews.com/',
			'accountId': cookie.split("&")[1].split("=")[1],
			'Accept-Language': 'zh-CN,zh-Hans;q=0.9',

		},
	}
}

function taskurl(url) {
	return {
		'url': url,
		'headers': {
			'Host': 'apps.skywen.cn',
			'Accept-Encoding': 'gzip, deflate, br',
			'Authorization': cookie,
			'Connection': 'keep-alive',
			'Accept': '*/*',
			'UserAgent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
			'X-Requested-With': 'com.tencent.mm',
			'Sec-Fetch-Site': 'same-origin',
			'Sec-Fetch-Mode': 'cors',
			'Sec-Fetch-Dest': 'empty',
			'Accept-Language': 'zh-cn',
			'Referer': 'https://apps.skywen.cn/quiz_h5/pages/mine/answer_record?exam_id=2&record_id=329929'
		},
	}
}
function getPostRequest(cookie,url, body) {
  const method = `POST`;
  const headers = {
    'Host': 'qy.zjol.com.cn',
	'Accept': 'application/json, text/plain, */*',
	'mobile': cookie.split("&")[2].split("=")[1],
	'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
	'Accept-Encoding': 'gzip, deflate, br',
	'accountId': cookie.split("&")[1].split("=")[1],
	'Content-Type': 'application/json;charset=UTF-8',
	'sessionId': cookie.split("&")[0].split("=")[1],
	'Origin': 'https://activity.tianmunews.com',
	'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;zjolapp; 5.4.0; 1081BAEA-444B-4345-B975-FD457158A9C6; iPhone11,2; iOS; 16.3.1; zh; appstore',
	'Referer': 'https://activity.tianmunews.com/',

	'Connection': 'keep-alive',

  };
  return {url: url, method: method, headers: headers, body: body};
}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
